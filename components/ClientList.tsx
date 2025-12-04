import React, { useState } from 'react';
import { useData } from '../contexts/DataProvider';
import { Client } from '../types';
import { Search, Mail, MapPin, Plus, User, X, Check } from 'lucide-react';
import { Button } from './ui/Button';

const ClientList: React.FC = () => {
  const { clients, addClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({ name: '', email: '', address: '' });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClient.name!,
      email: newClient.email || '',
      address: newClient.address || '',
      paymentTerms: 30
    };
    
    addClient(client);
    setIsModalOpen(false);
    setNewClient({ name: '', email: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500">Gérez votre base de données clients.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />}>
          Ajouter un client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <User size={24} />
              </div>
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded font-medium border border-green-100">
                Actif
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{client.name}</h3>
            <p className="text-sm text-slate-500 mb-4">Client depuis 2023</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-slate-600 gap-2">
                <Mail size={16} className="text-slate-400" />
                <a href={`mailto:${client.email}`} className="hover:text-blue-600 truncate">{client.email}</a>
              </div>
              <div className="flex items-start text-slate-600 gap-2">
                <MapPin size={16} className="text-slate-400 mt-0.5" />
                <span className="line-clamp-2">{client.address}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="text-xs text-slate-400">
                SIREN: {client.siren || 'N/A'}
              </div>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Voir détails
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors bg-slate-50/50 hover:bg-blue-50/50 min-h-[250px]"
        >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <Plus size={24} />
            </div>
            <span className="font-medium">Ajouter un nouveau client</span>
        </button>
      </div>

      {/* Simple Modal for Adding Client */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg">Nouveau Client</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddClient} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      value={newClient.name} 
                      onChange={e => setNewClient({...newClient, name: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={newClient.email} 
                      onChange={e => setNewClient({...newClient, email: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                    <input 
                      type="text" 
                      value={newClient.address} 
                      onChange={e => setNewClient({...newClient, address: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
                 <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                    <Button type="submit">Ajouter le client</Button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;