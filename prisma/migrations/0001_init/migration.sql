-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'STAFF') NOT NULL DEFAULT 'ADMIN',
    `mustChangePassword` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `businessName` VARCHAR(191) NOT NULL DEFAULT 'Laundry Anda',
    `tagline` VARCHAR(191) NOT NULL DEFAULT 'Laundry Kiloan & Satuan',
    `heroTitle` VARCHAR(191) NOT NULL DEFAULT 'Cucian bersih, wangi, dan tepat waktu',
    `description` TEXT NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `faviconUrl` VARCHAR(191) NULL,
    `heroImageUrl` VARCHAR(191) NULL,
    `aboutText` TEXT NULL,
    `galleryUrls` JSON NULL,
    `address` TEXT NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `openingHours` JSON NOT NULL,
    `mapsEmbedUrl` TEXT NULL,
    `bankName` VARCHAR(191) NOT NULL DEFAULT '',
    `bankAccountName` VARCHAR(191) NOT NULL DEFAULT '',
    `bankAccountNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `primaryColor` VARCHAR(191) NOT NULL DEFAULT '#0F766E',
    `accentColor` VARCHAR(191) NOT NULL DEFAULT '#38BDF8',
    `invoiceFormat` VARCHAR(191) NOT NULL DEFAULT 'LDR-{YYYY}{MM}{DD}-{SEQ:4}',
    `seoTitle` VARCHAR(191) NOT NULL DEFAULT '',
    `seoDescription` VARCHAR(191) NOT NULL DEFAULT '',
    `foundedYear` INTEGER NULL,
    `enableDelivery` BOOLEAN NOT NULL DEFAULT true,
    `enablePickup` BOOLEAN NOT NULL DEFAULT true,
    `enableProofUpload` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `price` INTEGER NOT NULL,
    `unit` VARCHAR(191) NOT NULL DEFAULT 'kg',
    `estimatedHours` INTEGER NOT NULL DEFAULT 48,
    `imageUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNo` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `status` ENUM('RECEIVED', 'WASHING', 'IRONING', 'PACKING', 'READY', 'DONE') NOT NULL DEFAULT 'RECEIVED',
    `fulfillment` ENUM('SELF_PICKUP', 'PICKUP_BY_STORE', 'DELIVERY') NOT NULL DEFAULT 'SELF_PICKUP',
    `address` TEXT NULL,
    `notes` TEXT NULL,
    `total` INTEGER NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estimatedDoneAt` DATETIME(3) NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_invoiceNo_key`(`invoiceNo`),
    INDEX `Order_status_deletedAt_idx`(`status`, `deletedAt`),
    INDEX `Order_receivedAt_idx`(`receivedAt`),
    INDEX `Order_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `serviceName` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `unitPrice` INTEGER NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `subtotal` INTEGER NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    INDEX `OrderItem_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderStatusHistory` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `status` ENUM('RECEIVED', 'WASHING', 'IRONING', 'PACKING', 'READY', 'DONE') NOT NULL,
    `userId` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OrderStatusHistory_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('UNPAID', 'PENDING_VERIFICATION', 'PAID', 'REJECTED') NOT NULL DEFAULT 'UNPAID',
    `proofFile` VARCHAR(191) NULL,
    `rejectReason` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentHistory` (
    `id` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `status` ENUM('UNPAID', 'PENDING_VERIFICATION', 'PAID', 'REJECTED') NOT NULL,
    `note` VARCHAR(191) NULL,
    `proofFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PaymentHistory_paymentId_idx`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentVerification` (
    `id` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `result` ENUM('APPROVED', 'REJECTED') NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PaymentVerification_paymentId_idx`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceCounter` (
    `key` VARCHAR(191) NOT NULL,
    `last` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RateLimit` (
    `key` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `windowStart` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderStatusHistory` ADD CONSTRAINT `OrderStatusHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderStatusHistory` ADD CONSTRAINT `OrderStatusHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentHistory` ADD CONSTRAINT `PaymentHistory_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentVerification` ADD CONSTRAINT `PaymentVerification_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentVerification` ADD CONSTRAINT `PaymentVerification_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


-- Riwayat verifikasi pembayaran bersifat append-only: tidak boleh diubah atau dihapus.
CREATE TRIGGER `PaymentVerification_no_update` BEFORE UPDATE ON `PaymentVerification`
FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PaymentVerification bersifat immutable';

CREATE TRIGGER `PaymentVerification_no_delete` BEFORE DELETE ON `PaymentVerification`
FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PaymentVerification bersifat immutable';