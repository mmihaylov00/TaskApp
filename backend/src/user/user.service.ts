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
    return this.repository.findOne({ where: { email } });
  }

  async loginUser(email: string, pass: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }
}
