import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import {
  CreateMovementDto,
  UpdateMovementDto,
} from './dto/create-movement-dto';
import { Movement } from './entity/movement.entity';
import { CheckOwnership } from '../common/decorators/ownership.decorator';
import { Wallet } from '../wallets/entity/wallet.entity';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { PaginationQueryDto } from '../common/utils/pagination/pagination-query.dto';

@Controller('movements')
export class MovementController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get(':id')
  @CheckOwnership(Movement, 'id', 'wallet.user')
  getById(@Param('id') id: number) {
    return this.movementsService.findById(id);
  }

  @Get()
  getAll(@CurrentUserId() userId: number, @Query() query: PaginationQueryDto) {
    return this.movementsService.findByUserIdPaginated(userId, query);
  }

  @Get('wallet/:walletId')
  @CheckOwnership(Wallet, 'walletId')
  getByWalletId(
    @Param('walletId') walletId: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.movementsService.findByWalletIdPaginated(+walletId, query);
  }

  @Post()
  @CheckOwnership(Wallet, 'walletId')
  create(@Body() dto: CreateMovementDto) {
    return this.movementsService.create(dto);
  }

  @Put(':id')
  @CheckOwnership(Movement, 'id', 'wallet.user')
  update(@Param('id') id: number, @Body() dto: UpdateMovementDto) {
    return this.movementsService.update(id, dto);
  }

  @Delete(':id')
  @CheckOwnership(Movement, 'id', 'wallet.user')
  delete(@Param('id') id: number) {
    return this.movementsService.delete(id);
  }
}
