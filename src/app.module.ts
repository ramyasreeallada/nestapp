import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { User } from './users/user.entity'; 
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [User],
      autoLoadEntities: true, // automatically load all entities
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Config accessible globally
    }),
    UsersModule, // ✅ import your UsersModule
    TasksModule,
    AuthModule
    
  ],
  controllers: [AppController], // ✅ only AppController here
  /*providers: [
    AppService, // your existing service
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard, // global API key guard
    },
  ], */      // ✅ only AppService here
  providers: [
    AppService, // your existing service
  ],       // ✅ only AppService here
  
})
export class AppModule {}
