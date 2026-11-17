import { UploadRecord, QuotaState } from '../types';

export const MAX_DAILY_CAPACITY_MINUTES = 480; // 8 Hours
export const MAX_SINGLE_VIDEO_MINUTES = 240; // 4 Hours
export const ROLLING_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 Hours in ms

export interface QuotaCalculationResult {
  effectiveNow: number;
  activeUsageMinutes: number;
  remainingMinutes: number;
  fourHourSlotsAvailable: number; // 0 to 2
  oneHourSlotsAvailable: number;  // 0 to 8
  percentUsed: number;
  activeUploads: UploadRecord[];
  nextResetTimestamp: number | null;
  countdownFormatted: string;
}

export function calculateRollingQuota(
  records: UploadRecord[],
  simulatedTimeOffsetMs: number = 0
): QuotaCalculationResult {
  const effectiveNow = Date.now() + simulatedTimeOffsetMs;
  const cutoffTime = effectiveNow - ROLLING_WINDOW_MS;

  // Filter only uploads completed or processing within the last 24 hours
  const activeUploads = records
    .filter(r => r.status !== 'failed' && r.uploadedAt > cutoffTime && r.uploadedAt <= effectiveNow)
    .sort((a, b) => a.uploadedAt - b.uploadedAt);

  const activeUsageMinutes = activeUploads.reduce((sum, r) => sum + r.durationMinutes, 0);
  const remainingMinutes = Math.max(0, MAX_DAILY_CAPACITY_MINUTES - activeUsageMinutes);
  
  const fourHourSlotsAvailable = Math.min(2, Math.floor(remainingMinutes / 240));
  const oneHourSlotsAvailable = Math.min(8, Math.floor(remainingMinutes / 60));
  const percentUsed = Math.min(100, Math.round((activeUsageMinutes / MAX_DAILY_CAPACITY_MINUTES) * 100));

  // Oldest active upload will be the first to roll out of the 24h window
  let nextResetTimestamp: number | null = null;
  let countdownFormatted = 'Full Quota Ready';

  if (activeUploads.length > 0) {
    const oldest = activeUploads[0];
    nextResetTimestamp = oldest.uploadedAt + ROLLING_WINDOW_MS;
    const diffMs = Math.max(0, nextResetTimestamp - effectiveNow);

    if (diffMs > 0) {
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      countdownFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }

  return {
    effectiveNow,
    activeUsageMinutes,
    remainingMinutes,
    fourHourSlotsAvailable,
    oneHourSlotsAvailable,
    percentUsed,
    activeUploads,
    nextResetTimestamp,
    countdownFormatted
  };
}

export interface UploadValidationResult {
  allowed: boolean;
  code: 'OK' | 'EXCEEDS_SINGLE_LIMIT' | 'EXCEEDS_ROLLING_QUOTA';
  message: string;
  minutesNeeded?: number;
  freeMinutesAvailable?: number;
}

export function validateNewUpload(
  durationMinutes: number,
  state: QuotaState
): UploadValidationResult {
  // Check single video limit first
  if (durationMinutes > MAX_SINGLE_VIDEO_MINUTES) {
    return {
      allowed: false,
      code: 'EXCEEDS_SINGLE_LIMIT',
      message: `Video duration (${durationMinutes} mins) exceeds maximum allowed single video limit of ${MAX_SINGLE_VIDEO_MINUTES} mins (4 Hours). Please trim the source video.`
    };
  }

  const { remainingMinutes } = calculateRollingQuota(state.records, state.simulatedTimeOffsetMs);

  if (durationMinutes > remainingMinutes) {
    const needed = durationMinutes - remainingMinutes;
    return {
      allowed: false,
      code: 'EXCEEDS_ROLLING_QUOTA',
      message: `24-Hour Rolling Quota reached! Upload requires ${durationMinutes} mins, but only ${remainingMinutes} mins remain in your 24h window. You need ${needed} more mins to clear.`,
      minutesNeeded: needed,
      freeMinutesAvailable: remainingMinutes
    };
  }

  return {
    allowed: true,
    code: 'OK',
    message: 'Quota check passed. Video fits within 24-hour limit.'
  };
}
