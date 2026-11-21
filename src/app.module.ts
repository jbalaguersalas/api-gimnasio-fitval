import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClassesModule } from './classes/classes.module';
import { DatabaseModule } from './database/database.module';
import { PlansModule } from './plans/plans.module';
import { TrainersModule } from './trainers/trainers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 20 }],
      errorMessage: 'Demasiadas peticiones. Espera un poco.',
    }),
    DatabaseModule,
    PlansModule,
    ClassesModule,
    UsersModule,
    AuthModule,
    TrainersModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
