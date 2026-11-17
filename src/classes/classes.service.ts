import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { GymClass, GymClassRow, toGymClass } from './gym-class';

const SELECT_CLASSES = `SELECT c.id, c.activity, c.room, c.starts_at, c.spots, t.name AS trainer_name
  FROM classes c JOIN trainers t ON t.id = c.trainer_id`;

@Injectable()
export class ClassesService {
  constructor(private readonly pool: Pool) {}

  async findAll(activity?: string): Promise<GymClass[]> {
    if (activity) {
      const result = await this.pool.query<GymClassRow>(
        `${SELECT_CLASSES} WHERE c.activity ILIKE '%' || $1 || '%' ORDER BY c.starts_at`,
        [activity],
      );
      return result.rows.map(toGymClass);
    }
    const result = await this.pool.query<GymClassRow>(
      `${SELECT_CLASSES} ORDER BY c.starts_at`,
    );
    return result.rows.map(toGymClass);
  }

  async findOne(id: number): Promise<GymClass> {
    const result = await this.pool.query<GymClassRow>(
      `${SELECT_CLASSES} WHERE c.id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('No existe esa clase');
    }
    return toGymClass(result.rows[0]);
  }
}
