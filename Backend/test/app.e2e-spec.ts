import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('TodosController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  it('/todos (GET) returns paginated payload', async () => {
    const response = await request(app.getHttpServer())
      .get('/todos')
      .query({ limit: 5, page: 1 })
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta).toMatchObject({
      page: 1,
      limit: 5,
    });
    expect(typeof response.body.meta.total).toBe('number');
    expect(typeof response.body.meta.totalPages).toBe('number');
  });

  afterEach(async () => {
    await app.close();
  });
});
