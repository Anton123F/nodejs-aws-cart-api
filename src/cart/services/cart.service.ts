import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Carts} from '../entity';

@Injectable()
export class CartService {
  private userCarts: Record<string, Carts> = {};

  constructor(
    @InjectRepository(Carts)
    private cartRepository: Repository<Carts>,
  ) {}

  findAll(): Promise<Carts[]> {
    return this.cartRepository.find();
  }

  async findByUserId(user_id: string): Promise<Carts> {
    //@ts-ignore
    return this.cartRepository.findOne({ where: { user_id } });
  }

  async createByUserId(userId: string): Promise<Carts> {
    //@ts-ignore
    const cart = this.cartRepository.create({ userId, items: [] });
    //@ts-ignore
    return this.cartRepository.save(cart);
  }

  async findOrCreateByUserId(userId: string): Promise<Carts> {
    let cart = await this.findByUserId(userId);
    if (!cart) {
      //@ts-ignore
      cart = await this.createByUserId(userId);
    }
    return cart;
  }

  async updateByUserId(userId: string, { items }: Carts): Promise<Carts> {
    const cart = await this.findOrCreateByUserId(userId);
    cart.items = items;
    return this.cartRepository.save(cart);
  }

  async removeByUserId(userId: string): Promise<void> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      await this.cartRepository.remove(cart);
    }
  }
}
