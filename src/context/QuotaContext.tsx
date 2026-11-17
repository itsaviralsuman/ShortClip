import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { UploadRecord, QuotaState } from '../types';
import {
  calculateRollingQuota,
  validateNewUpload,
  QuotaCalculationResult,
  UploadValidationResult,
  MAX_DAILY_CAPACITY_MINUTES,
  MAX_SINGLE_VIDEO_MINUTES
} from '../utils/quotaEngine';

interface QuotaContextType extends QuotaCalculationResult {
  records: UploadRecord[];
  simulatedTimeOffsetMs: number;
  addUpload: (record: Omit<UploadRecord, 'id' | 'uploadedAt'>) => UploadValidationResult;
  simulateQuickUpload: (durationMinutes: number, name?: string) => UploadValidationResult;
  fastForwardTime: (hours: number) => void;
  resetSimulatedTime: () => void;
  resetAllQuota: () => void;
  clearUploadHistory: () => void;
}

const STORAGE_KEY = 'clipfusion_quota_state_v1';

// Initial pre-seeded uploads showing realistic usage
const INITIAL_UPLOADS: UploadRecord[] = [
  {
    id: 'up-init-1',
    filename: 'The $100M Founder Playbook.mp4',
    durationMinutes: 58,
    fileSizeBytes: 1420000000,
    uploadedAt: Date.now() - (3 * 60 * 60 * 1000), // 3 hours ago
    source: 'youtube',
    status: 'completed'
  },
  {
    id: 'up-init-2',
    filename: 'Neural Synthesis & Video Scaling.mov',
    durationMinutes: 45,
    fileSizeBytes: 890000000,
    uploadedAt: Date.now() - (7 * 60 * 60 * 1000), // 7 hours ago
    source: 'local',
    status: 'completed'
  }
];

const QuotaContext = createContext<QuotaContextType | undefined>(undefined);

export const QuotaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<UploadRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.records)) return parsed.records;
      }
    } catch {
      // fallback
    }
    return INITIAL_UPLOADS;
  });

  const [simulatedTimeOffsetMs, setSimulatedTimeOffsetMs] = useState<number>(0);
  const [tick, setTick] = useState<number>(0);

  // Tick every second to update countdown display
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ records }));
    } catch {
      // ignore
    }
  }, [records]);

  // Calculate current quota status using the rolling window engine
  const quotaResult = useMemo(() => {
    return calculateRollingQuota(records, simulatedTimeOffsetMs);
  }, [records, simulatedTimeOffsetMs, tick]);

  const addUpload = (recordData: Omit<UploadRecord, 'id' | 'uploadedAt'>): UploadValidationResult => {
    const validation = validateNewUpload(recordData.durationMinutes, {
      totalCapacityMinutes: MAX_DAILY_CAPACITY_MINUTES,
      maxSingleVideoMinutes: MAX_SINGLE_VIDEO_MINUTES,
      records,
      simulatedTimeOffsetMs
    });

    if (!validation.allowed) {
      return validation;
    }

    const newRecord: UploadRecord = {
      ...recordData,
      id: `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      uploadedAt: Date.now() + simulatedTimeOffsetMs
    };

    setRecords(prev => [newRecord, ...prev]);
    return validation;
  };

  const simulateQuickUpload = (durationMinutes: number, name?: string): UploadValidationResult => {
    const title = name || (durationMinutes >= 240 ? 'Raw 4-Hour Stream (240m)' : `${durationMinutes}-Minute Podcast VOD`);
    return addUpload({
      filename: title,
      durationMinutes,
      source: durationMinutes >= 240 ? 'twitch' : 'youtube',
      status: 'completed'
    });
  };

  const fastForwardTime = (hours: number) => {
    setSimulatedTimeOffsetMs(prev => prev + (hours * 60 * 60 * 1000));
  };

  const resetSimulatedTime = () => {
    setSimulatedTimeOffsetMs(0);
  };

  const resetAllQuota = () => {
    setRecords([]);
    setSimulatedTimeOffsetMs(0);
  };

  const clearUploadHistory = () => {
    setRecords([]);
  };

  return (
    <QuotaContext.Provider
      value={{
        ...quotaResult,
        records,
        simulatedTimeOffsetMs,
        addUpload,
        simulateQuickUpload,
        fastForwardTime,
        resetSimulatedTime,
        resetAllQuota,
        clearUploadHistory
      }}
    >
      {children}
    </QuotaContext.Provider>
  );
};

export const useQuota = (): QuotaContextType => {
  const context = useContext(QuotaContext);
  if (!context) {
    throw new Error('useQuota must be used within a QuotaProvider');
  }
  return context;
};
