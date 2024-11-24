import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TopStatType } from '../types';

const formatAmount = (amount: string): number => {
  const cleanAmount = amount.replace(/[^\d.-]/g, '');
  return parseFloat(cleanAmount);
};

const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('ru-RU').format(absAmount);
  return `${amount < 0 ? '-' : ''}${formatted} ₸`;
};

export const useStats = () => {
  const [stats, setStats] = useState<TopStatType[]>([
    { label: 'Баланс', value: '0 ₸' },
    { label: 'Расходы', value: '0 ₸' },
    { label: 'В планах', value: '0 ₸' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribeCategories = onSnapshot(
        collection(db, 'categories'),
        (snapshot) => {
          let totalBalance = 0;
          let totalExpenses = 0;

          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const amount = formatAmount(data.amount);
            
            if (amount < 0) {
              totalExpenses += Math.abs(amount);
              totalBalance -= Math.abs(amount);
            } else {
              totalBalance += amount;
            }
          });

          setStats([
            { label: 'Баланс', value: formatCurrency(totalBalance) },
            { label: 'Расходы', value: formatCurrency(totalExpenses) },
            { label: 'В планах', value: '0 ₸' },
          ]);
          setLoading(false);
        },
        (error) => {
          console.error('Categories subscription error:', error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => unsubscribeCategories();
    } catch (error) {
      console.error('Error in useStats:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  return { stats, loading, error };
};