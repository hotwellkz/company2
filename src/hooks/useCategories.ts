import { useState, useEffect } from 'react';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Building2, Calculator, Car, Globe, Hammer, Home, Package, User, Wallet } from 'lucide-react';
import { CategoryCardType } from '../types';
import React from 'react';

const createIcon = (Icon: React.ElementType) => {
  return React.createElement(Icon, { 
    size: 24,
    className: "text-white"
  });
};

const iconMap: { [key: string]: React.ElementType } = {
  Car,
  User,
  Building2,
  Calculator,
  Wallet,
  Home,
  Hammer,
  Globe,
  Package
};

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
      try {
        const categoriesData = snapshot.docs.map(doc => {
          const data = doc.data();
          const IconComponent = iconMap[data.icon] || Home;
          
          return {
            id: doc.id,
            title: data.title,
            amount: data.amount,
            icon: createIcon(IconComponent),
            iconName: data.icon,
            color: data.color || 'bg-emerald-500',
            row: data.row || 1
          };
        });
        
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error processing categories:', err);
        setError('Ошибка обработки данных категорий');
        setLoading(false);
      }
    };

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'categories'),
        handleSnapshot,
        (err) => {
          console.error('Categories subscription error:', err);
          setError('Ошибка получения данных');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up categories subscription:', err);
      setError('Ошибка подключения к базе данных');
      setLoading(false);
    }
  }, []);

  return { categories, loading, error };
};