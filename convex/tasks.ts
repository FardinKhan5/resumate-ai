import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const generateResumeUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getResumeUrl = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    return ctx.storage.getUrl(args.storageId);
  },
});

export const saveResume = mutation({
  args: {
    user: v.string(),
    fileName: v.string(),
    resumeUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('resumes', {
      user: args.user,
      fileName: args.fileName,
      resumeUrl: args.resumeUrl,
    });
  },
});

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
    return await ctx.db.insert('history', { user, ...args.report });
  },
});

export const getReport = query({
  args: {
    reportId: v.id('history'),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    return report;
  },
});
