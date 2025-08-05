import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Driver, DriverDocument } from '../schemas/driver.schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverFilterDto } from './dto/driver-filter.dto';
import { DriverResponseDto } from './dto/driver-response.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(Driver.name) private readonly driverModel: Model<DriverDocument>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<DriverResponseDto> {
    const driver = new this.driverModel(createDriverDto);
    const savedDriver = await driver.save();
    return this.mapToResponseDto(savedDriver);
  }

  async findAll(filterDto: DriverFilterDto): Promise<DriverResponseDto[]> {
    const filter: any = { deleted: false };

    if (filterDto.organization) {
      filter.organization = filterDto.organization;
    }

    if (filterDto.status) {
      filter.status = filterDto.status;
    }

    if (filterDto.licenseCategory) {
      filter.licenseCategory = filterDto.licenseCategory;
    }

    if (filterDto.search) {
      filter.$or = [
        { fullName: { $regex: filterDto.search, $options: 'i' } },
        { licenseNumber: { $regex: filterDto.search, $options: 'i' } },
      ];
    }

    const drivers = await this.driverModel.find(filter).lean(); // lean() упростит обработку результатов
    return drivers.map((driver) => this.mapToResponseDto(driver));
  }

  async findOne(id: string): Promise<DriverResponseDto> {
    const driver = await this.driverModel.findById(id).lean();
    if (!driver || driver.deleted) {
      throw new NotFoundException('Водитель не найден');
    }
    return this.mapToResponseDto(driver);
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<DriverResponseDto> {
    const updatedDriver = await this.driverModel.findByIdAndUpdate(id, updateDriverDto, { new: true }).lean();
    if (!updatedDriver) {
      throw new NotFoundException('Водитель не найден');
    }
    return this.mapToResponseDto(updatedDriver);
  }

async remove(id: string): Promise<void> {
  const result = await this.driverModel.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
  if (result.modifiedCount === 0) { 
    throw new NotFoundException('Водитель не найден');
  }
}

  async assignVehicle(driverId: string, vehicleId: string): Promise<DriverResponseDto> {
    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      { $addToSet: { assignedVehicles: vehicleId } },
      { new: true },
    ).lean();
    if (!driver) {
      throw new NotFoundException('Водитель не найден');
    }
    return this.mapToResponseDto(driver);
  }

  async unassignVehicle(driverId: string, vehicleId: string): Promise<DriverResponseDto> {
    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      { $pull: { assignedVehicles: vehicleId } },
      { new: true },
    ).lean();
    if (!driver) {
      throw new NotFoundException('Водитель не найден');
    }
    return this.mapToResponseDto(driver);
  }

  async updateDriverStatus(id: string, status: string): Promise<DriverResponseDto> {
    const allowedStatuses = ['active', 'suspended', 'fired', 'vacation'];
    if (!allowedStatuses.includes(status)) {
      throw new Error('Неверный статус');
    }

    const driver = await this.driverModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!driver) {
      throw new NotFoundException('Водитель не найден');
    }
    return this.mapToResponseDto(driver);
  }

  private mapToResponseDto(driver: any): DriverResponseDto {
    return {
      _id: driver._id.toString(),
      fullName: driver.fullName,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      licenseExpiry: driver.licenseExpiry,
      phone: driver.phone,
      email: driver.email,
      address: driver.address,
      birthDate: driver.birthDate,
      organization: driver.organization?.toString() ?? '', // Возвращаем ID организации
      status: driver.status,
      hiredDate: driver.hiredDate,
      firedDate: driver.firedDate,
      notes: driver.notes,
      workPass: driver.workPass
        ? {
            number: driver.workPass.number,
            issueDate: driver.workPass.issueDate,
            expiryDate: driver.workPass.expiryDate,
            constructionSite: driver.workPass.constructionSite?.toString() ?? '', // Возвращаем ID стройплощадки
          }
        : undefined,
      medicalExam: driver.medicalExam
        ? {
            certificateNumber: driver.medicalExam.certificateNumber,
            issueDate: driver.medicalExam.issueDate,
            expiryDate: driver.medicalExam.expiryDate,
            clinic: driver.medicalExam.clinic,
          }
        : undefined,
      psychologicalExam: driver.psychologicalExam
        ? {
            certificateNumber: driver.psychologicalExam.certificateNumber,
            issueDate: driver.psychologicalExam.issueDate,
            expiryDate: driver.psychologicalExam.expiryDate,
            center: driver.psychologicalExam.center,
          }
        : undefined,
    };
  }
}