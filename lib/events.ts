type EventCallback<T = any> = (data: T) => void;

class EventBus {
  private listeners: { [key: string]: EventCallback[] } = {};

  subscribe<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  publish<T>(event: string, data: T) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export const eventService = new EventBus();

export const EVENTS = {
  INVOICE_CREATED: 'INVOICE_CREATED',
  INVOICE_UPDATED: 'INVOICE_UPDATED',
  CLIENT_CREATED: 'CLIENT_CREATED',
  NOTIFICATION: 'NOTIFICATION'
};