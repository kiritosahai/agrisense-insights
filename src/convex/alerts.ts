import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createAlert = mutation({
  args: {
    fieldId: v.id("fields"),
    type: v.union(
      v.literal("pest_risk"),
      v.literal("disease_risk"),
      v.literal("drought_stress"),
      v.literal("nutrient_deficiency"),
      v.literal("irrigation_needed"),
      v.literal("harvest_ready")
    ),
    severity: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    title: v.string(),
    description: v.string(),
    location: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      ...args,
      resolved: false,
    });
  },
});

export const getFieldAlerts = query({
  args: { 
    fieldId: v.id("fields"),
    includeResolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    // Verify field access
    const field = await ctx.db.get(args.fieldId);
    if (!field) {
      return [];
    }

    const farm = await ctx.db.get(field.farmId);
    if (!farm || farm.ownerId !== user._id) {
      return [];
    }

    let alerts = await ctx.db
      .query("alerts")
      .withIndex("by_field", (q) => q.eq("fieldId", args.fieldId))
      .collect();

    if (!args.includeResolved) {
      alerts = alerts.filter(alert => !alert.resolved);
    }

    return alerts.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const acknowledgeAlert = mutation({
  args: { alertId: v.id("alerts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const alert = await ctx.db.get(args.alertId);
    if (!alert) {
      throw new Error("Alert not found");
    }

    // Verify field access
    const field = await ctx.db.get(alert.fieldId);
    if (!field) {
      throw new Error("Field not found");
    }

    const farm = await ctx.db.get(field.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error("Access denied");
    }

    return await ctx.db.patch(args.alertId, {
      acknowledgedBy: user._id,
      acknowledgedAt: Date.now(),
    });
  },
});

export const resolveAlert = mutation({
  args: { alertId: v.id("alerts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const alert = await ctx.db.get(args.alertId);
    if (!alert) {
      throw new Error("Alert not found");
    }

    // Verify field access
    const field = await ctx.db.get(alert.fieldId);
    if (!field) {
      throw new Error("Field not found");
    }

    const farm = await ctx.db.get(field.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error("Access denied");
    }

    return await ctx.db.patch(args.alertId, {
      resolved: true,
      resolvedAt: Date.now(),
    });
  },
});
