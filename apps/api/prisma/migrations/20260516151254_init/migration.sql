-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'PACIENTE', 'KINESIOLOGO');

-- CreateEnum
CREATE TYPE "TipoPlan" AS ENUM ('PARTICULAR', 'OBRA_SOCIAL', 'PREPAGA');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('DISPONIBLE', 'RESERVADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ASISTIO', 'AUSENTE');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'MERCADOPAGO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('RECORDATORIO', 'CANCELACION_TURNO', 'PROMOCION', 'INFORMATIVA');

-- CreateEnum
CREATE TYPE "CanalNotificacion" AS ENUM ('EMAIL', 'WHATSAPP', 'SMS');

-- CreateEnum
CREATE TYPE "EstadoNotificacion" AS ENUM ('PENDIENTE', 'ENVIADA', 'ERROR');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "fecha_registro" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo_plan" "TipoPlan" NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kinesiologo" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Kinesiologo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoActividad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" SERIAL NOT NULL,
    "TipoActividad_id" INTEGER NOT NULL,
    "kinesiologo_id" INTEGER NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "fecha_desde" DATE NOT NULL,
    "fecha_hasta" DATE,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" SERIAL NOT NULL,
    "actividad_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "estado" "EstadoTurno" NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "turno_id" INTEGER NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_reserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cant_reprogramaciones" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "reserva_id" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_pago" TIMESTAMP(3),
    "comprobante" TEXT,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListaEspera" (
    "id" SERIAL NOT NULL,
    "turno_id" INTEGER NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "tipo_plan" "TipoPlan" NOT NULL,
    "posicion" INTEGER NOT NULL,
    "fecha_anotacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListaEspera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Descuento" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL,
    "motivo" TEXT NOT NULL,
    "mes_aplicable" DATE NOT NULL,
    "utilizado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Descuento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "canal" "CanalNotificacion" NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoNotificacion" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_usuario_id_key" ON "Paciente"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Kinesiologo_usuario_id_key" ON "Kinesiologo"("usuario_id");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kinesiologo" ADD CONSTRAINT "Kinesiologo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_TipoActividad_id_fkey" FOREIGN KEY ("TipoActividad_id") REFERENCES "TipoActividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad" ADD CONSTRAINT "Actividad_kinesiologo_id_fkey" FOREIGN KEY ("kinesiologo_id") REFERENCES "Kinesiologo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_reserva_id_fkey" FOREIGN KEY ("reserva_id") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaEspera" ADD CONSTRAINT "ListaEspera_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaEspera" ADD CONSTRAINT "ListaEspera_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Descuento" ADD CONSTRAINT "Descuento_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
