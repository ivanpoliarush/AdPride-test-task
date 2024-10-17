import { Module } from '@nestjs/common';
import { ProjectModule } from './project/module';
import { UserModule } from './user/module';
import { AuthModule } from './auth/module';

@Module({
  imports: [AuthModule, UserModule, ProjectModule],
})
export class AppModule {}
