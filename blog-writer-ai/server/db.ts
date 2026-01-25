import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  articles,
  InsertArticle,
  articleSections,
  InsertArticleSection,
  outlineProposals,
  aiConversations,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Article queries
 */
export async function createArticle(
  userId: number,
  theme: string,
  title: string,
  persona?: string,
  tone?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(articles).values({
    userId,
    theme,
    title,
    persona,
    tone,
    status: "draft",
    currentStep: 1,
  });

  return result;
}

export async function getArticleById(articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);

  return result[0];
}

export async function getUserArticles(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(articles).where(eq(articles.userId, userId));
}

export async function updateArticle(
  articleId: number,
  updates: Partial<InsertArticle>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(articles).set(updates).where(eq(articles.id, articleId));
}

/**
 * Article Section queries
 */
export async function createSection(
  articleId: number,
  heading: string,
  headingLevel: number,
  order: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(articleSections).values({
    articleId,
    heading,
    headingLevel,
    order,
    status: "pending",
  });

  return result;
}

export async function getArticleSections(articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(articleSections)
    .where(eq(articleSections.articleId, articleId))
    .orderBy(articleSections.order);
}

export async function updateSection(
  sectionId: number,
  updates: Partial<InsertArticleSection>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(articleSections)
    .set(updates)
    .where(eq(articleSections.id, sectionId));
}

/**
 * Outline Proposal queries
 */
export async function createOutlineProposal(
  articleId: number,
  proposalIndex: number,
  outline: string,
  reasoning?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(outlineProposals).values({
    articleId,
    proposalIndex,
    outline,
    reasoning,
  });
}

export async function getOutlineProposals(articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(outlineProposals)
    .where(eq(outlineProposals.articleId, articleId));
}

/**
 * AI Conversation queries
 */
export async function addConversation(
  articleId: number,
  role: "system" | "user" | "assistant",
  content: string,
  sectionId?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(aiConversations).values({
    articleId,
    sectionId,
    role,
    content,
  });
}

export async function getConversationHistory(articleId: number, sectionId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (sectionId) {
    return db
      .select()
      .from(aiConversations)
      .where(
        eq(aiConversations.articleId, articleId) &&
        eq(aiConversations.sectionId, sectionId)
      )
      .orderBy(aiConversations.createdAt);
  }

  return db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.articleId, articleId))
    .orderBy(aiConversations.createdAt);
}
