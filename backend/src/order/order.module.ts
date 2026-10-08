import { Module } from '@nestjs/common';
import { FilmsRepositoryModule } from 'src/repository/films-repository.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [FilmsRepositoryModule.register()],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
