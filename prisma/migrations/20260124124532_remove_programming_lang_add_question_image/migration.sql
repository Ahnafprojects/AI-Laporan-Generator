-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "class" TEXT,
    "practiceDate" TIMESTAMP(3) NOT NULL,
    "lecturer" TEXT,
    "codeContent" TEXT,
    "labSheet" TEXT NOT NULL,
    "questionImage" TEXT,
    "fileName" TEXT,
    "additionalNotes" TEXT,
    "generatedReport" TEXT NOT NULL,
    "templateStyle" TEXT NOT NULL DEFAULT 'formal',
    "aiModel" TEXT NOT NULL DEFAULT 'gemini-pro',

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_studentId_idx" ON "Report"("studentId");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");
