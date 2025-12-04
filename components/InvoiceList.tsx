import React from 'react';
import { useData } from '../contexts/DataProvider';
import { Plus, Search, Filter, FileText, Send, AlertTriangle, Check, Calendar, User, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

interface InvoiceListProps {
  onCreateNew: () => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onCreateNew }) => {
  const { invoices, clients } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
      case 'SENT': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <Check size={12} className="mr-1" />;
      case 'SENT': return <Send size={12} className="mr-1" />;
      case 'OVERDUE': return <AlertTriangle size={12} className="mr-1" />;
      default: return null;
    }
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Inconnu';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Factures</h1>
          <p className="text-slate-500 mt-1">Gérez vos factures et suivez les paiements.</p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={onCreateNew} fullWidth icon={<Plus size={18} />}>
            Nouvelle Facture
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par n°, client..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
            />
          </div>
          <Button variant="outline" icon={<Filter size={18} />}>
            Filtrer
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Numéro</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Échéance</th>
                <th className="px-6 py-4 text-right">Montant TTC</th>
                <th className="px-6 py-4 text-center">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                      <FileText size={16} />
                    </div>
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {getClientName(invoice.clientId)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {invoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-slate-100">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-4 hover:bg-slate-50 transition-colors active:bg-slate-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText size={18} />
                   </div>
                   <div>
                     <span className="block font-bold text-slate-900 text-sm">{invoice.number}</span>
                     <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                     </span>
                   </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-slate-900 text-lg">
                    {invoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                  <span className="text-xs text-slate-400">TTC</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-slate-500 mb-3">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-700">{getClientName(invoice.clientId)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span>Échéance: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                 <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                    Voir détails <ChevronRight size={16} className="ml-1" />
                 </Button>
              </div>
            </div>
          ))}
        </div>

        {invoices.length === 0 && (
          <div className="p-12 text-center text-slate-500">
             Aucune facture trouvée. Créez votre première facture !
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;