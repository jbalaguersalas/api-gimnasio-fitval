import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClassesModule } from './classes/classes.module';
import { DatabaseModule } from './database/database.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    PlansModule,
    ClassesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
