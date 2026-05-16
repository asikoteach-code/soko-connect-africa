import { useEffect, useRef, useState } from "react";

type Props = {
  lat?: number;
  lng?: number;
  onChange?: (p: { lat: number; lng: number; address: string }) => void;
};

const DEFAULT = { lat: -1.2921, lng: 36.8219 }; // Nairobi

export function MapPicker({ lat, lng, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !ref.current) return;

      const start: [number, number] = [lat ?? DEFAULT.lat, lng ?? DEFAULT.lng];

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:34px;height:44px;display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 32 44" width="34" height="44" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.2 0 0 7.1 0 16c0 11 16 28 16 28s16-17 16-28C32 7.1 24.8 0 16 0z" fill="#0D4A2A"/>
            <circle cx="16" cy="16" r="6" fill="#fff"/>
          </svg>
        </div>`,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
      });

      const map = L.map(ref.current, { zoomControl: true }).setView(start, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(start, { draggable: true, icon }).addTo(map);
      mapRef.current = map;
      markerRef.current = marker;

      const reverse = async (la: number, ln: number) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${la}&lon=${ln}&zoom=16`,
            { headers: { Accept: "application/json" } },
          );
          const j = (await r.json()) as { display_name?: string };
          return j.display_name ?? `${la.toFixed(4)}, ${ln.toFixed(4)}`;
        } catch {
          return `${la.toFixed(4)}, ${ln.toFixed(4)}`;
        }
      };

      const emit = async (la: number, ln: number) => {
        const address = await reverse(la, ln);
        onChange?.({ lat: la, lng: ln, address });
      };

      marker.on("dragend", () => {
        const p = marker.getLatLng();
        emit(p.lat, p.lng);
      });
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        emit(e.latlng.lat, e.latlng.lng);
      });

      emit(start[0], start[1]);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return (
    <div
      ref={ref}
      className="h-[220px] w-full rounded-2xl overflow-hidden shadow-card border border-border bg-muted"
      style={{ zIndex: 0 }}
    />
  );
}
