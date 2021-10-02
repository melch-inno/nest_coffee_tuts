import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavour } from './flavour.entity';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  brand: string;

  @Column({ nullable: true })
  description: string;

  @JoinTable()
  @ManyToMany(() => Flavour, (flavour) => flavour.coffees, {
    cascade: true,
  })
  flavours: Flavour[];

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  recommendations: number;
}
