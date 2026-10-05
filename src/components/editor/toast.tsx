'use client';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export function Toast({ message, type }: ToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] toast-enter">
      <div
        className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-sm ${
          type === 'success'
            ? 'bg-emerald-500/95 text-white'
            : 'bg-red-500/95 text-white'
        }`}
      >
        {type === 'success' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        )}
        {message}
      </div>
    </div>
  );
}
