import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateContactDto) {
    const ticket = await this.prisma.contactTicket.create({
      data: dto,
    });

    // Gửi email thông báo cho admin (không throw nếu lỗi)
    try {
      await this.emailService.sendContactNotificationEmail(ticket);
    } catch (error) {
      console.error('[CONTACT] Gửi email thông báo thất bại:', error);
    }

    return {
      message:
        'Yêu cầu hỗ trợ đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
      ticketId: ticket.id,
    };
  }

  async findAll(query: { status?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where = query.status ? { status: query.status as never } : {};

    const [tickets, total] = await Promise.all([
      this.prisma.contactTicket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.contactTicket.count({ where }),
    ]);

    return {
      data: tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.prisma.contactTicket.findUnique({ where: { id } });
  }

  async updateStatus(id: string, dto: UpdateTicketDto) {
    return this.prisma.contactTicket.update({
      where: { id },
      data: dto,
    });
  }
}
