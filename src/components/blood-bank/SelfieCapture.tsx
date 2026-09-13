'use client';

/**
 * src/components/blood-bank/SelfieCapture.tsx
 * Enforces direct live front-camera selfie capture during donor registration.
 * Supports both mobile native selfie camera trigger (`capture="user"`) and in-browser live webcam stream.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, User, AlertCircle, X, Sparkles } from 'lucide-react';

interface SelfieCaptureProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
}

export default function SelfieCapture({ value, onChange, required = true }: SelfieCaptureProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [showWebcamModal, setShowWebcamModal] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync with prop
  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // Start live webcam in modal
  const handleOpenLiveWebcam = async () => {
    setShowWebcamModal(true);
    setCameraError(null);
    setIsCameraStarting(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('الكاميرا غير مدعومة في متصفحك الحالي');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // front-facing selfie camera
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Webcam stream failed:', err);
      let msg = 'تعذر فتح الكاميرا مباشرة. يمكنك استخدام زر التقاط السيلفي عبر كاميرا الهاتف.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'يرجى السماح بصلاحية الكاميرا في المتصفح لالتقاط السيلفي.';
      }
      setCameraError(msg);
    } finally {
      setIsCameraStarting(false);
    }
  };

  const handleCloseWebcam = () => {
    stopCameraStream();
    setShowWebcamModal(false);
    setCameraError(null);
  };

  // Capture frame from webcam video to canvas
  const handleSnapWebcam = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    const size = Math.min(video.videoWidth, video.videoHeight) || 480;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop to square
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    // Mirror for natural selfie feel
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPreviewUrl(dataUrl);
    onChange(dataUrl);
    handleCloseWebcam();
  };

  // Handle native file/camera capture (`capture="user"`)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار صورة صالحة فقط.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center space-y-3" dir="rtl">
      {/* Hidden file input with direct camera capture */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="user" // Forces front/selfie camera on iOS & Android
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Circular Selfie Preview */}
      <div className="relative group">
        <div
          className={`w-28 h-28 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-md transition-all ${
            previewUrl
              ? 'border-emerald-500 ring-4 ring-emerald-100'
              : 'border-[#C0392B] bg-[#FDECEC] ring-4 ring-red-50'
          }`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="صورة سيلفي المتبرع"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-14 h-14 text-[#C0392B]/50 stroke-[1.5]" />
          )}
        </div>

        {/* Action button overlay on avatar */}
        <button
          type="button"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className={`absolute bottom-0 start-0 w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg border-2 border-white transition-transform active:scale-95 ${
            previewUrl ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#C0392B] hover:bg-[#A93226]'
          }`}
          title="التقاط صورة سيلفي"
          aria-label="التقاط صورة سيلفي"
        >
          {previewUrl ? (
            <RefreshCw className="w-4 h-4" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Label and Guidance */}
      <div className="text-center space-y-1 max-w-xs">
        {previewUrl ? (
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-black">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>تم التقاط صورة السيلفي بنجاح ✓</span>
          </div>
        ) : (
          <div className="space-y-0.5">
            <p className="text-xs font-black text-slate-900 flex items-center justify-center gap-1">
              <span>التقاط صورة سيلفي للوجه مباشرة</span>
              <span className="text-red-500">*</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              مطلوبة عبر كاميرا الهاتف للتأكد من هوية المتبرع وحماية المرضى
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {/* Button 1: Direct front camera */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{previewUrl ? 'إعادة التقاط سيلفي' : 'التقاط سيلفي الآن 🤳'}</span>
          </button>

          {/* Button 2: In-browser live webcam (if desktop or preferred) */}
          <button
            type="button"
            onClick={handleOpenLiveWebcam}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1 transition-all active:scale-95"
            title="فتح الكاميرا المباشرة في المتصفح"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>كاميرا الويب</span>
          </button>
        </div>
      </div>

      {/* Live Webcam Modal */}
      {showWebcamModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#C0392B]" />
                <h3 className="text-sm font-black text-slate-900">التقاط صورة سيلفي حية</h3>
              </div>
              <button
                type="button"
                onClick={handleCloseWebcam}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 space-y-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <p>{cameraError}</p>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseWebcam();
                    fileInputRef.current?.click();
                  }}
                  className="w-full py-2 bg-[#C0392B] text-white rounded-xl text-xs font-bold"
                >
                  التقاط عبر كاميرا الهاتف بدلاً من ذلك
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Live Video View with Face Oval Guide */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className="w-full h-full object-cover scale-x-[-1]" // mirror for selfie
                  />
                  {/* Face Silhouette Guide */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-56 rounded-[50%] border-2 border-dashed border-white/80 shadow-2xs" />
                  </div>
                  <span className="absolute top-3 text-[11px] font-bold text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                    ضع وجهك داخل الإطار واضغط التقاط
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSnapWebcam}
                    className="flex-1 py-3 bg-[#C0392B] hover:bg-[#A93226] text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>التقاط الصورة 📸</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseWebcam}
                    className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
