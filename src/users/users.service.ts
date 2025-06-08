import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../common/utils/hash-password.util';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { UpdateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) throw new BadRequestException('E-mail já cadastrado');

    const hashedPassword = await hashPassword(data.password);

    const user = this.repository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
    });

    return this.repository.save(user);
  }

  createFromGoogle(data: CreateGoogleUserDto): Promise<User> {
    const user = this.repository.create({
      email: data.email,
      name: data.name,
    });

    return this.repository.save(user);
  }

  update(id: number, data: UpdateUserDto): Promise<UpdateResult> {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Nenhum dado fornecido para atualização');
    }
    return this.repository.update(id, data);
  }

  findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  findAll(): Promise<User[] | null> {
    return this.repository.find();
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
