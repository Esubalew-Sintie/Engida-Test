import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpStatus,
  Res,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { ApiResponse } from './dto/api-response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('status') status: TaskStatus,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { items, totalCount } = await this.taskService.getTasksWithFilters(
        { page, limit },
        { search, status },
      );

      return res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse<Task[]>(
            'Tasks retrieved successfully',
            true,
            items,
            totalCount,
          ),
        );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse<null>('An unexpected error occurred', false, null),
        );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const task = await this.taskService.createTask(createTaskDto);
      return res
        .status(HttpStatus.CREATED)
        .json(new ApiResponse<Task>('Task created successfully', true, task));
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new ApiResponse<null>(error.message, false, null));
      } else if (error instanceof ConflictException) {
        return res
          .status(HttpStatus.CONFLICT)
          .json(new ApiResponse<null>(error.message, false, null));
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse<null>('An unexpected error occurred', false, null),
        );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const task = await this.taskService.updateTask(id, updateTaskDto);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return res
        .status(HttpStatus.OK)
        .json(new ApiResponse<Task>('Task updated successfully', true, task));
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ApiResponse<null>(error.message, false, null));
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse<null>('An unexpected error occurred', false, null),
        );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.taskService.deleteTask(id);
      return res
        .status(HttpStatus.OK)
        .json(new ApiResponse<null>('Task deleted successfully', true, null));
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ApiResponse<null>(error.message, false, null));
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse<null>('An unexpected error occurred', false, null),
        );
    }
  }
}
