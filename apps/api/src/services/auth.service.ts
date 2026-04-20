import bcrypt from 'bcryptjs';
import { query, queryOne } from '../config/database';
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
  const existing = await queryOne('SELECT id FROM users WHERE email = $1', [input.email]);
  if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });

  const hash = await bcrypt.hash(input.password, 12);
  const user = await queryOne<any>(
    `INSERT INTO users (email, password_hash, full_name, timezone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, avatar_url, timezone, plan, created_at`,
    [input.email, hash, input.fullName, input.timezone || 'UTC']
  );

  const token = signToken({ userId: user!.id, email: user!.email });
  return { user: formatUser(user!), token };
}

export async function login(input: LoginInput) {
  const user = await queryOne<any>(
    'SELECT id, email, password_hash, full_name, avatar_url, timezone, plan, created_at FROM users WHERE email = $1',
    [input.email]
  );
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await bcrypt.compare(input.password, user.password_hash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const token = signToken({ userId: user.id, email: user.email });
  return { user: formatUser(user), token };
}

export async function getProfile(userId: string) {
  const user = await queryOne<any>(
    'SELECT id, email, full_name, avatar_url, timezone, plan, created_at FROM users WHERE id = $1',
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
