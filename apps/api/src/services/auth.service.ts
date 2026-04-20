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

  run(
    `INSERT INTO users (id, email, password_hash, full_name, timezone)
     VALUES (?, ?, ?, ?, ?)`,
    [id, input.email, hash, input.fullName, input.timezone || 'UTC']
  );

  const user = queryOne<any>(
    'SELECT id, email, full_name, avatar_url, timezone, plan, created_at FROM users WHERE id = ?',
    [id]
  );

  const token = signToken({ userId: user!.id, email: user!.email });
  return { user: formatUser(user!), token };
}

export async function login(input: LoginInput) {
  const user = queryOne<any>(
    'SELECT id, email, password_hash, full_name, avatar_url, timezone, plan, created_at FROM users WHERE email = ?',
    [input.email]
  );
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await bcrypt.compare(input.password, user.password_hash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = signToken({ userId: user.id, email: user.email });
  return { user: formatUser(user), token };
}

export async function getProfile(userId: string) {
  const user = queryOne<any>(
    'SELECT id, email, full_name, avatar_url, timezone, plan, created_at FROM users WHERE id = ?',
    [userId]
  );
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return formatUser(user);
}

function formatUser(row: any) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    timezone: row.timezone,
    plan: row.plan,
    createdAt: row.created_at,
  };
}
