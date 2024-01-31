import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('ClassController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/class (POST)', () => {
    it('should register a class successfully', () => {
      return request(app.getHttpServer());
      // .post('/path')
      // .send({
      //   firstName: fakerFirstName,
      //   lastName: fakerLastName,
      //   email: fakerEmail,
      //   password: fakerPassword,
      //   createdAt: new Date(Date.now()),
      //   updatedAt: new Date(Date.now()),
      // })
      // .expect(201);
    });
  });
});
