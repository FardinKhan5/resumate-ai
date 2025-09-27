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
    usedFor: v.union(
      v.literal('none'),
      v.literal('Resume Review'),
      v.literal('Job-Fit Analysis'),
      v.literal('Interview Prep')
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('resumes', {
      user: args.user,
      fileName: args.fileName,
      resumeUrl: args.resumeUrl,
      usedFor: args.usedFor,
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

export const getReportIdByResume = mutation({
  args: {
    resumeId: v.id('resumes'),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db
      .query('reports')
      .filter((q) => q.eq(q.field('resume'), args.resumeId))
      .take(1);
    return report[0]._id;
  },
});

export const saveJobFitReport = mutation({
  args: {
    resume: v.id('resumes'),
    user: v.string(),
    overallScore: v.number(),
    jobMatchScore: v.number(),
    summary: v.object({
      positive: v.string(),
      improvement: v.string(),
    }),
    detailedAnalysis: v.array(
      v.object({
        category: v.string(),
        title: v.string(),
        score: v.number(),
        feedback: v.string(),
        suggestions: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { resume, user, overallScore, jobMatchScore, summary, detailedAnalysis } = args;
    return await ctx.db.insert('jobFitReports', {
      resume,
      user,
      overallScore,
      jobMatchScore,
      summary,
      detailedAnalysis,
    });
  },
});

export const getJobFitReport = query({
  args: {
    reportId: v.id('jobFitReports'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.reportId);
  },
});

export const getJobFitReportIdByResume = mutation({
  args: {
    resumeId: v.id('resumes'),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db
      .query('jobFitReports')
      .filter((q) => q.eq(q.field('resume'), args.resumeId))
      .take(1);
    return report.length > 0 ? report[0]._id : null;
  },
});

export const saveInterviewPrepQuestions = mutation({
  args: {
    resume: v.id('resumes'),
    user: v.string(),
    general_questions: v.array(v.string()),
    technical_questions: v.array(v.string()),
    behavioral_questions: v.array(v.string()),
    tips: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { resume, user, general_questions, technical_questions, behavioral_questions, tips } =
      args;
    return await ctx.db.insert('interviewPrep', {
      resume,
      user,
      general_questions,
      technical_questions,
      behavioral_questions,
      tips,
    });
  },
});

export const getInterviewPrepQuestions = query({
  args: {
    interviewPrepId: v.id('interviewPrep'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.interviewPrepId);
  },
});

export const getInterviewPrepIdByResume = mutation({
  args: {
    resumeId: v.id('resumes'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('interviewPrep')
      .filter((q) => q.eq(q.field('resume'), args.resumeId))
      .take(1);
    return result.length > 0 ? result[0]._id : null;
  },
});
