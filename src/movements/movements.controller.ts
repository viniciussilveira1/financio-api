import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

@Controller('movements')
export class MovementController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get(':id')
  @CheckOwnership(Movement, 'id', 'wallet.user')
  getById(@Param('id') id: number) {
    return this.movementsService.findById(id);
  }

  @Get()
  getAll(@CurrentUserId() userId: number) {
    return this.movementsService.findByUserId(userId);
  }

  @Get('wallet/:walletId')
  @CheckOwnership(Wallet, 'walletId')
  getByWalletId(@Param('walletId') walletId: number) {
    return this.movementsService.findByWalletId(walletId);
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
