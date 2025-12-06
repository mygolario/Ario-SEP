-- CreateTable
CREATE TABLE "LandingPagePlan" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandingPagePlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingPagePlan_projectId_key" ON "LandingPagePlan"("projectId");

-- AddForeignKey
ALTER TABLE "LandingPagePlan" ADD CONSTRAINT "LandingPagePlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
