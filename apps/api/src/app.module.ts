import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ActividadesModule } from './actividades/actividades.module';
import { TurnosModule } from './turnos/turnos.module';
import { ReservaModule } from './reservas/reserva.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    PrismaModule,
    UsuariosModule,
    AuthModule,
    ActividadesModule,
    TurnosModule,
    ReservaModule,
  ],
  providers: [],
})
export class AppModule {}