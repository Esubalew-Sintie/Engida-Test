import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../task.controller';
import { TaskService } from '../task.service';
import { Task } from '../entities/task.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            createTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
            getTasksWithFilters: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return tasks with pagination and filters', async () => {
      const tasks = [
        { id: '1', title: 'Task 1', status: 'To Do', createdAt: new Date() },
      ];
      jest
        .spyOn(service, 'getTasksWithFilters')
        .mockResolvedValue({ items: tasks, totalCount: 1 });

      await controller.getTasks(
        { page: 1, limit: 10, search: '', status: 'To Do' },
        res,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tasks retrieved successfully',
        success: true,
        data: tasks,
        totalCount: 1,
      });
    });
  });

  describe('createTask', () => {
    it('should create a task and return success response', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'Task Description',
      };
      const task = {
        ...createTaskDto,
        id: '1',
        status: 'To Do',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'createTask').mockResolvedValue(task);

      await controller.createTask(createTaskDto, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task created successfully',
        success: true,
        data: task,
      });
    });

    it('should return ConflictException if task already exists', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'Task Description',
      };
      jest
        .spyOn(service, 'createTask')
        .mockRejectedValue(new ConflictException('Task exists'));

      await controller.createTask(createTaskDto, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task exists',
        success: false,
        data: null,
      });
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      const task = {
        id: '1',
        title: 'Updated Task',
        status: 'To Do',
        createdAt: new Date(),
      };
      jest.spyOn(service, 'updateTask').mockResolvedValue(task);

      await controller.updateTask('1', updateTaskDto, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task updated successfully',
        success: true,
        data: task,
      });
    });

    it('should return NotFoundException if task does not exist', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      jest
        .spyOn(service, 'updateTask')
        .mockRejectedValue(new NotFoundException('Task not found'));

      await controller.updateTask('1', updateTaskDto, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task not found',
        success: false,
        data: null,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      jest.spyOn(service, 'deleteTask').mockResolvedValue(undefined);

      await controller.deleteTask('1', res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task deleted successfully',
        success: true,
        data: null,
      });
    });

    it('should return NotFoundException if task does not exist', async () => {
      jest
        .spyOn(service, 'deleteTask')
        .mockRejectedValue(new NotFoundException('Task not found'));

      await controller.deleteTask('1', res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task not found',
        success: false,
        data: null,
      });
    });
  });
});
