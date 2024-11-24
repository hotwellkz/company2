import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator as CalcIcon } from 'lucide-react';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { PriceBreakdown } from '../components/calculator/PriceBreakdown';
import { calculatePrice, calculateCostBreakdown } from '../utils/calculatorUtils';
import { CalculatorState, CostBreakdown } from '../types/calculator';
import { CommercialProposal } from '../components/calculator/CommercialProposal';

const initialState: CalculatorState = {
  area: '',
  floors: '1 этаж',
  firstFloorHeight: '2,5 метра',
  secondFloorHeight: '2,5 метра',
  roofType: '1-скатная',
  houseShape: 'Простая форма'
};

export const CalculatorPage: React.FC = () => {
  const [formData, setFormData] = useState<CalculatorState>(initialState);
  const [pricePerSqm, setPricePerSqm] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>({
    foundation: 0,
    houseKit: 0,
    assembly: 0
  });
  const [showProposal, setShowProposal] = useState(false);

  useEffect(() => {
    const { pricePerSqm: price, totalPrice: total } = calculatePrice(formData);
    setPricePerSqm(price);
    setTotalPrice(total);
    setCostBreakdown(calculateCostBreakdown(total));
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "77477434343";
    const message = `Здравствуйте! Меня интересует строительство дома:\n
Площадь: ${formData.area} м²\n
Этажность: ${formData.floors}\n
Высота 1-го этажа: ${formData.firstFloorHeight}\n
${formData.floors === '2 этажа' ? `Высота 2-го этажа: ${formData.secondFloorHeight}\n` : ''}
Тип крыши: ${formData.roofType}\n
Форма дома: ${formData.houseShape}\n
Стоимость за м²: ${pricePerSqm.toLocaleString()} тг\n
Общая стоимость: ${totalPrice.toLocaleString()} тг\n
Стоимость фундамента: ${costBreakdown.foundation.toLocaleString()} тг\n
Стоимость домокомплекта: ${costBreakdown.houseKit.toLocaleString()} тг\n
Стоимость монтажа: ${costBreakdown.assembly.toLocaleString()} тг`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button onClick={() => window.history.back()} className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Калькулятор строительства
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <CalcIcon className="w-8 h-8 text-emerald-500" />
            <h2 className="text-xl font-semibold">
              Расчет стоимости строительства дома
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <CalculatorForm
              formData={formData}
              onChange={setFormData}
            />

            <PriceBreakdown
              pricePerSqm={pricePerSqm}
              totalPrice={totalPrice}
              costBreakdown={costBreakdown}
            />

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setShowProposal(true)}
                className="flex-1 px-4 py-3 bg-white border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Сформировать КП
              </button>
              
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Получить консультацию
              </button>
            </div>
          </form>
        </div>
      </div>

      {showProposal && (
        <CommercialProposal
          formData={formData}
          pricePerSqm={pricePerSqm}
          totalPrice={totalPrice}
          costBreakdown={costBreakdown}
          onClose={() => setShowProposal(false)}
        />
      )}
    </div>
  );
};