/*
  Warnings:

  - You are about to drop the column `projectId` on the `BrandingKit` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `DeepPlan` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `FundingRoadmap` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `LandingPagePlan` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `MarketAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `PitchDeck` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `StrategyMap` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ideaIntakeId]` on the table `BrandingKit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ideaIntakeId]` on the table `DeepPlan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ideaIntakeId]` on the table `FundingRoadmap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ideaIntakeId]` on the table `LandingPagePlan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ideaIntakeId]` on the table `MarketAnalysis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ideaIntakeId]` on the table `PitchDeck` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ideaIntakeId` to the `BrandingKit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideaIntakeId` to the `DeepPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideaIntakeId` to the `FundingRoadmap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideaIntakeId` to the `LandingPagePlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideaIntakeId` to the `MarketAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideaIntakeId` to the `PitchDeck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideaIntakeId` to the `StrategyMap` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BrandingKit" DROP CONSTRAINT "BrandingKit_projectId_fkey";

-- DropForeignKey
ALTER TABLE "DeepPlan" DROP CONSTRAINT "DeepPlan_projectId_fkey";

-- DropForeignKey
ALTER TABLE "FundingRoadmap" DROP CONSTRAINT "FundingRoadmap_projectId_fkey";

-- DropForeignKey
ALTER TABLE "LandingPagePlan" DROP CONSTRAINT "LandingPagePlan_projectId_fkey";

-- DropForeignKey
ALTER TABLE "MarketAnalysis" DROP CONSTRAINT "MarketAnalysis_projectId_fkey";

-- DropForeignKey
ALTER TABLE "PitchDeck" DROP CONSTRAINT "PitchDeck_projectId_fkey";

-- DropForeignKey
ALTER TABLE "StrategyMap" DROP CONSTRAINT "StrategyMap_projectId_fkey";

-- DropIndex
DROP INDEX "BrandingKit_projectId_key";

-- DropIndex
DROP INDEX "DeepPlan_projectId_key";

-- DropIndex
DROP INDEX "FundingRoadmap_projectId_key";

-- DropIndex
DROP INDEX "LandingPagePlan_projectId_key";

-- DropIndex
DROP INDEX "MarketAnalysis_projectId_key";

-- DropIndex
DROP INDEX "PitchDeck_projectId_key";

-- AlterTable
ALTER TABLE "BrandingKit" DROP COLUMN "projectId",
ADD COLUMN     "ideaIntakeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DeepPlan" DROP COLUMN "projectId",
ADD COLUMN     "ideaIntakeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FundingRoadmap" DROP COLUMN "projectId",
ADD COLUMN     "ideaIntakeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LandingPagePlan" DROP COLUMN "projectId",
ADD COLUMN     "ideaIntakeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MarketAnalysis" DROP COLUMN "projectId",
ADD COLUMN     "ideaIntakeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PitchDeck" DROP COLUMN "projectId",
ADD COLUMN     "ideaIntakeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StrategyMap" DROP COLUMN "projectId",
ADD COLUMN     "ideaIntakeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BrandingKit_ideaIntakeId_key" ON "BrandingKit"("ideaIntakeId");

-- CreateIndex
CREATE UNIQUE INDEX "DeepPlan_ideaIntakeId_key" ON "DeepPlan"("ideaIntakeId");

-- CreateIndex
CREATE UNIQUE INDEX "FundingRoadmap_ideaIntakeId_key" ON "FundingRoadmap"("ideaIntakeId");

-- CreateIndex
CREATE UNIQUE INDEX "LandingPagePlan_ideaIntakeId_key" ON "LandingPagePlan"("ideaIntakeId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketAnalysis_ideaIntakeId_key" ON "MarketAnalysis"("ideaIntakeId");

-- CreateIndex
CREATE UNIQUE INDEX "PitchDeck_ideaIntakeId_key" ON "PitchDeck"("ideaIntakeId");

-- AddForeignKey
ALTER TABLE "StrategyMap" ADD CONSTRAINT "StrategyMap_ideaIntakeId_fkey" FOREIGN KEY ("ideaIntakeId") REFERENCES "IdeaIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeepPlan" ADD CONSTRAINT "DeepPlan_ideaIntakeId_fkey" FOREIGN KEY ("ideaIntakeId") REFERENCES "IdeaIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandingKit" ADD CONSTRAINT "BrandingKit_ideaIntakeId_fkey" FOREIGN KEY ("ideaIntakeId") REFERENCES "IdeaIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingPagePlan" ADD CONSTRAINT "LandingPagePlan_ideaIntakeId_fkey" FOREIGN KEY ("ideaIntakeId") REFERENCES "IdeaIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketAnalysis" ADD CONSTRAINT "MarketAnalysis_ideaIntakeId_fkey" FOREIGN KEY ("ideaIntakeId") REFERENCES "IdeaIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchDeck" ADD CONSTRAINT "PitchDeck_ideaIntakeId_fkey" FOREIGN KEY ("ideaIntakeId") REFERENCES "IdeaIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingRoadmap" ADD CONSTRAINT "FundingRoadmap_ideaIntakeId_fkey" FOREIGN KEY ("ideaIntakeId") REFERENCES "IdeaIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;
