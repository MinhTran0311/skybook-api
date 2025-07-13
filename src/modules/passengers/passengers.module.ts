import { Module } from '@nestjs/common';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import {
  PassengersRepository,
  PASSENGER_REPOSITORY,
} from './repository/passengers.repository';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PassengersController],
  providers: [
    PassengersService,
    {
      provide: PASSENGER_REPOSITORY,
      useClass: PassengersRepository,
    },
  ],
})
export class PassengersModule {}
