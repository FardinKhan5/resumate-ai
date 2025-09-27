import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  resumes: defineTable({
    user: v.string(),
    fileName: v.string(),
    resumeUrl: v.string(),
    usedFor: v.union(
      v.literal('none'),
      v.literal('Resume Review'),
      v.literal('Job-Fit Analysis'),
      v.literal('Interview Prep')
    ),
  }),

  reports: defineTable({
    resume: v.id('resumes'),
    user: v.string(),
    overall_score: v.number(),
    quick_verdict: v.string(),
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    section_breakdown: v.any(),
    recommendations: v.array(v.string()),
    motivational_message: v.string(),
  }),

  jobFitReports: defineTable({
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
  }),

  interviewPrep: defineTable({
    resume: v.id('resumes'),
    user: v.string(),
    general_questions: v.array(v.string()),
    technical_questions: v.array(v.string()),
    behavioral_questions: v.array(v.string()),
    tips: v.array(v.string()),
  }),
});
