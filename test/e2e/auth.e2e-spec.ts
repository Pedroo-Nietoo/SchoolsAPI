import { AppModule } from '@/app.module';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

const fakerFirstName = faker.person.firstName();
const fakerLastName = faker.person.lastName();
const fakerEmail = faker.internet.email();
const fakerPassword = faker.internet.password({ length: 8 });

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a test user', () => {
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

  describe('/auth/login (POST)', () => {
    it('should log a registered user and storage his access token into the broser cookies', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: fakerEmail,
          password: fakerPassword,
        })
        .expect(200);

      expect(response.headers).toHaveProperty('set-cookie');

      const cookies: string | string[] = response.headers['set-cookie'];

      const cookiesArray: string[] = Array.isArray(cookies)
        ? cookies
        : [cookies];

      const jwtCookie = cookiesArray.find((cookie) =>
        cookie.startsWith('token='),
      );

      expect(jwtCookie).toBeDefined();
    });

    it('should return 404 if the user is not registered', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(404);
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should check if the cookie is stored in the browser', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/profile')
        .send({
          email: fakerEmail,
          password: fakerPassword,
        })
        .expect(200);

      expect(response.headers).toHaveProperty('set-cookie');

      const cookies: string | string[] = response.headers['set-cookie'];

      const cookiesArray: string[] = Array.isArray(cookies)
        ? cookies
        : [cookies];

      const tokenCookie = cookiesArray.find((cookie) =>
        cookie.startsWith('token='),
      );
      expect(tokenCookie).toBeDefined();
    });

    it('should return 404 if the token stored in the cookie is not the same as the current user profile infos', async () => {
      //todo fix the cookies post and get methods
      const response = await request(app.getHttpServer())
        .post('/auth/profile')
        .send({
          email: fakerEmail,
          password: fakerPassword,
        })
        .expect(200);

      expect(response.headers).toHaveProperty('set-cookie');

      const cookies: string | string[] = response.headers['set-cookie'];

      const cookiesArray: string[] = Array.isArray(cookies)
        ? cookies
        : [cookies];

      const tokenCookie = cookiesArray.find((cookie) =>
        cookie.startsWith('token='),
      );
      expect(tokenCookie).toBeDefined();
    });
  });
});

// afterEach(() => {
//   it('should remove the test user', () => {
//     return request(app.getHttpServer())
//       .delete(`/users/${fakerEmail}`)
//       .expect(200);
//   });
// });
