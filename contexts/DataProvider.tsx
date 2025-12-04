import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Invoice, Client } from '../types';
import { initialInvoices, initialClients } from '../mockData';
import { eventService, EVENTS } from '../lib/events';

interface DataContextType {
  invoices: Invoice[];
  clients: Client[];
  addClient: (client: Client) => void;
  updateInvoice: (invoice: Invoice) => void;
  stats: {
    totalRevenue: number;
    pendingRevenue: number;
    overdueRevenue: number;
    invoicesCount: number;
    clientsCount: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [clients, setClients] = useState<Client[]>(initialClients);

  // Calculate real-time stats
  const stats = {
    totalRevenue: invoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + i.total, 0),
    pendingRevenue: invoices.filter(i => i.status === 'SENT').reduce((acc, i) => acc + i.total, 0),
    overdueRevenue: invoices.filter(i => i.status === 'OVERDUE').reduce((acc, i) => acc + i.total, 0),
    invoicesCount: invoices.length,
    clientsCount: clients.length
  };

  useEffect(() => {
    // Subscribe to Invoice Events
    const unsubInvoiceCreated = eventService.subscribe<Invoice>(EVENTS.INVOICE_CREATED, (newInvoice) => {
      setInvoices(prev => [newInvoice, ...prev]);
      eventService.publish(EVENTS.NOTIFICATION, {
        type: 'success',
        title: 'Facture créée',
        message: `La facture ${newInvoice.number} a été ajoutée avec succès.`
      });
    });

    const unsubInvoiceUpdated = eventService.subscribe<Invoice>(EVENTS.INVOICE_UPDATED, (updatedInvoice) => {
      setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
      eventService.publish(EVENTS.NOTIFICATION, {
        type: 'info',
        title: 'Facture mise à jour',
        message: `La facture ${updatedInvoice.number} a été modifiée.`
      });
    });

    // Subscribe to Client Events
    const unsubClientCreated = eventService.subscribe<Client>(EVENTS.CLIENT_CREATED, (newClient) => {
      setClients(prev => [...prev, newClient]);
      eventService.publish(EVENTS.NOTIFICATION, {
        type: 'success',
        title: 'Client ajouté',
        message: `Le client ${newClient.name} a été ajouté à votre base.`
      });
    });

    return () => {
      unsubInvoiceCreated();
      unsubInvoiceUpdated();
      unsubClientCreated();
    };
  }, []);

  // Helper methods that publish events (Simulating API calls)
  const addClient = (client: Client) => {
    eventService.publish(EVENTS.CLIENT_CREATED, client);
  };

  const updateInvoice = (invoice: Invoice) => {
    // Check if it's new or existing
    const exists = invoices.find(i => i.id === invoice.id);
    if (exists) {
      eventService.publish(EVENTS.INVOICE_UPDATED, invoice);
    } else {
      eventService.publish(EVENTS.INVOICE_CREATED, invoice);
    }
  };

  return (
    <DataContext.Provider value={{ invoices, clients, addClient, updateInvoice, stats }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};