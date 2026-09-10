import { NextRequest, NextResponse } from "next/server";

// Proxies to OpenStreetMap's Nominatim geocoder. This exists as a server
// route (rather than calling Nominatim directly from the browser) because
// Nominatim's usage policy requires a descriptive User-Agent identifying the
// application, and browsers refuse to let client-side JS set that header.
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "ETechElevatorsWebsite/1.0 (contact form location picker; https://etechelevators.com)";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    if (lat && lon) {
      const url = `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) throw new Error("Nominatim reverse geocode failed");
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (q) {
      const url = `${NOMINATIM_BASE}/search?format=jsonv2&countrycodes=in&limit=5&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) throw new Error("Nominatim search failed");
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Missing q or lat/lon" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Geocoding service unavailable" }, { status: 502 });
  }
}
