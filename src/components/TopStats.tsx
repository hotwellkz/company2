import React, { useState } from 'react';
import { collection, getDocs, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ContextMenu } from './ContextMenu';

interface TopStatsProps {
  stats: Array<{ label: string; value: string; }>;
}

export const TopStats: React.FC<TopStatsProps> = ({ stats }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent, label: string) => {
    if (label === 'Баланс') {
      e.preventDefault();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    }
  };

  const handleResetBalance = async () => {
    if (window.confirm('Вы уверены, что хотите обнулить все балансы? Это также очистит всю историю транзакций.')) {
      try {
        const batch = writeBatch(db);
        
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        categoriesSnapshot.docs.forEach((docRef) => {
          batch.update(doc(db, 'categories', docRef.id), {
            amount: '0 ₸'
          });
        });

        const transactionsSnapshot = await getDocs(collection(db, 'transactions'));
        const deletePromises = transactionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        await batch.commit();
        setShowContextMenu(false);
        
        alert('Все балансы обнулены и история транзакций очищена');
      } catch (error) {
        console.error('Error resetting data:', error);
        alert('Ошибка при обнулении данных');
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 py-4 border-t">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="text-center cursor-default"
            onContextMenu={(e) => handleContextMenu(e, stat.label)}
          >
            <div className="text-base text-gray-600 font-normal">{stat.label}</div>
            <div className="text-xl font-medium text-gray-800">{stat.value}</div>
          </div>
        ))}
      </div>

      {showContextMenu && (
        <ContextMenu
          position={contextMenuPosition}
          onClose={() => setShowContextMenu(false)}
          onEdit={() => handleResetBalance()}
          onDelete={() => {}}
          customActions={[
            {
              label: 'Обнулить все балансы',
              onClick: handleResetBalance,
              icon: 'refresh',
              className: 'text-blue-600'
            }
          ]}
        />
      )}
    </>
  );
};