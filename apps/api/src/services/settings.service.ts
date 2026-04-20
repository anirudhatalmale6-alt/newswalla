import { queryOne, query, run } from '../config/database';

export function getSetting(key: string): string | null {
  const row = queryOne<any>('SELECT value FROM settings WHERE key = ?', [key]);
  return row?.value || null;
}

export function setSetting(key: string, value: string): void {
  const existing = queryOne('SELECT key FROM settings WHERE key = ?', [key]);
  if (existing) {
    run("UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = ?", [value, key]);
  } else {
    run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, value]);
  }
}

export function getAllSettings(): Record<string, string> {
  const rows = query<any>('SELECT key, value FROM settings', []);
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

const API_KEY_SETTINGS = [
  'facebook_app_id',
  'facebook_app_secret',
  'linkedin_client_id',
  'linkedin_client_secret',
  'tiktok_client_key',
  'tiktok_client_secret',
  'pinterest_app_id',
  'pinterest_app_secret',
  'youtube_client_id',
  'youtube_client_secret',
  'openai_api_key',
  'anthropic_api_key',
];

export function getApiKeys(): Record<string, string> {
  const all = getAllSettings();
  const result: Record<string, string> = {};
  for (const key of API_KEY_SETTINGS) {
    result[key] = all[key] || '';
  }
  return result;
}

export function getApiKeysMasked(): Record<string, string> {
  const keys = getApiKeys();
  const masked: Record<string, string> = {};
  for (const [key, value] of Object.entries(keys)) {
    if (value && value.length > 8) {
      masked[key] = value.substring(0, 4) + '****' + value.substring(value.length - 4);
    } else if (value) {
      masked[key] = '****';
    } else {
      masked[key] = '';
    }
  }
  return masked;
}

export function setApiKeys(keys: Record<string, string>): void {
  for (const [key, value] of Object.entries(keys)) {
    if (API_KEY_SETTINGS.includes(key)) {
      setSetting(key, value);
    }
  }
}
