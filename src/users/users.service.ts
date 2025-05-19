import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { hashPassword } from './utils/hash-password.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findUser(userId: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ userId });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async getUsersList(): Promise<User[] | null> {
    return await this.usersRepository.find();
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({
      username: data.username,
    });
    if (existingUser)
      throw new BadRequestException('Nome de usuário já registrado');

    const hashedPassword = await hashPassword(data.password);

    const user = this.usersRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async delete(userId: number) {
    return await this.usersRepository.delete(userId);
  }
}
