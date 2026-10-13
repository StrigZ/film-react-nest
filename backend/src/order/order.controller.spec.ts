import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ListResponseDto } from '../common/list-response.dto';
import { BookedTicketDto } from './dto/booked-ticket.dto';
import { CreateOrderDto, TicketDto } from './dto/create-order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

const bookedTicketMock: BookedTicketDto = {
  film: 'film id',
  row: 1,
  seat: 1,
  session: 'session id',
  daytime: '',
  id: 'ticket id',
  price: 350,
};

const ticketMock: TicketDto = {
  film: 'film id',
  row: 1,
  seat: 1,
  session: 'session id',
};

describe('OrderController', () => {
  let controller: OrderController;
  let mockedCreate: jest.Mock<
    Promise<ListResponseDto<BookedTicketDto>>,
    [CreateOrderDto]
  >;

  beforeEach(async () => {
    mockedCreate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: mockedCreate,
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', async () => {
    mockedCreate.mockResolvedValue({
      total: 1,
      items: [bookedTicketMock],
    });

    const createOrderDto = {
      email: '',
      phone: '',
      tickets: [ticketMock],
    };
    const result = await controller.create(createOrderDto);
    expect(mockedCreate).toHaveBeenCalledTimes(1);
    expect(mockedCreate).toHaveBeenCalledWith(createOrderDto);
    expect(result).toEqual({
      total: 1,
      items: [bookedTicketMock],
    });
  });
  it('should reject if seat is taken', async () => {
    mockedCreate.mockRejectedValue(new ConflictException('Место 1:1 занято'));

    const createOrderDto = {
      email: '',
      phone: '',
      tickets: [ticketMock],
    };

    await expect(controller.create(createOrderDto)).rejects.toThrow(
      new ConflictException('Место 1:1 занято'),
    );
    expect(mockedCreate).toHaveBeenCalledTimes(1);
    expect(mockedCreate).toHaveBeenCalledWith(createOrderDto);
  });
});
