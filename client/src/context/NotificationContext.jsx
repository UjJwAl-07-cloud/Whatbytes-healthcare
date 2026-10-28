import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);

  const clearNotification = useCallback(() => {
    setNotification(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showNotification = useCallback((message, type = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setNotification({ message, type, id: Date.now() });
    timerRef.current = setTimeout(() => {
      setNotification(null);
      timerRef.current = null;
    }, 4000);
  }, []);

  const showSuccess = useCallback((message) => showNotification(message, 'success'), [showNotification]);
  const showError = useCallback((message) => showNotification(message, 'error'), [showNotification]);
  const showInfo = useCallback((message) => showNotification(message, 'info'), [showNotification]);

  return (
    <NotificationContext.Provider value={{ notification, showSuccess, showError, showInfo, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
