import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('School API')
    .setDescription(
      'School API system with professors, classes and activities management',
    )
    .setVersion('1.0')
    .setContact(
      'Pedro Henrique Nieto da Silva',
      'https://devtree-pedro-nieto.vercel.app/',
      'pedronieto.2005@gmail.com',
    )

    .addBearerAuth()

    .addServer('http://localhost:3000', 'Dev server')
    .addServer('http://schoolsapi.com', 'Prod server')

    .addTag('Auth', 'All about auth', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })

    .addTag('Users', 'All about users', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })

    .addTag('Classes', 'All about classes', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })

    .addTag('Activities', 'All about activities', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })

    .addTag('Health', 'All about service health', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(helmet());

  app.use(cookieParser());

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
