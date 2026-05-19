import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
;

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'CLAVE_SECRETA_KINEPRO', // Usar .env en producción
      signOptions: { expiresIn: '1d' }, // El token va a expirar en 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}