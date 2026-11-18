import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Shield,
  Clock,
  Laptop,
  CheckCircle,
  X,
  Info,
  ExternalLink,
  Trash2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { EmailSecurityNotification } from '../../types';

export const SecurityInboxModal: React.FC = () => {
  const {
    isSecurityInboxOpen,
    closeSecurityInbox,
    notifications,
    markNotificationRead,
    clearNotifications,
    currentDeviceInfo
  } = useAuth();

  const [selectedNotice, setSelectedNotice] = useState<EmailSecurityNotification | null>(
    notifications.length > 0 ? notifications[0] : null
  );

  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  if (!isSecurityInboxOpen) return null;

  const activeNotice = selectedNotice || (notifications.length > 0 ? notifications[0] : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-studio-900 border border-purple-500/30 rounded-2xl max-w-4xl w-full h-[90vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <header className="px-5 py-3.5 border-b border-slate-800 bg-studio-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Shield className="w-5 h-5 text-brand-purple" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Email Security Notification System</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Transactional Mailer Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audit trail of sign-in security notifications dispatched to user emails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showHowItWorks ? 'Back to Inbox' : 'Kaise Hua? (Architecture)'}</span>
            </button>

            <button
              onClick={closeSecurityInbox}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Body: Either Architecture Explanation OR Email Reader */}
        {showHowItWorks ? (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-studio-950/50">
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-brand-purple" />
                  <span>How Email Notification on Sign-In Works (Kaise Hua)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every time a user logs into ClipFusion AI, an automated transactional security alert is generated and sent to their email. Here is the step-by-step engineering pipeline:
                </p>
              </div>

              {/* Step by Step Architecture Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-studio-900 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-purple-400 uppercase">
                    Step 1: Auth Event & Client Fingerprinting
                  </div>
                  <h4 className="text-sm font-semibold text-white">Device Detection</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When the user enters their email and completes OTP/Password or Google OAuth, <code>getClientDeviceInfo()</code> captures the client's OS (e.g. Windows 11, iOS, Android), Browser, Screen type, and Network IP.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-studio-900 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
                    Step 2: 3-Seat Concurrency Gate Check
                  </div>
                  <h4 className="text-sm font-semibold text-white">Max 3 Devices Enforcement</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Before granting token access, the Auth Engine checks <code>activeSeats.length &lt; 3</code>. If 3 active devices already exist, the 4th device is blocked with the Seat Limit screen.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-studio-900 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    Step 3: RFC-822 Transactional Mailer Dispatch
                  </div>
                  <h4 className="text-sm font-semibold text-white">Email Generation & Delivery</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A security alert email payload is formatted with sender <code>security@clipfusion.ai</code>, subject, device info, timestamp, and IP. In production, this calls a transactional SMTP API (Resend / AWS SES / SendGrid / Webhook) to deliver directly to the user's Gmail/Outlook inbox.
                  </p>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setShowHowItWorks(false)}
                  className="px-5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <span>Go to Security Mailbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Email List */}
            <div className="w-full md:w-80 border-r border-slate-800 bg-studio-950/40 flex flex-col shrink-0">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  Dispatched Mails ({notifications.length})
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                    No sign-in emails logged yet. Sign in with any email to trigger a live security alert!
                  </div>
                ) : (
                  notifications.map((n) => {
                    const isSelected = activeNotice?.id === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => {
                          setSelectedNotice(n);
                          markNotificationRead(n.id);
                        }}
                        className={`w-full p-3 text-left transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-purple-900/30 border-l-2 border-brand-purple'
                            : 'hover:bg-studio-800/60'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-studio-800 text-purple-300 shrink-0 mt-0.5">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-[11px] mb-0.5">
                            <span className="font-bold text-white truncate">{n.toEmail}</span>
                            <span className="font-mono text-[10px] text-slate-500 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 truncate font-medium">
                            {n.subject}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">
                            {n.deviceInfo} • {n.method}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Full Email View (Gmail / Outlook style) */}
            <div className="flex-1 flex flex-col bg-studio-950 overflow-y-auto p-4 sm:p-6">
              {activeNotice ? (
                <div className="max-w-2xl mx-auto w-full bg-studio-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                  {/* Email Header */}
                  <div className="border-b border-slate-800 pb-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-xs">
                          CF
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">ClipFusion AI Security Dispatcher</div>
                          <div className="text-[10px] text-slate-400 font-mono">security-alerts@clipfusion.ai</div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Delivered
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {activeNotice.subject}
                      </h3>
                      <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                        <span>To: <strong className="text-purple-300">{activeNotice.toEmail}</strong></span>
                        <span>•</span>
                        <span>{new Date(activeNotice.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Email Body Content */}
                  <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <p>
                      Hello <strong className="text-white">{activeNotice.userName}</strong>,
                    </p>
                    <p>
                      A new successful sign-in was detected on your ClipFusion AI creator account. Here are the security details of this session:
                    </p>

                    {/* Metadata Card */}
                    <div className="p-4 rounded-xl bg-studio-950 border border-purple-500/20 space-y-2.5 font-mono text-xs">
                      <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="text-slate-400">Device Name:</span>
                        <span className="text-white font-bold">{activeNotice.deviceInfo}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="text-slate-400">Browser / Platform:</span>
                        <span className="text-cyan-300">{activeNotice.browser}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="text-slate-400">IP Address:</span>
                        <span className="text-amber-300">{activeNotice.ipAddress}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="text-slate-400">Sign-In Method:</span>
                        <span className="text-purple-300 font-bold">{activeNotice.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Session Timestamp:</span>
                        <span className="text-slate-300">{new Date(activeNotice.timestamp).toUTCString()}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 pt-2">
                      If this was you, you can safely ignore this notification. Your 24-hour quota (480 mins) and active projects are synced and ready for editing.
                    </p>
                    <p className="text-xs text-slate-400">
                      If you did not sign in or suspect unauthorized access, you can revoke this session directly from the Active Devices manager.
                    </p>
                  </div>

                  {/* Sign-Off */}
                  <div className="border-t border-slate-800 pt-4 text-xs text-slate-500">
                    <div>ClipFusion AI Security Team</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Automated Transactional Alert — Do Not Reply</div>
                  </div>
                </div>
              ) : (
                <div className="m-auto text-center text-xs text-slate-500">
                  Select an email on the left to read its security details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
