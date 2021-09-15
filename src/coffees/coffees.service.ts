import { Injectable, NotFoundException } from '@nestjs/common';
import { CoffeeEntity } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: CoffeeEntity[] = [
    {
      id: 1,
      name: 'Cappuccino',
      price: 12,
      brand: 'Starbucks',
      flavour: ['Mocha', 'Caramel'],
      rating: 4.5,
    },
  ];

  findAll(): CoffeeEntity[] {
    return this.coffees;
  }

  findOneById(id: number): CoffeeEntity {
    const result = this.coffees.find((coffee) => coffee.id === +id);
    if (!result) {
      throw new NotFoundException(`Coffee with ID: #${id} not found`);
    }
    return result;
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
    return createCoffeeDto;
  }

  update(id: number, updateCoffeeDto: any) {
    const index = this.coffees.findIndex((coffee) => coffee.id === +id);
    this.coffees[index] = updateCoffeeDto;
  }

  remove(id: number) {
    const index = this.coffees.findIndex((coffee) => coffee.id === +id);
    this.coffees.splice(index, 1);
  }
}
