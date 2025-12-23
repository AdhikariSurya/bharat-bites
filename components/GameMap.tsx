"use client";

import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import mapData from "@/data/india.json";
import { isStateMatch } from "@/utils/map-helpers";

interface GameMapProps {
  correctStates: string[];
  incorrectStates: string[];
}

export function GameMap({ correctStates, incorrectStates }: GameMapProps) {
  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [78.9629, 22.5937] // Center of India
        }}
        className="w-full h-full"
      >
        <Geographies geography={mapData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // Try to find the name property. It varies by TopoJSON source.
              // Common keys: 'name', 'st_nm', 'NAME_1'
              const mapStateName = geo.properties.name || geo.properties.st_nm || geo.properties.NAME_1 || "";
              
              // Logic to determine color
              let fillColor = "#E5E5E5"; // Default Neutral (Stone-200)
              
              const isCorrect = correctStates.some(target => isStateMatch(mapStateName, target));
              const isIncorrect = incorrectStates.some(target => isStateMatch(mapStateName, target));

              if (isCorrect) {
                fillColor = "#16a34a"; // Green-600
              } else if (isIncorrect) {
                fillColor = "#dc2626"; // Red-600
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#A8A29E" // Stone-400
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: fillColor === "#E5E5E5" ? "#D6D3D1" : fillColor },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

