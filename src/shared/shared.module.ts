import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WompiService } from './wampi/wompi.service';

@Module({
  imports: [HttpModule],
  providers: [WompiService],
  exports: [WompiService],
})
export class SharedModule {}
