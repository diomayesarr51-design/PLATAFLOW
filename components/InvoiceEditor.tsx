import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, Client } from '../types';
import { Plus, Trash2, Save, Download, ArrowLeft, Wand2, GripVertical } from 'lucide-react';
import { Button } from './ui/Button';
import { useData } from '../contexts/DataProvider';

interface InvoiceEditorProps {
  initialInvoice?: Invoice | null;
  onCancel: () => void;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ initialInvoice, onCancel }) => {
  const { clients, updateInvoice } = useData();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    number: `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    status: 'DRAFT',
    date: new Date().toISOString().split('T')[0],
    items: [],
    subtotal: 0,
    taxTotal: 0,
    total: 0
  });

  const [selectedClientId, setSelectedClientId] = useState<string>('');

  useEffect(() => {
    if (initialInvoice) {
      setInvoice(initialInvoice);
      setSelectedClientId(initialInvoice.clientId);
    }
  }, [initialInvoice]);

  const calculateTotals = (items: InvoiceItem[]) => {
    const sub = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0);
    return { sub, tax, total: sub + tax };
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 20
    };
    const newItems = [...(invoice.items || []), newItem];
    const totals = calculateTotals(newItems);
    setInvoice({ ...invoice, items: newItems, subtotal: totals.sub, taxTotal: totals.tax, total: totals.total });
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = (invoice.items || []).map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    const totals = calculateTotals(newItems);
    setInvoice({ ...invoice, items: newItems, subtotal: totals.sub, taxTotal: totals.tax, total: totals.total });
  };

  const handleRemoveItem = (id: string) => {
    const newItems = (invoice.items || []).filter(item => item.id !== id);
    const totals = calculateTotals(newItems);
    setInvoice({ ...invoice, items: newItems, subtotal: totals.sub, taxTotal: totals.tax, total: totals.total });
  };

  const handleSave = () => {
    if (!selectedClientId) return alert('Veuillez sélectionner un client');
    
    setIsSaving(true);
    const client = clients.find(c => c.id === selectedClientId);
    const dueDate = new Date(invoice.date!);
    dueDate.setDate(dueDate.getDate() + (client?.paymentTerms || 30));

    const finalInvoice: Invoice = {
      id: invoice.id || Math.random().toString(36).substr(2, 9),
      number: invoice.number!,
      clientId: selectedClientId,
      status: invoice.status as any || 'SENT', // Simulate immediate send for dashboard impact
      date: invoice.date!,
      dueDate: dueDate.toISOString().split('T')[0],
      items: invoice.items || [],
      subtotal: invoice.subtotal!,
      taxTotal: invoice.taxTotal!,
      total: invoice.total!,
      createdAt: invoice.createdAt || new Date().toISOString(),
      notes: invoice.notes
    };

    // Simulate network delay
    setTimeout(() => {
      updateInvoice(finalInvoice);
      setIsSaving(false);
      onCancel(); // Go back to list
    }, 800);
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Reusable sub-components for cleaner render
  const ClientSection = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Informations Client</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Facturer à</label>
          <select 
            value={selectedClientId} 
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">-- Sélectionner un client --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          {selectedClient && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 animate-fade-in">
              <div className="font-bold text-slate-900">{selectedClient.name}</div>
              <div>{selectedClient.address}</div>
              <div>{selectedClient.email}</div>
              <div className="mt-2 text-xs text-slate-400">TVA: {selectedClient.vatNumber || 'N/A'}</div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date d'émission</label>
            <input 
              type="date" 
              value={invoice.date}
              onChange={(e) => setInvoice({...invoice, date: e.target.value})}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
             <span className="text-sm text-slate-500">Échéance estimée</span>
             <span className="font-semibold text-slate-900">{selectedClient ? `+${selectedClient.paymentTerms} jours` : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const InvoiceItemsList = () => (
    <div className="space-y-4">
      {invoice.items?.map((item, index) => (
        <div key={item.id} className="group bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all relative">
          {/* Mobile Layout (Stacked) */}
          <div className="md:hidden space-y-3">
             <input 
                type="text" 
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                className="w-full font-medium text-slate-900 border-b border-transparent focus:border-blue-500 outline-none placeholder:text-slate-300 bg-transparent py-1"
             />
             <div className="flex gap-3">
                <div className="flex-1">
                   <label className="text-[10px] uppercase text-slate-400 font-bold">Qté</label>
                   <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-slate-50 rounded border border-transparent focus:bg-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="flex-1">
                   <label className="text-[10px] uppercase text-slate-400 font-bold">Prix U.</label>
                   <input 
                      type="number" 
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-slate-50 rounded border border-transparent focus:bg-white focus:border-blue-500 outline-none"
                    />
                </div>
             </div>
             <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <span className="font-bold text-slate-900">{(item.quantity * item.unitPrice).toFixed(2)} €</span>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 p-2"><Trash2 size={18}/></button>
             </div>
          </div>

          {/* Desktop Layout (Grid like) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="cursor-move text-slate-300 hover:text-slate-500"><GripVertical size={16}/></div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Description du produit ou service"
                value={item.description}
                onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                className="w-full font-medium text-slate-900 border-transparent focus:border-blue-500 border-b outline-none placeholder:text-slate-300 bg-transparent py-1"
              />
            </div>
            <div className="w-20">
               <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full text-right p-1 rounded hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="w-24">
               <input 
                  type="number" 
                  value={item.unitPrice}
                  onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full text-right p-1 rounded hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="w-24 text-right font-bold text-slate-900">
              {(item.quantity * item.unitPrice).toFixed(2)} €
            </div>
            <button 
              onClick={() => handleRemoveItem(item.id)}
              className="text-slate-300 hover:text-red-500 transition-colors p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      
      <Button variant="secondary" onClick={handleAddItem} icon={<Plus size={16} />} fullWidth className="border-dashed border-2 bg-transparent text-slate-600 hover:bg-slate-50 border-slate-300 shadow-none">
        Ajouter une ligne
      </Button>
    </div>
  );

  const InvoicePreview = () => (
    <div className="bg-white shadow-xl rounded-none md:rounded-xl overflow-hidden border border-slate-200 min-h-[600px] flex flex-col">
       <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
       <div className="p-8 md:p-12 flex-1">
          <div className="flex justify-between items-start mb-8">
             <div>
                <h1 className="text-3xl font-bold text-slate-900">FACTURE</h1>
                <p className="text-slate-500 mt-1">#{invoice.number}</p>
             </div>
             <div className="text-right">
                <div className="font-bold text-slate-900">PlataFlow Inc.</div>
                <div className="text-sm text-slate-500">75000 Paris</div>
             </div>
          </div>
          
          <div className="border-t border-b border-slate-100 py-6 mb-8 flex flex-col md:flex-row gap-8">
             <div className="flex-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Facturé à</h3>
                {selectedClient ? (
                  <div className="text-sm">
                    <p className="font-bold text-slate-900">{selectedClient.name}</p>
                    <p className="text-slate-600">{selectedClient.address}</p>
                  </div>
                ) : <span className="text-slate-300 italic">Aucun client sélectionné</span>}
             </div>
             <div className="flex-1 md:text-right">
                <div className="flex justify-between md:justify-end gap-8 mb-2">
                   <span className="text-slate-500 text-sm">Date:</span>
                   <span className="font-medium">{new Date(invoice.date!).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between md:justify-end gap-8">
                   <span className="text-slate-500 text-sm">Total:</span>
                   <span className="font-bold text-blue-600">{invoice.total?.toFixed(2)} €</span>
                </div>
             </div>
          </div>

          <table className="w-full text-sm mb-8">
             <thead>
                <tr className="border-b border-slate-200 text-left">
                   <th className="py-2 text-slate-500 font-medium">Description</th>
                   <th className="py-2 text-right text-slate-500 font-medium">Qté</th>
                   <th className="py-2 text-right text-slate-500 font-medium">Prix</th>
                   <th className="py-2 text-right text-slate-500 font-medium">Total</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {invoice.items?.map(item => (
                   <tr key={item.id}>
                      <td className="py-3 text-slate-900">{item.description || <span className="text-slate-300 italic">Item sans nom</span>}</td>
                      <td className="py-3 text-right text-slate-600">{item.quantity}</td>
                      <td className="py-3 text-right text-slate-600">{item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-right font-medium text-slate-900">{(item.quantity * item.unitPrice).toFixed(2)}</td>
                   </tr>
                ))}
             </tbody>
          </table>

          <div className="flex justify-end">
             <div className="w-full md:w-1/2 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                   <span>Sous-total</span>
                   <span>{invoice.subtotal?.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                   <span>TVA (20%)</span>
                   <span>{invoice.taxTotal?.toFixed(2)} €</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-lg font-bold text-slate-900">
                   <span>Total TTC</span>
                   <span>{invoice.total?.toFixed(2)} €</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 sticky top-0 z-20 bg-slate-50/95 backdrop-blur py-2">
        <div className="flex items-center w-full md:w-auto">
          <Button variant="ghost" onClick={onCancel} className="mr-2 text-slate-500">
            <ArrowLeft size={20} />
          </Button>
          <div>
             <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
               {invoice.number}
               <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">{invoice.status}</span>
             </h1>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex bg-slate-200 p-1 rounded-lg w-full">
           <button 
             onClick={() => setActiveTab('edit')} 
             className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
           >
             Éditeur
           </button>
           <button 
             onClick={() => setActiveTab('preview')} 
             className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
           >
             Aperçu
           </button>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex gap-3">
          <Button variant="outline" icon={<Download size={18} />}>PDF</Button>
          <Button onClick={handleSave} isLoading={isSaving} icon={<Save size={18} />}>Enregistrer</Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Editor Column */}
        <div className={`${activeTab === 'edit' ? 'block' : 'hidden'} lg:block space-y-6 animate-fade-in`}>
           <ClientSection />
           
           <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Lignes de facture</h3>
              <Button variant="ghost" size="xs" icon={<Wand2 size={14} />} className="text-purple-600">Auto-complétion IA</Button>
           </div>
           
           <InvoiceItemsList />

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes & Conditions</label>
              <textarea
                value={invoice.notes || ''}
                onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
                placeholder="Conditions de paiement, coordonnées bancaires..."
                className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-600 min-h-[100px] focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
           </div>
        </div>

        {/* Preview Column */}
        <div className={`${activeTab === 'preview' ? 'block' : 'hidden'} lg:block animate-fade-in sticky top-24`}>
           <InvoicePreview />
           {/* Mobile Fab for save when in preview */}
           <div className="md:hidden fixed bottom-24 right-4 left-4 z-30">
              <Button fullWidth onClick={handleSave} isLoading={isSaving} icon={<Save size={18} />} className="shadow-lg">Enregistrer la facture</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditor;