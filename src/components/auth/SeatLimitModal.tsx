import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Laptop, Smartphone, Tablet, Trash2, X, AlertTriangle, Users } from 'lucide-react';

export const SeatLimitModal: React.FC = () => {
  const {
    isSeatLimitExceeded,
    dismissSeatLimitModal,
    activeSeats,
    maxSeats,
    revokeSeat,
    currentDeviceInfo
  } = useAuth();

  if (!isSeatLimitExceeded) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-studio-900 border border-red-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={dismissSeatLimitModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Header */}
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono text-[11px] font-bold uppercase mb-1">
              <Users className="w-3 h-3" />
              <span>Seat Limit Reached: {activeSeats.length}/{maxSeats} Devices</span>
            </div>
            <h2 className="text-xl font-bold text-white">Maximum 3 Users / Devices Allowed</h2>
            <p className="text-xs text-slate-400 mt-1">
              This ClipFusion workspace is strictly capped at <span className="text-white font-semibold">3 active devices</span>. A 4th user or device cannot access until one of the existing 3 sessions is revoked.
            </p>
          </div>
        </div>

        {/* Active Seats List */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Active Registered Devices ({activeSeats.length}/{maxSeats}):
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {activeSeats.map((seat, index) => {
              const isThisDevice = seat.deviceId === currentDeviceInfo.id;
              const Icon = seat.deviceType === 'mobile' ? Smartphone : seat.deviceType === 'tablet' ? Tablet : Laptop;

              return (
                <div
                  key={seat.deviceId}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isThisDevice
                      ? 'bg-purple-950/40 border-purple-500/40'
                      : 'bg-studio-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-studio-800 text-slate-300 shrink-0">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{seat.deviceName}</span>
                        {isThisDevice && (
                          <span className="text-[10px] font-mono bg-purple-500/30 text-purple-300 px-1.5 py-0.2 rounded font-semibold">
                            You
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {seat.userEmail} • <span className="font-mono text-[10px] text-slate-500">{seat.ipAddress}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => revokeSeat(seat.deviceId)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-semibold transition shrink-0"
                    title="Revoke session to free up a seat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info & Dismiss */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Click "Revoke" on an idle device to free a seat.</span>
          </div>

          <button
            onClick={dismissSeatLimitModal}
            className="px-4 py-1.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-white font-medium transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
