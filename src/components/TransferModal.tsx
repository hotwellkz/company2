import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CategoryCardType } from '../types';
import { collection, addDoc, serverTimestamp, runTransaction, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TransferModalProps {
  sourceCategory: CategoryCardType;
  targetCategory: CategoryCardType;
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  sourceCategory,
  targetCategory,
  isOpen,
  onClose,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transferAmount = parseFloat(amount);

      // Создаем транзакции для обоих категорий
      await runTransaction(db, async (transaction) => {
        // Создаем транзакцию списания
        const withdrawalRef = await addDoc(collection(db, 'transactions'), {
          categoryId: sourceCategory.id,
          fromUser: sourceCategory.title,
          toUser: targetCategory.title,
          amount: transferAmount,
          description,
          type: 'expense',
          date: serverTimestamp()
        });

        // Создаем транзакцию пополнения
        const depositRef = await addDoc(collection(db, 'transactions'), {
          categoryId: targetCategory.id,
          fromUser: sourceCategory.title,
          toUser: targetCategory.title,
          amount: transferAmount,
          description,
          type: 'income',
          date: serverTimestamp()
        });

        // Обновляем балансы категорий
        const sourceDoc = doc(db, 'categories', sourceCategory.id);
        const targetDoc = doc(db, 'categories', targetCategory.id);

        const sourceAmount = parseFloat(sourceCategory.amount.replace(/[^\d.-]/g, '')) - transferAmount;
        const targetAmount = parseFloat(targetCategory.amount.replace(/[^\d.-]/g, '')) + transferAmount;

        transaction.update(sourceDoc, { amount: `${sourceAmount} ₸` });
        transaction.update(targetDoc, { amount: `${targetAmount} ₸` });
      });

      onClose();
    } catch (error) {
      console.error('Error processing transfer:', error);
      alert('Ошибка при выполнении перевода');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Перевод средств</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>От: {sourceCategory.title}</span>
            <span>Кому: {targetCategory.title}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сумма перевода
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Комментарий к переводу
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                placeholder="Укажите назначение платежа"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Выполняется перевод...' : 'Выполнить перевод'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};