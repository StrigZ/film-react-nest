import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configProvider } from './app.config.provider';
import { FilmsController } from './order/films/films.controller';
import { FilmsService } from './order/films/films.service';
import { FilmsService } from './films/films.service';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';
import { FilmsModule } from './films/films.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    OrderModule,
    FilmsModule,
    // @todo: Добавьте раздачу статических файлов из public
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider, FilmsService, OrderService],
})
export class AppModule {}
