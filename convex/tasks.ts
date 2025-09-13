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
    resume: v.id('resumes'),
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
    const { resume, user, report } = args;
    return await ctx.db.insert('reports', { resume, user, ...report });
  },
});

export const getReport = query({
  args: {
    reportId: v.id('reports'),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    return report;
  },
});

export const getResumes = query({
  args: {
    user: v.string(),
  },
  handler: async (ctx, args) => {
    const resumes = await ctx.db
      .query('resumes')
      .filter((q) => q.eq(q.field('user'), args.user))
      .order('desc')
      .take(100);
    return resumes;
  },
});

export const getReportOfResume = query({
  args: {
    resumeId: v.id('resumes'),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db
      .query('reports')
      .filter((q) => q.eq(q.field('resume'), args.resumeId))
      .take(1);
    return report;
  },
});
