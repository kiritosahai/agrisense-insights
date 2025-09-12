import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const addSensorReading = mutation({
  args: {
    fieldId: v.id("fields"),
    sensorType: v.union(
      v.literal("soil_moisture"),
      v.literal("temperature"),
      v.literal("humidity"),
      v.literal("leaf_wetness"),
      v.literal("ph"),
      v.literal("nitrogen"),
      v.literal("phosphorus"),
      v.literal("potassium")
    ),
    value: v.number(),
    unit: v.string(),
    timestamp: v.optional(v.number()),
    location: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    // Verify field access
    const field = await ctx.db.get(args.fieldId);
    if (!field) {
      throw new Error("Field not found");
    }

    const farm = await ctx.db.get(field.farmId);
    if (!farm || farm.ownerId !== user._id) {
      throw new Error("Access denied");
    }

    return await ctx.db.insert("sensorReadings", {
      ...args,
      timestamp: args.timestamp || Date.now(),
    });
  },
});

export const getSensorReadings = query({
  args: {
    fieldId: v.id("fields"),
    sensorType: v.optional(v.union(
      v.literal("soil_moisture"),
      v.literal("temperature"),
      v.literal("humidity"),
      v.literal("leaf_wetness"),
      v.literal("ph"),
      v.literal("nitrogen"),
      v.literal("phosphorus"),
      v.literal("potassium")
    )),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
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

    // Build and execute query without reassigning different query types
    const readings = args.sensorType
      ? await ctx.db
          .query("sensorReadings")
          .withIndex("by_field_and_type", (q) =>
            q.eq("fieldId", args.fieldId).eq("sensorType", args.sensorType!)
          )
          .collect()
      : await ctx.db
          .query("sensorReadings")
          .withIndex("by_field_and_timestamp", (q) =>
            q.eq("fieldId", args.fieldId)
          )
          .collect();

    // Filter by date range if provided
    const filtered = (args.startDate || args.endDate)
      ? readings.filter((reading) => {
          if (args.startDate && reading.timestamp < args.startDate) return false;
          if (args.endDate && reading.timestamp > args.endDate) return false;
          return true;
        })
      : readings;

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  },
});

export const getLatestSensorReadings = query({
  args: { fieldId: v.id("fields") },
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

    const sensorTypes = [
      "soil_moisture", "temperature", "humidity", "leaf_wetness",
      "ph", "nitrogen", "phosphorus", "potassium"
    ];

    const latestReadings = [];

    for (const sensorType of sensorTypes) {
      const readings = await ctx.db
        .query("sensorReadings")
        .withIndex("by_field_and_type", (q) => 
          q.eq("fieldId", args.fieldId).eq("sensorType", sensorType as any)
        )
        .order("desc")
        .take(1);

      if (readings.length > 0) {
        latestReadings.push(readings[0]);
      }
    }

    return latestReadings;
  },
});