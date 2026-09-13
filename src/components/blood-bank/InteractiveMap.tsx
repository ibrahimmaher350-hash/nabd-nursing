'use client';

/**
 * src/components/blood-bank/InteractiveMap.tsx
 * High-performance, fully interactive OpenStreetMap & Leaflet Map component.
 * Supports:
 * 1. 'picker' mode: Tap / drag pin to choose location, real GPS locate, Damietta quick districts.
 * 2. 'banks' mode: Overview of regional blood banks with interactive markers and navigation.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Navigation, ExternalLink, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { BloodBank } from '@/lib/blood-bank/types';

export interface InteractiveMapProps {
  mode?: 'picker' | 'banks';
  initialLat?: number;
  initialLng?: number;
  banks?: BloodBank[];
  selectedBankId?: string;
  onLocationChange?: (location: { lat: number; lng: number; address: string }) => void;
  height?: string;
  showQuickPills?: boolean;
}

// Famous Damietta districts coordinates
export const DAMIETTA_DISTRICTS = [
  { name: 'دمياط (الأعصر / المركز)', lat: 31.4165, lng: 31.8133 },
  { name: 'دمياط الجديدة', lat: 31.4361, lng: 31.6706 },
  { name: 'رأس البر', lat: 31.5160, lng: 31.8210 },
  { name: 'فارسكور', lat: 31.3325, lng: 31.8025 },
  { name: 'كفر سعد', lat: 31.3533, lng: 31.6872 },
  { name: 'الزرقا', lat: 31.2250, lng: 31.6250 },
  { name: 'كفر البطيخ', lat: 31.3960, lng: 31.7580 },
];

export default function InteractiveMap({
  mode = 'picker',
  initialLat = 31.4165,
  initialLng = 31.8133,
  banks = [],
  selectedBankId,
  onLocationChange,
  height = '320px',
  showQuickPills = true,
}: InteractiveMapProps) {
  const [currentLat, setCurrentLat] = useState<number>(initialLat);
  const [currentLng, setCurrentLng] = useState<number>(initialLng);
  const [currentAddress, setCurrentAddress] = useState<string>('دمياط، مصر');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccess, setGpsSuccess] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync with initial coordinates
  useEffect(() => {
    if (initialLat && initialLng) {
      setCurrentLat(initialLat);
      setCurrentLng(initialLng);
    }
  }, [initialLat, initialLng]);

  // Handle postMessage from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAB_MAP_CLICK') {
        const { lat, lng } = event.data;
        setCurrentLat(lat);
        setCurrentLng(lng);
        const autoAddr = findNearestDistrict(lat, lng);
        setCurrentAddress(autoAddr);
        if (onLocationChange) {
          onLocationChange({ lat, lng, address: autoAddr });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLocationChange]);

  // Helper to find nearest district name
  const findNearestDistrict = (lat: number, lng: number): string => {
    let nearest = DAMIETTA_DISTRICTS[0];
    let minDist = 999999;
    for (const d of DAMIETTA_DISTRICTS) {
      const dist = Math.hypot(d.lat - lat, d.lng - lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = d;
      }
    }
    return `مصر، دمياط - بالقرب من ${nearest.name}`;
  };

  // Real browser GPS handler
  const handleGetLiveGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('خاصية تحديد الموقع غير مدعومة في هذا المتصفح');
      return;
    }

    setIsLocating(true);
    setGpsError(null);
    setGpsSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLat(latitude);
        setCurrentLng(longitude);
        const detectedAddr = findNearestDistrict(latitude, longitude);
        setCurrentAddress(detectedAddr);
        setGpsSuccess(true);
        setIsLocating(false);

        // Notify iframe
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: 'NAB_FLY_TO', lat: latitude, lng: longitude, zoom: 15 },
            '*'
          );
        }

        if (onLocationChange) {
          onLocationChange({ lat: latitude, lng: longitude, address: detectedAddr });
        }

        setTimeout(() => setGpsSuccess(false), 4000);
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        let msg = 'تعذر الوصول للموقع عبر GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'يرجى السماح بصلاحية الموقع (GPS) من إعدادات المتصفح، أو اختر منطقتك من الأزرار السريعة بالأسفل.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'إشارة الـ GPS غير متوفرة حالياً، يمكنك النقر على الخريطة مباشرة.';
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // Select quick district
  const handleSelectDistrict = (district: (typeof DAMIETTA_DISTRICTS)[0]) => {
    setCurrentLat(district.lat);
    setCurrentLng(district.lng);
    const addr = `مصر، دمياط - ${district.name}`;
    setCurrentAddress(addr);
    setGpsError(null);

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'NAB_FLY_TO', lat: district.lat, lng: district.lng, zoom: 14 },
        '*'
      );
    }

    if (onLocationChange) {
      onLocationChange({ lat: district.lat, lng: district.lng, address: addr });
    }
  };

  // Build the complete Leaflet HTML for iframe srcDoc
  const leafletHtml = useMemo(() => {
    const banksJson = JSON.stringify(
      banks.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        lat: b.lat || 31.4165,
        lng: b.lng || 31.8133,
        types: b.availableTypes.join('، '),
        phone: b.phone || '',
      }))
    );

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <style>
    body, html, #map {
      margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .custom-pulse-marker {
      display: flex; align-items: center; justify-content: center;
    }
    .marker-dot {
      width: 22px; height: 22px; background: #C0392B; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 12px rgba(192,57,43,0.5);
    }
    .marker-pulse {
      position: absolute; width: 38px; height: 38px; background: rgba(192,57,43,0.3); border-radius: 50%; animation: pulse-ring 1.8s infinite ease-out;
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.6); opacity: 0.9; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .hospital-pin {
      width: 28px; height: 28px; background: #07132B; color: #fff; border: 2.5px solid #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(7,19,43,0.4);
    }
    .hospital-pin.active {
      background: #C0392B; transform: scale(1.2); transition: transform 0.2s;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 16px; direction: rtl; text-align: right; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    .leaflet-popup-content {
      font-size: 12px; line-height: 1.5; margin: 10px 14px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var isPicker = ${mode === 'picker'};
    var centerLat = ${currentLat};
    var centerLng = ${currentLng};
    var banksData = ${banksJson};
    var selectedId = ${selectedBankId ? JSON.stringify(selectedBankId) : 'null'};

    var map = L.map('map', {
      center: [centerLat, centerLng],
      zoom: isPicker ? 13 : 11,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    var userMarker = null;

    if (isPicker) {
      var pulseIcon = L.divIcon({
        className: 'custom-pulse-marker',
        html: '<div class="marker-pulse"></div><div class="marker-dot"></div>',
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      userMarker = L.marker([centerLat, centerLng], {
        icon: pulseIcon,
        draggable: true
      }).addTo(map);

      userMarker.bindPopup('<b style="color:#C0392B;">📍 موقعك المحدد</b><br>يمكنك سحب الدبوس أو النقر في أي مكان').openPopup();

      userMarker.on('dragend', function(e) {
        var pos = userMarker.getLatLng();
        window.parent.postMessage({ type: 'NAB_MAP_CLICK', lat: pos.lat, lng: pos.lng }, '*');
      });

      map.on('click', function(e) {
        userMarker.setLatLng(e.latlng);
        window.parent.postMessage({ type: 'NAB_MAP_CLICK', lat: e.latlng.lat, lng: e.latlng.lng }, '*');
      });
    } else {
      // Banks overview mode
      var markersMap = {};
      banksData.forEach(function(bank) {
        var isSel = (bank.id === selectedId);
        var iconHtml = '<div class="hospital-pin ' + (isSel ? 'active' : '') + '">🏥</div>';
        var bIcon = L.divIcon({
          className: '',
          html: iconHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        var m = L.marker([bank.lat, bank.lng], { icon: bIcon }).addTo(map);
        var popupContent = '<div style="font-family: inherit;">' +
          '<h4 style="margin:0 0 4px 0; color:#07132B; font-size:13px; font-weight:bold;">' + bank.name + '</h4>' +
          '<p style="margin:0 0 4px 0; color:#64748b; font-size:11px;">' + bank.address + '</p>' +
          '<p style="margin:0 0 6px 0; color:#C0392B; font-weight:bold; font-size:11px;">الفصائل: ' + bank.types + '</p>' +
          '<div style="margin-top:6px; display:flex; gap:6px;">' +
            (bank.phone ? '<a href="tel:' + bank.phone + '" style="background:#07132B; color:#fff; padding:4px 8px; border-radius:8px; text-decoration:none; font-size:11px; font-weight:bold;">📞 اتصال</a>' : '') +
            '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(bank.name + ' ' + bank.address) + '" target="_blank" style="background:#C0392B; color:#fff; padding:4px 8px; border-radius:8px; text-decoration:none; font-size:11px; font-weight:bold;">الاتجاهات ↗</a>' +
          '</div>' +
        '</div>';
        m.bindPopup(popupContent);
        markersMap[bank.id] = m;
        if (isSel) {
          m.openPopup();
        }
      });
    }

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'NAB_FLY_TO') {
        map.flyTo([e.data.lat, e.data.lng], e.data.zoom || 14, { duration: 1.2 });
        if (userMarker) {
          userMarker.setLatLng([e.data.lat, e.data.lng]);
          userMarker.openPopup();
        }
      }
    });
  </script>
</body>
</html>`;
  }, [mode, currentLat, currentLng, banks, selectedBankId]);

  return (
    <div className="w-full space-y-2.5" dir="rtl">
      {/* Map Header Action Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#C0392B]" />
          <span className="text-xs font-black text-slate-900">
            {mode === 'picker' ? 'خريطة تحديد الموقع' : 'خريطة بنوك الدم بدمياط'}
          </span>
        </div>

        {/* GPS Locate Action */}
        {mode === 'picker' && (
          <button
            type="button"
            onClick={handleGetLiveGps}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#C0392B] border border-red-200 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
            title="تحديد موقعي الدقيق عبر GPS"
          >
            {isLocating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isLocating ? 'جارٍ تحديد موقعك...' : 'تحديد موقعي بدقة (GPS)'}</span>
          </button>
        )}
      </div>

      {/* GPS Feedback Banners */}
      {gpsSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تم تحديد موقعك بدقة بنجاح عبر الـ GPS! ✓</span>
        </div>
      )}

      {gpsError && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>{gpsError}</p>
          </div>
        </div>
      )}

      {/* Embedded Map Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100"
        style={{ height }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={leafletHtml}
          title="خريطة بنك الدم نبض"
          className="w-full h-full border-0"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />

        {/* Google Maps External Affordance Pill */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 start-2 z-10 px-2.5 py-1 bg-white/95 backdrop-blur-xs text-slate-700 hover:text-[#C0392B] rounded-lg text-[10px] font-extrabold shadow-sm border border-slate-200 flex items-center gap-1 transition-all"
        >
          <span>تطبيق Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Quick Damietta District Selector Pills */}
      {mode === 'picker' && showQuickPills && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>أو اختر مركزك السكني بدمياط بنقرة واحدة:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {DAMIETTA_DISTRICTS.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => handleSelectDistrict(d)}
                className="shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 active:bg-[#C0392B] active:text-white border border-slate-200 text-slate-700 transition-colors"
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Location Address Strip */}
      {mode === 'picker' && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <Navigation className="w-4 h-4 text-[#C0392B] shrink-0 fill-[#C0392B]/20" />
            <span className="font-bold text-slate-800 truncate">{currentAddress}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 shrink-0" dir="ltr">
            {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
