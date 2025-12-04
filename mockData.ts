import { Client, Invoice } from './types';

export const initialClients: Client[] = [
  {
    id: 'c1',
    name: 'TechSolutions SAS',
    email: 'contact@techsolutions.fr',
    address: '12 Avenue des Champs-Élysées, 75008 Paris',
    siren: '892 123 456',
    paymentTerms: 30
  },
  {
    id: 'c2',
    name: 'Boulangerie Durand',
    email: 'jean.durand@orange.fr',
    address: '45 Rue de la République, 69002 Lyon',
    siren: '456 789 123',
    paymentTerms: 15
  },
  {
    id: 'c3',
    name: 'Consulting Partners',
    email: 'finance@consulting-partners.com',
    address: '10 Quai des Chartrons, 33000 Bordeaux',
    siren: '789 123 456',
    paymentTerms: 45
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'i1',
    number: 'FAC-2024-001',
    clientId: 'c1',
    status: 'PAID',
    date: '2024-04-01',
    dueDate: '2024-05-01',
    items: [
      { id: 'it1', description: 'Développement Module Auth', quantity: 5, unitPrice: 850, taxRate: 20 },
      { id: 'it2', description: 'Maintenance Serveur Avril', quantity: 1, unitPrice: 200, taxRate: 20 }
    ],
    subtotal: 4450,
    taxTotal: 890,
    total: 5340,
    createdAt: '2024-04-01T10:00:00Z'
  },
  {
    id: 'i2',
    number: 'FAC-2024-002',
    clientId: 'c2',
    status: 'OVERDUE',
    date: '2024-04-10',
    dueDate: '2024-04-25',
    items: [
      { id: 'it3', description: 'Installation Caisse Tactile', quantity: 1, unitPrice: 1200, taxRate: 20 },
      { id: 'it4', description: 'Formation Personnel', quantity: 4, unitPrice: 90, taxRate: 20 }
    ],
    subtotal: 1560,
    taxTotal: 312,
    total: 1872,
    createdAt: '2024-04-10T14:30:00Z'
  },
  {
    id: 'i3',
    number: 'FAC-2024-003',
    clientId: 'c3',
    status: 'SENT',
    date: '2024-05-15',
    dueDate: '2024-06-30',
    items: [
      { id: 'it5', description: 'Audit Sécurité', quantity: 3, unitPrice: 1100, taxRate: 20 }
    ],
    subtotal: 3300,
    taxTotal: 660,
    total: 3960,
    createdAt: '2024-05-15T09:15:00Z'
  }
];