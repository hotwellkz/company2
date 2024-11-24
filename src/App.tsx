import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { Sidebar } from './components/Sidebar';
import { Feed } from './pages/Feed';
import { DailyReport } from './pages/DailyReport';
import { Clients } from './pages/Clients';
import { ContractTemplates } from './pages/ContractTemplates';
import { CalculatorPage } from './pages/Calculator';
import { Products } from './pages/Products';
import { useCategories } from './hooks/useCategories';
import { useStats } from './hooks/useStats';
import { LoadingSpinner } from './components/LoadingSpinner';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

type Page = 'main' | 'feed' | 'daily-report' | 'clients' | 'templates' | 'calculator' | 'products';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { stats, loading: statsLoading, error: statsError } = useStats();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        console.log('Firebase connected, documents count:', snapshot.size);
        setIsLoading(false);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading || categoriesLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  if (categoriesError || statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-xl text-red-500 p-4 bg-white rounded-lg shadow">
          Ошибка загрузки данных: {categoriesError || statsError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
      <div className="lg:pl-64">
        <Header stats={stats} />
        {currentPage === 'main' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CategoryGrid categories={categories} />
          </main>
        )}
        {currentPage === 'feed' && <Feed />}
        {currentPage === 'daily-report' && <DailyReport />}
        {currentPage === 'clients' && <Clients />}
        {currentPage === 'templates' && <ContractTemplates />}
        {currentPage === 'calculator' && <CalculatorPage />}
        {currentPage === 'products' && <Products />}
      </div>
    </div>
  );
};

export default App;