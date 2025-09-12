import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getFieldMapDetails = query({
  args: { fieldId: v.id("fields") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const field = await ctx.db.get(args.fieldId);
    if (!field) return null;

    const farm = await ctx.db.get(field.farmId);
    if (!farm || farm.ownerId !== user._id) return null;

    const latestSpectral = await ctx.db
      .query("spectralData")
      .withIndex("by_field_and_date", (q) =>
        q.eq("fieldId", args.fieldId)
      )
      .order("desc")
      .take(1);

    return {
      farmBoundingBox: farm.boundingBox,
      fieldGeometry: field.geometry,
      cropType: field.cropType,
      area: field.area,
      latestSpectral: latestSpectral[0] ?? null,
    };
  },
});
