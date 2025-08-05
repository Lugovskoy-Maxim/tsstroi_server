import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from '../schemas/vehicle.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleSearchDto } from './dto/vehicle-search.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
  ) {}

  // Создание нового транспортного средства
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const createdVehicle = new this.vehicleModel(createVehicleDto);
    return createdVehicle.save();
  }

  // Поиск транспортного средства по ID
  async findById(id: string): Promise<Vehicle | null> {
    return this.vehicleModel
      .findOne({ _id: id, deleted: false })
      .exec();
  }

  // Поиск по регистрационному номеру
  async findByRegistrationNumber(regNumber: string): Promise<Vehicle | null> {
    return this.vehicleModel
      .findOne({ 
        registration_number: regNumber, 
        deleted: false 
      })
      .exec();
  }

  // Поиск по VIN номеру
  async findByVinNumber(vin: string): Promise<Vehicle | null> {
    return this.vehicleModel
      .findOne({ 
        VIN_number: vin.toUpperCase(), 
        deleted: false 
      })
      .exec();
  }

  // Поиск с фильтрами и пагинацией
  async search(searchDto: VehicleSearchDto): Promise<{ data: Vehicle[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      registration_number,
      brand,
      status,
      organization,
      year_from,
      year_to,
      sortBy,
      sortOrder = 'asc',
    } = searchDto;

    const query: any = { deleted: false };

    if (registration_number) {
      query.registration_number = new RegExp(registration_number, 'i');
    }
    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }
    if (status) {
      query.status = status;
    }
    if (organization) {
      query.organization = new RegExp(organization, 'i');
    }
    if (year_from || year_to) {
      query.year = {};
      if (year_from) query.year.$gte = Number(year_from);
      if (year_to) query.year.$lte = Number(year_to);
    }

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // Сортировка по умолчанию
    }

    const data = await this.vehicleModel
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.vehicleModel.countDocuments(query).exec();

    return { data, total };
  }

  // Обновление транспортного средства
  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle | null> {
    return this.vehicleModel
      .findByIdAndUpdate(id, updateVehicleDto, { new: true })
      .exec();
  }

  // Мягкое удаление (помечаем как удаленное)
  async softDelete(id: string): Promise<Vehicle | null> {
    return this.vehicleModel
      .findByIdAndUpdate(
        id,
        { deleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  // Полное удаление из базы (использовать с осторожностью)
  async hardDelete(id: string): Promise<Vehicle | null> {
    return this.vehicleModel.findByIdAndDelete(id).exec();
  }

  // Получение всех активных транспортных средств организации
  async findByOrganization(organizationId: string): Promise<Vehicle[]> {
    return this.vehicleModel
      .find({ 
        organization: organizationId, 
        deleted: false,
        status: 'active',
      })
      .exec();
  }

  // Изменение статуса транспортного средства
  async changeStatus(id: string, status: 'active' | 'idle' | 'repair'): Promise<Vehicle | null> {
    return this.vehicleModel
      .findByIdAndUpdate(
        id,
        { status },
        { new: true },
      )
      .exec();
  }
}