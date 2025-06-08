import {
  MovementCategory,
  MovementType,
} from '../../common/interfaces/Movement';
import { Wallet } from '../../wallets/entity/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @Column({
    type: 'enum',
    enum: MovementCategory,
  })
  category: MovementCategory;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.movements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column()
  walletId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
