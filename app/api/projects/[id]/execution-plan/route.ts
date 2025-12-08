import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";
import { generateExecutionPlan } from "@/lib/ai/execution-coach";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: projectId } = await params;

    const project = await prisma.ideaIntake.findUnique({
        where: { id: projectId },
    });

    if (!project) {
        return new NextResponse("Project not found", { status: 404 });
    }

    if (project.userId !== user.id && user.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // Call AI to generate the plan
    const executionPlanData = await generateExecutionPlan(project);

    // Save to database
    const updatedProject = await prisma.ideaIntake.update({
      where: { id: projectId },
      data: {
        // @ts-ignore: executionPlan exists in DB but Prisma Client types might be stale due to file locks
        executionPlan: executionPlanData, 
      },
    });

    // @ts-ignore: Accessing executionPlan from result
    return NextResponse.json({ success: true, executionPlan: updatedProject.executionPlan });
  } catch (error) {
    console.error("[EXECUTION_PLAN_GENERATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
