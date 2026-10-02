import { Body, Controller, Post } from '@nestjs/common';
import { ListResponseDto } from 'src/common/list-response.dto';
import { BookedTicketDto } from './dto/booked-ticket.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ListResponseDto<BookedTicketDto>> {
    return this.orderService.create(createOrderDto);
  }
}
