import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AdditionalWorksEstimateTable } from './AdditionalWorksEstimateTable';
import { AdditionalWorksEstimateData } from '../../types/estimate';
import { useEstimateTotals } from '../../hooks/useEstimateTotals';

interface AdditionalWorksEstimateProps {
  isEditing: boolean;
  clientId: string;
  floors: string;
}

export const AdditionalWorksEstimate: React.FC<AdditionalWorksEstimateProps> = ({
  isEditing,
  clientId,
  floors
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [estimateData, setEstimateData] = useState<AdditionalWorksEstimateData>({
    items: [
      { name: 'Общая стоимость всех работ (Зарплата строителям)', total: 0 },
      { name: 'ЗП Проектирование дома и кан, водопр, тп, и смета', total: 30000 },
      { name: 'ЗП по Расскройки домкомплекта', total: 20000 },
      { name: '', total: 0 },
      { name: '', total: 0 },
      { name: '', total: 0 },
      { name: '', total: 0 },
      { name: '', total: 0 },
      { name: '', total: 0 }
    ],
    totalCost: 50000,
    grandTotal: 0
  });

  const { totals } = useEstimateTotals(clientId);
  const grandTotal = Object.entries(totals).reduce((sum, [key, value]) => {
    // Включаем стоимость межэтажного перекрытия только для многоэтажных домов
    if (key === 'floor') {
      return floors === '1' ? sum : sum + value;
    }
    return sum + value;
  }, 0);

  // Subscribe to changes in the estimates document to sync builder's salary
  useEffect(() => {
    const estimateRef = doc(db, 'estimates', clientId);
    const unsubscribe = onSnapshot(estimateRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.roofValues?.builderSalary?.value !== undefined) {
          setEstimateData(prev => {
            const newItems = [...prev.items];
            newItems[0] = {
              ...newItems[0],
              total: data.roofValues.builderSalary.value
            };
            
            const totalCost = newItems.reduce((sum, item) => sum + item.total, 0);
            return {
              ...prev,
              items: newItems,
              totalCost
            };
          });
        }
      }
    });

    return () => unsubscribe();
  }, [clientId]);

  useEffect(() => {
    const loadEstimateData = async () => {
      try {
        const estimateRef = doc(db, 'additionalWorksEstimates', clientId);
        const estimateDoc = await getDoc(estimateRef);
        
        if (estimateDoc.exists()) {
          setEstimateData(estimateDoc.data() as AdditionalWorksEstimateData);
        }
      } catch (error) {
        console.error('Error loading additional works estimate data:', error);
      }
    };

    loadEstimateData();
  }, [clientId]);

  useEffect(() => {
    const saveEstimateData = async () => {
      if (!isEditing) return;

      try {
        const estimateRef = doc(db, 'additionalWorksEstimates', clientId);
        await setDoc(estimateRef, {
          ...estimateData,
          grandTotal,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error saving additional works estimate data:', error);
      }
    };

    const debounceTimer = setTimeout(saveEstimateData, 500);
    return () => clearTimeout(debounceTimer);
  }, [clientId, isEditing, estimateData, grandTotal]);

  const handleUpdateItem = (index: number, field: 'name' | 'total', value: string | number) => {
    // Prevent manual updates to the builder's salary field (index 0)
    if (index === 0 && field === 'total') return;

    setEstimateData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };

      const totalCost = newItems.reduce((sum, item) => sum + item.total, 0);
      return {
        ...prev,
        items: newItems,
        totalCost
      };
    });
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 mr-1" />
        ) : (
          <ChevronDown className="w-5 h-5 mr-1" />
        )}
        Смета Дополнительных Работ
      </button>

      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white text-center py-2">
            ДОПОЛНИТЕЛЬНЫЕ РАБОТЫ
          </div>
          
          <AdditionalWorksEstimateTable
            items={estimateData.items}
            totalCost={estimateData.totalCost}
            grandTotal={grandTotal}
            onUpdateItem={handleUpdateItem}
            isEditing={isEditing}
          />
        </div>
      )}
    </div>
  );
};