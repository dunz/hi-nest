import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    console.log('beforeAll');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my API');
  });

  describe('/movies', () => {
    let req;
    beforeEach(() => {
      req = request(app.getHttpServer());
    });
    it('GET 200', () => {
      return req.get('/movies').expect(200).expect([]);
    });

    it('POST 201', () => {
      return req
        .post('/movies')
        .send({ title: 'asdf', year: 2020, genres: ['2020'] })
        .expect(201);
    });
    it('POST 400', () => {
      return req
        .post('/movies')
        .send({ title: 'asdf', year: 2020, genres: ['2020'], hacked: 'by me' })
        .expect(400);
    });
    it('DELETE 404', () => {
      return req.delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });
    it('GET 404', () => {
      return request(app.getHttpServer()).get('/movies/999').expect(404);
    });
    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'hahaha' })
        .expect(200);
    });
    it('DELETE 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
    it('DELETE 404', () => {
      return request(app.getHttpServer()).delete('/movies/999').expect(404);
    });
  });
});
