import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartItems } from '../../cartItems/entity';
enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED'
}

@Entity('carts')
export class Carts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({
    type: "enum",
    enum: CartStatuses,
    default: CartStatuses.OPEN
  })
  status: CartStatuses;

  @OneToMany(() => CartItems, cartItems => cartItems.cart, { cascade: true, eager: true })
  items: CartItems[];

}