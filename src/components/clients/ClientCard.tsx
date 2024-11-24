import React, { useState } from 'react';
import { X, Save, Edit2 } from 'lucide-react';
import { Client } from '../../types/client';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ClientCardProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(client);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const clientRef = doc(db, 'clients', client.id);
      await updateDoc(clientRef, formData);
      setIsEditing(false);
      window.location.reload(); // Обновляем страницу для отображения изменений
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Ошибка при сохранении данных клиента');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Карточка клиента</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер клиента
              </label>
              <input
                type="text"
                name="clientNumber"
                value={formData.clientNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Год
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};