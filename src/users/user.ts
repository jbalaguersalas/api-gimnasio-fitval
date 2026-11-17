export type Role = 'member' | 'staff';

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  role: Role;
}

export interface User {
  id: number;
  email: string;
  role: Role;
}

export function toUser(row: UserRow): User {
  return { id: row.id, email: row.email, role: row.role };
}
