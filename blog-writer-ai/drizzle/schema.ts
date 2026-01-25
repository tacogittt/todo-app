import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog Article table: Stores the main article metadata and state
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  theme: text("theme").notNull(), // Original theme input by user
  persona: varchar("persona", { length: 100 }), // e.g., "gentle_teacher", "business_expert"
  tone: varchar("tone", { length: 100 }), // e.g., "casual", "professional"
  status: mysqlEnum("status", ["draft", "in_progress", "completed", "published"]).default("draft").notNull(),
  currentStep: int("currentStep").default(1).notNull(), // 1-5: which step user is on
  outline: text("outline"), // JSON: array of headings with structure
  seoMetadata: text("seoMetadata"), // JSON: SEO keywords, description, etc.
  wordpressPostId: varchar("wordpressPostId", { length: 100 }), // WordPress post ID after publishing
  wordpressUrl: varchar("wordpressUrl", { length: 500 }), // WordPress post URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Article Section table: Stores individual sections of the article
 */
export const articleSections = mysqlTable("articleSections", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull().references(() => articles.id, { onDelete: "cascade" }),
  headingLevel: int("headingLevel").notNull(), // 2 for H2, 3 for H3, etc.
  heading: varchar("heading", { length: 255 }).notNull(),
  order: int("order").notNull(), // Position in the article
  content: text("content"), // Generated or edited section content
  aiGenerated: text("aiGenerated"), // Original AI-generated content (for comparison)
  status: mysqlEnum("status", ["pending", "generated", "edited", "approved"]).default("pending").notNull(),
  wordCount: int("wordCount").default(0),
  imageUrl: varchar("imageUrl", { length: 500 }), // DALL-E generated image URL
  hallucination_check: text("hallucination_check"), // JSON: fact-check results
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ArticleSection = typeof articleSections.$inferSelect;
export type InsertArticleSection = typeof articleSections.$inferInsert;

/**
 * Outline Proposal table: Stores multiple outline proposals for user selection
 */
export const outlineProposals = mysqlTable("outlineProposals", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull().references(() => articles.id, { onDelete: "cascade" }),
  proposalIndex: int("proposalIndex").notNull(), // 1st, 2nd, 3rd proposal
  outline: text("outline").notNull(), // JSON: array of headings
  reasoning: text("reasoning"), // Why this outline is good (SEO, user intent, etc.)
  selected: int("selected").default(0), // 1 if user selected this outline
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OutlineProposal = typeof outlineProposals.$inferSelect;
export type InsertOutlineProposal = typeof outlineProposals.$inferInsert;

/**
 * AI Conversation History table: Stores chat history for context maintenance
 */
export const aiConversations = mysqlTable("aiConversations", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull().references(() => articles.id, { onDelete: "cascade" }),
  sectionId: int("sectionId").references(() => articleSections.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["system", "user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertAiConversation = typeof aiConversations.$inferInsert;