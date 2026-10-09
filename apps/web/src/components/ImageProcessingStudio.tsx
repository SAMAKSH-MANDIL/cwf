"use client";

import React, { useState, useRef, useEffect } from "react";
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
  FileArchive,
  FolderUp,
  Folder
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

interface FileItem {
  file: File;
  path: string;
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
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<VisionResult | null>(null);
  const [selectedThumb, setSelectedThumb] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  // Enable directory upload attributes on folder input
  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  const uploadBatch = async (items: FileItem[]) => {
    if (!items || items.length === 0) {
      setErrorMsg("No files found to process.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setStatusText(`Packaging ${items.length} file(s)...`);

    const formData = new FormData();
    formData.append("dataset_name", datasetName);
    formData.append("resolution", resolution.toString());
    formData.append("grayscale", grayscale.toString());

    // Single ZIP archive case
    if (items.length === 1 && items[0].file.name.toLowerCase().endsWith(".zip")) {
      formData.append("file", items[0].file);
    } else {
      let validCount = 0;
      const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".tif"];
      for (const item of items) {
        const lowerName = item.file.name.toLowerCase();
        if (validExtensions.some((ext) => lowerName.endsWith(ext))) {
          // Pass the relative path as filename to preserve folder hierarchy for label inference
          formData.append("files", item.file, item.path || item.file.name);
          validCount++;
        }
      }

      if (validCount === 0) {
        setIsProcessing(false);
        setStatusText(null);
        setErrorMsg("No valid image files (.png, .jpg, .jpeg, .webp, .bmp, .tiff) found in the selected folder.");
        return;
      }
      setStatusText(`Converting ${validCount} image(s) to 2D matrices...`);
    }

    try {
      const res = await fetch("/api/datasets/process-images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Image matrix transformation failed.");
      }
      setResult(data);
      setSelectedThumb(0);
      setStatusText(null);
      if (onDatasetReady) onDatasetReady(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to process images.");
      setStatusText(null);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (folderInputRef.current) folderInputRef.current.value = "";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const items: FileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      items.push({ file: files[i], path: files[i].name });
    }
    uploadBatch(items);
  };

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const items: FileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relPath = (file as any).webkitRelativePath || file.name;
      items.push({ file, path: relPath });
    }
    uploadBatch(items);
  };

  // Recursively traverse dropped directories and files
  const traverseEntry = async (entry: any, currentPath = ""): Promise<FileItem[]> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        entry.file(
          (file: File) => {
            const relPath = currentPath ? `${currentPath}/${file.name}` : file.name;
            resolve([{ file, path: relPath }]);
          },
          () => resolve([])
        );
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const entries: any[] = [];
      const readEntries = (): Promise<any[]> => {
        return new Promise((resolve) => {
          dirReader.readEntries(
            (results: any[]) => {
              if (results.length === 0) {
                resolve(entries);
              } else {
                entries.push(...results);
                resolve(readEntries());
              }
            },
            () => resolve(entries)
          );
        });
      };
      const allEntries = await readEntries();
      const newPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
      const nested = await Promise.all(allEntries.map((e) => traverseEntry(e, newPath)));
      return nested.flat();
    }
    return [];
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const fileList: FileItem[] = [];
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const f = e.dataTransfer.files[i];
          fileList.push({ file: f, path: f.name });
        }
        await uploadBatch(fileList);
      }
      return;
    }

    setStatusText("Scanning dropped folders and images...");
    const collected: FileItem[] = [];
    const entries: any[] = [];

    for (let i = 0; i < items.length; i++) {
      const entry = (items[i] as any).webkitGetAsEntry ? (items[i] as any).webkitGetAsEntry() : null;
      if (entry) {
        entries.push(entry);
      } else {
        const file = items[i].getAsFile();
        if (file) collected.push({ file, path: file.name });
      }
    }

    if (entries.length > 0) {
      for (const entry of entries) {
        const itemsInEntry = await traverseEntry(entry);
        collected.push(...itemsInEntry);
      }
    }

    await uploadBatch(collected);
  };

  const handleGenerateDemo = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setStatusText("Synthesizing microscopic tissue scans...");
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
      setStatusText(null);
      if (onDatasetReady) onDatasetReady(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Network error generating demo dataset.");
      setStatusText(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const activeImage = result?.thumbnails?.[selectedThumb];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".zip,.png,.jpg,.jpeg,.bmp,.webp,.tiff,.tif"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        onChange={handleFolderUpload}
        className="hidden"
      />

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
              Convert raw images or nested category folders into normalized 2D tabular matrices for decentralized edge training.
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

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              TARGET MATRIX RESOLUTION
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { res: 28, label: "28×28", features: "784 px" },
                { res: 32, label: "32×32", features: "1,024 px" },
                { res: 64, label: "64×64", features: "4,096 px" },
              ].map((item) => (
                <button
                  key={item.res}
                  onClick={() => setResolution(item.res)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                    resolution === item.res
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{item.features}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              COLOR CHANNEL EXTRACTION
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGrayscale(true)}
                className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                  grayscale
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                Grayscale (1 Ch, [0,1])
              </button>
              <button
                onClick={() => setGrayscale(false)}
                className={`py-2 px-3 rounded-lg text-xs font-mono border transition-all ${
                  !grayscale
                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                RGB (3 Ch, [0,1])
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
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all ${
            dragActive
              ? "border-cyan-400 bg-cyan-950/30 scale-[1.01]"
              : "border-slate-800 hover:border-cyan-500/50 bg-slate-950/40"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {isProcessing ? (
                <RefreshCw className="w-7 h-7 animate-spin" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <div>
              <p className="text-base font-bold text-white">
                Drag & Drop Entire Folder, Images, or .ZIP Archive
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Subfolders automatically define class labels (e.g. <span className="font-mono text-cyan-400">dataset/cats/</span> and <span className="font-mono text-cyan-400">dataset/dogs/</span>).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                <FolderUp className="w-4 h-4" />
                <span>Select Entire Image Folder</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <FileArchive className="w-4 h-4 text-cyan-400" />
                <span>Select Files or .ZIP</span>
              </button>
            </div>

            {statusText && (
              <div className="text-xs font-mono text-cyan-400 flex items-center space-x-2 animate-pulse pt-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{statusText}</span>
              </div>
            )}
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
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Thumbnail Gallery ({result.total_images} Extracted Samples)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span>Classes:</span>
                {Object.entries(result.classes).map(([className, id]) => (
                  <span
                    key={className}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700"
                  >
                    {className} ({result.class_distribution[className] || 0})
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-80 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
              {result.thumbnails.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedThumb(idx)}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border transition-all ${
                    selectedThumb === idx
                      ? "border-cyan-400 ring-2 ring-cyan-500/30 scale-105"
                      : "border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={`data:image/png;base64,${t.thumbnail_b64}`}
                    alt={t.filename}
                    className="w-full h-14 object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-[9px] font-mono text-center text-slate-300 truncate px-1">
                    {t.label_name}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="font-mono">
                Storage: <span className="text-slate-200">{result.storage_path}</span>
              </div>
              <div className="font-mono">
                Matrix Size: <span className="text-cyan-400">{result.csv_size_kb} KB</span>
              </div>
            </div>
          </div>

          {/* Interactive 2D Pixel Heatmap Matrix Explorer */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Grid className="w-4 h-4 text-emerald-400" />
                <span>2D Pixel Intensity Heatmap</span>
              </div>
              {activeImage && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  Label: {activeImage.label_name}
                </span>
              )}
            </div>

            {activeImage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div
                    className="grid gap-[1px] bg-slate-900 p-1 rounded-lg border border-slate-800"
                    style={{
                      gridTemplateColumns: `repeat(${resolution}, minmax(0, 1fr))`,
                      width: "196px",
                      height: "196px",
                    }}
                  >
                    {activeImage.matrix_preview.map((val, pIdx) => {
                      const intensity = Math.round(val * 255);
                      return (
                        <div
                          key={pIdx}
                          title={`px_${String(pIdx).padStart(4, "0")}: ${val.toFixed(3)}`}
                          style={{
                            backgroundColor: `rgb(${intensity}, ${intensity}, ${intensity})`,
                          }}
                          className="w-full h-full hover:ring-1 hover:ring-cyan-400 cursor-crosshair transition-all"
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>File:</span>
                    <span className="text-white truncate max-w-[150px]">{activeImage.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="text-cyan-400">{result.target_size} ({result.features_count} inputs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pixel Range:</span>
                    <span className="text-emerald-400">[0.000, 1.000] Normalized</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onDatasetReady) onDatasetReady(result);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Database className="w-4 h-4" />
                  <span>Mount Dataset & Open Tabular Profiler</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-500 font-mono">
                Select a thumbnail to inspect pixel heatmap
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
