import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

    .addTag('Users', 'All about users', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })

    .addTag('Classes', 'All about classes', {
      description: 'More info',
      url: 'https://github.com/Pedroo-Nietoo',
    })

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(helmet());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
