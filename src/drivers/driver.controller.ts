import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, ParseIntPipe, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverResponseDto } from './dto/driver-response.dto';
import { DriverFilterDto } from './dto/driver-filter.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('/')
  @HttpCode(200)
  async findAll(@Query() filterDto: DriverFilterDto): Promise<DriverResponseDto[]> {
    return this.driverService.findAll(filterDto);
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<DriverResponseDto> {
    return this.driverService.findOne(id);
  }

  @Post('/')
  @HttpCode(201)
  async create(@Body() createDriverDto: CreateDriverDto): Promise<DriverResponseDto> {
    return this.driverService.create(createDriverDto);
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto): Promise<DriverResponseDto> {
    return this.driverService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return this.driverService.remove(id);
  }

  @Post('/:driverId/vehicles/:vehicleId')
  @HttpCode(200)
  async assignVehicle(@Param('driverId') driverId: string, @Param('vehicleId') vehicleId: string): Promise<DriverResponseDto> {
    return this.driverService.assignVehicle(driverId, vehicleId);
  }

  @Delete('/:driverId/vehicles/:vehicleId')
  @HttpCode(200)
  async unassignVehicle(@Param('driverId') driverId: string, @Param('vehicleId') vehicleId: string): Promise<DriverResponseDto> {
    return this.driverService.unassignVehicle(driverId, vehicleId);
  }

  @Patch('/:id/status')
  @HttpCode(200)
  async changeStatus(@Param('id') id: string, @Body('status') status: string): Promise<DriverResponseDto> {
    return this.driverService.updateDriverStatus(id, status);
  }
}