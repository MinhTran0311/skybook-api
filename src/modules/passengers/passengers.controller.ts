import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { PassengersService } from './passengers.service';
import { FilterPassengerDto } from './dto/filter-passenger.dto';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get(':id')
  async getPassengerById(@Param('id') id: string) {
    return await this.passengersService.getPassengerById(id);
  }
}
