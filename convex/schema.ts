import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  resumes: defineTable({
    user: v.string(),
    fileName: v.string(),
    resumeUrl: v.string(),
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
});
