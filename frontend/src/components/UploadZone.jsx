import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';

export default function UploadZone({ onScanFile, isScanning, previewUrl, onClearScan }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onScanFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onScanFile(e.target.files[0]);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or unavailable: " + err.message);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `label_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      stopCamera();
      onScanFile(file);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {isCameraActive ? (
        /* Camera UI */
        <div className="glass-card flex flex-col items-center gap-4" style={{ borderColor: '#38bdf8' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 540,
            aspectRatio: '4/3',
            borderRadius: 14,
            overflow: 'hidden',
            background: '#000000',
            border: '1px solid #334155'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 24,
              border: '2px dashed rgba(56, 189, 248, 0.8)',
              borderRadius: 10,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                background: 'rgba(0,0,0,0.7)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: 6
              }}>
                Align Packaged Label inside frame
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={capturePhoto} className="btn btn-primary">
              <Camera style={{ width: 16, height: 16 }} />
              Capture Label
            </button>
            <button onClick={stopCamera} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`dropzone-container ${isDragging ? 'dragging' : ''}`}
          onClick={() => !isScanning && fileInputRef.current?.click()}
        >
          {isScanning ? (
            <div className="flex flex-col items-center gap-3" style={{ padding: '16px 0' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: '3px solid rgba(56, 189, 248, 0.2)',
                borderTopColor: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} className="spin">
                <Sparkles style={{ width: 22, height: 22, color: '#38bdf8' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
                  Analyzing Packaged Commodity...
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 4 }}>
                  Extracting declarations via AI Vision & evaluating against PCR 2011 clauses.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="dropzone-icon-box">
                <UploadCloud style={{ width: 32, height: 32 }} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
                  Upload or Snap Product Label Image
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 4 }}>
                  Drag & drop any food packaging photo, chips packet, biscuit label, or FMCG item.
                </p>
              </div>

              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary btn-sm"
                >
                  <ImageIcon style={{ width: 14, height: 14 }} />
                  Browse Photo
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="btn btn-secondary btn-sm"
                >
                  <Camera style={{ width: 14, height: 14, color: '#38bdf8' }} />
                  Use Camera
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
