import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entity/movement.entity';
import { MovementsService } from './movements.service';
import { MovementController } from './movements.controller';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movement]), WalletsModule],
  controllers: [MovementController],
  providers: [MovementsService],
  exports: [MovementsService],
})
export class MovementModule {}
