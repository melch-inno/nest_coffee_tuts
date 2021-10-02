import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Connection, Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavour } from './entities/flavour.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffee.constants';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,

    @InjectRepository(Flavour)
    private readonly flavourRepository: Repository<Flavour>,

    private readonly connection: Connection,

    @Inject(COFFEE_BRANDS) readonly coffeeBrands: string[],

    @Inject(coffeesConfig.KEY)
    private readonly configConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    console.log(configConfiguration.foo);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
    const { limit, offset } = paginationQuery;
    return await this.coffeeRepository.find({
      relations: ['flavours'],
      skip: offset,
      take: limit,
    });
  }

  async findOneById(id: number): Promise<Coffee> {
    const result = await this.coffeeRepository.findOne(id, {
      relations: ['flavours'],
    });

    if (!result) {
      throw new NotFoundException(`Coffee with ID: #${id} not found`);
    }
    return result;
  }

  async create(createCoffeeDto: any): Promise<Coffee> {
    const flavours = await Promise.all(
      createCoffeeDto.flavours.map((name: string) =>
        this.preloadFlavourByName(name),
      ),
    );

    const coffee: any = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavours,
    });
    return await this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: any): Promise<Coffee> {
    const flavours =
      updateCoffeeDto.flavours &&
      (await Promise.all(
        updateCoffeeDto.flavours.map((name: string) =>
          this.preloadFlavourByName(name),
        ),
      ));

    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavours,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with ID: #${id} not found`);
    }
    return await this.coffeeRepository.save(coffee);
  }

  async remove(id: number): Promise<void> {
    const coffee = await this.coffeeRepository.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee with ID: #${id} not found`);
    }
    await this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavourByName(name: string): Promise<Flavour> {
    const existingFlavour = await this.flavourRepository.findOne({ name });
    if (existingFlavour) {
      return existingFlavour;
    }
    return this.flavourRepository.create({ name });
  }
}
