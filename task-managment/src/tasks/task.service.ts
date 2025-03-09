import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasksWithFilters(
    paginationOptions: { page: number; limit: number },
    filters: { search: string; status?: TaskStatus },
  ) {
    const { page, limit } = paginationOptions;
    const { search, status } = filters;

    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (search) {
      queryBuilder.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [tasks, totalCount] = await queryBuilder.getManyAndCount();

    return {
      items: tasks,
      totalCount,
    };
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title } = createTaskDto;

    const existingTask = await this.taskRepository.findOne({
      where: { title },
    });

    if (existingTask) {
      throw new ConflictException('A task with this title already exists');
    }

    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.update(id, updateTaskDto);
    return this.taskRepository.findOne({ where: { id } });
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.delete(id);
  }
}
