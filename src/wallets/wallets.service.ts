import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { CreateWalletDto, UpdateWalletDto } from './dto/wallets-dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private repository: Repository<Wallet>,
  ) {}

  create(data: CreateWalletDto, userId: number): Promise<Wallet> {
    const wallet = this.repository.create({
      ...data,
      user: { id: userId },
    });

    return this.repository.save(wallet);
  }

  update(id: number, data: UpdateWalletDto): Promise<UpdateResult> {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Nenhum dado fornecido para atualização');
    }

    return this.repository.update(id, data);
  }

  findByUserId(userId: number): Promise<Wallet[]> {
    return this.repository.find({
      where: { user: { id: userId } },
    });
  }

  findById(id: number): Promise<Wallet | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
