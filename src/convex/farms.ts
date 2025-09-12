import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createFarm = mutation({
  args: {
    name: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    boundingBox: v.object({
      north: v.number(),
      south: v.number(),
      east: v.number(),
      west: v.number(),
    }),
    cropType: v.string(),
    area: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    return await ctx.db.insert("farms", {
      ...args,
      ownerId: user._id,
    });
  },
});

export const getUserFarms = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("farms")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

export const getFarmById = query({
  args: { farmId: v.id("farms") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const farm = await ctx.db.get(args.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error("Farm not found or access denied");
    }

    return farm;
  },
});

export const updateFarm = mutation({
  args: {
    farmId: v.id("farms"),
    name: v.optional(v.string()),
    cropType: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const farm = await ctx.db.get(args.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error("Farm not found or access denied");
    }

    const { farmId, ...updates } = args;
    return await ctx.db.patch(farmId, updates);
  },
});
