"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Play,
  Download,
  Copy,
  Check,
  Sparkles,
  Server,
  Layers,
  Cpu,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  FolderOpen
} from "lucide-react";

interface PipelineTemplate {
  key: string;
  name: string;
  category: string;
  description: string;
  code: string;
}

interface PipelineStudioProps {
  serverHost?: string;
  className?: string;
  variant?: "retro" | "cyber";
}

export default function PipelineStudio({
  serverHost = "http://localhost:8000",
  className = "",
  variant = "retro",
}: PipelineStudioProps) {
  const [templates, setTemplates] = useState<PipelineTemplate[]>([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("tabular_mlp");
  const [code, setCode] = useState<string>("");
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [customNodeName, setCustomNodeName] = useState<string>("Hospital_Beta_Node");
  const [customDataPath, setCustomDataPath] = useState<string>("C:/data/patient_records.csv");

  useEffect(() => {
    fetchTemplates();
    fetchCurrentPipeline();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/pipeline/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (e) {
      console.error("Failed to fetch pipeline templates", e);
    }
  };

  const fetchCurrentPipeline = async () => {
    try {
      const res = await fetch("/api/pipeline/current");
      if (res.ok) {
        const data = await res.json();
        if (data && data.code) {
          setCode(data.code);
          if (data.template_key) {
            setSelectedTemplateKey(data.template_key);
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch current pipeline", e);
    }
  };

  const handleSelectTemplate = (templateKey: string) => {
    setSelectedTemplateKey(templateKey);
    const tmpl = templates.find((t) => t.key === templateKey);
    if (tmpl) {
      setCode(tmpl.code);
    }
  };

  const handleDeployPipeline = async () => {
    if (!code.trim()) return;
    setIsDeploying(true);
    setDeploySuccess(null);
    try {
      const res = await fetch("/api/pipeline/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          template_key: selectedTemplateKey,
          model_name: templates.find((t) => t.key === selectedTemplateKey)?.name || "CustomFederatedPipeline",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeploySuccess(`Pipeline deployed to edge mesh (${data.bytes_count || code.length} bytes broadcasted via WebSocket).`);
        setTimeout(() => setDeploySuccess(null), 5000);
      }
    } catch (e) {
      console.error("Failed to deploy pipeline", e);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDownload = () => {
    window.open("/api/pipeline/download", "_blank");
  };

  const cliCommand = `python fedzero_worker.py --server ${serverHost} --name "${customNodeName}" --data-path "${customDataPath}" --pipeline "./pipeline.py"`;

  const copyCliCommand = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const isRetro = variant === "retro";
  const linesCount = code.split("\n").length;

  return (
    <div
      className={`rounded-2xl border-2 space-y-6 ${
        isRetro
          ? "bg-[#FAF7F2] border-[#1C1917] retro-shadow p-7"
          : "bg-slate-900/60 border-slate-800 p-7 backdrop-blur-md"
      } ${className}`}
    >
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1C1917]/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span
              className={`w-7 h-7 rounded-lg font-mono font-black text-xs flex items-center justify-center border ${
                isRetro
                  ? "bg-[#E05338] text-white border-[#1C1917]"
                  : "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
              }`}
            >
              <FileCode className="w-4 h-4" />
            </span>
            <h3
              className={`text-xl font-black font-display uppercase tracking-tight ${
                isRetro ? "text-[#1C1917]" : "text-white"
              }`}
            >
              Python Pipeline Studio & Distributed Execution
            </h3>
          </div>
          <p
            className={`text-xs font-mono ${
              isRetro ? "text-[#78716C]" : "text-slate-400"
            }`}
          >
            Design custom model architectures & local training steps. Edge nodes run the pipeline on their local private datasets with zero raw data sharing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">


          <button
            onClick={handleDownload}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 border-2 transition-all hover:scale-102 ${
              isRetro
                ? "bg-[#FAF7F2] border-[#1C1917] text-[#1C1917] hover:bg-[#F2ECE1]"
                : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#E05338]" />
            <span>Download pipeline.py</span>
          </button>


          <button
            onClick={handleDeployPipeline}
            disabled={isDeploying}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center space-x-2 border-2 transition-transform hover:scale-102 ${
              isRetro
                ? "bg-[#1C1917] text-white border-[#1C1917] retro-shadow-sm disabled:opacity-50"
                : "bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isDeploying ? "animate-spin" : ""}`} />
            <span>{isDeploying ? "Broadcasting..." : "Deploy to Mesh"}</span>
          </button>
        </div>
      </div>

      {/* Templates Selector */}
      <div className="space-y-3">
        <label
          className={`text-xs font-mono font-black uppercase tracking-wider ${
            isRetro ? "text-[#1C1917]" : "text-slate-300"
          }`}
        >
          Select Pipeline Architecture Template:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templates.map((tmpl) => {
            const isSelected = selectedTemplateKey === tmpl.key;
            return (
              <div
                key={tmpl.key}
                onClick={() => handleSelectTemplate(tmpl.key)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? isRetro
                      ? "bg-[#F4EFE6] border-[#1C1917] retro-shadow ring-2 ring-[#E05338]"
                      : "bg-cyan-950/30 border-cyan-500 ring-2 ring-cyan-500/40"
                    : isRetro
                    ? "bg-[#FAF7F2] border-[#1C1917]/30 hover:border-[#1C1917]"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                      isRetro
                        ? "bg-[#E05338]/10 text-[#E05338] border-[#E05338]/30"
                        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    }`}
                  >
                    {tmpl.category}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-display font-bold text-sm ${
                      isRetro ? "text-[#1C1917]" : "text-white"
                    }`}
                  >
                    {tmpl.name}
                  </h4>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      isRetro ? "text-[#57534E]" : "text-slate-400"
                    }`}
                  >
                    {tmpl.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deploy Success Callout */}
      {deploySuccess && (
        <div
          className={`p-3.5 rounded-xl border-2 flex items-center space-x-2.5 text-xs font-mono font-bold animate-in fade-in ${
            isRetro
              ? "bg-[#EBF7EE] border-[#1C1917] text-[#166534]"
              : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{deploySuccess}</span>
        </div>
      )}

      {/* Interactive Python Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span
              className={`font-bold ${
                isRetro ? "text-[#1C1917]" : "text-slate-300"
              }`}
            >
              pipeline.py
            </span>
            <span
              className={`text-[11px] ${
                isRetro ? "text-[#78716C]" : "text-slate-500"
              }`}
            >
              ({linesCount} lines • Python 3)
            </span>
          </div>
          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
              isRetro
                ? "bg-[#FAF7F2] border-[#1C1917]/20 text-[#78716C]"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            Custom Architecture & SGD Definition
          </span>
        </div>

        <div
          className={`rounded-xl border-2 overflow-hidden ${
            isRetro
              ? "bg-[#1C1917] border-[#1C1917] retro-shadow-sm text-stone-200"
              : "bg-slate-950 border-slate-800 text-slate-200"
          }`}
        >
          {/* Editor Header Bar */}
          <div className="px-4 py-2 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-400">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 text-stone-400 font-bold">edge_training_pipeline.py</span>
            </div>
            <span>Editable in-browser or on local edge machines</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={16}
            spellCheck={false}
            className="w-full p-4 font-mono text-xs leading-relaxed bg-transparent text-emerald-400 focus:outline-none resize-y selection:bg-cyan-500/30 selection:text-white"
            placeholder="# Write your custom Python federated pipeline code..."
          />
        </div>
      </div>

      {/* Multi-Device Connection & Dataset Path Customization Helper */}
      <div
        className={`p-5 rounded-xl border-2 space-y-4 ${
          isRetro
            ? "bg-[#F7F4EE] border-[#1C1917]"
            : "bg-slate-950/60 border-slate-800"
        }`}
      >
        <div className="flex items-center space-x-2 text-xs font-mono font-black uppercase text-[#E05338]">
          <Terminal className="w-4 h-4" />
          <span>Launch on Other Devices with Custom Local Dataset Paths</span>
        </div>

        <p
          className={`text-xs font-medium leading-relaxed ${
            isRetro ? "text-[#57534E]" : "text-slate-400"
          }`}
        >
          Each connected edge device runs the same pipeline logic locally on its own private hardware enclave. Devices can specify their own local dataset path (<code className="px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#1C1917]/20 font-bold font-mono">--data-path</code>) and edit <code className="px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#1C1917]/20 font-bold font-mono">pipeline.py</code> locally without affecting other nodes!
        </p>

        {/* Input Parameters for Command Generator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <label className="font-bold text-[#1C1917]">Node Device Name:</label>
            <input
              type="text"
              value={customNodeName}
              onChange={(e) => setCustomNodeName(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#1C1917]/40 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#E05338]"
              placeholder="e.g. Hospital_Beta_Node"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-[#1C1917]">Device's Local Dataset Path:</label>
            <input
              type="text"
              value={customDataPath}
              onChange={(e) => setCustomDataPath(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#1C1917]/40 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#E05338]"
              placeholder="e.g. /home/user/data.csv or C:/data/patients.csv"
            />
          </div>
        </div>

        {/* Generated Command Box */}
        <div className="p-3 rounded-lg bg-[#1C1917] text-white flex items-center justify-between gap-3 text-xs font-mono retro-shadow-sm">
          <code className="text-emerald-400 overflow-x-auto whitespace-nowrap">
            {cliCommand}
          </code>
          <button
            onClick={copyCliCommand}
            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 flex items-center space-x-1 shrink-0 font-bold text-[11px]"
          >
            {copiedCmd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
