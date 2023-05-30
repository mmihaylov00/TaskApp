import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {

  constructor(@InjectRepository(Task)
              private readonly repository: Repository<Task>) {
  }


}
