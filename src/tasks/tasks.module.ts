import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])], // important!
  controllers: [TasksController],
  providers: [TasksService], // ✅ Make sure TasksService is here
  
})
export class TasksModule {}
