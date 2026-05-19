/*
  Warnings:

  - You are about to drop the column `actividad_id` on the `Turno` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fecha,hora_inicio]` on the table `Turno` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hora_inicio` to the `Turno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoActividad_id` to the `Turno` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Turno" DROP CONSTRAINT "Turno_actividad_id_fkey";

-- AlterTable
ALTER TABLE "Turno" DROP COLUMN "actividad_id",
ADD COLUMN     "cantidad_inscriptos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hora_inicio" TIME NOT NULL,
ADD COLUMN     "tipoActividad_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Turno_fecha_hora_inicio_key" ON "Turno"("fecha", "hora_inicio");

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_tipoActividad_id_fkey" FOREIGN KEY ("tipoActividad_id") REFERENCES "TipoActividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
