import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { InvoiceService } from './invoice.service';

const mockOrdersService = {
  createOrder: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findAllAdmin: jest.fn(),
  getStats: jest.fn(),
  updateStatus: jest.fn(),
};

const mockInvoiceService = {
  generateInvoice: jest.fn(),
};

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
        { provide: InvoiceService, useValue: mockInvoiceService },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
