import { Doc, Id } from "@/convex/_generated/dataModel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Sprout } from "lucide-react";

interface FarmSelectorProps {
  farms: Doc<"farms">[];
  selectedFarmId: Id<"farms"> | null;
  onFarmSelect: (farmId: Id<"farms">) => void;
  fields: Doc<"fields">[];
  selectedFieldId: Id<"fields"> | null;
  onFieldSelect: (fieldId: Id<"fields">) => void;
}

export default function FarmSelector({
  farms,
  selectedFarmId,
  onFarmSelect,
  fields,
  selectedFieldId,
  onFieldSelect,
}: FarmSelectorProps) {
  const selectedFarm = farms.find(f => f._id === selectedFarmId);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Select Farm</label>
        <Select
          value={selectedFarmId || ""}
          onValueChange={(value) => {
            if (value) {
              onFarmSelect(value as Id<"farms">);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a farm..." />
          </SelectTrigger>
          <SelectContent>
            {farms.map((farm) => (
              <SelectItem key={farm._id} value={farm._id}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{farm.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {farm.area} hectares • {farm.cropType}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedFarm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{selectedFarm.name}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Area: {selectedFarm.area} hectares</div>
              <div>Crop: {selectedFarm.cropType}</div>
              <div>Fields: {fields.length}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {fields.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Select Field</label>
          <Select
            value={selectedFieldId || ""}
            onValueChange={(value) => {
              if (value) {
                onFieldSelect(value as Id<"fields">);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a field..." />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field._id} value={field._id}>
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{field.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {field.area} hectares • {field.cropType}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
