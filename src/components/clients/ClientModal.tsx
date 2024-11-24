import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ClientForm } from './ClientForm';
import { NewClient } from '../../types/client';
import { collection, addDoc, doc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: NewClient;
  isEditMode?: boolean;
  yearOptions: number[];
  onSave: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  client: initialClient,
  isEditMode = false,
  yearOptions,
  onSave
}) => {
  const [client, setClient] = useState<NewClient>(initialClient);

  useEffect(() => {
    if (!isEditMode) {
      generateClientNumber(client.year);
    }
  }, [client.year]);

  const generateClientNumber = async (year: number) => {
    try {
      const q = query(
        collection(db, 'clients'),
        where('year', '==', year)
      );
      
      const snapshot = await getDocs(q);
      let maxNumber = 0;

      snapshot.forEach(doc => {
        const clientData = doc.data();
        const currentNumber = parseInt(clientData.clientNumber.split('-')[1]);
        if (currentNumber > maxNumber) {
          maxNumber = currentNumber;
        }
      });

      const nextNumber = maxNumber + 1;
      const clientNumber = `${year}-${String(nextNumber).padStart(3, '0')}`;
      
      setClient(prev => ({ ...prev, clientNumber }));
    } catch (error) {
      console.error('Error generating client number:', error);
    }
  };

  const handleChange = (updates: Partial<NewClient>) => {
    setClient(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clientData = {
        ...client,
        createdAt: serverTimestamp()
      };

      if (isEditMode) {
        const clientRef = doc(db, 'clients', initialClient.id!);
        await updateDoc(clientRef, clientData);
      } else {
        await addDoc(collection(db, 'clients'), clientData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Ошибка при сохранении данных клиента');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Редактировать клиента' : 'Добавить клиента'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <ClientForm
            client={client}
            onChange={handleChange}
            yearOptions={yearOptions}
            isEditMode={isEditMode}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              {isEditMode ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};