import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Agriculture platform tables
    farms: defineTable({
      name: v.string(),
      ownerId: v.id("users"),
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
      area: v.number(), // in hectares
      description: v.optional(v.string()),
    }).index("by_owner", ["ownerId"]),

    fields: defineTable({
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
    }).index("by_farm", ["farmId"]),

    sensorReadings: defineTable({
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
      timestamp: v.number(),
      location: v.optional(v.object({
        lat: v.number(),
        lng: v.number(),
      })),
    }).index("by_field_and_type", ["fieldId", "sensorType"])
      .index("by_field_and_timestamp", ["fieldId", "timestamp"]),

    spectralData: defineTable({
      fieldId: v.id("fields"),
      imageUrl: v.string(),
      captureDate: v.number(),
      indices: v.object({
        ndvi: v.number(),
        evi: v.number(),
        savi: v.number(),
        gndvi: v.number(),
      }),
      processingStatus: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      ),
      metadata: v.optional(v.object({
        resolution: v.number(),
        bands: v.array(v.string()),
        cloudCover: v.number(),
      })),
    }).index("by_field", ["fieldId"])
      .index("by_field_and_date", ["fieldId", "captureDate"]),

    alerts: defineTable({
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
      acknowledgedBy: v.optional(v.id("users")),
      acknowledgedAt: v.optional(v.number()),
      resolved: v.boolean(),
      resolvedAt: v.optional(v.number()),
    }).index("by_field", ["fieldId"])
      .index("by_field_and_severity", ["fieldId", "severity"]),

    processingJobs: defineTable({
      fieldId: v.id("fields"),
      type: v.union(
        v.literal("spectral_analysis"),
        v.literal("risk_assessment"),
        v.literal("yield_prediction"),
        v.literal("report_generation")
      ),
      status: v.union(
        v.literal("queued"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed")
      ),
      progress: v.number(), // 0-100
      startedAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      logs: v.array(v.string()),
      result: v.optional(v.any()),
    }).index("by_field", ["fieldId"])
      .index("by_status", ["status"]),

    reports: defineTable({
      fieldId: v.id("fields"),
      generatedBy: v.id("users"),
      title: v.string(),
      type: v.union(
        v.literal("health_assessment"),
        v.literal("yield_forecast"),
        v.literal("pest_analysis"),
        v.literal("irrigation_plan")
      ),
      dateRange: v.object({
        start: v.number(),
        end: v.number(),
      }),
      fileUrl: v.optional(v.string()),
      data: v.any(),
    }).index("by_field", ["fieldId"])
      .index("by_user", ["generatedBy"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;