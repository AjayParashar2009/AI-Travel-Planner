import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons when using Vite/React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ----------------------------------------------------
// Map controller - SAFETY CHECKS ADDED
// ----------------------------------------------------
function MapController({ center, focusLocation }) {
  const map = useMap();

  useEffect(() => {
    const target = focusLocation || center;

    // 🛑 CRITICAL FIX: Prevent Leaflet crash on null/undefined/NaN coordinates
    if (
      !target ||
      !Array.isArray(target) ||
      target.length !== 2 ||
      typeof target[0] !== "number" ||
      typeof target[1] !== "number" ||
      isNaN(target[0]) ||
      isNaN(target[1])
    ) {
      return;
    }

    map.flyTo(target, 13, {
      duration: 1.2,
    });
  }, [center, map, focusLocation]);

  return null;
}

// ----------------------------------------------------
// Main MapView
// ----------------------------------------------------
export default function MapView({
  destination,
  itinerary,
  activeDay = 0,
  focusLocation,
}) {
  // 1. State to store the real coordinates fetched from the API
  const [centerCoords, setCenterCoords] = useState([48.8566, 2.3522]); // Default to Paris
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  // 2. Fetch real coordinates based on the destination string
  useEffect(() => {
    if (!destination) return;

    const geocodeDestination = async () => {
      setGeocodingLoading(true);
      try {
        // Using free OpenStreetMap Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`,
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setCenterCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
        // Keep default Paris coordinates if geocoding fails
      } finally {
        setGeocodingLoading(false);
      }
    };

    geocodeDestination();
  }, [destination]);

  // 3. Get activities from selected day
  const locations = useMemo(() => {
    const day = itinerary?.days?.[activeDay];

    if (!day) return [];

    const periods = ["morning", "afternoon", "evening"];

    return periods
      .map((period) => {
        const activity = day?.[period];

        if (!activity?.location) return null;

        return {
          period,
          activity: activity.activity || "Activity",
          description: activity.description || "",
          location: activity.location,
          estimatedCost: activity.estimatedCost || 0,
        };
      })
      .filter(Boolean);
  }, [itinerary, activeDay]);

  // 4. Create markers around the REAL destination coordinates (MEMOIZED)
  const markers = useMemo(() => {
    return locations.map((location, index) => {
      const offsets = [
        [0.01, 0],
        [-0.008, 0.012],
        [0.006, -0.015],
      ];

      const offset = offsets[index % offsets.length];

      return {
        ...location,
        position: [centerCoords[0] + offset[0], centerCoords[1] + offset[1]],
      };
    });
  }, [locations, centerCoords]);

  // 5. 🛑 FIX: Convert string focusLocation ("morning", etc.) into a real coordinate
  const focusCoords = useMemo(() => {
    // If focusLocation is null or not a string, don't do anything
    if (!focusLocation || typeof focusLocation !== "string") return null;

    const day = itinerary?.days?.[activeDay];
    if (!day) return null;

    // Find the location of the specific period
    const periodData = day[focusLocation];
    if (!periodData?.location) return null;

    // Find the index of this period to use the exact same offset as the marker
    const periods = ["morning", "afternoon", "evening"];
    const periodIndex = periods.indexOf(focusLocation);

    // If it's not found, return null (don't fly anywhere)
    if (periodIndex === -1) return null;

    const offsets = [
      [0.01, 0],
      [-0.008, 0.012],
      [0.006, -0.015],
    ];
    const offset = offsets[periodIndex % offsets.length];

    // Return the approximated coordinate for the activity
    return [centerCoords[0] + offset[0], centerCoords[1] + offset[1]];
  }, [focusLocation, itinerary, activeDay, centerCoords]);

  // 6. If there are no itinerary locations, still show destination marker
  const destinationMarker = useMemo(
    () => ({
      position: centerCoords,
      name: destination || "Destination",
    }),
    [centerCoords, destination],
  );

  return (
    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
      <MapContainer
        center={centerCoords}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🛑 CRITICAL FIX: Only render MapController when coordinates are completely valid */}
        {!geocodingLoading &&
          centerCoords.every(
            (coord) => typeof coord === "number" && !isNaN(coord),
          ) && (
            <MapController center={centerCoords} focusLocation={focusCoords} />
          )}

        {/* Destination marker - Added missing 'key' prop */}
        <Marker key="destination-marker" position={destinationMarker.position}>
          <Popup>
            <div className="text-black">
              <strong>{destinationMarker.name}</strong>
            </div>
          </Popup>
        </Marker>

        {/* Itinerary markers */}
        {markers.map((item, index) => (
          <Marker key={`${item.period}-${index}`} position={item.position}>
            <Popup>
              <div className="text-black min-w-[180px]">
                <p className="text-xs font-bold uppercase text-blue-600">
                  {item.period}
                </p>

                <h3 className="font-bold mt-1">{item.activity}</h3>

                <p className="text-xs mt-1">{item.location}</p>

                {item.estimatedCost && (
                  <p className="text-xs mt-2 font-semibold">
                    Cost: ₹{item.estimatedCost}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map overlay */}
      <div className="absolute top-5 left-5 z-[1000]">
        <div className="bg-[#050506]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 shadow-2xl">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">
            Navigation Grid
          </p>

          <p className="text-xs font-bold text-white mt-1 flex items-center gap-2">
            {geocodingLoading ? (
              <span className="text-gray-500 text-[10px]">Locating...</span>
            ) : (
              destination || "Unknown Destination"
            )}
          </p>

          <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">
            Day {activeDay + 1} // {markers.length} locations
          </p>
        </div>
      </div>
    </div>
  );
}
