import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movement } from './entity/movement.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import {
  CreateMovementDto,
  UpdateMovementDto,
} from './dto/create-movement-dto';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  paginate,
} from '../common/utils/pagination/pagination.util';
import { PaginationQueryDto } from '../common/utils/pagination/pagination-query.dto';

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

  findByWalletIdPaginated(walletId: number, query: PaginationQueryDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    return paginate(
      this.repository,
      {
        where: { walletId },
      },
      page,
      limit,
    );
  }

  findByUserIdPaginated(userId: number, query: PaginationQueryDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;

    return paginate(
      this.repository,
      {
        where: { wallet: { user: { id: userId } } },
      },
      page,
      limit,
    );
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
