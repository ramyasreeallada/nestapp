import { Controller, Get, Body, Post, UploadedFile, UseInterceptors, Render, Res, Redirect, Param, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TasksService } from './tasks.service';
import { Express } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthRequest } from '../auth/auth-request.interface';


@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Render main tasks page with a link to import Excel
  @Get()
  @Render('tasks/index') // create index.hbs
  tasksHome(@Req() req: AuthRequest) {
    console.log('TASKS: session object ramya =>', req.session);
    console.log('TASKS: session user =>', req.session?.user);
  
    return {
      user: req.session?.user, // pass to hbs
    };
  }

  @Get('create-task')
  @Render('tasks/task-form') // create index.hbs
  createTask() {
    return {
      isEdit: false,
      task: null,
    };
  }

  @Get('edit/:id')
  @Render('tasks/task-form')
  async editTask(@Param('id') id: string) {
    return {
      //tasks: await this.tasksService.findAll(),
      isEdit: true,
      task: await this.tasksService.findOne(+id),
    };
  }

  // ✅ Update route
  @Post('update/:id')
  @Redirect('/tasks/list-tasks')
  async updateTask(
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    await this.tasksService.update(+id, title);
  }

  // Delete
  @Post('delete/:id')
  @Redirect('/tasks/list-tasks')
  async deleteTask(@Param('id') id: string) {
    await this.tasksService.remove(+id);
  }

  @Post('save')
  @Redirect('/tasks/list-tasks')
  async saveTask(@Body() createTaskDto: CreateTaskDto) {
    await this.tasksService.create(createTaskDto);
  }

  
  @Get('list-tasks')
  @Render('tasks/task-list')
  async listTasks() {
    const tasks = await this.tasksService.findAll();
    return { tasks };
  }
  
  // Render the Excel upload page
  @Get('import-excel')
  @Render('tasks/import-excel') // 'tasks/' subfolder
  importExcelForm() {
    return { data: null }; // initially no table
  }

  @Get('todo')
  @Render('tasks/todo') // create todo.hbs
  todoList() {
    return {}; // you can pass data if needed
  }

  // Handle Excel file upload
  @Post('import-excel')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // folder where uploaded files are saved
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    // 1️⃣ Read Excel data using TasksService
    const data = await this.tasksService.readExcel(file.path);

    // 2️⃣ Debug: log first row (like PHP print_r + exit)
    console.log('First row of Excel data:', data[0]);
    // If you want to stop here for debugging, uncomment:
    // process.exit(0);

    // 3️⃣ Return data to render table in template
    return { data };
  }
}
