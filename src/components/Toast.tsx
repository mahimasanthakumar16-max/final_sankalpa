"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 99999,
          maxWidth: '420px',
          width: 'calc(100% - 48px)',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    
    // Auto-remove after 5 seconds
    const removeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(toast.id), 300); // Wait for exit animation
    }, 5000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  // Color palette matching Sankalpa styles
  let bgColor = '#ffffff';
  let borderColor = '#e2e8f0';
  let iconColor = '#0284c7'; // Sky blue
  let textColor = '#0f172a';
  let Icon = Info;

  if (toast.type === 'success') {
    bgColor = '#f0fdf4'; // Light green
    borderColor = '#bbf7d0';
    iconColor = '#16a34a'; // Green
    textColor = '#14532d';
    Icon = CheckCircle;
  } else if (toast.type === 'error') {
    bgColor = '#fef2f2'; // Light red
    borderColor = '#fecaca';
    iconColor = '#dc2626'; // Red
    textColor = '#7f1d1d';
    Icon = AlertCircle;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '12px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        color: textColor,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.95)',
        pointerEvents: 'auto',
      }}
    >
      <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />
      <span style={{ fontSize: '0.875rem', fontWeight: 500, flexGrow: 1, lineHeight: '1.4', fontFamily: 'var(--font-sans), sans-serif' }}>
        {toast.message}
      </span>
      <button
        onClick={handleClose}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: '#94a3b8',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'all 0.2s',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
