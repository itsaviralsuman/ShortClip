import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle, ExternalLink, X, Shield } from 'lucide-react';

export const SecurityToast: React.FC = () => {
  const { latestNotificationToast, dismissNotificationToast, openSecurityInbox } = useAuth();

  if (!latestNotificationToast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-fade-in-up">
      <div className="bg-studio-900 border border-purple-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
          <Mail className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 uppercase">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Email Notification Dispatched</span>
          </div>

          <h4 className="text-xs font-bold text-white truncate mt-0.5">
            Security Alert Sent to {latestNotificationToast.toEmail}
          </h4>

          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            Sign-in from <span className="text-purple-300 font-semibold">{latestNotificationToast.deviceInfo}</span> recorded with security timestamp.
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={() => {
                dismissNotificationToast();
                openSecurityInbox();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-purple hover:bg-brand-purple/90 text-white text-[11px] font-semibold transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Received Email</span>
            </button>

            <button
              onClick={dismissNotificationToast}
              className="text-slate-400 hover:text-slate-200 text-[11px] px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={dismissNotificationToast}
          className="text-slate-500 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
