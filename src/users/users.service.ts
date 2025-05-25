import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
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
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) throw new BadRequestException('E-mail já cadastrado');

    const hashedPassword = await hashPassword(data.password);

    const user = this.usersRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
    });

    return this.usersRepository.save(user);
  }

  async createFromGoogle(data: { email: string; name: string }) {
    const user = this.usersRepository.create({
      email: data.email,
      name: data.name,
    });

    return this.usersRepository.save(user);
  }

  async delete(userId: number) {
    return await this.usersRepository.delete(userId);
  }
}
