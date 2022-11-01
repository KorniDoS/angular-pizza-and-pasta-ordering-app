import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Pasta } from './pasta.entity';
import { PastaController } from './pasta.controller';
import { PastaService } from './pasta.service';
 import { ConfigModule } from '@nestjs/config';
import { PastaRepository } from './pasta.repository';
@Module({
  imports: [/*ConfigModule*/TypeOrmModule.forFeature([Pasta]), AuthModule],
  controllers: [PastaController],
  providers: [PastaService, PastaRepository],
})
export class PastaModule {}