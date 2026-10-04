"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FolderPlus, 
  UploadCloud, 
  CheckCircle2, 
  Settings2, 
  Database, 
  Cpu, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  Binary, 
  FileText, 
  Sparkles,
  Play,
  Sliders,
  AlertCircle,
  Plus,
  Trash2,
  Network,
  Zap
} from "lucide-react";

export default function DatasetsPage() {
  const [presets, setPresets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("heart_disease_uci");

  // Custom CSV State
  const [customCsvText, setCustomCsvText] = useState<string>("");
  const [activeCsv, setActiveCsv] = useState<string>("");

  // Profiler State
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);

  // Configuration State
  const [targetCol, setTargetCol] = useState<string>("");
  const [problemType, setProblemType] = useState<string>("logistic_regression");
  const [featureConfigs, setFeatureConfigs] = useState<Record<string, { selected: boolean; action: string }>>({});
  const [modelName, setModelName] = useState<string>("");

  // Hyperparameters & Architecture State
  const [archPreset, setArchPreset] = useState<"linear" | "shallow" | "deep" | "ultra_deep" | "custom">("shallow");
  const [hiddenLayers, setHiddenLayers] = useState<number[]>([32]);

  // Deployment State
  const [deploying, setDeploying] = useState<boolean>(false);
  const [deployResult, setDeployResult] = useState<any>(null);

  // Load Presets on Mount
  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const res = await fetch("/api/datasets/presets");
      if (res.ok) {
        const data = await res.json();
        setPresets(data);
        if (data.length > 0) {
          loadPreset(data[0].key);
        }
      }
    } catch (e) {
      console.error("Failed to load presets", e);
    }
  };

  const loadPreset = async (key: string) => {
    setSelectedPresetKey(key);
    setLoadingProfile(true);
    setDeployResult(null);
    try {
      const res = await fetch("/api/datasets/load-preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset_key: key }),
      });
      if (res.ok) {
        const data = await res.json();
        applyProfile(data, data.csv_text, key);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleProfileCustomCsv = async () => {
    if (!customCsvText.trim()) return;
    setLoadingProfile(true);
    setDeployResult(null);
    try {
      const res = await fetch("/api/datasets/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv_text: customCsvText }),
      });
      if (res.ok) {
        const data = await res.json();
        applyProfile(data, customCsvText, "custom_dataset");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCustomCsvText(text);
        setActiveTab("custom");
        // Automatically profile
        setLoadingProfile(true);
        fetch("/api/datasets/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ csv_text: text }),
        })
          .then((r) => r.json())
          .then((data) => applyProfile(data, text, file.name.replace(".csv", "")))
          .finally(() => setLoadingProfile(false));
      }
    };
    reader.readAsText(file);
  };

  const applyProfile = (data: any, csv: string, baseName: string) => {
    setProfile(data);
    setActiveCsv(csv);
    setTargetCol(data.suggested_target);
    setProblemType(data.suggested_problem_type);
    setModelName(`${baseName.replace(/[^a-zA-Z0-9]/g, "-")}-Model`);

    // Build initial feature configs based on profile recommendations
    const configs: Record<string, { selected: boolean; action: string }> = {};
    data.columns.forEach((col: any) => {
      if (col.name === data.suggested_target) {
        configs[col.name] = { selected: false, action: "drop" };
      } else {
        configs[col.name] = {
          selected: col.selected,
          action: col.suggested_action,
        };
      }
    });
    setFeatureConfigs(configs);
  };

  const toggleFeatureSelected = (colName: string) => {
    setFeatureConfigs((prev) => ({
      ...prev,
      [colName]: {
        ...prev[colName],
        selected: !prev[colName]?.selected,
      },
    }));
  };

  const handleSelectTargetColumn = (newTarget: string) => {
    const oldTarget = targetCol;
    setTargetCol(newTarget);

    // Auto-detect problem type from the newly selected target column
    const newTargetMeta = profile?.columns?.find((c: any) => c.name === newTarget);
    if (newTargetMeta) {
      if (newTargetMeta.unique_count === 2) {
        setProblemType("logistic_regression");
      } else if (newTargetMeta.is_numeric && newTargetMeta.unique_count > 2) {
        setProblemType("linear_regression");
      }
    }

    setFeatureConfigs((prev) => {
      const updated = { ...prev };
      // 1. Restore old target back to a feature
      if (oldTarget && oldTarget !== newTarget) {
        const oldMeta = profile?.columns?.find((c: any) => c.name === oldTarget);
        updated[oldTarget] = {
          selected: true,
          action: oldMeta?.suggested_action || (oldMeta?.unique_count <= 2 ? "binary" : "numeric"),
        };
      }
      // 2. Set new target as excluded from features
      updated[newTarget] = {
        selected: false,
        action: "drop",
      };
      return updated;
    });
  };

  const setFeatureAction = (colName: string, action: string) => {
    setFeatureConfigs((prev) => ({
      ...prev,
      [colName]: {
        ...prev[colName],
        action: action,
        selected: action !== "drop",
      },
    }));
  };

  // Calculate estimated input dimension after encodings
  const calculateOutputDimensions = () => {
    if (!profile) return 0;
    let dim = 0;
    profile.columns.forEach((col: any) => {
      if (col.name === targetCol) return;
      const cfg = featureConfigs[col.name];
      if (!cfg || !cfg.selected || cfg.action === "drop") return;

      if (cfg.action === "one_hot") {
        dim += col.unique_count;
      } else {
        dim += 1;
      }
    });
    return dim;
  };

  // Architecture & Hyperparameter Helpers
  const handleSelectArchPreset = (preset: "linear" | "shallow" | "deep" | "ultra_deep" | "custom") => {
    setArchPreset(preset);
    if (preset === "linear") setHiddenLayers([]);
    else if (preset === "shallow") setHiddenLayers([32]);
    else if (preset === "deep") setHiddenLayers([64, 32]);
    else if (preset === "ultra_deep") setHiddenLayers([128, 64, 32]);
  };

  const handleUpdateLayerNeurons = (index: number, count: number) => {
    const updated = [...hiddenLayers];
    updated[index] = Math.max(1, Math.min(1024, count));
    setHiddenLayers(updated);
  };

  const handleAddLayer = () => {
    if (hiddenLayers.length >= 5) return;
    const last = hiddenLayers.length > 0 ? Math.max(8, Math.floor(hiddenLayers[hiddenLayers.length - 1] / 2)) : 32;
    setHiddenLayers([...hiddenLayers, last]);
    setArchPreset("custom");
  };

  const handleRemoveLayer = (index: number) => {
    const updated = hiddenLayers.filter((_, i) => i !== index);
    setHiddenLayers(updated);
    setArchPreset("custom");
  };

  const calculateTotalParameters = () => {
    const inDim = calculateOutputDimensions();
    if (inDim === 0) return 0;
    const dims = [inDim, ...hiddenLayers, 1];
    let total = 0;
    for (let i = 0; i < dims.length - 1; i++) {
      total += (dims[i] * dims[i + 1]) + dims[i + 1];
    }
    return total;
  };

  const handleDeployToEdge = async () => {
    if (!activeCsv || !targetCol) return;
    setDeploying(true);
    try {
      const res = await fetch("/api/datasets/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csv_text: activeCsv,
          target_col: targetCol,
          feature_configs: featureConfigs,
          problem_type: problemType,
          model_name: modelName || "Custom-Dynamic-Model",
          hidden_layers: hiddenLayers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDeployResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AutoML • Dynamic Dataset Ingestion & Partitioning</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dataset & Feature Studio
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Upload custom CSV tabular data or load curated Kaggle/HuggingFace datasets. Configure categorical encodings (0/1 or One-Hot), select labels, and auto-deploy to edge devices for federated training.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <label className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-sm font-semibold cursor-pointer transition-all hover:scale-102">
            <UploadCloud className="w-4 h-4" />
            <span>Upload Custom CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Source Selection Tabs */}
      <div className="flex space-x-3 border-b border-slate-800/80 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab("presets")}
          className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
            activeTab === "presets"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Curated Kaggle / HF Presets</span>
        </button>

        <button
          onClick={() => setActiveTab("custom")}
          className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
            activeTab === "custom"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Upload or Paste Custom CSV</span>
        </button>
      </div>

      {/* Preset Cards Grid */}
      {activeTab === "presets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((p) => {
            const isSelected = selectedPresetKey === p.key;
            return (
              <div
                key={p.key}
                onClick={() => loadPreset(p.key)}
                className={`p-5 rounded-2xl border card-3d cursor-pointer transition-all ${
                  isSelected
                    ? "bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10 scale-102"
                    : "glass-panel border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    p.problem_type === "logistic_regression"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}>
                    {p.problem_type === "logistic_regression" ? "Logistic" : "Linear"}
                  </span>
                  <span className="text-slate-400">{p.features_count} Raw Features</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-3 leading-snug">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>Target: {p.target_col}</span>
                  {isSelected && <span className="font-bold">✓ Selected</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom CSV Paste Box */}
      {activeTab === "custom" && (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Paste Raw CSV Data or Drag & Drop File Above</span>
            </h3>
            <button
              onClick={handleProfileCustomCsv}
              disabled={loadingProfile || !customCsvText.trim()}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              {loadingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Inspect & Profile Dataset</span>
            </button>
          </div>
          <textarea
            value={customCsvText}
            onChange={(e) => setCustomCsvText(e.target.value)}
            rows={5}
            placeholder="age,sex,blood_pressure,cholesterol,diagnosis&#10;54,Male,130,240,1&#10;48,Female,120,180,0&#10;..."
            className="w-full bg-[#050811] border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      )}

      {/* Dataset Profile & Interactive Column Schema Mapping */}
      {profile && (
        <div className="space-y-6">
          {/* Target and Problem Type Configuration */}
          <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                  1. Target / Label Column (y)
                </label>
                <span className="text-[11px] font-mono text-cyan-400">
                  Target: <strong className="text-white">{targetCol}</strong>
                </span>
              </div>
              <select
                value={targetCol}
                onChange={(e) => handleSelectTargetColumn(e.target.value)}
                className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 font-bold shadow-inner cursor-pointer"
              >
                {profile.columns.map((c: any) => (
                  <option key={c.name} value={c.name}>
                    {c.name === targetCol ? "🎯 Target: " : ""}{c.name} ({c.inferred_type}, {c.unique_count} unique values)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                2. Model & Problem Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProblemType("logistic_regression")}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                    problemType === "logistic_regression"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                      : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  ⚡ Logistic Regression
                </button>
                <button
                  type="button"
                  onClick={() => setProblemType("linear_regression")}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                    problemType === "linear_regression"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400"
                      : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  📈 Linear Regression
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                3. Model Identifier
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. Heart-Disease-Logistic-v1"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Hyperparameters & Dynamic Neural Architecture Studio */}
          <div className="p-6 rounded-3xl glass-panel border border-indigo-500/30 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Dynamic Neural Architecture &amp; Hyperparameters</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure network depth, hidden layers, and neuron counts per layer. Supports arbitrary topologies from pure linear models to deep MLPs.
                </p>
              </div>

              {/* Topology Summary Pill */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs font-mono">
                <Network className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Total Params:</span>
                <span className="text-indigo-300 font-bold">{calculateTotalParameters().toLocaleString()}</span>
              </div>
            </div>

            {/* Architecture Presets */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                Architecture Topology Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { key: "linear", label: "Pure Linear / Logistic", desc: "0 Hidden Layers (D ➔ 1)" },
                  { key: "shallow", label: "Shallow MLP", desc: "1 Layer (32 ReLU)" },
                  { key: "deep", label: "Deep MLP", desc: "2 Layers (64 ➔ 32)" },
                  { key: "ultra_deep", label: "Ultra Deep MLP", desc: "3 Layers (128 ➔ 64 ➔ 32)" },
                  { key: "custom", label: "Custom Architecture", desc: "User Defined Depth & Width" },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleSelectArchPreset(p.key as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      archPreset === p.key
                        ? "bg-indigo-600/20 border-indigo-400 text-white shadow-md shadow-indigo-500/20"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{p.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hidden Layers Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                  Hidden Layers Configuration ({hiddenLayers.length} Layers)
                </span>
                <button
                  type="button"
                  onClick={handleAddLayer}
                  disabled={hiddenLayers.length >= 5}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/40 hover:border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-mono transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Layer</span>
                </button>
              </div>

              {hiddenLayers.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center space-x-3">
                  <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Pure single-layer model selected: Inputs map directly to output via {problemType === "logistic_regression" ? "Sigmoid (Logistic)" : "Linear regression"} without hidden layers.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {hiddenLayers.map((neurons, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-500/40 transition-all space-y-2.5 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-indigo-300 flex items-center space-x-1">
                          <span>Layer #{idx + 1}</span>
                          <span className="text-[10px] text-slate-500">(ReLU)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLayer(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove Layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 text-[11px]">Neurons:</span>
                          <input
                            type="number"
                            min="1"
                            max="512"
                            value={neurons}
                            onChange={(e) => handleUpdateLayerNeurons(idx, parseInt(e.target.value) || 1)}
                            className="w-16 bg-slate-950 border border-indigo-500/40 rounded-lg px-2 py-0.5 text-right font-bold text-white text-xs focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="256"
                          step="4"
                          value={neurons}
                          onChange={(e) => handleUpdateLayerNeurons(idx, parseInt(e.target.value))}
                          className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Neural Topology Visualization Flowchart */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs space-y-2">
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                Synthesized Computation Graph Pipeline
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Input Layer */}
                <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold flex items-center space-x-1.5 shadow-sm">
                  <span>Input:</span>
                  <span className="text-white">{calculateOutputDimensions()} Features</span>
                </div>

                {/* Arrow */}
                <span className="text-slate-600 font-bold">➔</span>

                {/* Hidden Layers */}
                {hiddenLayers.map((h, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-bold flex items-center space-x-1.5 shadow-sm">
                      <span>Hidden #{i + 1}:</span>
                      <span className="text-white">{h} Neurons</span>
                      <span className="text-[10px] text-indigo-400">(ReLU)</span>
                    </div>
                    <span className="text-slate-600 font-bold">➔</span>
                  </div>
                ))}

                {/* Output Layer */}
                <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold flex items-center space-x-1.5 shadow-sm">
                  <span>Output:</span>
                  <span className="text-white">1</span>
                  <span className="text-[10px] text-emerald-400">
                    ({problemType === "logistic_regression" ? "Sigmoid" : "Linear"})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Feature Configuration Table */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Configure Features & Categorical Encodings</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click <span className="text-cyan-400 font-semibold">&quot;Set as Target&quot;</span> on any column to make it the target variable, or select feature checkboxes &amp; encodings below.
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                  {profile.total_rows} Rows
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold">
                  {calculateOutputDimensions()} Resulting Model Inputs
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3 w-10">Use</th>
                    <th className="p-3">Target Role</th>
                    <th className="p-3">Column Name</th>
                    <th className="p-3">Inferred Type</th>
                    <th className="p-3">Sample Values</th>
                    <th className="p-3">Unique</th>
                    <th className="p-3">Action / Categorical Encoding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {profile.columns.map((c: any) => {
                    const isTarget = c.name === targetCol;
                    const cfg = featureConfigs[c.name] || { selected: false, action: "numeric" };
                    return (
                      <tr key={c.name} className={isTarget ? "bg-cyan-950/30 font-bold border-l-4 border-l-cyan-400" : "hover:bg-slate-800/30"}>
                        <td className="p-3">
                          {isTarget ? (
                            <span className="text-slate-500 text-[10px] select-none">-</span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={cfg.selected}
                              onChange={() => toggleFeatureSelected(c.name)}
                              className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="p-3">
                          {isTarget ? (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>TARGET (y)</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectTargetColumn(c.name)}
                              className="px-2.5 py-1 rounded-lg border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 text-[10px] font-mono transition-all hover:bg-cyan-950/40 cursor-pointer flex items-center space-x-1"
                              title="Click to make this column the target variable y"
                            >
                              <span>🎯 Set as Target</span>
                            </button>
                          )}
                        </td>
                        <td className="p-3 text-white font-semibold">
                          {c.name}
                          {isTarget && <span className="text-cyan-400 ml-2 text-[10px]">(Output Variable y)</span>}
                        </td>
                        <td className="p-3 text-slate-400">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.inferred_type === "numeric" ? "bg-slate-800 text-slate-300" : "bg-purple-950/50 text-purple-300"
                          }`}>
                            {c.inferred_type}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 truncate max-w-xs">
                          {JSON.stringify(c.sample_values)}
                        </td>
                        <td className="p-3 text-slate-400">{c.unique_count}</td>
                        <td className="p-3">
                          {isTarget ? (
                            <span className="text-xs text-cyan-400 font-mono font-bold">
                              {problemType === "logistic_regression" ? "Binarized (0 / 1) Sigmoid" : "Continuous Float"}
                            </span>
                          ) : (
                            <select
                              value={cfg.action}
                              onChange={(e) => setFeatureAction(c.name, e.target.value)}
                              disabled={!cfg.selected}
                              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 disabled:opacity-40"
                            >
                              <option value="numeric">Numeric (Z-score Standardize)</option>
                              <option value="binary">Binary (0 / 1 Mapping)</option>
                              <option value="one_hot">One-Hot Encoding (Dummify into {c.unique_count} columns)</option>
                              <option value="drop">Drop / Exclude</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Footer: Architecture Summary & Deploy Button */}
          <div className="p-7 rounded-3xl hologram-card border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 font-mono">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Ready to Synthesize Dynamic Federated Architecture</span>
              </div>
              <p className="text-xs text-slate-400">
                Model: <span className="text-white font-bold">{problemType === "logistic_regression" ? "Logistic Regression" : "Linear Regression"}</span> • Topology: <span className="text-indigo-300 font-bold font-mono">[{calculateOutputDimensions()}{hiddenLayers.length > 0 ? ` ➔ ${hiddenLayers.join(" ➔ ")}` : ""} ➔ 1]</span> • Params: <span className="text-cyan-300 font-bold">{calculateTotalParameters().toLocaleString()}</span>
              </p>
            </div>

            <button
              onClick={handleDeployToEdge}
              disabled={deploying || calculateOutputDimensions() === 0}
              className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
            >
              {deploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Partitioning & Deploying to Edge Nodes...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Deploy Dataset &amp; Initialize {hiddenLayers.length > 0 ? "Deep MLP" : "Linear"} Model</span>
                </>
              )}
            </button>
          </div>

          {/* Deployment Success Modal / Card */}
          {deployResult && (
            <div className="p-7 rounded-3xl glass-panel-glow border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Dataset Successfully Deployed to Distributed Edge!</span>
                </div>
                <Link
                  href="/training"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
                >
                  <span>Go to Training Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Deployed Model ID</div>
                  <div className="text-cyan-300 font-bold mt-1 truncate">{deployResult.model_id}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Architecture Pipeline</div>
                  <div className="text-indigo-300 font-bold mt-1">{deployResult.architecture || `${deployResult.input_dimension} ➔ 1`}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Trainable Parameters</div>
                  <div className="text-emerald-400 font-bold mt-1">{deployResult.parameters_count?.toLocaleString()} params</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Training Samples Split</div>
                  <div className="text-purple-300 font-bold mt-1">{deployResult.train_samples} samples across nodes</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400 flex flex-wrap gap-4">
                <span>Model Hash: <span className="text-cyan-400">{deployResult.model_hash?.slice(0, 20)}...</span></span>
                <span>Problem: <span className="text-white font-bold">{deployResult.problem_type}</span></span>
                <span>Active Edge Partitions: <span className="text-emerald-400 font-bold">{Object.keys(deployResult.allocated_devices || {}).length} Devices</span></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
