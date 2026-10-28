import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>
          <AlertTriangle size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: confirmVariant === 'danger' ? '#dc2626' : '#2563eb' }} />
          {title}
        </h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className={`confirm-btn ${confirmVariant}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
