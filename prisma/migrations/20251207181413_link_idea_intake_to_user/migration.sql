-- AlterTable
ALTER TABLE "IdeaIntake" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "IdeaIntake" ADD CONSTRAINT "IdeaIntake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
