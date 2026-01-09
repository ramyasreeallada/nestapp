import { Injectable, NotFoundException } from '@nestjs/common';
import * as XLSX from 'xlsx';

import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * Reads Excel file and converts first sheet to JSON
   * @param filePath - path to uploaded Excel file
   */
  readExcel(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  }

  async create(dto: CreateTaskDto) {
    const task = this.taskRepository.create(dto);
    return this.taskRepository.save(task);
  }

  async findAll() {
    return this.taskRepository.find({
      order: { id: 'DESC' },
    });
  }

  // 2️⃣ Find one task
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, title: string): Promise<Task> {
    const task = await this.findOne(id);
    task.title = title;
    return this.taskRepository.save(task);
  }

  // 5️⃣ Delete / Remove a task
  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
 
}
