export interface ClientDeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  ip: string;
}

const DEVICE_ID_KEY = 'clipfusion_device_fingerprint_id';

export function getClientDeviceInfo(): ClientDeviceInfo {
  let id = '';
  try {
    id = localStorage.getItem(DEVICE_ID_KEY) || '';
    if (!id) {
      id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
  } catch {
    id = `dev_${Date.now()}`;
  }

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let type: 'mobile' | 'desktop' | 'tablet' = 'desktop';
  let os = 'Unknown OS';
  let browser = 'Chrome';

  if (/iPad|Tablet/i.test(ua)) {
    type = 'tablet';
    os = 'iPadOS';
  } else if (/iPhone|iPod/i.test(ua)) {
    type = 'mobile';
    os = 'iOS (iPhone)';
  } else if (/Android/i.test(ua)) {
    type = 'mobile';
    os = 'Android';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    type = 'desktop';
    os = 'macOS';
  } else if (/Windows NT/i.test(ua)) {
    type = 'desktop';
    os = 'Windows 11 / 10';
  } else if (/Linux/i.test(ua)) {
    type = 'desktop';
    os = 'Linux';
  }

  if (/Edg\//i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox\//i.test(ua)) {
    browser = 'Mozilla Firefox';
  }

  const name = `${os} (${browser} ${type === 'mobile' ? 'Mobile' : 'Desktop'})`;
  const ip = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.hostname
    : '192.168.1.8';

  return { id, name, type, browser, os, ip };
}
