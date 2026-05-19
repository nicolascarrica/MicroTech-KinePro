import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { ActividadesModule } from './actividades/actividades.module';
import { TurnosModule } from './turnos/turnos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    PrismaModule,
    UsuariosModule,
    ActividadesModule,
    TurnosModule,
  ],
})
export class AppModule {}