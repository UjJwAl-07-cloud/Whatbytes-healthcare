import { Outlet } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-branding">
          <div className="auth-logo">
            <Heart size={26} />
          </div>
          <h1>WhatBytes Healthcare</h1>
          <p>Healthcare Management System</p>
        </div>
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
