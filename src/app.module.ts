import { Module } from '@nestjs/common';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
