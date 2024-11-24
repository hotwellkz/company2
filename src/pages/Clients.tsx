import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, deleteClientContracts } from '../lib/firebase';
import { ClientContextMenu } from '../components/ClientContextMenu';
import { Client, NewClient, initialClientState } from '../types/client';
import { ClientList } from '../components/clients/ClientList';
import { ClientModal } from '../components/clients/ClientModal';
import { ClientPage } from './ClientPage';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState<NewClient>(initialClientState);
  const [showClientPage, setShowClientPage] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const fetchClients = async () => {
    try {
      const q = query(collection(db, 'clients'), orderBy('clientNumber'));
      const snapshot = await getDocs(q);
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      setClients(clientsData);
      return clientsData;
    } catch (error) {
      console.error('Error fetching clients:', error);
      alert('Ошибка при загрузке списка клиентов');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => client.year === selectedYear);

  const handleContextMenu = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setSelectedClient(client);
    setShowContextMenu(true);
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setShowClientPage(true);
  };

  const handleEdit = () => {
    if (selectedClient) {
      setEditingClient({
        ...selectedClient
      });
      setShowEditModal(true);
      setShowContextMenu(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;

    if (window.confirm(`Вы уверены, что хотите удалить клиента ${selectedClient.lastName} ${selectedClient.firstName}?`)) {
      try {
        await deleteClientContracts(selectedClient.id);
        await deleteDoc(doc(db, 'clients', selectedClient.id));
        const updatedClients = await fetchClients();
        setClients(updatedClients);
        setShowContextMenu(false);
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Ошибка при удалении клиента');
      }
    }
  };

  const handleClientSaved = async () => {
    const updatedClients = await fetchClients();
    setClients(updatedClients);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  if (showClientPage && selectedClient) {
    return (
      <ClientPage
        client={selectedClient}
        onBack={() => setShowClientPage(false)}
        onSave={handleClientSaved}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Клиенты</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-1" />
                Добавить клиента
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Список клиентов */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет клиентов за {selectedYear} год</p>
          </div>
        ) : (
          <ClientList
            clients={filteredClients}
            onContextMenu={handleContextMenu}
            onClientClick={handleClientClick}
          />
        )}
      </div>

      {/* Контекстное меню */}
      {showContextMenu && selectedClient && (
        <ClientContextMenu
          position={contextMenuPosition}
          onClose={() => setShowContextMenu(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          clientName={`${selectedClient.lastName} ${selectedClient.firstName}`}
        />
      )}

      {/* Модальное окно добавления/редактирования клиента */}
      {(showAddModal || showEditModal) && (
        <ClientModal
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
          client={showEditModal ? editingClient : initialClientState}
          isEditMode={showEditModal}
          yearOptions={yearOptions}
          onSave={handleClientSaved}
        />
      )}
    </div>
  );
};