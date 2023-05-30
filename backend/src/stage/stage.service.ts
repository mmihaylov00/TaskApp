import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stage } from './stage.entity';

@Injectable()
export class StageService {

  constructor(@InjectRepository(Stage)
              private readonly repository: Repository<Stage>) {
  }


}
