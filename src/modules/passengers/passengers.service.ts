import { Injectable, Inject } from '@nestjs/common';
import {
  IPassengerRepository,
  PASSENGER_REPOSITORY,
} from './repository/passengers.repository';

@Injectable()
export class PassengersService {
  constructor(
    @Inject(PASSENGER_REPOSITORY)
    private readonly passengerRepository: IPassengerRepository,
  ) {}
  async getPassengerById(id: string) {
    return this.passengerRepository.getPassengerById(id);
  }
}
