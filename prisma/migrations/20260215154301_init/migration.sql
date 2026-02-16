-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coupleName1" TEXT NOT NULL,
    "coupleName2" TEXT NOT NULL,
    "weddingDate" DATETIME NOT NULL,
    "personalMessage" TEXT NOT NULL DEFAULT '',
    "heroImageUrl" TEXT,
    "bankAccountHolder" TEXT NOT NULL,
    "bankIBAN" TEXT NOT NULL,
    "bankBIC" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "adminPasswordHash" TEXT NOT NULL,
    "siteToken" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "GiftItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "isGroupGift" BOOLEAN NOT NULL DEFAULT false,
    "targetAmount" REAL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GiftItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "giftItemId" INTEGER NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT,
    "amount" REAL NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "paymentMethod" TEXT NOT NULL DEFAULT 'wire_transfer',
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contribution_giftItemId_fkey" FOREIGN KEY ("giftItemId") REFERENCES "GiftItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_siteToken_key" ON "Settings"("siteToken");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "GiftItem_categoryId_idx" ON "GiftItem"("categoryId");

-- CreateIndex
CREATE INDEX "GiftItem_status_idx" ON "GiftItem"("status");

-- CreateIndex
CREATE INDEX "Contribution_giftItemId_idx" ON "Contribution"("giftItemId");
