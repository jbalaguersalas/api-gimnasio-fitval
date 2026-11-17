import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Plan, PlanRow, toPlan } from './plan';

@Injectable()
export class PlansService {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Plan[]> {
    const result = await this.pool.query<PlanRow>(
      'SELECT id, name, monthly_price FROM plans ORDER BY monthly_price',
    );
    return result.rows.map(toPlan);
  }
}
