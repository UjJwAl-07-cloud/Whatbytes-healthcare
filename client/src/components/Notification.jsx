import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import './Notification.css';

const icons = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
};

export default function Notification() {
  const { notification, clearNotification } = useNotification();

  if (!notification) return null;

  return (
    <div className={`notification-bar ${notification.type}`} key={notification.id} role="status" aria-live="polite">
      {icons[notification.type]}
      <span className="notif-message">{notification.message}</span>
      <button className="notif-close" onClick={clearNotification} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}
