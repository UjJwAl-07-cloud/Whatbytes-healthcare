import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <div className="notfound-icon">
          <FileQuestion size={56} />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/dashboard" className="btn btn-primary-action">
          <Home size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
