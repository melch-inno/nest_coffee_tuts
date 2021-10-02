import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavour } from './entities/flavour.entity';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffee.constants';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

// class MockCoffeeService {}
// class ConfigService {}
// class DevelopmentConfigService {}
// class ProductionConfigService {}
@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavour, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  controllers: [CoffeesController],
  // providers: [{ provide: CoffeesService, useValue: new MockCoffeeService() }],
  providers: [
    CoffeesService,
    // {
    //   provide: ConfigService,
    //   useClass:
    //     process.env.NODE_ENV === 'production'
    //       ? ProductionConfigService
    //       : DevelopmentConfigService,
    // },
    {
      provide: COFFEE_BRANDS,
      useFactory: () => ['starbugs', 'cafe star', "Mcdonald's"],
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
