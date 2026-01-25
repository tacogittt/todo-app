CREATE TABLE `aiConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`sectionId` int,
	`role` enum('system','user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `articleSections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`headingLevel` int NOT NULL,
	`heading` varchar(255) NOT NULL,
	`order` int NOT NULL,
	`content` text,
	`aiGenerated` text,
	`status` enum('pending','generated','edited','approved') NOT NULL DEFAULT 'pending',
	`wordCount` int DEFAULT 0,
	`imageUrl` varchar(500),
	`hallucination_check` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articleSections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`theme` text NOT NULL,
	`persona` varchar(100),
	`tone` varchar(100),
	`status` enum('draft','in_progress','completed','published') NOT NULL DEFAULT 'draft',
	`currentStep` int NOT NULL DEFAULT 1,
	`outline` text,
	`seoMetadata` text,
	`wordpressPostId` varchar(100),
	`wordpressUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `outlineProposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`proposalIndex` int NOT NULL,
	`outline` text NOT NULL,
	`reasoning` text,
	`selected` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `outlineProposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `aiConversations` ADD CONSTRAINT `aiConversations_articleId_articles_id_fk` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `aiConversations` ADD CONSTRAINT `aiConversations_sectionId_articleSections_id_fk` FOREIGN KEY (`sectionId`) REFERENCES `articleSections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `articleSections` ADD CONSTRAINT `articleSections_articleId_articles_id_fk` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `articles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `outlineProposals` ADD CONSTRAINT `outlineProposals_articleId_articles_id_fk` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;