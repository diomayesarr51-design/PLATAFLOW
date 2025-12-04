export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  siren?: string;
  vatNumber?: string;
  paymentTerms: number; // days
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  createdAt: string;
}

export interface KPIMetrics {
  monthlyRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  dso: number; // Days Sales Outstanding
}