import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

const mockPrisma = {
  contactTicket: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockEmailService = {
  sendContactNotificationEmail: jest.fn(),
};

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    jest.clearAllMocks();
  });

  const mockTicket = {
    id: 'ticket-1',
    name: 'Nguyễn Văn A',
    email: 'test@example.com',
    subject: 'Hỏi về đơn hàng',
    message: 'Đơn hàng của tôi bị trễ',
    status: 'OPEN',
    createdAt: new Date(),
  };

  describe('create', () => {
    it('should create a ticket and send email notification', async () => {
      mockPrisma.contactTicket.create.mockResolvedValue(mockTicket);
      mockEmailService.sendContactNotificationEmail.mockResolvedValue(
        undefined,
      );

      const result = await service.create({
        name: 'Nguyễn Văn A',
        email: 'test@example.com',
        subject: 'Hỏi về đơn hàng',
        message: 'Đơn hàng của tôi bị trễ',
      });

      expect(result.ticketId).toBe('ticket-1');
      expect(mockPrisma.contactTicket.create).toHaveBeenCalled();
      expect(
        mockEmailService.sendContactNotificationEmail,
      ).toHaveBeenCalledWith(mockTicket);
    });

    it('should still succeed if email notification fails', async () => {
      mockPrisma.contactTicket.create.mockResolvedValue(mockTicket);
      mockEmailService.sendContactNotificationEmail.mockRejectedValue(
        new Error('SMTP error'),
      );

      const result = await service.create({
        name: 'Nguyễn Văn A',
        email: 'test@example.com',
        subject: 'Hỏi',
        message: 'Nội dung',
      });

      expect(result.ticketId).toBe('ticket-1');
    });
  });

  describe('findAll', () => {
    it('should return paginated tickets', async () => {
      mockPrisma.contactTicket.findMany.mockResolvedValue([mockTicket]);
      mockPrisma.contactTicket.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrisma.contactTicket.findMany.mockResolvedValue([]);
      mockPrisma.contactTicket.count.mockResolvedValue(0);

      await service.findAll({ status: 'OPEN', page: 1, limit: 10 });

      expect(mockPrisma.contactTicket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'OPEN' },
        }),
      );
    });

    it('should use default pagination', async () => {
      mockPrisma.contactTicket.findMany.mockResolvedValue([]);
      mockPrisma.contactTicket.count.mockResolvedValue(0);

      const result = await service.findAll({});

      expect(result.page).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a ticket by id', async () => {
      mockPrisma.contactTicket.findUnique.mockResolvedValue(mockTicket);

      const result = await service.findOne('ticket-1');

      expect(result).toEqual(mockTicket);
    });

    it('should return null if not found', async () => {
      mockPrisma.contactTicket.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update ticket status and notes', async () => {
      const updated = {
        ...mockTicket,
        status: 'RESOLVED',
        adminNote: 'Đã xử lý',
      };
      mockPrisma.contactTicket.update.mockResolvedValue(updated);

      const result = await service.updateStatus('ticket-1', {
        status: 'RESOLVED',
        adminNote: 'Đã xử lý',
      });

      expect(result.status).toBe('RESOLVED');
      expect(mockPrisma.contactTicket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: { status: 'RESOLVED', adminNote: 'Đã xử lý' },
      });
    });
  });
});
