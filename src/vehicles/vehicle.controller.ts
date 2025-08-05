import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleSearchDto } from './dto/vehicle-search.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // Создание нового транспортного средства
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  // Получение транспортного средства по ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehicleService.findById(id);
  }

  // Поиск транспортных средств с фильтрами
  @Get()
  async search(@Query() searchDto: VehicleSearchDto) {
    return this.vehicleService.search(searchDto);
  }

  // Обновление транспортного средства
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  // Удаление транспортного средства (мягкое удаление)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.vehicleService.softDelete(id);
  }

  // Получение транспортных средств по организации
  @Get('organization/:organizationId')
  async findByOrganization(@Param('organizationId') organizationId: string) {
    return this.vehicleService.findByOrganization(organizationId);
  }

  // Поиск по регистрационному номеру
  @Get('reg-number/:regNumber')
  async findByRegNumber(@Param('regNumber') regNumber: string) {
    return this.vehicleService.findByRegistrationNumber(regNumber);
  }

  // Поиск по VIN номеру
  @Get('vin/:vin')
  async findByVin(@Param('vin') vin: string) {
    return this.vehicleService.findByVinNumber(vin);
  }

  // Изменение статуса транспортного средства
  @Put(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Query('status') status: 'active' | 'idle' | 'repair',
  ) {
    return this.vehicleService.changeStatus(id, status);
  }
}