"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Eye,
  ArrowRight,
  Database,
  Cpu,
  RefreshCw,
  ImageIcon,
  Grid,
  FileArchive
} from "lucide-react";

export interface VisionResult {
  success: boolean;
  dataset_name: string;
  filename: string;
  storage_path: string;
  total_images: number;
  features_count: number;
  target_size: string;
  channels: number;
  classes: Record<string, number>;
  class_distribution: Record<string, number>;
  thumbnails: Array<{
    filename: string;
    label_name: string;
    label_id: number;
    thumbnail_b64: string;
    matrix_preview: number[];
  }>;
  csv_text: string;
  preview_rows: string[][];
  csv_size_kb: number;
}

interface ImageProcessingStudioProps {
  onDatasetReady?: (result: VisionResult) => void;
  className?: string;
  variant?: "retro" | "cyber";
}

export default function ImageProcessingStudio({
  onDatasetReady,
  className = "",
  variant = "cyber",
}: ImageProcessingStudioProps) {
  const [resolution, setResolution] = useState<number>(28);
  const [grayscale, setGrayscale] = useState<boolean>(true);
  const [datasetName, setDatasetName] = useState<string>("Cellular_Pathology_Scans");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<VisionResult | null>(null);
  const [selectedThumb, setSelectedThumb] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("dataset_name", datasetName);
    formData.append("resolution", resolution.toString());
    formData.append("grayscale", grayscale.toString());

    if (files.length === 1 && files[0].name.toLowerCase().endsWith(".zip")) {
      formData.append("file", files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      const res = await fetch("/api/datasets/process-images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Image processing failed.");
      }
      setResult(data);
      setSelectedThumb(0);
      if (onDatasetReady) onDatasetReady(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to process images.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleGenerateDemo = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/datasets/generate-vision-demo?samples=240&resolution=${resolution}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate demo image dataset.");
      }
      setResult(data);
      setSelectedThumb(0);
      if (onDatasetReady) onDatasetReady(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Network error generating demo dataset.");
    } finally {
      setIsProcessing(false);
    }
  };

  const activeImage = result?.thumbnails?.[selectedThumb];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Configuration Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-1">
              <ImageIcon className="w-4 h-4" />
              <span>COMPUTER VISION PREPROCESSING ENGINE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Image Matrix Ingestion & Feature Normalization
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Extract raw pixels or multi-channel visual signals into tabular 2D matrices formatted for decentralized edge SGD.
            </p>
          </div>

          <button
            onClick={handleGenerateDemo}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center space-x-2 hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Generate Demo Cellular Scans (240 Imgs)</span>
          </button>
        </div>

        {/* Processing Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              TARGET MATRIX RESOLUTION
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { res: 28, label: "28x28 (784 Dims)" },
                { res: 32, label: "32x32 (1,024 Dims)" },
                { res: 64, label: "64x64 (4,096 Dims)" },
              ].map((item) => (
                <button
                  key={item.res}
                  onClick={() => setResolution(item.res)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-mono border transition-all ${
                    resolution === item.res
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              COLOR CHANNEL FORMAT
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGrayscale(true)}
                className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                  grayscale
                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                Grayscale (1 Ch, Scaled [0,1])
              </button>
              <button
                onClick={() => setGrayscale(false)}
                className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                  !grayscale
                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                RGB (3 Ch, Scaled [0,1])
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              DATASET NAME IDENTIFIER
            </label>
            <input
              type="text"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. Skin_Lesions_Vision"
            />
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-8 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl bg-slate-950/40 cursor-pointer text-center transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".zip,.png,.jpg,.jpeg,.bmp,.webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Drop Image ZIP Archive or Multiple Image Files (.png, .jpg, .zip)
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Subfolders in ZIP automatically designate class labels (e.g. <span className="font-mono text-cyan-400">/benign</span> and <span className="font-mono text-cyan-400">/malignant</span>).
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Visual Inspection Panel */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thumbnails Gallery */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Grid className="w-4 h-4 text-cyan-400" />
                  <span>Processed Image Samples ({result.total_images} Total)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any thumbnail to inspect its normalized 2D pixel intensity matrix
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {Object.entries(result.class_distribution).map(([className, count]) => (
                  <span
                    key={className}
                    className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-300"
                  >
                    {className}: {count}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-2">
              {result.thumbnails.map((t, idx) => {
                const isSelected = selectedThumb === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedThumb(idx)}
                    className={`relative p-1 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-950/40 shadow-md shadow-cyan-500/20 scale-105"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                    }`}
                  >
                    <img
                      src={t.thumbnail_b64}
                      alt={t.filename}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="mt-1 text-[9px] font-mono truncate text-center text-slate-400">
                      {t.label_name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matrix & Dimension Metadata Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Dimensions</span>
                <span className="text-white font-bold">{result.target_size}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Feature Columns</span>
                <span className="text-cyan-400 font-bold">{result.features_count} Raw Inputs</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">CSV Storage File</span>
                <span className="text-emerald-400 font-bold">{result.filename} ({result.csv_size_kb} KB)</span>
              </div>
            </div>
          </div>

          {/* Matrix Heatmap Inspector for Active Image */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>2D Pixel Intensity Matrix</span>
              </h3>
              {activeImage && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Label: {activeImage.label_name} ({activeImage.label_id})
                </span>
              )}
            </div>

            {activeImage && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={activeImage.thumbnail_b64}
                    alt={activeImage.filename}
                    className="w-16 h-16 rounded-xl border border-slate-700 shadow-md"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{activeImage.filename}</span>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Target: Class {activeImage.label_id}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">
                      First 16 normalized floats:
                    </span>
                  </div>
                </div>

                {/* 4x4 Sample Heatmap Matrix */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px] text-center">
                    {activeImage.matrix_preview.map((val, pIdx) => {
                      const opacity = Math.max(0.1, val);
                      return (
                        <div
                          key={pIdx}
                          style={{ backgroundColor: `rgba(6, 182, 212, ${opacity})` }}
                          className="p-1 rounded text-slate-950 font-bold transition-all"
                          title={`Pixel ${pIdx}: ${val}`}
                        >
                          {val.toFixed(2)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onDatasetReady) onDatasetReady(result);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
                  >
                    <span>Mount Dataset & Open Tabular Profiler</span>
                    <ArrowRight className="w-4 h-4" />
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
