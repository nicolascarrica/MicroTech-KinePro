/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefono]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capacidad` to the `Turno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Made the column `telefono` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Turno" ADD COLUMN     "capacidad" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "dni" TEXT NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_telefono_key" ON "Usuario"("telefono");
