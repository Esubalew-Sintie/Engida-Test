import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
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
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(task);

      const result = await service.createTask(createTaskDto);
      expect(result).toEqual(task);
    });

    it('should throw ConflictException if task already exists', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'Task Description',
      };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce({ title: 'New Task' });

      await expect(service.createTask(createTaskDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      const task = {
        id: '1',
        title: 'Old Task',
        description: 'Task Description',
        status: 'To Do',
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task);
      jest.spyOn(repository, 'update').mockResolvedValue(null);
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue({ ...task, ...updateTaskDto });

      const result = await service.updateTask('1', updateTaskDto);
      expect(result.title).toBe(updateTaskDto.title);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateTask('1', updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const task = { id: '1', title: 'Task to be deleted' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await service.deleteTask('1');
      expect(repository.delete).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.deleteTask('1')).rejects.toThrow(NotFoundException);
    });
  });
});
