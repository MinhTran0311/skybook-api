import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { PassengersModule } from './modules/passengers/passengers.module';

@Module({
  imports: [PrismaModule, PassengersModule],
})
export class AppModule {}
