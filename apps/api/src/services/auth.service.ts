import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query, queryOne, run } from '../config/database';
import { signToken } from '../utils/jwt';

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  timezone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function register(input: RegisterInput) {
  const existing = queryOne('SELECT id FROM users WHERE email = ?', [input.email]);
  if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });

  const hash = await bcrypt.hash(input.password, 12);
  const id = crypto.randomUUID();

  // Check if this is the first user - make them admin
  const userCount = queryOne<any>('SELECT COUNT(*) as count FROM users', []);
  const role = userCount?.count === 0 ? 'admin' : 'user';

  run(
    `INSERT INTO users (id, email, password_hash, full_name, timezone, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, input.email, hash, input.fullName, input.timezone || 'UTC', role]
  );

  const user = queryOne<any>(
    'SELECT id, email, full_name, avatar_url, timezone, plan, role, language, theme, is_active, subscription_status, created_at FROM users WHERE id = ?',
    [id]
  );

  const token = signToken({ userId: user!.id, email: user!.email, role: user!.role });
  return { user: formatUser(user!), token };
}

export async function login(input: LoginInput) {
  const user = queryOne<any>(
    'SELECT id, email, password_hash, full_name, avatar_url, timezone, plan, role, language, theme, is_active, subscription_status, created_at FROM users WHERE email = ?',
    [input.email]
  );
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  if (!user.is_active) throw Object.assign(new Error('Account is deactivated'), { status: 403 });

  const valid = await bcrypt.compare(input.password, user.password_hash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  return { user: formatUser(user), token };
}

export async function getProfile(userId: string) {
  const user = queryOne<any>(
    'SELECT id, email, full_name, avatar_url, timezone, plan, role, language, theme, is_active, subscription_status, created_at FROM users WHERE id = ?',
    [userId]
  );
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return formatUser(user);
}

export async function updateProfile(userId: string, data: { fullName?: string; timezone?: string; language?: string; theme?: string }) {
  const updates: string[] = [];
  const params: any[] = [];

  if (data.fullName) { updates.push('full_name = ?'); params.push(data.fullName); }
  if (data.timezone) { updates.push('timezone = ?'); params.push(data.timezone); }
  if (data.language) { updates.push('language = ?'); params.push(data.language); }
  if (data.theme) { updates.push('theme = ?'); params.push(data.theme); }

  if (updates.length === 0) return getProfile(userId);

  updates.push("updated_at = datetime('now')");
  params.push(userId);

  run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
  return getProfile(userId);
}

// Admin functions
export async function listUsers() {
  const users = query<any>(
    'SELECT id, email, full_name, avatar_url, timezone, plan, role, language, theme, is_active, subscription_status, created_at FROM users ORDER BY created_at DESC',
    []
  );
  return users.map(formatUser);
}

export async function createUser(data: { email: string; password: string; fullName: string; role?: string }) {
  const existing = queryOne('SELECT id FROM users WHERE email = ?', [data.email]);
  if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });

  const hash = await bcrypt.hash(data.password, 12);
  const id = crypto.randomUUID();

  run(
    `INSERT INTO users (id, email, password_hash, full_name, role)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.email, hash, data.fullName, data.role || 'user']
  );

  return getProfile(id);
}

export async function updateUser(userId: string, data: { fullName?: string; email?: string; role?: string; is_active?: boolean }) {
  const updates: string[] = [];
  const params: any[] = [];

  if (data.fullName) { updates.push('full_name = ?'); params.push(data.fullName); }
  if (data.email) { updates.push('email = ?'); params.push(data.email); }
  if (data.role) { updates.push('role = ?'); params.push(data.role); }
  if (data.is_active !== undefined) { updates.push('is_active = ?'); params.push(data.is_active ? 1 : 0); }

  if (updates.length === 0) return getProfile(userId);

  updates.push("updated_at = datetime('now')");
  params.push(userId);

  run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
  return getProfile(userId);
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const hash = await bcrypt.hash(newPassword, 12);
  run("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?", [hash, userId]);
  return { success: true };
}

export async function deleteUser(userId: string) {
  run('DELETE FROM users WHERE id = ?', [userId]);
  return { success: true };
}

function formatUser(row: any) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    timezone: row.timezone,
    plan: row.plan,
    role: row.role || 'user',
    language: row.language || 'en',
    theme: row.theme || 'blue',
    isActive: row.is_active !== 0,
    subscriptionStatus: row.subscription_status || 'free',
    createdAt: row.created_at,
  };
}
