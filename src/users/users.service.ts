import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseError, Pool } from 'pg';
import { User, UserRow, toUser } from './user';

@Injectable()
export class UsersService {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<UserRow | undefined> {
    const result = await this.pool.query<UserRow>(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>(
      'SELECT id, email, password_hash, role FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] && toUser(result.rows[0]);
  }

  async create(email: string, passwordHash: string): Promise<User> {
    try {
      const result = await this.pool.query<UserRow>(
        `INSERT INTO users (email, password_hash) VALUES ($1, $2)
         RETURNING id, email, password_hash, role`,
        [email, passwordHash],
      );
      return toUser(result.rows[0]);
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ConflictException('Ese email ya está registrado');
      }
      throw error;
    }
  }
}
