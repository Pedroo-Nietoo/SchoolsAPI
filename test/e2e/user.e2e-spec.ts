import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

const fakerFirstName = faker.person.firstName();
const fakerLastName = faker.person.lastName();
const fakerEmail = faker.internet.email();
const fakerPassword = faker.internet.password({ length: 8 });

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/users (POST)', () => {
    it('should register a user successfully', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          firstName: fakerFirstName,
          lastName: fakerLastName,
          email: fakerEmail,
          password: fakerPassword,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        })
        .expect(201);
    });
  });
});
