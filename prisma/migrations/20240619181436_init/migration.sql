-- CreateTable
CREATE TABLE "Landlord" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Landlord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareHouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "landlordId" TEXT NOT NULL,
    "assignmentSheetId" TEXT NOT NULL,

    CONSTRAINT "ShareHouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RotationAssignment" (
    "id" TEXT NOT NULL,
    "shareHouseId" TEXT NOT NULL,
    "rotationCycle" INTEGER NOT NULL,

    CONSTRAINT "RotationAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSheet" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "assignedData" JSONB NOT NULL,

    CONSTRAINT "AssignmentSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "rotationAssignmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extraAssignedCount" INTEGER NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantPlaceholder" (
    "index" INTEGER NOT NULL,
    "rotationAssignmentId" TEXT NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "TenantPlaceholder_pkey" PRIMARY KEY ("rotationAssignmentId","index")
);

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_email_key" ON "Landlord"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShareHouse_assignmentSheetId_key" ON "ShareHouse"("assignmentSheetId");

-- CreateIndex
CREATE UNIQUE INDEX "RotationAssignment_shareHouseId_key" ON "RotationAssignment"("shareHouseId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");

-- AddForeignKey
ALTER TABLE "ShareHouse" ADD CONSTRAINT "ShareHouse_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "Landlord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareHouse" ADD CONSTRAINT "ShareHouse_assignmentSheetId_fkey" FOREIGN KEY ("assignmentSheetId") REFERENCES "AssignmentSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RotationAssignment" ADD CONSTRAINT "RotationAssignment_shareHouseId_fkey" FOREIGN KEY ("shareHouseId") REFERENCES "ShareHouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_rotationAssignmentId_fkey" FOREIGN KEY ("rotationAssignmentId") REFERENCES "RotationAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantPlaceholder" ADD CONSTRAINT "TenantPlaceholder_rotationAssignmentId_fkey" FOREIGN KEY ("rotationAssignmentId") REFERENCES "RotationAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantPlaceholder" ADD CONSTRAINT "TenantPlaceholder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
