import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { ClassesService } from './classes.service';

const spinningRow = {
  id: 1,
  activity: 'Spinning',
  room: 'Sala 1',
  starts_at: new Date('2026-11-02T09:00:00Z'),
  spots: 12,
  trainer_name: 'Carla Navarro',
};

const newClass = {
  activity: 'Fuerza',
  room: 'Sala 3',
  startsAt: '2026-11-10T18:00:00Z',
  spots: 15,
  trainerId: 99,
};

describe('ClassesService', () => {
  const fakePool = { query: jest.fn() };
  const service = new ClassesService(fakePool as unknown as Pool);

  beforeEach(() => {
    fakePool.query.mockReset();
  });

  it('findOne lanza un 404 si no hay ninguna fila', async () => {
    fakePool.query.mockResolvedValue({ rows: [] });

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('findOne devuelve la clase convertida', async () => {
    fakePool.query.mockResolvedValue({ rows: [spinningRow] });

    const gymClass = await service.findOne(1);

    expect(gymClass.trainerName).toBe('Carla Navarro');
    expect(gymClass.startsAt).toEqual(new Date('2026-11-02T09:00:00Z'));
  });

  it('create con un monitor que no existe lanza un 400 y no hace el INSERT', async () => {
    fakePool.query.mockResolvedValue({ rows: [] });

    await expect(service.create(newClass)).rejects.toThrow(BadRequestException);
    expect(fakePool.query).toHaveBeenCalledTimes(1);
  });

  it('remove lanza un 409 si la clase tiene reservas y no hace el DELETE', async () => {
    fakePool.query
      .mockResolvedValueOnce({ rows: [spinningRow] })
      .mockResolvedValueOnce({ rows: [{ total: 3 }] });

    await expect(service.remove(1)).rejects.toThrow(ConflictException);
    expect(fakePool.query).toHaveBeenCalledTimes(2);
  });

  it('remove de una clase sin reservas la devuelve y hace el DELETE', async () => {
    fakePool.query
      .mockResolvedValueOnce({ rows: [spinningRow] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] })
      .mockResolvedValueOnce({ rows: [] });

    const gymClass = await service.remove(1);

    expect(gymClass.activity).toBe('Spinning');
    expect(fakePool.query).toHaveBeenCalledTimes(3);
    expect(fakePool.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('DELETE'),
      [1],
    );
  });

  it('findPage devuelve el total y las páginas', async () => {
    fakePool.query
      .mockResolvedValueOnce({ rows: [spinningRow] })
      .mockResolvedValueOnce({ rows: [{ total: 7 }] });

    const page = await service.findPage({
      page: 1,
      limit: 3,
      sort: 'startsAt',
      order: 'asc',
    });

    expect(page.total).toBe(7);
    expect(page.totalPages).toBe(3);
  });
});
