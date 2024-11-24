import React from 'react';
import { Plus } from 'lucide-react';

interface AddCategoryButtonProps {
  onClick: () => void;
}

export const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center space-y-2 cursor-pointer group"
    >
      <div className="w-16 h-16 bg-gray-200 group-hover:bg-gray-300 rounded-full flex items-center justify-center shadow-lg transition-colors">
        <Plus className="w-8 h-8 text-gray-500 group-hover:text-gray-700" />
      </div>
      <div className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
        Добавить
      </div>
    </button>
  );
};