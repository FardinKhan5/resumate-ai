import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const saveReport = mutation({
  args: {
    user: v.string(),
    report: v.object({
      overall_score: v.number(),
      quick_verdict: v.string(),
      strengths: v.array(v.string()),
      improvements: v.array(v.string()),
      section_breakdown: v.any(),
      recommendations: v.array(v.string()),
      motivational_message: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { user } = args;
    await ctx.db.insert('history', { user, ...args.report });
  },
});
