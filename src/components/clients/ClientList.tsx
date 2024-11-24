import React from 'react';
import { Client } from '../../types/client';

interface ClientListProps {
  clients: Client[];
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
  onClientClick: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ 
  clients, 
  onContextMenu,
  onClientClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      {clients.map((client, index) => (
        <div
          key={client.id}
          className="flex items-center px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
          onContextMenu={(e) => onContextMenu(e, client)}
          onClick={() => onClientClick(client)}
        >
          <span className="w-12 text-gray-500 font-medium">{index + 1}</span>
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {client.lastName} {client.firstName}
              </span>
              <span className="text-sm text-gray-500">
                {client.clientNumber || 'Нет номера'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-900">{client.phone}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};