import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { Thermometer, Droplets, Leaf } from "lucide-react";

interface TimeSeriesPanelProps {
  fieldId: Id<"fields">;
}

export default function TimeSeriesPanel({ fieldId }: TimeSeriesPanelProps) {
  const sensorReadings = useQuery(api.sensorData.getSensorReadings, {
    fieldId,
    startDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // Last 30 days
  });

  if (!sensorReadings) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Group readings by date and sensor type
  const groupedData = sensorReadings.reduce((acc, reading) => {
    const date = format(new Date(reading.timestamp), 'MMM dd');
    
    if (!acc[date]) {
      acc[date] = { date };
    }
    
    acc[date][reading.sensorType] = reading.value;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(groupedData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sensorConfigs = [
    {
      title: "Temperature & Humidity",
      icon: <Thermometer className="h-5 w-5" />,
      sensors: [
        { key: "temperature", name: "Temperature", color: "#ef4444", unit: "°C" },
        { key: "humidity", name: "Humidity", color: "#3b82f6", unit: "%" }
      ]
    },
    {
      title: "Soil Conditions",
      icon: <Droplets className="h-5 w-5" />,
      sensors: [
        { key: "soil_moisture", name: "Soil Moisture", color: "#06b6d4", unit: "%" }
      ]
    },
    {
      title: "Plant Health",
      icon: <Leaf className="h-5 w-5" />,
      sensors: [
        { key: "leaf_wetness", name: "Leaf Wetness", color: "#22c55e", unit: "%" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sensorConfigs.map((config) => (
        <Card key={config.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {config.icon}
              {config.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {config.sensors.map((sensor) => (
                    <Line
                      key={sensor.key}
                      type="monotone"
                      dataKey={sensor.key}
                      stroke={sensor.color}
                      strokeWidth={2}
                      dot={{ fill: sensor.color, strokeWidth: 2, r: 4 }}
                      name={`${sensor.name} (${sensor.unit})`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
