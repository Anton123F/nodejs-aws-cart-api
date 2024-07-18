import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Carts } from '../../cart/entity';

@Entity('cart_items')
export class CartItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  product_id: string;

  @Column({ type: 'int' })
  count: number;

  @ManyToOne(() => Carts, carts => carts.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Carts;
}