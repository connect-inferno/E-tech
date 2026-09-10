"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker, LeafletMouseEvent } from "leaflet";
import { Search, MapPin, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [18.5204, 73.8567]; // Pune, MH — fallback before a location is picked

export interface LocationValue {
  address: string;
  lat: number | null;
  lng: number | null;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationPickerProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [mapReady, setMapReady] = useState(false);
  const [query, setQuery] = useState(value.address);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the search box in sync when the parent resets/clears the value —
  // but this never fires from our own selections, since those update local
  // `query` directly at the same time they call onChange.
  useEffect(() => {
    setQuery(value.address);
  }, [value.address]);

  const goldDivIcon = useCallback((L: typeof import("leaflet")) => {
    return L.divIcon({
      className: "",
      html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z" fill="#d4af37"/>
        <circle cx="15" cy="15" r="5.5" fill="#0c0c0e"/>
      </svg>`,
      iconSize: [30, 40],
      iconAnchor: [15, 40],
    });
  }, []);

  const setPosition = useCallback((lat: number, lng: number, knownAddress?: string) => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    marker.setLatLng([lat, lng]);
    map.setView([lat, lng], 16);

    if (knownAddress) {
      setQuery(knownAddress);
      onChangeRef.current({ address: knownAddress, lat, lng });
      return;
    }

    // Reverse-geocode a dragged/clicked point via our proxy route.
    const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    fetch(`/api/geocode?lat=${lat}&lon=${lng}`)
      .then((res) => res.json())
      .then((data) => {
        const address = data && data.display_name ? data.display_name : fallback;
        setQuery(address);
        onChangeRef.current({ address, lat, lng });
      })
      .catch(() => {
        setQuery(fallback);
        onChangeRef.current({ address: fallback, lat, lng });
      });
  }, []);

  // Initialize the map once. The map container div is never given React-
  // rendered children — Leaflet takes full imperative ownership of its DOM,
  // and mixing that with React-managed children in the same node causes
  // "insertBefore"/"removeChild" crashes when the two try to reconcile the
  // same nodes.
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const center: [number, number] =
        value.lat != null && value.lng != null ? [value.lat, value.lng] : DEFAULT_CENTER;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: value.lat != null ? 16 : 12,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker(center, { draggable: true, icon: goldDivIcon(L) }).addTo(map);
      markerRef.current = marker;

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setPosition(pos.lat, pos.lng);
      });

      map.on("click", (e: LeafletMouseEvent) => {
        setPosition(e.latlng.lat, e.latlng.lng);
      });

      setMapReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Runs once on mount — the map instance owns all further interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 450);
  };

  const selectResult = (result: SearchResult) => {
    setShowResults(false);
    setResults([]);
    setPosition(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-luxury-text-secondary pointer-events-none z-10" />
        <input
          type="text"
          required
          placeholder="Search for your address, or drag the pin below"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          className="w-full bg-black/40 border border-white/5 rounded-sm py-3 pl-9 pr-8 text-xs text-luxury-text-primary focus:outline-none focus:border-luxury-accent focus:ring-1 focus:ring-luxury-accent/30 transition-all"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-luxury-text-secondary animate-spin" />
        )}

        {showResults && results.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0e0e12] border border-white/10 rounded-sm shadow-2xl max-h-56 overflow-y-auto">
            {results.map((r, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectResult(r)}
                className="w-full text-left px-3 py-2.5 text-[11px] text-luxury-text-secondary hover:bg-white/5 hover:text-luxury-text-primary transition-colors border-b border-white/5 last:border-0"
              >
                {r.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative w-full h-[220px] rounded-sm border border-white/5 overflow-hidden bg-black/40">
        <div ref={mapContainerRef} className="absolute inset-0" />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center text-luxury-text-secondary pointer-events-none">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
      </div>

      {value.lat != null && value.lng != null && (
        <div className="flex items-start gap-1.5 text-[10px] text-luxury-text-secondary">
          <MapPin className="w-3 h-3 text-luxury-accent shrink-0 mt-0.5" />
          <span>
            {value.address}{" "}
            <span className="text-luxury-text-secondary/60">
              ({value.lat.toFixed(6)}, {value.lng.toFixed(6)})
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
