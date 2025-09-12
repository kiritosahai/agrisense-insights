import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface AlertsPanelProps {
  fieldId: Id<"fields">;
  alerts: Doc<"alerts">[];
  expanded?: boolean;
}

export default function AlertsPanel({ fieldId, alerts, expanded = false }: AlertsPanelProps) {
  const acknowledgeAlert = useMutation(api.alerts.acknowledgeAlert);
  const resolveAlert = useMutation(api.alerts.resolveAlert);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "pest_risk":
      case "disease_risk":
        return <AlertTriangle className="h-4 w-4" />;
      case "drought_stress":
      case "irrigation_needed":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleAcknowledge = async (alertId: Id<"alerts">) => {
    try {
      await acknowledgeAlert({ alertId });
      toast.success("Alert acknowledged");
    } catch (error) {
      toast.error("Failed to acknowledge alert");
    }
  };

  const handleResolve = async (alertId: Id<"alerts">) => {
    try {
      await resolveAlert({ alertId });
      toast.success("Alert resolved");
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  const displayAlerts = expanded ? alerts : alerts.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts
          </div>
          <Badge variant={alerts.length > 0 ? "destructive" : "secondary"}>
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>No active alerts</p>
            <p className="text-sm">All systems are running normally</p>
          </div>
        ) : (
          displayAlerts.map((alert) => (
            <div
              key={alert._id}
              className="p-4 border rounded-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(alert._creationTime), 'MMM dd, HH:mm')}
                      </div>
                      {alert.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Location
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!alert.acknowledgedBy && !alert.resolved && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAcknowledge(alert._id)}
                  >
                    Acknowledge
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleResolve(alert._id)}
                  >
                    Resolve
                  </Button>
                </div>
              )}

              {alert.acknowledgedBy && !alert.resolved && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Acknowledged
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleResolve(alert._id)}
                  >
                    Resolve
                  </Button>
                </div>
              )}

              {alert.resolved && (
                <Badge variant="outline" className="text-xs text-green-600">
                  Resolved
                </Badge>
              )}
            </div>
          ))
        )}

        {!expanded && alerts.length > 3 && (
          <Button variant="outline" className="w-full">
            View All Alerts ({alerts.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
