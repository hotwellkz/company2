import React, { useState } from 'react';
import { 
  User, 
  ScrollText, 
  Receipt, 
  PieChart, 
  History, 
  Star, 
  Share2, 
  Settings, 
  HelpCircle,
  RefreshCw,
  FileText,
  Users,
  Calculator,
  Menu,
  X,
  Package
} from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface SidebarProps {
  onPageChange: (page: 'main' | 'feed' | 'daily-report' | 'clients' | 'templates' | 'calculator' | 'products') => void;
  currentPage: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onPageChange, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { 
      icon: <User className="w-5 h-5" />, 
      label: 'Профиль', 
      onClick: () => onPageChange('main'),
      isActive: currentPage === 'main'
    },
    { 
      icon: <ScrollText className="w-5 h-5" />, 
      label: 'Лента', 
      onClick: () => onPageChange('feed'),
      isActive: currentPage === 'feed'
    },
    { 
      icon: <Receipt className="w-5 h-5" />, 
      label: 'Отчет по дням', 
      onClick: () => onPageChange('daily-report'),
      isActive: currentPage === 'daily-report'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Клиенты', 
      onClick: () => onPageChange('clients'),
      isActive: currentPage === 'clients'
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: 'Шаблоны договоров', 
      onClick: () => onPageChange('templates'),
      isActive: currentPage === 'templates'
    },
    { 
      icon: <Calculator className="w-5 h-5" />, 
      label: 'Калькулятор', 
      onClick: () => onPageChange('calculator'),
      isActive: currentPage === 'calculator'
    },
    { 
      icon: <Package className="w-5 h-5" />, 
      label: 'Товары и цены', 
      onClick: () => onPageChange('products'),
      isActive: currentPage === 'products'
    },
    { icon: <PieChart className="w-5 h-5" />, label: 'Общая', onClick: () => {} },
    { icon: <History className="w-5 h-5" />, label: 'История', onClick: () => {} },
    { icon: <Star className="w-5 h-5" />, label: 'Оценить нас', onClick: () => {} },
    { icon: <Share2 className="w-5 h-5" />, label: 'Распределите СМС', onClick: () => {} },
    { icon: <Settings className="w-5 h-5" />, label: 'Настройки', onClick: () => {} },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Помощь', onClick: () => {} },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    item.onClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-64
      `}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4 mt-16 lg:mt-0">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item)}
                className={`w-full flex items-center px-6 py-3 text-gray-700 transition-colors ${
                  item.isActive 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className={item.isActive ? 'text-emerald-600' : 'text-emerald-500'}>
                  {item.icon}
                </span>
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center text-sm text-gray-500">
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>Сегодня, {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};