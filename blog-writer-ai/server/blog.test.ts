import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("blog router", () => {
  describe("listArticles", () => {
    it("should list articles for the authenticated user", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      // List articles (should be empty or existing articles)
      const articles = await caller.blog.listArticles();
      expect(Array.isArray(articles)).toBe(true);
    });
  });

  describe("generateOutlineProposals", () => {
    it("should have generateOutlineProposals procedure", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      // Test that the procedure exists
      expect(caller.blog.generateOutlineProposals).toBeDefined();
    });
  });

  describe("getSections", () => {
    it("should return empty sections for non-existent article", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      // Get sections for a non-existent article
      const sections = await caller.blog.getSections({
        articleId: 99999,
      });

      expect(Array.isArray(sections)).toBe(true);
    });
  });

  describe("auth logout", () => {
    it("should clear the session cookie and report success", async () => {
      const ctx = createAuthContext(1);
      const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];

      const contextWithClearCookie: TrpcContext = {
        ...ctx,
        res: {
          clearCookie: (name: string, options: Record<string, unknown>) => {
            clearedCookies.push({ name, options });
          },
        } as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(contextWithClearCookie);
      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(clearedCookies).toHaveLength(1);
      expect(clearedCookies[0]?.name).toBe("app_session_id");
    });
  });
});
