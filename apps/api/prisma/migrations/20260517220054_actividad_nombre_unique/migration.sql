/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `TipoActividad` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TipoActividad_nombre_key" ON "TipoActividad"("nombre");
