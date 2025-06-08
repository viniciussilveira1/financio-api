import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto, UpdateWalletDto } from './dto/wallets-dto';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Wallet } from './entity/wallet.entity';
import { CheckOwnership } from '../common/decorators/ownership.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() dto: CreateWalletDto, @CurrentUserId() userId: number) {
    return this.walletsService.create(dto, userId);
  }

  @Get()
  getAllByUser(@CurrentUserId() userId: number) {
    return this.walletsService.findByUserId(userId);
  }

  @Get(':id')
  @CheckOwnership(Wallet)
  getById(@Param('id') id: number) {
    return this.walletsService.findById(id);
  }

  @Put(':id')
  @CheckOwnership(Wallet)
  update(@Param('id') id: number, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletsService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @CheckOwnership(Wallet)
  delete(@Param('id') id: number) {
    return this.walletsService.delete(id);
  }
}
