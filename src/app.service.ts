import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

  async getGlobalStatistics() {
    const [totalUsers, activeUsers] = await Promise.all([
      this.usersService.getTotalCount(),
      this.usersService.getActiveCount(),
    ]);

    return {
      totalUsers,
      activeUsers,
      serverTime: new Date().toISOString(),
    };
  }
}
