import { Module } from '@nestjs/common';
import { ProjectModule } from './project/module';
import { UserModule } from './user/module';
import { AuthModule } from './auth/module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ProjectModule,
  ],
})
export class AppModule {}
