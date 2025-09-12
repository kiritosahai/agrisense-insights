import { useEffect, useRef } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface MapCanvasProps {
  fieldId: Id<"fields">;
  fields: Doc<"fields">[];
}

export default function MapCanvas({ fieldId, fields }: MapCanvasProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock map implementation - in a real app, you'd use Leaflet or Mapbox
    if (!mapRef.current) return;

    const selectedField = fields.find(f => f._id === fieldId);
    if (!selectedField) return;

    // Clear previous content
    mapRef.current.innerHTML = '';

    // Create a simple SVG representation
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 400 300");
    svg.style.background = "#f0f9ff";

    // Draw field boundary
    const points = selectedField.geometry.map((point, index) => {
      const x = 50 + (index % 2) * 300;
      const y = 50 + Math.floor(index / 2) * 200;
      return `${x},${y}`;
    }).join(" ");

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", points);
    polygon.setAttribute("fill", "#22c55e");
    polygon.setAttribute("fill-opacity", "0.3");
    polygon.setAttribute("stroke", "#16a34a");
    polygon.setAttribute("stroke-width", "2");

    svg.appendChild(polygon);

    // Add NDVI heatmap simulation
    for (let i = 0; i < 20; i++) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const x = 80 + Math.random() * 240;
      const y = 80 + Math.random() * 140;
      const ndvi = 0.3 + Math.random() * 0.5;
      
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", "8");
      circle.setAttribute("fill", ndvi > 0.6 ? "#22c55e" : ndvi > 0.4 ? "#eab308" : "#ef4444");
      circle.setAttribute("fill-opacity", "0.7");
      
      svg.appendChild(circle);
    }

    // Add legend
    const legendGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const legendBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    legendBg.setAttribute("x", "10");
    legendBg.setAttribute("y", "10");
    legendBg.setAttribute("width", "120");
    legendBg.setAttribute("height", "80");
    legendBg.setAttribute("fill", "white");
    legendBg.setAttribute("stroke", "#e5e7eb");
    legendBg.setAttribute("rx", "4");
    
    legendGroup.appendChild(legendBg);

    const legendTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
    legendTitle.setAttribute("x", "20");
    legendTitle.setAttribute("y", "30");
    legendTitle.setAttribute("font-size", "12");
    legendTitle.setAttribute("font-weight", "bold");
    legendTitle.textContent = "NDVI Health";
    
    legendGroup.appendChild(legendTitle);

    // Legend items
    const legendItems = [
      { color: "#22c55e", label: "Healthy" },
      { color: "#eab308", label: "Moderate" },
      { color: "#ef4444", label: "Stressed" }
    ];

    legendItems.forEach((item, index) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "25");
      circle.setAttribute("cy", (45 + index * 15).toString());
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", item.color);
      
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "35");
      text.setAttribute("y", (49 + index * 15).toString());
      text.setAttribute("font-size", "10");
      text.textContent = item.label;
      
      legendGroup.appendChild(circle);
      legendGroup.appendChild(text);
    });

    svg.appendChild(legendGroup);
    mapRef.current.appendChild(svg);

  }, [fieldId, fields]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg border bg-muted/30"
      style={{ minHeight: "384px" }}
    />
  );
}
