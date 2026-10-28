import './LoadingSpinner.css';

export default function LoadingSpinner({ message = 'Loading...', small = false }) {
  if (small) {
    return <div className="spinner small" />;
  }

  return (
    <div className="spinner-container">
      <div className="spinner" />
      <span>{message}</span>
    </div>
  );
}
