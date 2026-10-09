"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X, Zap } from "lucide-react";

export interface UploadResult {
  filename: string;
  size_bytes: number;
  size_formatted: string;
  total_rows: number;
  headers: string[];
  preview_rows: string[][];
  preview_text: string;
  storage_path: string;
}

interface LargeFileUploaderProps {
  onUploadSuccess: (result: UploadResult) => void;
  className?: string;
  variant?: "retro" | "cyber";
}

export default function LargeFileUploader({
  onUploadSuccess,
  className = "",
  variant = "retro",
}: LargeFileUploaderProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedBytes, setUploadedBytes] = useState<number>(0);
  const [totalBytes, setTotalBytes] = useState<number>(0);
  const [uploadSpeed, setUploadSpeed] = useState<string>("0 MB/s");
  const [eta, setEta] = useState<string>("--");
  const [fileName, setFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startUpload(file);
    }
  };

  const startUpload = (file: File) => {
    setErrorMsg(null);
    setUploadResult(null);
    setFileName(file.name);
    setIsUploading(true);
    setProgress(0);
    setUploadedBytes(0);
    setTotalBytes(file.size);

    let lastLoaded = 0;
    let lastTime = Date.now();

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const currentTime = Date.now();
        const timeDelta = (currentTime - lastTime) / 1000; // in seconds

        if (timeDelta > 0.2) {
          const bytesDelta = event.loaded - lastLoaded;
          const speedBps = bytesDelta / timeDelta;
          const speedMbps = speedBps / (1024 * 1024);
          setUploadSpeed(speedMbps >= 0.1 ? `${speedMbps.toFixed(2)} MB/s` : `${(speedBps / 1024).toFixed(1)} KB/s`);

          const remainingBytes = event.total - event.loaded;
          const remainingSec = speedBps > 0 ? remainingBytes / speedBps : 0;
          setEta(remainingSec < 1 ? "< 1s" : `${remainingSec.toFixed(1)}s`);

          lastLoaded = event.loaded;
          lastTime = currentTime;
        }

        const pct = Math.round((event.loaded / event.total) * 100);
        setProgress(pct);
        setUploadedBytes(event.loaded);
        setTotalBytes(event.total);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res: UploadResult = JSON.parse(xhr.responseText);
          setProgress(100);
          setUploadResult(res);
          onUploadSuccess(res);
        } catch (e) {
          setErrorMsg("Failed to parse server response.");
        }
      } else {
        setErrorMsg(`Upload failed with status code ${xhr.status}.`);
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setErrorMsg("Network error during file upload. Check coordinator connection.");
    };

    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", "/api/datasets/upload", true);
    xhr.send(formData);
  };

  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      setIsUploading(false);
      setProgress(0);
      setErrorMsg("Upload cancelled by user.");
    }
  };

  const resetUploader = () => {
    setUploadResult(null);
    setProgress(0);
    setErrorMsg(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isRetro = variant === "retro";

  return (
    <div
      className={`rounded-2xl border-2 transition-all ${
        isRetro
          ? "bg-[#FAF7F2] border-[#1C1917] retro-shadow-sm p-6"
          : "bg-slate-900/60 border-slate-800 p-6 backdrop-blur-md"
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv,text/plain"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* STATE 1: IDLE / PICK FILE */}
      {!isUploading && !uploadResult && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all ${
            isRetro
              ? "border-[#1C1917]/40 bg-[#F4EFE6] hover:border-[#1C1917] hover:bg-[#EFE9DD]"
              : "border-cyan-500/30 bg-cyan-950/10 hover:border-cyan-500 hover:bg-cyan-950/20"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${
              isRetro
                ? "bg-[#FAF7F2] border-[#1C1917] text-[#E05338] retro-shadow-sm"
                : "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
            }`}
          >
            <UploadCloud className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h4
              className={`font-display font-bold text-base ${
                isRetro ? "text-[#1C1917]" : "text-white"
              }`}
            >
              Upload Large Dataset (CSV / TSV)
            </h4>
            <p
              className={`text-xs font-mono mt-1 ${
                isRetro ? "text-[#78716C]" : "text-slate-400"
              }`}
            >
              Click or drag & drop files (100MB+ supported with real-time stream tracking)
            </p>
          </div>
          <button
            type="button"
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider border-2 transition-transform hover:scale-102 ${
              isRetro
                ? "bg-[#1C1917] text-white border-[#1C1917] retro-shadow-sm"
                : "bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20"
            }`}
          >
            Select Dataset File
          </button>
        </div>
      )}

      {/* STATE 2: UPLOADING WITH LIVE STREAM TELEMETRY */}
      {isUploading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 ${
                  isRetro
                    ? "bg-[#FAF7F2] border-[#1C1917] text-[#E05338]"
                    : "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                }`}
              >
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h5
                  className={`font-display font-bold text-sm ${
                    isRetro ? "text-[#1C1917]" : "text-white"
                  }`}
                >
                  Streaming {fileName}
                </h5>
                <span
                  className={`text-[11px] font-mono ${
                    isRetro ? "text-[#78716C]" : "text-slate-400"
                  }`}
                >
                  Chunked stream to coordinator storage
                </span>
              </div>
            </div>
            <button
              onClick={cancelUpload}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center space-x-1 border ${
                isRetro
                  ? "bg-[#FAF7F2] border-[#1C1917] text-[#E05338] hover:bg-red-50"
                  : "bg-red-950/30 border-red-500/50 text-red-400 hover:bg-red-950/50"
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="space-y-2">
            <div
              className={`w-full h-4 rounded-full overflow-hidden border-2 p-0.5 ${
                isRetro
                  ? "bg-[#F4EFE6] border-[#1C1917]"
                  : "bg-slate-950 border-slate-700"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  isRetro
                    ? "bg-[#E05338]"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* TELEMETRY ROW */}
            <div
              className={`flex flex-wrap items-center justify-between text-xs font-mono font-bold pt-1 ${
                isRetro ? "text-[#1C1917]" : "text-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                    isRetro
                      ? "bg-[#1C1917] text-white"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}
                >
                  {progress}%
                </span>
                <span>
                  {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-[11px]">
                <span className="flex items-center space-x-1">
                  <span className={isRetro ? "text-[#78716C]" : "text-slate-400"}>Speed:</span>
                  <strong className={isRetro ? "text-[#E05338]" : "text-cyan-400"}>{uploadSpeed}</strong>
                </span>
                <span className="flex items-center space-x-1">
                  <span className={isRetro ? "text-[#78716C]" : "text-slate-400"}>ETA:</span>
                  <strong className={isRetro ? "text-[#1C1917]" : "text-white"}>{eta}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: UPLOAD SUCCESS SUMMARY */}
      {uploadResult && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isRetro
                ? "bg-[#EBF7EE] border-[#1C1917] text-[#166534]"
                : "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
            }`}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <h5 className="font-display font-bold text-sm">
                  Upload Complete: {uploadResult.filename}
                </h5>
                <p className="text-xs font-mono opacity-80 mt-0.5">
                  Size: {uploadResult.size_formatted} • Ingested: {uploadResult.total_rows.toLocaleString()} rows • {uploadResult.headers.length} columns detected
                </p>
              </div>
            </div>

            <button
              onClick={resetUploader}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 shrink-0 ${
                isRetro
                  ? "bg-[#FAF7F2] border-[#1C1917] text-[#1C1917] hover:bg-[#F2ECE1]"
                  : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              }`}
            >
              Upload Another
            </button>
          </div>

          {/* COLUMNS BADGES */}
          {uploadResult.headers.length > 0 && (
            <div className="space-y-1.5">
              <div
                className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  isRetro ? "text-[#78716C]" : "text-slate-400"
                }`}
              >
                Ingested Features ({uploadResult.headers.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {uploadResult.headers.map((h, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                      isRetro
                        ? "bg-[#FAF7F2] border-[#1C1917]/25 text-[#1C1917]"
                        : "bg-slate-800/60 border-slate-700 text-slate-300"
                    }`}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <div
          className={`mt-4 p-3 rounded-xl border flex items-center space-x-2 text-xs font-mono ${
            isRetro
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-red-950/40 border-red-500/40 text-red-400"
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
