import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipe/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Public()
  @Get()
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Coffee[]> {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Coffee> {
    return await this.coffeeService.findOneById(+id);
  }

  @Post()
  async create(@Body() createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    return await this.coffeeService.create(createCoffeeDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ): Promise<Coffee> {
    return await this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.coffeeService.remove(id);
  }
}
