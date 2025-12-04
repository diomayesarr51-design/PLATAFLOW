import React, { useState } from 'react';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';
import InvoiceList from './components/InvoiceList';
import InvoiceEditor from './components/InvoiceEditor';
import ClientList from './components/ClientList';
import { DataProvider } from './contexts/DataProvider';
import { Toaster } from './components/ui/Toaster';
import { Invoice } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

  const handleCreateNewInvoice = () => {
    setEditingInvoiceId('new');
    setCurrentView('invoice-editor');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <InvoiceList onCreateNew={handleCreateNewInvoice} />;
      case 'clients':
        return <ClientList />;
      case 'invoice-editor':
        // Note: InvoiceEditor now handles saving internally via context
        return (
          <InvoiceEditor 
            initialInvoice={null} // Editing existing not fully wired yet for simplicity
            onCancel={() => setCurrentView('invoices')}
          />
        );
      case 'reports':
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-fade-in">
             <div className="bg-blue-50 p-6 rounded-full mb-4">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
             </div>
             <h2 className="text-xl font-bold text-slate-900">Module Rapports</h2>
             <p className="text-slate-500 mt-2 max-w-sm">Les fonctionnalités avancées de reporting et analytics seront disponibles dans la version Pro.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-fade-in">
             <div className="bg-slate-100 p-6 rounded-full mb-4">
                <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             </div>
             <h2 className="text-xl font-bold text-slate-900">Paramètres</h2>
             <p className="text-slate-500 mt-2">Configurez votre profil entreprise et vos préférences de facturation ici prochainement.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
      <Toaster />
    </DataProvider>
  );
};

export default App;