import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateMockData = mutation({
  args: { farmId: v.id("farms") },
  handler: async (ctx, args) => {
    // Create sample fields
    const field1 = await ctx.db.insert("fields", {
      farmId: args.farmId,
      name: "North Field",
      geometry: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.7138, lng: -74.0060 },
        { lat: 40.7138, lng: -74.0040 },
        { lat: 40.7128, lng: -74.0040 },
      ],
      cropType: "Corn",
      plantingDate: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
      expectedHarvest: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
      area: 25.5,
    });

    const field2 = await ctx.db.insert("fields", {
      farmId: args.farmId,
      name: "South Field",
      geometry: [
        { lat: 40.7108, lng: -74.0060 },
        { lat: 40.7118, lng: -74.0060 },
        { lat: 40.7118, lng: -74.0040 },
        { lat: 40.7108, lng: -74.0040 },
      ],
      cropType: "Soybeans",
      plantingDate: Date.now() - 85 * 24 * 60 * 60 * 1000,
      expectedHarvest: Date.now() + 75 * 24 * 60 * 60 * 1000,
      area: 18.2,
    });

    // Generate sensor readings for the last 30 days
    const sensorTypes = ["soil_moisture", "temperature", "humidity", "leaf_wetness"];
    const fields = [field1, field2];

    for (const fieldId of fields) {
      for (let day = 0; day < 30; day++) {
        const timestamp = Date.now() - day * 24 * 60 * 60 * 1000;
        
        for (const sensorType of sensorTypes) {
          let value, unit;
          
          switch (sensorType) {
            case "soil_moisture":
              value = 30 + Math.random() * 40; // 30-70%
              unit = "%";
              break;
            case "temperature":
              value = 20 + Math.random() * 15; // 20-35°C
              unit = "°C";
              break;
            case "humidity":
              value = 40 + Math.random() * 40; // 40-80%
              unit = "%";
              break;
            case "leaf_wetness":
              value = Math.random() * 100; // 0-100%
              unit = "%";
              break;
            default:
              value = 0;
              unit = "";
          }

          await ctx.db.insert("sensorReadings", {
            fieldId,
            sensorType: sensorType as any,
            value,
            unit,
            timestamp,
          });
        }
      }
    }

    // Create some sample alerts
    await ctx.db.insert("alerts", {
      fieldId: field1,
      type: "irrigation_needed",
      severity: "medium",
      title: "Low Soil Moisture Detected",
      description: "Soil moisture levels have dropped below optimal range in the north section.",
      resolved: false,
    });

    await ctx.db.insert("alerts", {
      fieldId: field2,
      type: "pest_risk",
      severity: "high",
      title: "Pest Activity Detected",
      description: "Increased pest activity detected based on spectral analysis.",
      resolved: false,
    });

    // Create spectral data entries
    await ctx.db.insert("spectralData", {
      fieldId: field1,
      imageUrl: "https://example.com/spectral1.tif",
      captureDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
      indices: {
        ndvi: 0.75,
        evi: 0.68,
        savi: 0.72,
        gndvi: 0.71,
      },
      processingStatus: "completed",
      metadata: {
        resolution: 10,
        bands: ["Red", "Green", "Blue", "NIR"],
        cloudCover: 5,
      },
    });

    return { success: true, fieldsCreated: 2 };
  },
});
