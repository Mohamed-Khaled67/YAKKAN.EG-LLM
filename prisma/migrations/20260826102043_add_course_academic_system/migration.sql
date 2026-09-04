-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "EducationType" AS ENUM ('UNIVERSITY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('FIRST', 'SECOND');

-- CreateEnum
CREATE TYPE "AcademicLevel" AS ENUM ('UNIVERSITY_LEVEL_1', 'UNIVERSITY_LEVEL_2', 'UNIVERSITY_LEVEL_3', 'UNIVERSITY_LEVEL_4', 'SECONDARY_GRADE_1', 'SECONDARY_GRADE_2', 'SECONDARY_GRADE_3');

-- CreateEnum
CREATE TYPE "SecondaryTrack" AS ENUM ('SCIENCE', 'LITERARY', 'SCIENCE_SCIENCES', 'SCIENCE_MATH');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mediaUrl" TEXT,
    "mediaKey" TEXT,
    "mediaType" "MediaType",
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "educationType" "EducationType" NOT NULL,
    "academicLevel" "AcademicLevel" NOT NULL,
    "semester" "Semester" NOT NULL,
    "secondaryTrack" "SecondaryTrack",
    "subjectId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Course_educationType_idx" ON "Course"("educationType");

-- CreateIndex
CREATE INDEX "Course_academicLevel_idx" ON "Course"("academicLevel");

-- CreateIndex
CREATE INDEX "Course_semester_idx" ON "Course"("semester");

-- CreateIndex
CREATE INDEX "Course_secondaryTrack_idx" ON "Course"("secondaryTrack");

-- CreateIndex
CREATE INDEX "Course_subjectId_idx" ON "Course"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
