import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createArticle,
  getUserArticles,
  getArticleById,
  updateArticle,
  createSection,
  getArticleSections,
  updateSection,
  createOutlineProposal,
  getOutlineProposals,
  addConversation,
  getConversationHistory,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  blog: router({
    // Step 1: Create new article with theme and persona/tone
    createArticle: protectedProcedure
      .input(
        z.object({
          theme: z.string().min(1),
          title: z.string().min(1),
          persona: z.string().optional(),
          tone: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await createArticle(
          ctx.user.id,
          input.theme,
          input.title,
          input.persona,
          input.tone
        );
        return result;
      }),

    // Get user's articles
    listArticles: protectedProcedure.query(async ({ ctx }) => {
      return getUserArticles(ctx.user.id);
    }),

    // Get article details
    getArticle: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        return getArticleById(input.articleId);
      }),

    // Update article
    updateArticleData: protectedProcedure
      .input(
        z.object({
          articleId: z.number(),
          updates: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.updates) {
          await updateArticle(input.articleId, input.updates as Partial<any>);
        }
        return { success: true };
      }),

    // Step 2: Generate outline proposals
    generateOutlineProposals: protectedProcedure
      .input(
        z.object({
          articleId: z.number(),
          theme: z.string(),
          persona: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // TODO: Implement LLM call to generate outline proposals
        return { proposals: [] };
      }),

    // Get outline proposals
    getOutlineProposals: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        return getOutlineProposals(input.articleId);
      }),

    // Select outline
    selectOutline: protectedProcedure
      .input(
        z.object({
          articleId: z.number(),
          proposalId: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        // TODO: Mark proposal as selected and create sections
        return { success: true };
      }),

    // Step 3: Get article sections
    getSections: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => {
        return getArticleSections(input.articleId);
      }),

    // Update section order (drag & drop)
    updateSectionOrder: protectedProcedure
      .input(
        z.object({
          articleId: z.number(),
          sections: z.array(
            z.object({
              id: z.number(),
              order: z.number(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        // TODO: Update section orders
        return { success: true };
      }),

    // Step 4: Generate section content
    generateSection: protectedProcedure
      .input(
        z.object({
          articleId: z.number(),
          sectionId: z.number(),
          instructions: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // TODO: Implement LLM call to generate section content
        return { content: "" };
      }),

    // Update section content
    updateSection: protectedProcedure
      .input(
        z.object({
          sectionId: z.number(),
          content: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await updateSection(input.sectionId, { content: input.content });
        return { success: true };
      }),

    // Step 5: Publish to WordPress
    publishToWordPress: protectedProcedure
      .input(
        z.object({
          articleId: z.number(),
          wordpressUrl: z.string(),
          wordpressUsername: z.string(),
          wordpressPassword: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // TODO: Implement WordPress REST API call
        return { success: true, postId: "" };
      }),
  }),
});

export type AppRouter = typeof appRouter;
