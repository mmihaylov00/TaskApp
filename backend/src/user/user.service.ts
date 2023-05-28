import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User)
              private readonly repository: Repository<User>) {
  }

  findByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }

  getUserData(id: string): Promise<User> {
    return this.repository.findOne({
      where: { id },
      select: ['firstName', 'lastName', 'role']
    });
  }

  async loginUser(email: string, pass: string): Promise<User> {
    const user = await this.findByEmail(email);
    return await bcrypt.compare(pass, user.password) ? user : null;
  }
}
