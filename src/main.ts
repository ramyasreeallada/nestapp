import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { winstonLogger } from './common/logger/winston.logger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as hbs from 'hbs';
import * as path from 'path';
import * as fs from 'fs';
import * as session from 'express-session';
import * as passport from 'passport';



import { User } from './users/user.entity';



async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    { logger: winstonLogger }, // ✅ IMPORTANT
  );
  
  const viewsPath = path.join(process.cwd(), 'views');
  //const partialsPath = path.join(process.cwd(), 'views', 'tasks');

  console.log('Views:', viewsPath);
  //console.log('Partials:', partialsPath);

  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');

  //hbs.registerPartials(partialsPath);

  hbs.registerPartial('task-form', fs.readFileSync(
    path.join(process.cwd(), 'views/tasks/task-form.hbs'),
    'utf8'
  ));

  

  hbs.registerHelper('objectKeys', function (obj) {
    return Object.keys(obj);
  });

  // ✅ Global validation (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Global serialization (handles @Exclude, @Expose)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // ✅ Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my NestJS app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  // Sessions (needed for Passport)
  app.use(
    session({
      secret: 'mysecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
        secure: false,   // must be false on localhost (HTTPS required if true)
      },
    }),
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  
  // Global error handler
  app.useGlobalFilters(new AllExceptionsFilter());

  // in main.ts after setViewEngine
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  //await app.listen(3002);
  await app.listen(3002, '0.0.0.0');
}
bootstrap();
