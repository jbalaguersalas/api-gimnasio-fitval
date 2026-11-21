import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateClassDto } from './dto/create-class.dto';
import { ListClassesQueryDto } from './dto/list-classes-query.dto';
import { GymClass, GymClassPage, GymClassRow, toGymClass } from './gym-class';

const SELECT_CLASSES = `SELECT c.id, c.activity, c.room, c.starts_at, c.spots, t.name AS trainer_name
  FROM classes c JOIN trainers t ON t.id = c.trainer_id`;

const SORT_COLUMNS = {
  startsAt: 'c.starts_at',
  activity: 'c.activity',
  spots: 'c.spots',
};

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

  async findPage(query: ListClassesQueryDto): Promise<GymClassPage> {
    const { page, limit, sort, order } = query;
    const activity = query.activity ?? null;
    const direction = order === 'desc' ? 'DESC' : 'ASC';
    const offset = (page - 1) * limit;

    const result = await this.pool.query<GymClassRow>(
      `${SELECT_CLASSES}
       WHERE ($1::text IS NULL OR c.activity ILIKE '%' || $1 || '%')
       ORDER BY ${SORT_COLUMNS[sort]} ${direction}, c.id
       LIMIT $2 OFFSET $3`,
      [activity, limit, offset],
    );

    const count = await this.pool.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM classes c
       WHERE ($1::text IS NULL OR c.activity ILIKE '%' || $1 || '%')`,
      [activity],
    );
    const total = count.rows[0].total;

    return {
      data: result.rows.map(toGymClass),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

  async create(dto: CreateClassDto): Promise<GymClass> {
    const trainer = await this.pool.query(
      'SELECT id FROM trainers WHERE id = $1',
      [dto.trainerId],
    );
    if (trainer.rows.length === 0) {
      throw new BadRequestException(
        'No existe ningún monitor con ese trainerId',
      );
    }

    const result = await this.pool.query<{ id: number }>(
      `INSERT INTO classes (activity, room, starts_at, spots, trainer_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [dto.activity, dto.room, dto.startsAt, dto.spots, dto.trainerId],
    );

    return this.findOne(result.rows[0].id);
  }

  async remove(id: number): Promise<GymClass> {
    const gymClass = await this.findOne(id);

    const bookings = await this.pool.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM bookings WHERE class_id = $1',
      [id],
    );
    if (bookings.rows[0].total > 0) {
      throw new ConflictException('La clase tiene reservas');
    }

    await this.pool.query('DELETE FROM classes WHERE id = $1', [id]);
    return gymClass;
  }
}
