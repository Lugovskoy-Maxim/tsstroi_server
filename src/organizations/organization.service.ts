import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../schemas/organization.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationSearchDto } from './dto/organization-search.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) 
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  // Создание новой организации
  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const createdOrganization = new this.organizationModel(createOrganizationDto);
    return createdOrganization.save();
  }

  // Поиск организации по ID
  async findById(id: string): Promise<Organization | null> {
    return this.organizationModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
  }

  // Поиск по ИНН
  async findByInn(inn: string): Promise<Organization | null> {
    return this.organizationModel
      .findOne({ inn, deletedAt: null })
      .exec();
  }

  // Поиск по ОГРН
  async findByOgrn(ogrn: string): Promise<Organization | null> {
    return this.organizationModel
      .findOne({ ogrn, deletedAt: null })
      .exec();
  }

  // Поиск организаций с фильтрами
  async search(searchDto: OrganizationSearchDto): Promise<{ data: Organization[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      query,
      legalForm,
      isActive,
      sortBy,
      sortOrder = 'asc',
    } = searchDto;

    const filter: any = { deletedAt: null };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { inn: query },
        { ogrn: query },
      ];
    }

    if (legalForm) {
      filter.legalForm = legalForm;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const data = await this.organizationModel
      .find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.organizationModel.countDocuments(filter).exec();

    return { data, total };
  }

  // Обновление организации
  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization | null> {
    return this.organizationModel
      .findByIdAndUpdate(id, updateOrganizationDto, { new: true })
      .exec();
  }

  // Мягкое удаление организации
  async softDelete(id: string): Promise<Organization | null> {
    return this.organizationModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), isActive: false },
        { new: true },
      )
      .exec();
  }

  // Полное удаление организации (использовать с осторожностью)
  async hardDelete(id: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndDelete(id).exec();
  }

  // Активация/деактивация организации
  async setActiveStatus(id: string, isActive: boolean): Promise<Organization | null> {
    return this.organizationModel
      .findByIdAndUpdate(
        id,
        { isActive },
        { new: true },
      )
      .exec();
  }

  // Получение всех активных организаций
  async findAllActive(): Promise<Organization[]> {
    return this.organizationModel
      .find({ isActive: true, deletedAt: null })
      .exec();
  }

  // Проверка существования организации по ID
  async exists(id: string): Promise<boolean> {
    const count = await this.organizationModel
      .countDocuments({ _id: id, deletedAt: null })
      .exec();
    return count > 0;
  }
}