import { CheckCircle, Send, AlertTriangle, FileText, XCircle, Clock, AlertOctagon } from 'lucide-react';

export const INVOICE_STATUSES = {
  DRAFT: {
    label: "Brouillon",
    colorClass: "bg-slate-100 text-slate-700 border-slate-200",
    icon: FileText,
    description: "Facture en cours de rédaction"
  },
  SENT: {
    label: "Envoyée",
    colorClass: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Send,
    description: "Facture envoyée au client, en attente de paiement"
  },
  PAID: {
    label: "Payée",
    colorClass: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    description: "Paiement intégralement reçu"
  },
  OVERDUE: {
    label: "En retard",
    colorClass: "bg-red-100 text-red-700 border-red-200",
    icon: AlertTriangle,
    description: "Échéance dépassée sans règlement"
  },
  CANCELLED: {
    label: "Annulée",
    colorClass: "bg-gray-100 text-gray-500 border-gray-200",
    icon: XCircle,
    description: "Facture annulée, ne sera pas payée"
  }
};

export const PAYMENT_TERMS = {
  0: "À réception",
  15: "15 jours",
  30: "30 jours",
  45: "45 jours fin de mois",
  60: "60 jours"
};

export const getStatusConfig = (status: string) => {
  return INVOICE_STATUSES[status as keyof typeof INVOICE_STATUSES] || INVOICE_STATUSES.DRAFT;
};