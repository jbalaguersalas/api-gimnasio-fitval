import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { PhotosService } from './photos.service';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [TrainersController],
  providers: [TrainersService, PhotosService],
})
export class TrainersModule {}
