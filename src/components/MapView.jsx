import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PERIODS = ["morning", "afternoon", "evening"];

const PERIOD_STYLE = {
  morning: { color: "#f59e0b", label: "Morning" },
  afternoon: { color: "#3b82f6", label: "Afternoon" },
  evening: { color: "#8b5cf6", label: "Evening" },
};

const DEFAULT_CENTER = [20.5937, 78.9629];
const CACHE_KEY = "yatra_geocode_cache_v1";

const memoryCache = new Map();

try {
  const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  Object.entries(stored).forEach(([k, v]) => memoryCache.set(k, v));
} catch {
  // Ignore corrupt or unavailable storage
}

function persistCache() {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(Object.fromEntries(memoryCache)),
    );
  } catch {
    // Storage full or blocked
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Returns { coords, fromNetwork }. coords is [lat, lng] or null.
async function geocode(query, signal) {
  const key = query.toLowerCase().trim();
  if (memoryCache.has(key)) {
    return { coords: memoryCache.get(key), fromNetwork: false };
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
    { headers: { "Accept-Language": "en" }, signal },
  );
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);

  const data = await res.json();
  const coords = data?.[0]
    ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    : null;

  // Only cache successful lookups so a temporary failure can be retried
  if (
    Array.isArray(coords) &&
    coords.length === 2 &&
    coords.every(Number.isFinite)
  ) {
    memoryCache.set(key, coords);
    persistCache();
  }
  return { coords, fromNetwork: true };
}

function numberedIcon(number, color, active) {
  const size = active ? 40 : 32;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};color:#fff;
      display:flex;align-items:center;justify-content:center;
      font:700 ${active ? 16 : 14}px/1 system-ui,sans-serif;
      border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.45);
      transition:all .2s;">${number}</div>`,
  });
}

const destinationIcon = L.divIcon({
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#fff;border:4px solid #111;
    box-shadow:0 0 0 3px rgba(255,255,255,.35);"></div>`,
});

function CameraController({ center, points, focusPoint, activeDay }) {
  const map = useMap();

  // Leaflet shows grey tiles when its container resizes after mount
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [map]);

  // Frame the whole day whenever the day or its resolved points change
  useEffect(() => {
    if (points.length > 1) {
      map.flyToBounds(L.latLngBounds(points), {
        padding: [70, 70],
        maxZoom: 15,
        duration: 1,
      });
    } else if (points.length === 1) {
      map.flyTo(points[0], 14, { duration: 1 });
    } else if (center) {
      map.flyTo(center, 12, { duration: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, activeDay, points.length, center?.[0], center?.[1]]);

  // Zoom in when a specific activity is selected
  useEffect(() => {
    if (focusPoint) map.flyTo(focusPoint, 15, { duration: 1 });
  }, [map, focusPoint]);

  return null;
}

function StopMarker({ item, number, isFocused }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isFocused && ref.current) ref.current.openPopup();
  }, [isFocused]);

  const { color, label } = PERIOD_STYLE[item.period];

  return (
    <Marker
      ref={ref}
      position={item.position}
      icon={numberedIcon(number, color, isFocused)}
      zIndexOffset={isFocused ? 1000 : 0}
    >
      <Popup>
        <div style={{ minWidth: 190, color: "#111" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color, margin: 0 }}>
            {label}
          </p>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "4px 0 0" }}>
            {item.activity}
          </h3>
          <p style={{ fontSize: 12, margin: "4px 0 0", color: "#555" }}>
            {item.location}
          </p>
          {item.description ? (
            <p style={{ fontSize: 12, margin: "6px 0 0" }}>
              {item.description}
            </p>
          ) : null}
          {item.estimatedCost > 0 ? (
            <p style={{ fontSize: 12, fontWeight: 600, margin: "8px 0 0" }}>
              Estimated cost: ₹
              {Number(item.estimatedCost).toLocaleString("en-IN")}
            </p>
          ) : null}
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapView({
  destination,
  itinerary,
  activeDay = 0,
  focusLocation, // "morning" | "afternoon" | "evening" | undefined
}) {
  const [center, setCenter] = useState(null);
  const [centerLoading, setCenterLoading] = useState(false);
  const [coordsByKey, setCoordsByKey] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [failedKeys, setFailedKeys] = useState([]);

  /* 1. Geocode the destination --------------------------------------- */
  useEffect(() => {
    if (!destination) return;
    const controller = new AbortController();

    (async () => {
      setCenterLoading(true);
      try {
        const { coords } = await geocode(destination, controller.signal);
        if (coords) setCenter(coords);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Geocoding failed:", err);
      } finally {
        if (!controller.signal.aborted) setCenterLoading(false);
      }
    })();

    return () => controller.abort();
  }, [destination]);

  /* 2. Stops for the active day -------------------------------------- */
  const stops = useMemo(() => {
    const day = itinerary?.days?.[activeDay];
    if (!day) return [];

    return PERIODS.map((period) => {
      const a = day[period];
      if (!a?.location) return null;
      return {
        period,
        activity: a.activity || "Activity",
        description: a.description || "",
        location: a.location,
        estimatedCost: Number(a.estimatedCost) || 0,
        key: `${destination || ""}|${a.location}`.toLowerCase(),
      };
    }).filter(Boolean);
  }, [itinerary, activeDay, destination]);

  /* 3. Geocode each stop, one at a time, updating the map as we go --- */
  useEffect(() => {
    if (!stops.length || !destination) return;

    const controller = new AbortController();
    const todo = stops.filter((s) => !coordsByKey[s.key]);
    if (!todo.length) {
      setPendingCount(0);
      return;
    }

    (async () => {
      setPendingCount(todo.length);
      const failed = [];

      for (const stop of todo) {
        if (controller.signal.aborted) return;
        try {
          const { coords, fromNetwork } = await geocode(
            `${stop.location}, ${destination}`,
            controller.signal,
          );
          if (coords) {
            setCoordsByKey((prev) => ({ ...prev, [stop.key]: coords }));
          } else {
            failed.push(stop.key);
          }
          // Nominatim policy: max 1 request per second
          if (fromNetwork) await sleep(1100);
        } catch (err) {
          if (err.name === "AbortError") return;
          console.error("Geocode failed for", stop.location, err);
          failed.push(stop.key);
        }
        setPendingCount((n) => Math.max(0, n - 1));
      }

      if (!controller.signal.aborted) {
        setPendingCount(0);
        setFailedKeys(failed);
      }
    })();

    return () => controller.abort();
    // coordsByKey is intentionally excluded: results arrive one by one
    // and must not restart the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, destination]);

  /* 4. Only show stops that were really located ---------------------- */
  const markers = useMemo(
    () =>
      stops
        .filter((s) => coordsByKey[s.key])
        .map((s) => ({ ...s, position: coordsByKey[s.key] })),
    [stops, coordsByKey],
  );

  const points = useMemo(() => markers.map((m) => m.position), [markers]);

  const focusPoint = useMemo(() => {
    if (!focusLocation) return null;
    return markers.find((m) => m.period === focusLocation)?.position || null;
  }, [focusLocation, markers]);

  const unlocated = stops.filter((s) => failedKeys.includes(s.key));

  return (
    <div className="relative w-full h-full min-h-[320px] rounded-[2rem] overflow-hidden bg-[#0b0b0d]">
      <MapContainer
        center={center || DEFAULT_CENTER}
        zoom={center ? 12 : 4}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <CameraController
          center={center}
          points={points}
          focusPoint={focusPoint}
          activeDay={activeDay}
        />

        {center && (
          <Marker position={center} icon={destinationIcon}>
            <Popup>
              <strong style={{ color: "#111" }}>
                {destination || "Destination"}
              </strong>
            </Popup>
          </Marker>
        )}

        {points.length > 1 && (
          <Polyline
            positions={points}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              opacity: 0.6,
              dashArray: "6 8",
            }}
          />
        )}

        {markers.map((item, i) => (
          <StopMarker
            key={`${activeDay}-${item.period}`}
            item={item}
            number={i + 1}
            isFocused={focusLocation === item.period}
          />
        ))}
      </MapContainer>

      {/* Info card */}
      <div className="absolute top-4 left-4 z-[1000] max-w-[70%]">
        <div className="bg-[#050506]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
          <p className="text-sm font-bold text-white truncate">
            {centerLoading ? "Locating…" : destination || "No destination"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Day {activeDay + 1} · {markers.length} of {stops.length} stops on
            map
            {pendingCount > 0 ? " · finding places…" : ""}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] flex gap-3 bg-[#050506]/90 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
        {PERIODS.map((p) => (
          <span
            key={p}
            className="flex items-center gap-1.5 text-xs text-gray-300"
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: PERIOD_STYLE[p].color }}
            />
            {PERIOD_STYLE[p].label}
          </span>
        ))}
      </div>

      {/* Places we couldn't find */}
      {unlocated.length > 0 && pendingCount === 0 && (
        <div className="absolute bottom-4 right-4 z-[1000] max-w-[55%] bg-amber-950/90 border border-amber-500/30 text-amber-200 text-xs rounded-xl px-3 py-2">
          Couldn't locate: {unlocated.map((s) => s.location).join(", ")}
        </div>
      )}
    </div>
  );
}
