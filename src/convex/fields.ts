import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createField = mutation({
  args: {
    farmId: v.id("farms"),
    name: v.string(),
    geometry: v.array(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    cropType: v.string(),
    plantingDate: v.optional(v.number()),
    expectedHarvest: v.optional(v.number()),
    area: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    // Verify farm ownership
    const farm = await ctx.db.get(args.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error("Farm not found or access denied");
    }

    return await ctx.db.insert("fields", args);
  },
});

export const getFieldsByFarm = query({
  args: { farmId: v.id("farms") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    // Verify farm ownership
    const farm = await ctx.db.get(args.farmId);
    if (!farm || farm.ownerId !== user._id) {
      return [];
    }

    return await ctx.db
      .query("fields")
      .withIndex("by_farm", (q) => q.eq("farmId", args.farmId))
      .collect();
  },
});

export const getFieldById = query({
  args: { fieldId: v.id("fields") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const field = await ctx.db.get(args.fieldId);
    if (!field) {
      throw new Error("Field not found");
    }

    // Verify farm ownership
    const farm = await ctx.db.get(field.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error("Access denied");
    }

    return field;
  },
});
