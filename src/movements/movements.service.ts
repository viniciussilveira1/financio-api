import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movement } from './entity/movement.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import {
  CreateMovementDto,
  UpdateMovementDto,
} from './dto/create-movement-dto';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private repository: Repository<Movement>,
  ) {}

  create(data: CreateMovementDto): Promise<Movement> {
    const movement = this.repository.create(data);
    return this.repository.save(movement);
  }

  findByWalletId(walletId: number): Promise<Movement[]> {
    return this.repository.find({
      where: { walletId },
    });
  }

  findByUserId(userId: number): Promise<Movement[]> {
    return this.repository.find({
      where: { wallet: { user: { id: userId } } },
    });
  }

  findById(id: number): Promise<Movement | null> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, data: UpdateMovementDto): Promise<UpdateResult> {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Nenhum dado fornecido para atualização');
    }
    return this.repository.update(id, data);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
