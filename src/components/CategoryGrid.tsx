import React, { useState, useRef } from 'react';
import { CategoryCard } from './CategoryCard';
import { CategoryCardType } from '../types';
import { AddCategoryButton } from './AddCategoryButton';
import { ChevronDown, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { AddCategoryModal } from './AddCategoryModal';

interface CategoryGridProps {
  categories: CategoryCardType[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    row1: false,
    row2: false,
    row3: false,
    row4: false
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const scrollContainers = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const activeContainer = useRef<string | null>(null);

  const categoriesByRow = {
    row1: categories.filter(cat => !cat.row || cat.row === 1),
    row2: categories.filter(cat => cat.row === 2),
    row3: categories.filter(cat => cat.row === 3),
    row4: categories.filter(cat => cat.row === 4),
  };

  const rowTitles = {
    row1: 'Клиенты',
    row2: 'Сотрудники',
    row3: 'Проекты',
    row4: 'Склад',
  };

  const toggleSection = (rowKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [rowKey]: !prev[rowKey]
    }));
  };

  const handleAddClick = (row: number) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const scroll = (rowKey: string, direction: 'left' | 'right') => {
    const container = scrollContainers.current[rowKey];
    if (container) {
      const scrollAmount = 240;
      const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, rowKey: string) => {
    const container = scrollContainers.current[rowKey];
    if (container) {
      setIsDragging(true);
      activeContainer.current = rowKey;
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !activeContainer.current) return;
    
    const container = scrollContainers.current[activeContainer.current];
    if (container) {
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    if (!activeContainer.current) return;
    
    const container = scrollContainers.current[activeContainer.current];
    if (container) {
      setIsDragging(false);
      activeContainer.current = null;
      container.style.cursor = 'grab';
      container.style.removeProperty('user-select');
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(categoriesByRow).map(([rowKey, rowCategories], index) => {
        const isCollapsed = collapsedSections[rowKey];
        const rowNumber = index + 1;
        
        return (
          <div key={rowKey} className="space-y-4">
            <button 
              onClick={() => toggleSection(rowKey)}
              className="hidden sm:flex items-center space-x-2 w-full px-4"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
              <span className="text-base font-medium text-gray-700">
                {rowTitles[rowKey as keyof typeof rowTitles]}
              </span>
            </button>
            
            {!isCollapsed && (
              <div className="relative group">
                <div 
                  ref={el => scrollContainers.current[rowKey] = el}
                  className="overflow-x-hidden scroll-smooth cursor-grab"
                  onMouseDown={(e) => handleMouseDown(e, rowKey)}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div className="grid grid-cols-4 gap-2 px-2 sm:grid-cols-none sm:gap-0 sm:px-4 sm:inline-flex sm:space-x-4">
                    {rowCategories.map((category) => (
                      <div key={category.id} className="sm:w-[120px] flex-shrink-0">
                        <CategoryCard category={category} />
                      </div>
                    ))}
                    <div className="sm:w-[120px] flex-shrink-0">
                      <AddCategoryButton onClick={() => handleAddClick(rowNumber)} />
                    </div>
                  </div>
                </div>
                
                {rowCategories.length > 5 && (
                  <>
                    <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => scroll(rowKey, 'left')}
                        className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => scroll(rowKey, 'right')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {isModalOpen && selectedRow && (
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          selectedRow={selectedRow}
        />
      )}
    </div>
  );
};