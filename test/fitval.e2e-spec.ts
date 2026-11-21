import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from '../src/app.config';
import { AppModule } from '../src/app.module';

const newClass = {
  activity: 'Fuerza',
  room: 'Sala 3',
  startsAt: '2026-11-10T18:00:00Z',
  spots: 15,
  trainerId: 4,
};

describe('API de FitVal', () => {
  let app: INestApplication<App>;
  let memberToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    const user = {
      email: `test-${Date.now()}@fitval.com`,
      password: '12345678',
    };
    await request(app.getHttpServer()).post('/api/v1/auth/register').send(user);
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(user);
    memberToken = (login.body as { accessToken: string }).accessToken;
  });

  afterAll(async () => {
    await app.get(Pool).end();
    await app.close();
  });

  it('GET /api/v1/health responde 200', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', database: 'fitval' });
  });

  it('GET /api/v1/classes responde 200 con un array', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/classes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/v1/classes/abc responde 400', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/abc',
    );

    expect(response.status).toBe(400);
  });

  it('GET /api/v1/classes/999999 responde 404', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/999999',
    );

    expect(response.status).toBe(404);
  });

  it('POST /api/v1/classes sin token responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/classes')
      .send(newClass);

    expect(response.status).toBe(401);
  });

  it('login con la contraseña mal responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'ana@gym.com', password: 'contraseña-mal' });

    expect(response.status).toBe(401);
  });

  it('POST /api/v1/classes con token de socio responde 403', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/classes')
      .set('Authorization', `Bearer ${memberToken}`)
      .send(newClass);

    expect(response.status).toBe(403);
  });

  it('GET /api/v2/classes?page=1&limit=3 trae 3 clases', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v2/classes?page=1&limit=3',
    );

    expect(response.status).toBe(200);
    expect((response.body as { data: unknown[] }).data).toHaveLength(3);
  });

  it('GET /api/v2/classes?limit=100 responde 400', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v2/classes?limit=100',
    );

    expect(response.status).toBe(400);
  });

  it('un 404 tiene path y timestamp', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/classes/999999',
    );

    expect(response.body).toHaveProperty('path', '/api/v1/classes/999999');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('las respuestas no llevan x-powered-by', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/plans');

    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('GET /api/v1/trainers/1 trae a Carla con sus especialidades', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/trainers/1',
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('specialties', [
      'Ciclo indoor',
      'Fuerza',
    ]);
  });
});
