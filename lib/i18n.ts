import { fr } from '../messages/fr';

// For this specific app scope, we default to French directly.
// In a real multi-lang setup, this would use a Context to switch languages.
export const useTranslation = () => {
  return { t: fr };
};

// Helper to access nested keys if needed (simplified for direct usage)
// Usage: t.dashboard.title
