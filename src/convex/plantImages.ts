import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const savePlantImage = mutation({
  args: {
    storageId: v.id("_storage"),
    fieldId: v.optional(v.id("fields")),
    title: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("User must be authenticated");

    if (args.fieldId) {
      const field = await ctx.db.get(args.fieldId);
      if (!field) throw new Error("Field not found");

      const farm = await ctx.db.get(field.farmId);
      if (!farm || farm.ownerId !== user._id) {
        throw new Error("Access denied");
      }
    }

    const docId = await ctx.db.insert("plantImages", {
      userId: user._id,
      storageId: args.storageId,
      status: "uploaded",
      ...(args.fieldId ? { fieldId: args.fieldId } : {}),
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.notes !== undefined ? { notes: args.notes } : {}),
    });

    return docId;
  },
});

export const listForField = query({
  args: { fieldId: v.id("fields") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const field = await ctx.db.get(args.fieldId);
    if (!field) return [];

    const farm = await ctx.db.get(field.farmId);
    if (!farm || farm.ownerId !== user._id) return [];

    const docs = await ctx.db
      .query("plantImages")
      .withIndex("by_field", (q) => q.eq("fieldId", args.fieldId))
      .order("desc")
      .collect();

    // Add signed URLs so the frontend can render thumbnails
    const withUrls = await Promise.all(
      docs.map(async (d) => {
        const url = await ctx.storage.getUrl(d.storageId);
        return { ...d, fileUrl: url };
      })
    );

    return withUrls;
  },
});