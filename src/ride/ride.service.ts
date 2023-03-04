import { Injectable } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RideService {
  public readonly baseFee: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.baseFee = this.configService.get('base_fee');
  }

  create(createRideDto: CreateRideDto) {
    return 'This action adds a new ride';
  }
}
