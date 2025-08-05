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
  NotFoundException,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationSearchDto } from './dto/organization-search.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // Создание новой организации
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  // Получение организации по ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const organization = await this.organizationService.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  // Поиск организаций с фильтрами
  @Get()
  async search(@Query() searchDto: OrganizationSearchDto) {
    return this.organizationService.search(searchDto);
  }

  // Обновление организации
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const updated = await this.organizationService.update(id, updateOrganizationDto);
    if (!updated) {
      throw new NotFoundException('Organization not found');
    }
    return updated;
  }

  // Удаление организации (мягкое удаление)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const deleted = await this.organizationService.softDelete(id);
    if (!deleted) {
      throw new NotFoundException('Organization not found');
    }
  }

  // Поиск по ИНН
  @Get('inn/:inn')
  async findByInn(@Param('inn') inn: string) {
    const organization = await this.organizationService.findByInn(inn);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  // Поиск по ОГРН
  @Get('ogrn/:ogrn')
  async findByOgrn(@Param('ogrn') ogrn: string) {
    const organization = await this.organizationService.findByOgrn(ogrn);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  // Получение всех активных организаций
  @Get('active/all')
  async findAllActive() {
    return this.organizationService.findAllActive();
  }

  // Изменение статуса активности организации
  @Put(':id/status')
  async setActiveStatus(
    @Param('id') id: string,
    @Query('active') active: string,
  ) {
    const isActive = active === 'true';
    const updated = await this.organizationService.setActiveStatus(id, isActive);
    if (!updated) {
      throw new NotFoundException('Organization not found');
    }
    return updated;
  }
}