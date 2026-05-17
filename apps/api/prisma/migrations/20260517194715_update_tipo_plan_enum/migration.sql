/*
  Warnings:

  - The values [OBRA_SOCIAL,PREPAGA] on the enum `TipoPlan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoPlan_new" AS ENUM ('PARTICULAR', 'FIJO');
ALTER TABLE "Paciente" ALTER COLUMN "tipo_plan" TYPE "TipoPlan_new" USING ("tipo_plan"::text::"TipoPlan_new");
ALTER TABLE "ListaEspera" ALTER COLUMN "tipo_plan" TYPE "TipoPlan_new" USING ("tipo_plan"::text::"TipoPlan_new");
ALTER TYPE "TipoPlan" RENAME TO "TipoPlan_old";
ALTER TYPE "TipoPlan_new" RENAME TO "TipoPlan";
DROP TYPE "public"."TipoPlan_old";
COMMIT;
