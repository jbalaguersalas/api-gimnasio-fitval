import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClassesModule } from './classes/classes.module';
import { DatabaseModule } from './database/database.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [DatabaseModule, PlansModule, ClassesModule],
  controllers: [AppController],
})
export class AppModule {}
