import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name)
    private readonly coffeeModel: Model<Coffee>,
  ) {}

  findAll(query: PaginationDto) {
    const { limit, offset } = query;

    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOneById(id: string) {
    try {
      const coffee = await this.coffeeModel.findById(id).exec();

      if (!coffee) {
        throw new NotFoundException('Coffee not found');
      }
      return coffee;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    try {
      const coffee = new this.coffeeModel(createCoffeeDto);
      return coffee.save();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    try {
      const result = await this.coffeeModel
        .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
        .exec();

      if (!result) {
        throw new NotFoundException(`Coffee with ID: #${id} not found`);
      }

      return result;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.coffeeModel.findByIdAndRemove(id).exec();
      if (!result) {
        throw new NotFoundException(`Coffee with ID: #${id} does not exist`);
      }
      return result;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
