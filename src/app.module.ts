import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Properties } from './config/properties.config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      load: [Properties],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
