-- CreateTable
CREATE TABLE "IdeaIntake" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ideaOneLiner" TEXT NOT NULL,
    "mainNeed" TEXT NOT NULL,
    "budgetAndTimeline" TEXT NOT NULL,
    "extraInfo" TEXT,
    "contact" TEXT NOT NULL,

    CONSTRAINT "IdeaIntake_pkey" PRIMARY KEY ("id")
);
