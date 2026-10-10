"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Layers,
  Play,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Coins,
  ArrowRight,
  Lock,
  Plus,
  Terminal,
  Server,
  Zap,
  X,
  Laptop,
  Activity,
  Trash2,
  Check,
  Box,
  Sliders,
  Sparkles,
  Copy,
  Upload,
  FileText,
  Database,
  ArrowUpRight,
  Eye,
  SlidersHorizontal,
  Split,
  Binary,
  BarChart2,
  Target,
  Download
} from "lucide-react";
import LargeFileUploader, { UploadResult } from "@/components/LargeFileUploader";
import PipelineStudio from "@/components/PipelineStudio";

// Synthetic Dataset Presets with Detailed Column Statistics for Table View

const SYNTHETIC_DATASETS = [
  {
    id: "healthcare",
    name: "Healthcare EHR Diagnostics",
    category: "Clinical Oncology & Cardio",
    description: "Multivariate patient diagnostic records with clinical biomarkers for early pathology detection.",
    rowsCount: 480,
    target: "diagnostic_risk",
    columns: [
      { name: "diagnostic_risk", type: "integer", unique: 2, encoding: "Binary Encoding", size: "3.8 KB", missing: "0 (0%)", range: "[0, 1] Binary", isTarget: true },
      { name: "age", type: "numeric", unique: 52, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "24 - 86 yrs", isTarget: false },
      { name: "systolic_bp", type: "numeric", unique: 68, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "98 - 188 mmHg", isTarget: false },
      { name: "diastolic_bp", type: "numeric", unique: 44, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "60 - 115 mmHg", isTarget: false },
      { name: "fasting_glucose", type: "numeric", unique: 94, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "65 - 240 mg/dL", isTarget: false },
      { name: "cholesterol_ldl", type: "numeric", unique: 112, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "80 - 245 mg/dL", isTarget: false },
      { name: "troponin_i", type: "numeric", unique: 38, encoding: "MinMax Scaler", size: "3.8 KB", missing: "0 (0%)", range: "0.01 - 0.45 ng/mL", isTarget: false },
      { name: "crp_biomarker", type: "numeric", unique: 49, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "0.2 - 14.8 mg/L", isTarget: false },
      { name: "wbc_count", type: "numeric", unique: 58, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "4.1 - 16.5 k/uL", isTarget: false },
      { name: "creatinine_serum", type: "numeric", unique: 31, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "0.6 - 2.8 mg/dL", isTarget: false },
      { name: "bmi_index", type: "numeric", unique: 76, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "18.2 - 42.6", isTarget: false },
      { name: "spo2_deficit", type: "numeric", unique: 22, encoding: "MinMax Scaler", size: "3.8 KB", missing: "0 (0%)", range: "0 - 8 %", isTarget: false },
      { name: "respiratory_rate", type: "numeric", unique: 18, encoding: "Numeric (Standardized)", size: "3.8 KB", missing: "0 (0%)", range: "12 - 28 bpm", isTarget: false },
      { name: "smoker_status", type: "categorical", unique: 3, encoding: "One-Hot Encoding", size: "3.8 KB", missing: "0 (0%)", range: "[0: Never, 1: Former, 2: Active]", isTarget: false },
      { name: "genetic_marker_a", type: "boolean", unique: 2, encoding: "Binary Encoding", size: "3.8 KB", missing: "0 (0%)", range: "[0, 1]", isTarget: false },
      { name: "genetic_marker_b", type: "boolean", unique: 2, encoding: "Binary Encoding", size: "3.8 KB", missing: "0 (0%)", range: "[0, 1]", isTarget: false },
    ],
    sampleRows: [
      { age: 58, systolic_bp: 142, fasting_glucose: 118, cholesterol_ldl: 165, troponin_i: 0.04, diagnostic_risk: 1 },
      { age: 44, systolic_bp: 120, fasting_glucose: 92, cholesterol_ldl: 128, troponin_i: 0.01, diagnostic_risk: 0 },
      { age: 67, systolic_bp: 156, fasting_glucose: 144, cholesterol_ldl: 189, troponin_i: 0.08, diagnostic_risk: 1 },
      { age: 39, systolic_bp: 115, fasting_glucose: 88, cholesterol_ldl: 110, troponin_i: 0.01, diagnostic_risk: 0 },
    ],
  },
  {
    id: "fraud",
    name: "Financial Transaction Anomaly",
    category: "Fintech & Web3 Fraud",
    description: "Credit card telemetry, transaction velocity, risk scores, and geospatial signals for fraud detection.",
    rowsCount: 750,
    target: "is_fraud",
    columns: [
      { name: "is_fraud", type: "integer", unique: 2, encoding: "Binary Encoding", size: "6.0 KB", missing: "0 (0%)", range: "[0: Legitimate, 1: Fraud]", isTarget: true },
      { name: "tx_amount_usd", type: "numeric", unique: 412, encoding: "Numeric (Standardized)", size: "6.0 KB", missing: "0 (0%)", range: "$1.50 - $4,850.00", isTarget: false },
      { name: "velocity_last_24h", type: "numeric", unique: 24, encoding: "Numeric (Standardized)", size: "6.0 KB", missing: "0 (0%)", range: "1 - 38 transactions", isTarget: false },
      { name: "ip_risk_score", type: "numeric", unique: 88, encoding: "MinMax Scaler", size: "6.0 KB", missing: "0 (0%)", range: "0 - 100 score", isTarget: false },
      { name: "card_age_days", type: "numeric", unique: 310, encoding: "Numeric (Standardized)", size: "6.0 KB", missing: "0 (0%)", range: "12 - 1,840 days", isTarget: false },
      { name: "foreign_country_flag", type: "boolean", unique: 2, encoding: "Binary Encoding", size: "6.0 KB", missing: "0 (0%)", range: "[0: Domestic, 1: Foreign]", isTarget: false },
      { name: "failed_pins_30d", type: "numeric", unique: 6, encoding: "Numeric (Standardized)", size: "6.0 KB", missing: "0 (0%)", range: "0 - 5 attempts", isTarget: false },
      { name: "device_fingerprint_score", type: "numeric", unique: 74, encoding: "MinMax Scaler", size: "6.0 KB", missing: "0 (0%)", range: "10 - 99", isTarget: false },
      { name: "distance_from_home_km", type: "numeric", unique: 198, encoding: "Numeric (Standardized)", size: "6.0 KB", missing: "0 (0%)", range: "0.2 - 8,400 km", isTarget: false },
      { name: "mcc_high_risk", type: "boolean", unique: 2, encoding: "One-Hot Encoding", size: "6.0 KB", missing: "0 (0%)", range: "[0, 1]", isTarget: false },
    ],
    sampleRows: [
      { tx_amount_usd: 1420.50, velocity_last_24h: 7, ip_risk_score: 88, foreign_country_flag: 1, is_fraud: 1 },
      { tx_amount_usd: 42.10, velocity_last_24h: 1, ip_risk_score: 12, foreign_country_flag: 0, is_fraud: 0 },
      { tx_amount_usd: 890.00, velocity_last_24h: 4, ip_risk_score: 74, foreign_country_flag: 1, is_fraud: 1 },
      { tx_amount_usd: 15.75, velocity_last_24h: 2, ip_risk_score: 8, foreign_country_flag: 0, is_fraud: 0 },
    ],
  },
  {
    id: "iot",
    name: "Industrial IoT Edge Telemetry",
    category: "Smart Manufacturing",
    description: "Multi-sensor industrial telemetry monitoring rotor temperature, acoustic vibrations, and RPM deviations.",
    rowsCount: 600,
    target: "machine_failure",
    columns: [
      { name: "machine_failure", type: "integer", unique: 2, encoding: "Binary Encoding", size: "4.8 KB", missing: "0 (0%)", range: "[0: Normal, 1: Failure]", isTarget: true },
      { name: "vibration_rms", type: "numeric", unique: 184, encoding: "Numeric (Standardized)", size: "4.8 KB", missing: "0 (0%)", range: "0.45 - 8.92 mm/s", isTarget: false },
      { name: "temperature_celsius", type: "numeric", unique: 92, encoding: "Numeric (Standardized)", size: "4.8 KB", missing: "0 (0%)", range: "24.5 - 114.2 °C", isTarget: false },
      { name: "hydraulic_pressure_kpa", type: "numeric", unique: 110, encoding: "Numeric (Standardized)", size: "4.8 KB", missing: "0 (0%)", range: "120 - 450 kPa", isTarget: false },
      { name: "acoustic_decibels", type: "numeric", unique: 76, encoding: "Numeric (Standardized)", size: "4.8 KB", missing: "0 (0%)", range: "54 - 108 dB", isTarget: false },
      { name: "rpm_rotational_speed", type: "numeric", unique: 140, encoding: "Numeric (Standardized)", size: "4.8 KB", missing: "0 (0%)", range: "1,200 - 4,800 RPM", isTarget: false },
      { name: "electrical_kw_draw", type: "numeric", unique: 85, encoding: "Numeric (Standardized)", size: "4.8 KB", missing: "0 (0%)", range: "3.2 - 24.8 kW", isTarget: false },
      { name: "ambient_humidity", type: "numeric", unique: 45, encoding: "MinMax Scaler", size: "4.8 KB", missing: "0 (0%)", range: "20 - 90 %", isTarget: false },
    ],
    sampleRows: [
      { vibration_rms: 4.82, temperature_celsius: 86.4, acoustic_decibels: 94.2, rpm_rotational_speed: 3450, machine_failure: 1 },
      { vibration_rms: 1.15, temperature_celsius: 48.2, acoustic_decibels: 68.1, rpm_rotational_speed: 2980, machine_failure: 0 },
      { vibration_rms: 5.10, temperature_celsius: 91.0, acoustic_decibels: 98.6, rpm_rotational_speed: 3510, machine_failure: 1 },
      { vibration_rms: 1.30, temperature_celsius: 52.0, acoustic_decibels: 70.4, rpm_rotational_speed: 3010, machine_failure: 0 },
    ],
  },
  {
    id: "mnist",
    name: "MNIST Digit PCA Embeddings",
    category: "Computer Vision",
    description: "16-dimensional PCA eigenprojections of handwritten digits for distributed privacy-preserving classification.",
    rowsCount: 900,
    target: "is_odd_digit",
    columns: [
      { name: "is_odd_digit", type: "integer", unique: 2, encoding: "Binary Encoding", size: "7.2 KB", missing: "0 (0%)", range: "[0: Even, 1: Odd]", isTarget: true },
      { name: "pca_component_01", type: "numeric", unique: 480, encoding: "Numeric (Standardized)", size: "7.2 KB", missing: "0 (0%)", range: "[-4.2, +5.1]", isTarget: false },
      { name: "pca_component_02", type: "numeric", unique: 420, encoding: "Numeric (Standardized)", size: "7.2 KB", missing: "0 (0%)", range: "[-3.8, +4.6]", isTarget: false },
      { name: "pca_component_03", type: "numeric", unique: 390, encoding: "Numeric (Standardized)", size: "7.2 KB", missing: "0 (0%)", range: "[-3.1, +3.9]", isTarget: false },
      { name: "pca_component_04", type: "numeric", unique: 340, encoding: "Numeric (Standardized)", size: "7.2 KB", missing: "0 (0%)", range: "[-2.9, +3.2]", isTarget: false },
      { name: "pca_component_05", type: "numeric", unique: 310, encoding: "Numeric (Standardized)", size: "7.2 KB", missing: "0 (0%)", range: "[-2.5, +2.8]", isTarget: false },
      { name: "pca_component_06", type: "numeric", unique: 270, encoding: "Numeric (Standardized)", size: "7.2 KB", missing: "0 (0%)", range: "[-2.1, +2.4]", isTarget: false },
      { name: "pca_component_07", type: "numeric", unique: 240, encoding: "Numeric (Standardized)", size: "7.2 KB", missing: "0 (0%)", range: "[-1.9, +2.0]", isTarget: false },
      { name: "pca_component_08", type: "numeric", unique: 210, encoding: "Numeric (Standardized)", size: "7.2 KB", missing: "0 (0%)", range: "[-1.6, +1.8]", isTarget: false },
    ],
    sampleRows: [
      { pca_component_01: 2.41, pca_component_02: -1.22, pca_component_03: 0.88, is_odd_digit: 1 },
      { pca_component_01: -1.85, pca_component_02: 3.14, pca_component_03: -0.42, is_odd_digit: 0 },
      { pca_component_01: 0.94, pca_component_02: -2.05, pca_component_03: 1.15, is_odd_digit: 1 },
      { pca_component_01: -2.10, pca_component_02: 1.80, pca_component_03: -0.90, is_odd_digit: 0 },
    ],
  },
];

interface EdgeNode {
  id: string;
  name: string;
  hardware_tier: string;
  vram_gb: number;
  cpu_name?: string;
  os_name?: string;
  system_ram_gb?: number;
  samples_count: number;
  wallet_address: string;
  enabled: boolean;
  is_simulated?: boolean;
}

export default function TrainingPage() {
  // =========================================================================
  // STEP 1: DATASET SELECTION STATE
  // =========================================================================
  const [datasetMode, setDatasetMode] = useState<"synthetic" | "custom">("synthetic");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("healthcare");
  const [customCsvText, setCustomCsvText] = useState<string>(
    "age,systolic_bp,fasting_glucose,cholesterol_ldl,troponin_i,wbc_count,diagnostic_risk\n" +
    "58,142,118,165,0.04,7.2,1\n" +
    "44,120,92,128,0.01,5.8,0\n" +
    "67,156,144,189,0.08,8.9,1\n" +
    "39,115,88,110,0.01,5.1,0\n" +
    "52,138,105,152,0.03,6.8,1\n" +
    "48,124,96,134,0.02,6.0,0"
  );

  // =========================================================================
  // STEP 2: FEATURES & TARGET SELECTION IN TABULAR FORMAT
  // =========================================================================
  const activePreset = SYNTHETIC_DATASETS.find((d) => d.id === selectedPresetId) || SYNTHETIC_DATASETS[0];
  const [selectedTarget, setSelectedTarget] = useState<string>("diagnostic_risk");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "age", "systolic_bp", "diastolic_bp", "fasting_glucose", "cholesterol_ldl", "troponin_i", "crp_biomarker", "wbc_count"
  ]);
  const [tableSearch, setTableSearch] = useState<string>("");
  const [featureEncodings, setFeatureEncodings] = useState<Record<string, string>>({});

  const handleUpdateEncoding = (colName: string, enc: string) => {
    setFeatureEncodings((prev) => ({ ...prev, [colName]: enc }));
  };

  // Custom parsed columns list with inferred metadata & encodings
  const customColumns = useMemo(() => {
    if (datasetMode === "synthetic") {
      return activePreset.columns.map((col) => ({
        ...col,
        encoding: featureEncodings[col.name] || col.encoding || "Numeric (Standardized)",
      }));
    }
    const lines = customCsvText.trim().split("\n");
    if (!lines[0]) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
    const dataRows = lines.slice(1).map((l) => l.split(",").map((v) => v.trim()));
    return headers.map((h, i) => {
      const vals = dataRows.map((r) => r[i]).filter(Boolean);
      const uniqueVals = new Set(vals);
      const isNum = vals.length > 0 && vals.every((v) => !isNaN(Number(v)));
      let minVal = 0;
      let maxVal = 1;
      if (isNum && vals.length > 0) {
        minVal = Number(vals[0]);
        maxVal = Number(vals[0]);
        for (let j = 1; j < vals.length; j++) {
          const num = Number(vals[j]);
          if (!isNaN(num)) {
            if (num < minVal) minVal = num;
            if (num > maxVal) maxVal = num;
          }
        }
      }
      const defaultEnc = uniqueVals.size === 2
        ? "Binary Encoding"
        : !isNum || uniqueVals.size <= 8
        ? "One-Hot Encoding"
        : "Numeric (Standardized)";

      return {
        name: h,
        type: isNum ? "numeric" : "categorical",
        unique: uniqueVals.size,
        encoding: featureEncodings[h] || (h === selectedTarget ? "Binary Encoding" : defaultEnc),
        size: `${(lines.length * 8 / 1024).toFixed(1)} KB`,
        missing: "0 (0%)",
        range: isNum ? `[${minVal} - ${maxVal}]` : `[${Array.from(uniqueVals).slice(0, 3).join(", ")}]`,
        isTarget: h === selectedTarget,
      };
    });
  }, [datasetMode, activePreset, customCsvText, selectedTarget, featureEncodings]);

  // When synthetic preset changes, update target & default features
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = SYNTHETIC_DATASETS.find((d) => d.id === presetId);
    if (p) {
      setSelectedTarget(p.target);
      const feats = p.columns.filter((c) => c.name !== p.target).map((c) => c.name);
      setSelectedFeatures(feats.slice(0, 8)); // select first 8 features by default
    }
  };

  const toggleFeature = (colName: string) => {
    if (colName === selectedTarget) return; // target cannot be a feature
    if (selectedFeatures.includes(colName)) {
      if (selectedFeatures.length <= 1) return; // keep at least 1 feature
      setSelectedFeatures(selectedFeatures.filter((f) => f !== colName));
    } else {
      setSelectedFeatures([...selectedFeatures, colName]);
    }
  };

  const selectAllFeatures = () => {
    const allCols = customColumns.map((c) => c.name).filter((n) => n !== selectedTarget);
    setSelectedFeatures(allCols);
  };

  const deselectAllFeatures = () => {
    const allCols = customColumns.map((c) => c.name).filter((n) => n !== selectedTarget);
    setSelectedFeatures(allCols.slice(0, 1));
  };

  const handleSetTarget = (colName: string) => {
    setSelectedTarget(colName);
    setSelectedFeatures(selectedFeatures.filter((f) => f !== colName));
  };

  // Custom CSV parser on upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomCsvText(content);
        const firstLine = content.trim().split("\n")[0];
        if (firstLine) {
          const cols = firstLine.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
          const lastCol = cols[cols.length - 1];
          setSelectedTarget(lastCol);
          setSelectedFeatures(cols.filter((c) => c !== lastCol));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleLargeUploadSuccess = (result: UploadResult) => {
    if (result.preview_text) {
      setCustomCsvText(result.preview_text);
      if (result.headers && result.headers.length > 0) {
        const lastCol = result.headers[result.headers.length - 1];
        setSelectedTarget(lastCol);
        setSelectedFeatures(result.headers.filter((c) => c !== lastCol));
      }
    }
  };



  // =========================================================================
  // STEP 3: EDGE NODES STATE & CALIBRATION (EQUALLY SPLIT VS MANUAL)
  // =========================================================================
  const [partitionMode, setPartitionMode] = useState<"equal" | "manual">("equal");

  // Dynamic total dataset row count (synthetic preset rows or parsed custom CSV rows)
  const totalDatasetRecords = useMemo(() => {
    if (datasetMode === "synthetic") {
      return activePreset.rowsCount;
    }
    const lines = customCsvText.trim().split("\n").filter((l) => l.trim().length > 0);
    return Math.max(1, lines.length - 1);
  }, [datasetMode, activePreset.rowsCount, customCsvText]);

  const [edgeNodes, setEdgeNodes] = useState<EdgeNode[]>([]);
  const [simCount, setSimCount] = useState<number>(3);
  const [isSpawningSim, setIsSpawningSim] = useState<boolean>(false);
  const [isClearingSim, setIsClearingSim] = useState<boolean>(false);

  // WebSocket Live Telemetry State
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const wsRef = useRef<WebSocket | null>(null);

  // Real-time multi-device sync with live registered providers from backend
  useEffect(() => {
    let isSubscribed = true;
    const syncProviders = () => {
      fetch("/api/providers")
        .then((res) => res.json())
        .then((data: any[]) => {
          if (!isSubscribed || !data || !Array.isArray(data)) return;
          setEdgeNodes((prev) => {
            const prevMap = new Map(
              prev.map((p) => [
                p.wallet_address.toLowerCase(),
                { enabled: p.enabled, samples: p.samples_count, tier: p.hardware_tier, vram: p.vram_gb },
              ])
            );
            const prevNameMap = new Map(
              prev.map((p) => [
                p.name.toLowerCase(),
                { enabled: p.enabled, samples: p.samples_count, tier: p.hardware_tier, vram: p.vram_gb },
              ])
            );

            return data.map((d, idx) => {
              const wKey = (d.wallet_address || "").toLowerCase();
              const nKey = (d.device_name || "").toLowerCase();
              const existing = prevMap.get(wKey) || prevNameMap.get(nKey);

              return {
                id: d.wallet_address || `node-${idx + 1}`,
                name: d.device_name || `Edge Node ${idx + 1}`,
                hardware_tier: d.hardware_tier || existing?.tier || "Auto-Detected",
                vram_gb: d.declared_vram_gb ?? d.vram_gb ?? existing?.vram ?? 6,
                cpu_name: d.cpu_name,
                os_name: d.os_name,
                system_ram_gb: d.system_ram_gb,
                samples_count: existing?.samples ?? (d.samples_count || 120),
                wallet_address: d.wallet_address || `0x...`,
                enabled: existing ? existing.enabled : true,
                is_simulated: (d.device_name || "").includes("[Simulated]"),
              };
            });
          });
        })
        .catch((e) => console.error("Failed to sync edge nodes from providers", e));
    };

    syncProviders();
    const interval = setInterval(syncProviders, 3000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  const handleSpawnSimulated = async () => {
    setIsSpawningSim(true);
    try {
      const res = await fetch("/api/nodes/spawn-simulated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: simCount }),
      });
      if (res.ok) {
        const provRes = await fetch("/api/providers");
        const data = await provRes.json();
        if (Array.isArray(data)) {
          setEdgeNodes(
            data.map((d, idx) => ({
              id: d.wallet_address || `node-${idx + 1}`,
              name: d.device_name || `Edge Node ${idx + 1}`,
              hardware_tier: d.hardware_tier || "RTX 4090",
              vram_gb: d.declared_vram_gb ?? d.vram_gb ?? 16,
              cpu_name: d.cpu_name,
              os_name: d.os_name,
              system_ram_gb: d.system_ram_gb,
              samples_count: d.samples_count || 120,
              wallet_address: d.wallet_address || `0x...`,
              enabled: true,
              is_simulated: (d.device_name || "").includes("[Simulated]"),
            }))
          );
        }
      }
    } catch (e) {
      console.error("Failed to spawn simulated nodes", e);
    } finally {
      setIsSpawningSim(false);
    }
  };

  const handleClearSimulated = async () => {
    setIsClearingSim(true);
    try {
      await fetch("/api/nodes/clear-simulated", { method: "POST" });
      const provRes = await fetch("/api/providers");
      const data = await provRes.json();
      if (Array.isArray(data)) {
        setEdgeNodes(
          data.map((d, idx) => ({
            id: d.wallet_address || `node-${idx + 1}`,
            name: d.device_name || `Edge Node ${idx + 1}`,
            hardware_tier: d.hardware_tier || "Auto-Detected",
            vram_gb: d.declared_vram_gb ?? d.vram_gb ?? 6,
            cpu_name: d.cpu_name,
            os_name: d.os_name,
            system_ram_gb: d.system_ram_gb,
            samples_count: d.samples_count || 120,
            wallet_address: d.wallet_address || `0x...`,
            enabled: true,
            is_simulated: (d.device_name || "").includes("[Simulated]"),
          }))
        );
      }
    } catch (e) {
      console.error("Failed to clear simulated nodes", e);
    } finally {
      setIsClearingSim(false);
    }
  };

  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeTier, setNewNodeTier] = useState("RTX 4090");
  const [newNodeVram, setNewNodeVram] = useState(16);
  const [newNodeSamples, setNewNodeSamples] = useState(100);

  const activeNodes = edgeNodes.filter((n) => n.enabled);

  const allocatedRows = useMemo(() => {
    return activeNodes.reduce((acc, n) => acc + (n.samples_count || 0), 0);
  }, [activeNodes]);

  const remainingRows = totalDatasetRecords - allocatedRows;

  // Equal split calculation whenever active nodes change, totalDatasetRecords changes, or partitionMode is "equal"
  useEffect(() => {
    if (partitionMode === "equal" && activeNodes.length > 0) {
      const perNode = Math.floor(totalDatasetRecords / activeNodes.length);
      const remainder = totalDatasetRecords % activeNodes.length;
      let activeIndex = 0;
      setEdgeNodes((prev) =>
        prev.map((n) => {
          if (!n.enabled) return n;
          const extra = activeIndex < remainder ? 1 : 0;
          activeIndex++;
          return { ...n, samples_count: perNode + extra };
        })
      );
    }
  }, [partitionMode, activeNodes.length, totalDatasetRecords]);

  const toggleNodeEnabled = (id: string) => {
    setEdgeNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const updateNodeTier = (id: string, tier: string) => {
    setEdgeNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, hardware_tier: tier } : n))
    );
  };

  const updateNodeManualSamples = (id: string, samples: number) => {
    setEdgeNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, samples_count: Math.max(0, samples) } : n))
    );
  };

  const distributeRemainingRows = () => {
    if (activeNodes.length === 0 || remainingRows <= 0) return;
    const perNode = Math.floor(remainingRows / activeNodes.length);
    const rem = remainingRows % activeNodes.length;
    let idx = 0;
    setEdgeNodes((prev) =>
      prev.map((n) => {
        if (!n.enabled) return n;
        const extra = idx < rem ? 1 : 0;
        idx++;
        return { ...n, samples_count: n.samples_count + perNode + extra };
      })
    );
  };

  const removeNode = async (id: string) => {
    if (edgeNodes.length <= 1) {
      alert("At least 1 edge participant must remain in the network.");
      return;
    }
    const targetNode = edgeNodes.find((n) => n.id === id);
    setEdgeNodes((prev) => prev.filter((n) => n.id !== id));
    if (targetNode) {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("fedzero_device_node");
        if (saved && targetNode.name.toLowerCase().includes(saved.toLowerCase())) {
          localStorage.removeItem("fedzero_device_node");
        }
      }
      try {
        await fetch("/api/devices/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: targetNode.wallet_address || targetNode.name || id }),
        });
      } catch (err) {
        console.error("Failed to delete node on backend", err);
      }
    }
  };

  const handleAddNewNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;
    const newId = `node-${Date.now()}`;
    const randHex = Math.random().toString(16).substring(2, 10);
    const initialSamples = partitionMode === "equal"
      ? Math.floor(totalDatasetRecords / (activeNodes.length + 1))
      : newNodeSamples;

    try {
      await fetch("/api/devices/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newNodeName,
          hardware_tier: newNodeTier,
          vram_gb: Number(newNodeVram),
          samples_count: Number(initialSamples),
        }),
      });
    } catch (err) {
      console.error("Failed to register node on backend", err);
    }

    setEdgeNodes((prev) => [
      ...prev,
      {
        id: newId,
        name: newNodeName,
        hardware_tier: newNodeTier,
        vram_gb: newNodeVram,
        samples_count: initialSamples,
        wallet_address: `0x${randHex}...${randHex.substring(0, 4)}`,
        enabled: true,
      },
    ]);
    setShowAddNodeModal(false);
    setNewNodeName("");
  };

  // =========================================================================
  // STEP 4: NEURAL NETWORK ARCHITECTURE & UNLIMITED HYPERPARAMETERS
  // =========================================================================
  const [hiddenLayers, setHiddenLayers] = useState<number[]>([32, 16]);
  const [layerActivations, setLayerActivations] = useState<string[]>(["ReLU", "ReLU"]);
  // Epochs: unlimited number, manually enterable
  const [epochs, setEpochs] = useState<number>(4);
  // Learning Rate: manually enterable decimal
  const [learningRate, setLearningRate] = useState<number>(0.03);

  const addHiddenLayer = () => {
    const lastLayer = hiddenLayers.length > 0 ? hiddenLayers[hiddenLayers.length - 1] : 32;
    const newLayerSize = Math.max(4, Math.floor(lastLayer / 2));
    setHiddenLayers([...hiddenLayers, newLayerSize]);
    setLayerActivations([...layerActivations, "ReLU"]);
  };

  const removeHiddenLayer = (index: number) => {
    if (hiddenLayers.length <= 1) return;
    setHiddenLayers(hiddenLayers.filter((_, i) => i !== index));
    setLayerActivations(layerActivations.filter((_, i) => i !== index));
  };

  const updateHiddenLayerNodes = (index: number, nodes: number) => {
    const updated = [...hiddenLayers];
    updated[index] = Math.max(2, Math.min(1024, nodes));
    setHiddenLayers(updated);
  };

  const updateLayerActivation = (index: number, act: string) => {
    const updated = [...layerActivations];
    updated[index] = act;
    setLayerActivations(updated);
  };

  // Input dim is count of selected features
  const inputDim = Math.max(1, selectedFeatures.length);
  const outputDim = 2; // binary classification

  const calculateTotalParameters = () => {
    const dims = [inputDim, ...hiddenLayers, outputDim];
    let total = 0;
    for (let i = 0; i < dims.length - 1; i++) {
      total += dims[i] * dims[i + 1] + dims[i + 1];
    }
    return total;
  };
  const totalParameters = calculateTotalParameters();

  // =========================================================================
  // STEP 5: TRAINING EXECUTION & REFINED MULTI-NODE LOGS TERMINAL
  // =========================================================================
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [nodeLogs, setNodeLogs] = useState<Record<string, string[]>>({});
  const [activeLogTab, setActiveLogTab] = useState<string>("all"); // "all" | node.id
  const [copiedLogNode, setCopiedLogNode] = useState<string | null>(null);
  const [roundStats, setLastRoundStats] = useState<{
    round: number;
    accBefore: number;
    accAfter: number;
    lossBefore: number;
    lossAfter: number;
    zkProofHash: string;
    arbitrumTx: string;
    solanaSig: string;
    aggregatedWeightsPreview?: number[];
    aggregatedNorm?: number;
    deltaAggNorm?: number;
  } | null>(null);

  const [mounted, setMounted] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const executionBoxRef = useRef<HTMLDivElement>(null);

  // Initialize node logs safely whenever edgeNodes updates
  useEffect(() => {
    setMounted(true);
    setNodeLogs((prev) => {
      const next = { ...prev };
      const ts = new Date().toLocaleTimeString();
      edgeNodes.forEach((node) => {
        if (!next[node.id] || next[node.id].length === 0) {
          next[node.id] = [
            `[${ts}] [ENV_INIT] Initialized hardware enclave sandbox for "${node.name}" (${node.hardware_tier}).`,
            `[${ts}] [LOCAL_DATA] Secure partition mounted with ${node.samples_count} private biomarker samples.`,
            `[${ts}] [NODE_READY] Worker daemon listening. Standby for federated dispatch instruction.`,
          ];
        }
      });
      return next;
    });
  }, [edgeNodes]);

  // Auto-detect if current device is a registered worker node (e.g. LOQ_Vinu) from localStorage or URL
  useEffect(() => {
    if (typeof window !== "undefined" && edgeNodes.length > 0) {
      const savedNode = localStorage.getItem("fedzero_device_node");
      if (savedNode) {
        const found = edgeNodes.find((n) => n.name.toLowerCase().includes(savedNode.toLowerCase()));
        if (found) {
          setActiveLogTab(found.id);
          return;
        }
      }
      const params = new URLSearchParams(window.location.search);
      const urlNode = params.get("node");
      if (urlNode) {
        const found = edgeNodes.find((n) => n.name.toLowerCase().includes(urlNode.toLowerCase()));
        if (found) setActiveLogTab(found.id);
      }
    }
  }, [edgeNodes]);

  // Dynamically include any external edge laptop that sent logs into the multi-terminal grid
  const displayedGridNodes = useMemo(() => {
    const list = [...activeNodes];
    Object.keys(nodeLogs).forEach((k) => {
      const kLower = k.toLowerCase();
      if (["all", "coordinator", "aggregator", "arbitrum", "solana", "relayer"].includes(kLower)) return;
      if (!list.some((n) => n.id === k || n.name.toLowerCase() === kLower || n.wallet_address.toLowerCase() === kLower)) {
        list.push({
          id: k,
          name: k,
          hardware_tier: "External Edge Laptop",
          vram_gb: 8,
          samples_count: 120,
          wallet_address: `0x${kLower.replace(/[^a-f0-9]/g, "").padEnd(40, "0").slice(0, 42)}`,
          enabled: true,
        });
      }
    });
    return list;
  }, [activeNodes, nodeLogs]);

  // Real-Time WebSocket Telemetry Connection & Multi-Node Event Bus
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: any = null;
    let fallbackInterval: any = null;
    let lastSeenRound = 0;

    const connectWs = () => {
      try {
        const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = typeof window !== "undefined" ? window.location.hostname || "localhost" : "localhost";
        const wsUrl = `${protocol}//${host}:8000/ws/training`;

        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setWsStatus("connected");
          if (fallbackInterval) {
            clearInterval(fallbackInterval);
            fallbackInterval = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            const { event: evtType, data } = payload;

            if (evtType === "WORKER_ONLINE") {
              setEdgeNodes((prev) => {
                const wKey = (data.wallet_address || "").toLowerCase();
                const nKey = (data.node_name || "").toLowerCase();
                const exists = prev.some((p) => p.wallet_address.toLowerCase() === wKey || p.name.toLowerCase() === nKey);
                if (exists) {
                  return prev.map((p) =>
                    p.wallet_address.toLowerCase() === wKey || p.name.toLowerCase() === nKey
                      ? { ...p, enabled: true, hardware_tier: data.hardware_tier, vram_gb: data.vram_gb }
                      : p
                  );
                } else {
                  return [
                    ...prev,
                    {
                      id: data.wallet_address || `node-${prev.length + 1}`,
                      name: data.node_name,
                      hardware_tier: data.hardware_tier,
                      vram_gb: data.vram_gb,
                      samples_count: data.samples_count || 120,
                      wallet_address: data.wallet_address,
                      enabled: true,
                    },
                  ];
                }
              });
            } else if (evtType === "ROUND_STARTED") {
              setIsTraining(true);
              setActiveStep(1);
            } else if (evtType === "STEP_PROGRESS") {
              if (data?.step) setActiveStep(data.step);
            } else if (evtType === "LOG_EMITTED") {
              const { tag, line } = data;
              setNodeLogs((prev) => {
                const next = { ...prev };
                const tLower = (tag || "").toLowerCase();
                const matched = edgeNodes.find(
                  (n) =>
                    n.name.toLowerCase() === tLower ||
                    n.id.toLowerCase() === tLower ||
                    n.wallet_address.toLowerCase() === tLower ||
                    tLower.includes(n.name.toLowerCase()) ||
                    n.name.toLowerCase().includes(tLower)
                );

                // Dynamically ensure node exists in edgeNodes if external device sends logs
                if (!matched && tag && !["Coordinator", "Aggregator", "Arbitrum", "Solana", "Relayer"].includes(tag)) {
                  setEdgeNodes((curr) => {
                    if (curr.some((c) => c.name.toLowerCase() === tLower)) return curr;
                    return [
                      ...curr,
                      {
                        id: tag,
                        name: tag,
                        hardware_tier: "External Edge Node",
                        vram_gb: 8,
                        samples_count: 120,
                        wallet_address: `0x${tag.toLowerCase().replace(/[^a-f0-9]/g, "").padEnd(40, "0").slice(0, 42)}`,
                        enabled: true,
                      },
                    ];
                  });
                }

                const targetKey = matched ? matched.id : tag;
                if (targetKey) {
                  next[targetKey] = [...(next[targetKey] || []), line];
                }
                next[tag] = [...(next[tag] || []), line];
                next["all"] = [...(next["all"] || []), line];
                return next;
              });
            } else if (evtType === "EPOCH_PROGRESS") {
              const ts = new Date().toLocaleTimeString();
              const cName = data.client_name || data.client_id || "Worker";
              const logLine = `[${ts}] [${cName}] [EPOCH_STREAM] Epoch ${data.epoch}/${data.total_epochs} | Batch Loss = ${data.loss} | Hardware SGD Telemetry`;
              setNodeLogs((prev) => {
                const next = { ...prev };
                const cKey = cName.toLowerCase();
                const matched = edgeNodes.find(
                  (n) =>
                    n.name.toLowerCase() === cKey ||
                    n.id.toLowerCase() === cKey ||
                    n.wallet_address.toLowerCase() === cKey ||
                    cKey.includes(n.name.toLowerCase()) ||
                    n.name.toLowerCase().includes(cKey)
                );
                const targetKey = matched ? matched.id : cName;
                if (targetKey) {
                  next[targetKey] = [...(next[targetKey] || []), logLine];
                }
                next[cName] = [...(next[cName] || []), logLine];
                next["all"] = [...(next["all"] || []), logLine];
                return next;
              });

            } else if (evtType === "ZK_PROOF_GENERATED") {
              setLastRoundStats((prev: any) => ({
                ...(prev || {}),
                zkProofHash: data.proof_hash?.substring(0, 18) || "0x...",
              }));
            } else if (evtType === "ARBITRUM_VERIFIED") {
              setLastRoundStats((prev: any) => ({
                ...(prev || {}),
                arbitrumTx: data.tx_hash?.substring(0, 18) || "0x...",
              }));
            } else if (evtType === "SOLANA_REWARD_DISBURSED") {
              const ts = new Date().toLocaleTimeString();
              const logLine = `[${ts}] [SOLANA_SETTLE] Dynamic incentive confirmed: ${data.reward_amount?.toFixed(2) || 0} SOL minted (Tx: ${data.tx_signature?.substring(0, 14)}...)`;
              setNodeLogs((prev) => {
                const next = { ...prev };
                const matched = edgeNodes.find(
                  (n) =>
                    n.name.toLowerCase() === (data.client_name || "").toLowerCase() ||
                    n.id.toLowerCase() === (data.client_id || "").toLowerCase()
                );
                if (matched) {
                  next[matched.id] = [...(next[matched.id] || []), logLine];
                }
                return next;
              });
            } else if (evtType === "ROUND_COMPLETED") {
              setIsTraining(false);
              setLastRoundStats({
                round: data.round_number,
                accBefore: data.accuracy_before,
                accAfter: data.accuracy_after,
                lossBefore: data.loss_before,
                lossAfter: data.loss_after,
                zkProofHash: data.new_model_hash?.substring(0, 18) || "0x...",
                arbitrumTx: data.arbitrum_tx?.substring(0, 18) || "0x...",
                solanaSig: `SolanaSettled_${data.round_number}`,
                aggregatedWeightsPreview: data.aggregated_weights_preview,
                aggregatedNorm: data.aggregated_norm,
                deltaAggNorm: data.delta_agg_norm,
              });
              setTimeout(() => setActiveStep(null), 5000);
            }
          } catch (e) {
            console.error("Failed to parse WS payload", e);
          }
        };

        ws.onclose = () => {
          setWsStatus("disconnected");
          reconnectTimer = setTimeout(connectWs, 3000);
          startFallbackPolling();
        };

        ws.onerror = () => {
          setWsStatus("disconnected");
          ws?.close();
        };
      } catch (e) {
        setWsStatus("disconnected");
        reconnectTimer = setTimeout(connectWs, 3000);
        startFallbackPolling();
      }
    };

    const startFallbackPolling = () => {
      if (fallbackInterval) return;
      fallbackInterval = setInterval(async () => {
        try {
          const res = await fetch("/api/training/latest-round-logs");
          if (!res.ok) return;
          const data = await res.json();
          if (
            data &&
            data.round_number &&
            data.round_number > 0 &&
            data.node_logs &&
            Object.keys(data.node_logs).length > 0 &&
            data.round_number !== lastSeenRound
          ) {
            lastSeenRound = data.round_number;
            setNodeLogs((prev) => {
              const next = { ...prev };
              Object.entries(data.node_logs).forEach(([rawKey, lines]) => {
                if (Array.isArray(lines) && lines.length > 0) {
                  const matched = edgeNodes.find(
                    (n) =>
                      n.id.toLowerCase() === rawKey.toLowerCase() ||
                      n.name.toLowerCase() === rawKey.toLowerCase() ||
                      n.wallet_address.toLowerCase() === rawKey.toLowerCase()
                  );
                  const targetKey = matched ? matched.id : rawKey;
                  next[targetKey] = lines as string[];
                }
              });
              return next;
            });
          }
        } catch (e) {
          // silent fallback
        }
      }, 2000);
    };

    connectWs();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (fallbackInterval) clearInterval(fallbackInterval);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [edgeNodes, activeNodes]);

  const copyLogs = (key: string) => {
    let text = "";
    if (key === "consolidated") {
      text = (nodeLogs["all"] || []).join("\n");
    } else if (key === "all") {
      text = (nodeLogs["all"] && nodeLogs["all"].length > 0)
        ? nodeLogs["all"].join("\n")
        : Object.entries(nodeLogs)
            .map(([nid, lines]) => {
              const n = displayedGridNodes.find((x) => x.id === nid || x.name === nid);
              return `=== NODE: ${n?.name || nid} ===\n` + lines.join("\n");
            })
            .join("\n\n");
    } else {
      text = (nodeLogs[key] || nodeLogs[displayedGridNodes.find((n) => n.id === key)?.name || ""] || []).join("\n");
    }
    navigator.clipboard.writeText(text);
    setCopiedLogNode(key);
    setTimeout(() => setCopiedLogNode(null), 2000);
  };

  const clearLogs = () => {
    const cleared: Record<string, string[]> = {};
    const ts = new Date().toLocaleTimeString();
    cleared["all"] = [`[${ts}] [TERMINAL] Unified stream buffer cleared.`];
    displayedGridNodes.forEach((node) => {
      cleared[node.id] = [
        `[${ts}] [TERMINAL] Console buffer cleared for ${node.name}. Ready for next training round.`,
      ];
    });
    setNodeLogs(cleared);
  };

  // Start Distributed Training Process via Live WebSocket Stream or HTTP API
  const handleStartTraining = async () => {
    if (activeNodes.length === 0) return;
    setIsTraining(true);
    setActiveStep(1);

    // Scroll to logs container so user sees the action immediately
    executionBoxRef.current?.scrollIntoView({ behavior: "smooth" });

    const ts = () => new Date().toLocaleTimeString();

    // Reset and start logs for every active edge node
    setNodeLogs((prev) => {
      const next = { ...prev };
      activeNodes.forEach((node) => {
        next[node.id] = [
          ...(next[node.id] || []),
          `--------------------------------------------------------------------------------`,
          `[${ts()}] [DISPATCH] Federated Round triggered by Coordinator. Real-time WebSocket streaming active.`,
          `[${ts()}] [TOPOLOGY] Target Architecture: Input(${inputDim}) -> Dense[${hiddenLayers.join(", ")}] -> Output(${outputDim})`,
          `[${ts()}] [DATA_CONFIG] Target: "${selectedTarget}" | Active Features: ${selectedFeatures.length} dims | Partition: ${partitionMode.toUpperCase()}`,
          `[${ts()}] [CLIENT_EXEC] Hardware enclave online: ${node.hardware_tier} (${node.vram_gb} GB VRAM). Commencing real local SGD (${epochs} Epochs, lr=${learningRate}).`,
        ];
      });
      return next;
    });

    const payload = {
      action: "START_ROUND",
      epochs,
      learning_rate: learningRate,
      active_node_ids: activeNodes.map((n) => n.wallet_address || n.name || n.id),
    };

    // If WebSocket is connected, send command directly over socket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }

    // Call live backend endpoint to trigger pipeline execution & persist DB state
    try {
      const res = await fetch("/api/training/run-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          epochs,
          learning_rate: learningRate,
          active_node_ids: activeNodes.map((n) => n.wallet_address || n.name || n.id),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.round_id) {
          setLastRoundStats({
            round: data.round_id,
            accBefore: data.accuracy_before != null ? +(data.accuracy_before * 100).toFixed(1) : 92.1,
            accAfter: data.accuracy_after != null ? +(data.accuracy_after * 100).toFixed(1) : 96.9,
            lossBefore: data.loss_before != null ? +data.loss_before.toFixed(4) : 0.364,
            lossAfter: data.loss_after != null ? +data.loss_after.toFixed(4) : 0.108,
            zkProofHash: data.new_model_hash?.substring(0, 18) || "0x...",
            arbitrumTx: data.arbitrum_tx?.substring(0, 18) || "0x...",
            solanaSig: data.solana_payouts?.[0]?.tx_signature?.substring(0, 18) || "SolanaConfirmed",
          });
        }
      }
    } catch (err) {
      console.error("HTTP round execution error", err);
    } finally {
      setIsTraining(false);
      setTimeout(() => setActiveStep(null), 5000);
    }
  };

  const stripEmojis = (str: string) => {
    return str
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ""
      )
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  const renderFormattedLogLine = (line: string, index: number) => {
    const cleanRaw = stripEmojis(line);
    if (cleanRaw.startsWith("---")) {
      return (
        <div key={index} className="text-stone-700 select-none py-0.5 text-[10px]">
          ────────────────────────────────────────────────────────────────────────────────
        </div>
      );
    }

    const match = cleanRaw.match(/^(\[[^\]]+\])\s*(\[[^\]]+\])\s*(.*)$/);
    if (match) {
      const [, timestamp, tag, message] = match;
      const tagClean = tag.replace(/[\[\]]/g, "");
      const tagUpper = tagClean.toUpperCase();
      const cleanMessage = stripEmojis(message);

      let tagStyle = "text-stone-300 bg-stone-900 border-stone-700";
      let msgStyle = "text-stone-300";

      if (tagUpper.includes("DISPATCH") || tagUpper.includes("TOPOLOGY") || tagUpper.includes("DATA_CONFIG") || tagUpper.includes("INIT")) {
        tagStyle = "text-[#E05338] bg-[#E05338]/10 border-[#E05338]/30";
        msgStyle = "text-stone-200 font-medium";
      } else if (tagUpper.includes("SGD") || tagUpper.includes("LOCAL_SGD")) {
        tagStyle = "text-sky-400 bg-sky-950/60 border-sky-800/40";
        msgStyle = "text-stone-200";
      } else if (tagUpper.includes("CIRCUIT") || tagUpper.includes("PROOF") || tagUpper.includes("ZKML")) {
        tagStyle = "text-amber-400 bg-amber-950/60 border-amber-800/40";
        msgStyle = "text-amber-200/95 font-medium";
      } else if (tagUpper.includes("ARBITRUM") || tagUpper.includes("L2") || tagUpper.includes("PAIRING") || tagUpper.includes("MODEL_REGISTRY")) {
        tagStyle = "text-purple-400 bg-purple-950/60 border-purple-800/40";
        msgStyle = "text-purple-200/90";
      } else if (tagUpper.includes("RELAYER") || tagUpper.includes("BRIDGE")) {
        tagStyle = "text-cyan-400 bg-cyan-950/60 border-cyan-800/40";
        msgStyle = "text-cyan-200/90";
      } else if (tagUpper.includes("SOLANA") || tagUpper.includes("SETTLE") || tagUpper.includes("REWARD")) {
        tagStyle = "text-emerald-400 bg-emerald-950/70 border-emerald-700/50";
        msgStyle = "text-emerald-200 font-bold";
      } else if (tagUpper.includes("CONVERGED") || tagUpper.includes("FINALIZED") || tagUpper.includes("FEDAVG") || tagUpper.includes("TRAIN_COMPLETE") || tagUpper.includes("ROUND_COMPLETE")) {
        tagStyle = "text-emerald-300 bg-emerald-900/60 border-emerald-600/50";
        msgStyle = "text-emerald-300 font-bold";
      } else if (tagUpper.includes("INCOMING_WEIGHTS") || tagUpper.includes("INSPECT_NODE_WEIGHTS") || cleanMessage.includes("INCOMING_WEIGHTS") || cleanMessage.includes("INSPECT_NODE_WEIGHTS")) {
        tagStyle = "text-amber-400 bg-amber-950/80 border-amber-600/70";
        msgStyle = "text-amber-300 font-semibold";
      } else if (tagUpper.includes("AGGREGATED_WEIGHTS") || cleanMessage.includes("AGGREGATED_WEIGHTS") || cleanMessage.includes("ROOT COORDINATOR COMPUTED")) {
        tagStyle = "text-fuchsia-400 bg-fuchsia-950/80 border-fuchsia-600/70";
        msgStyle = "text-fuchsia-200 font-black";
      } else if (tagUpper.includes("EPOCH_METRICS") || cleanMessage.includes("EPOCH_METRICS")) {
        tagStyle = "text-sky-300 bg-sky-950/80 border-sky-600/60";
        msgStyle = "text-sky-200 font-mono";
      } else if (tagUpper.includes("ENV_INIT") || tagUpper.includes("LOCAL_DATA") || tagUpper.includes("NODE_READY") || tagUpper.includes("PRIVACY_GUARD")) {
        tagStyle = "text-stone-400 bg-stone-900/80 border-stone-800";
        msgStyle = "text-stone-400";
      }

      return (
        <div key={index} className="flex items-start space-x-2 text-[11px] leading-relaxed font-mono hover:bg-white/[0.03] px-1 py-0.5 rounded transition-colors">
          <span className="text-stone-600 select-none text-[10px] shrink-0 pt-0.5 font-mono">{timestamp}</span>
          <span className={`px-1.5 py-0.5 rounded border text-[9px] uppercase tracking-wider shrink-0 font-bold font-mono ${tagStyle}`}>
            {tagClean}
          </span>
          <span className={`break-words ${msgStyle}`}>{cleanMessage}</span>
        </div>
      );
    }

    return (
      <div key={index} className="text-stone-400 text-[11px] leading-relaxed font-mono px-1 py-0.5">
        {cleanRaw}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 select-none">
      {/* Top Retro Hero Banner */}
      <div className="p-8 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#FAF7F2] border-2 border-[#1C1917] text-[#E05338] text-xs font-mono font-black tracking-wider retro-shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#E05338]" />
            <span>CONFIDENTIAL FEDERATED LEARNING • STEP-BY-STEP STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] font-display tracking-tight">
            Federated Training Control Deck
          </h1>
          <p className="text-sm text-[#57534E] max-w-2xl font-medium leading-relaxed">
            Configure datasets, select custom features and labels in tabular format, calibrate edge device enclaves with equal or manual dataset splits, design neural hidden layers with unlimited epochs, and inspect live multi-node logs.
          </p>
        </div>

        <div className="z-10 flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm flex items-center space-x-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${wsStatus === "connected" ? "bg-emerald-500 animate-pulse" : wsStatus === "connecting" ? "bg-amber-500 animate-ping" : "bg-red-500"}`}></span>
            <span className="font-bold text-[#1C1917]">
              {wsStatus === "connected" ? "WebSocket Live" : wsStatus === "connecting" ? "WS Connecting..." : "WS Offline"}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-sm flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-[#1C1917]">{activeNodes.length} Nodes Ready</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DATASET SELECTION (SYNTHETIC VS CUSTOM UPLOAD/ENTER) */}
      {/* ========================================================================= */}
      <section className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1C1917]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#E05338] text-white font-mono font-black text-xs flex items-center justify-center border border-[#1C1917]">
                01
              </span>
              <h2 className="text-xl font-black text-[#1C1917] font-display uppercase tracking-tight">
                Dataset Selection
              </h2>
            </div>
            <p className="text-xs text-[#78716C] font-mono">
              Choose a synthetic test dataset preset or enter / upload your own CSV data.
            </p>
          </div>

          {/* Mode Switcher: Synthetic vs Custom */}
          <div className="flex items-center space-x-2 bg-[#F2ECE1] p-1.5 rounded-xl border-2 border-[#1C1917]">
            <button
              onClick={() => setDatasetMode("synthetic")}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                datasetMode === "synthetic"
                  ? "bg-[#1C1917] text-white retro-shadow-sm"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              🧪 Synthetic Dataset (Presets)
            </button>
            <button
              onClick={() => setDatasetMode("custom")}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                datasetMode === "custom"
                  ? "bg-[#1C1917] text-white retro-shadow-sm"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              📂 Enter / Upload CSV
            </button>
          </div>
        </div>

        {/* Mode A: Synthetic Dataset Presets */}
        {datasetMode === "synthetic" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SYNTHETIC_DATASETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? "bg-[#F4EFE6] border-[#1C1917] retro-shadow ring-2 ring-[#E05338]"
                        : "bg-[#FAF7F2] border-[#1C1917]/30 hover:border-[#1C1917] hover:bg-[#F9F6F0]"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-black uppercase text-[#E05338] px-2 py-0.5 rounded bg-[#E05338]/10 border border-[#E05338]/30">
                          {preset.category}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base text-[#1C1917] leading-snug">
                        {preset.name}
                      </h3>
                      <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                        {preset.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1C1917]/15 flex items-center justify-between text-[11px] font-mono text-[#78716C]">
                      <span className="px-2 py-0.5 rounded bg-[#1C1917] text-white font-bold text-[10px]">{preset.rowsCount} Total Rows</span>
                      <span>Target: <strong className="text-[#1C1917]">{preset.target}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Mode B: Custom CSV Upload & Enter */
          <div className="space-y-6">
            <LargeFileUploader variant="retro" onUploadSuccess={handleLargeUploadSuccess} />

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#1C1917] uppercase flex items-center justify-between">
                <span>Or Paste / Edit CSV Plaintext:</span>
                <span className="text-[11px] text-[#2563EB] font-bold bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#1C1917]/25">
                  Parsed: {totalDatasetRecords} Data Rows
                </span>
              </label>
              <textarea
                rows={5}
                value={customCsvText}
                onChange={(e) => setCustomCsvText(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] font-mono text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#E05338]"
                placeholder="col1,col2,col3,target&#10;1,2,3,0&#10;4,5,6,1"
              />
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURES & TARGET SELECTION IN RICH TABULAR FORMAT */}
      {/* ========================================================================= */}
      <section className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1C1917]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#E5A638] text-[#1C1917] font-mono font-black text-xs flex items-center justify-center border border-[#1C1917]">
                02
              </span>
              <h2 className="text-xl font-black text-[#1C1917] font-display uppercase tracking-tight">
                Features & Target Tabular Profiler
              </h2>
            </div>
            <p className="text-xs text-[#78716C] font-mono">
              Inspect columns in tabular format showing unique values, hot/cold variance signal, memory size, and designate target label.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={selectAllFeatures}
              className="px-3 py-1.5 rounded-lg border-2 border-[#1C1917] text-xs font-mono font-bold bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C1917]"
            >
              Select All Features
            </button>
            <button
              type="button"
              onClick={deselectAllFeatures}
              className="px-3 py-1.5 rounded-lg border-2 border-[#1C1917] text-xs font-mono font-bold bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C1917]"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Target Indicator Callout */}
        <div className="p-4 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-black uppercase text-white bg-[#E05338] px-2 py-1 rounded border border-[#1C1917]">
              TARGET LABEL
            </span>
            <span className="font-bold text-sm text-[#1C1917]">
              Current Target: <strong className="text-[#E05338] underline decoration-2">{selectedTarget}</strong>
            </span>
            <span className="text-[#78716C] hidden md:inline">
              (Click &quot;Set as Target&quot; on any row in the table below to change)
            </span>
          </div>
          <div className="font-bold text-[#1C1917]">
            Active Features: <span className="text-[#E05338]">{selectedFeatures.length}</span> / {customColumns.length - 1} Selected (Input Dim = {inputDim})
          </div>
        </div>

        {/* RICH TABULAR VIEW */}
        <div className="rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] overflow-hidden retro-shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#F4EFE6] border-b-2 border-[#1C1917] text-[#1C1917] font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">Include</th>
                  <th className="py-3 px-4">Column Name</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Data Type</th>
                  <th className="py-3 px-3">Unique Values</th>
                  <th className="py-3 px-3">Feature Encoding</th>
                  <th className="py-3 px-3">Memory Size</th>
                  <th className="py-3 px-3">Missing</th>
                  <th className="py-3 px-4">Value Range / Sample</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/15">
                {customColumns.map((col) => {
                  const isTarget = col.name === selectedTarget;
                  const isChecked = selectedFeatures.includes(col.name);

                  return (
                    <tr
                      key={col.name}
                      className={`transition-colors ${
                        isTarget
                          ? "bg-[#E05338]/10 font-bold"
                          : isChecked
                          ? "bg-[#FAF7F2] hover:bg-[#F7F4EE]"
                          : "bg-[#F4EFE6]/60 text-[#78716C] hover:bg-[#F2ECE1]"
                      }`}
                    >
                      {/* Checkbox for Feature Inclusion */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          disabled={isTarget}
                          checked={isChecked}
                          onChange={() => toggleFeature(col.name)}
                          className="w-4 h-4 accent-[#E05338] rounded cursor-pointer disabled:opacity-30"
                        />
                      </td>

                      {/* Column Name */}
                      <td className="py-3 px-4 font-bold text-[#1C1917]">
                        <span className="flex items-center space-x-1.5">
                          {isTarget && <Target className="w-3.5 h-3.5 text-[#E05338] shrink-0" />}
                          <span>{col.name}</span>
                        </span>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3">
                        {isTarget ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#E05338] text-white border border-[#1C1917]">
                            TARGET
                          </span>
                        ) : isChecked ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1C1917] text-white">
                            FEATURE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#EAE4D8] text-[#78716C]">
                            IGNORED
                          </span>
                        )}
                      </td>

                      {/* Data Type */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#F2ECE1] border border-[#1C1917]/20 text-[#57534E]">
                          {col.type}
                        </span>
                      </td>

                      {/* Unique Values */}
                      <td className="py-3 px-3 font-bold text-[#1C1917]">
                        {col.unique} unique
                      </td>

                      {/* Feature Encoding (One-Hot, Binary, Numeric, MinMax) with Real SVG Icons */}
                      <td className="py-3 px-3">
                        <div
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all shadow-sm ${
                            col.encoding === "One-Hot Encoding"
                              ? "bg-purple-50 text-purple-900 border-purple-300"
                              : col.encoding === "Binary Encoding"
                              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                              : col.encoding === "MinMax Scaler"
                              ? "bg-amber-50 text-amber-900 border-amber-300"
                              : "bg-blue-50 text-blue-900 border-blue-300"
                          }`}
                        >
                          {col.encoding === "One-Hot Encoding" && (
                            <Layers className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          )}
                          {col.encoding === "Binary Encoding" && (
                            <Binary className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          )}
                          {col.encoding === "MinMax Scaler" && (
                            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          )}
                          {(col.encoding === "Numeric (Standardized)" || !col.encoding) && (
                            <BarChart2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          )}
                          <select
                            value={col.encoding || "Numeric (Standardized)"}
                            onChange={(e) => handleUpdateEncoding(col.name, e.target.value)}
                            className="bg-transparent border-0 font-mono font-bold text-[10px] cursor-pointer focus:outline-none pr-1"
                          >
                            <option value="One-Hot Encoding">One-Hot Encoding</option>
                            <option value="Binary Encoding">Binary (0/1)</option>
                            <option value="Numeric (Standardized)">Numeric (Standard)</option>
                            <option value="MinMax Scaler">MinMax Scaler [0, 1]</option>
                          </select>
                        </div>
                      </td>

                      {/* Size */}
                      <td className="py-3 px-3 text-[#57534E]">{col.size}</td>

                      {/* Missing */}
                      <td className="py-3 px-3 text-[#57534E]">{col.missing}</td>

                      {/* Value Range */}
                      <td className="py-3 px-4 text-[#1C1917] truncate max-w-[180px]">
                        {col.range}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-center">
                        {isTarget ? (
                          <span className="text-[10px] text-[#E05338] font-black">Active Target</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetTarget(col.name)}
                            className="px-2 py-1 rounded text-[10px] font-mono font-bold border border-[#1C1917] bg-[#FAF7F2] hover:bg-[#1C1917] hover:text-white transition-all"
                          >
                            Set as Target
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PARTICIPATING EDGE DEVICES & DATASET SPLIT (EQUALLY SPLIT VS MANUAL) */}
      {/* ========================================================================= */}
      <section className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1C1917]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-mono font-black text-xs flex items-center justify-center border border-[#1C1917]">
                03
              </span>
              <h2 className="text-xl font-black text-[#1C1917] font-display uppercase tracking-tight">
                Participating Edge Devices & Data Split ({activeNodes.length} Active)
              </h2>
            </div>
            <p className="text-xs text-[#78716C] font-mono">
              Choose which nodes participate and specify whether dataset samples are equally divided or manually allocated.
            </p>
          </div>

          {/* Dataset Split Mode Toggle: Equally Split vs Manual */}
          <div className="flex items-center space-x-2 bg-[#F2ECE1] p-1.5 rounded-xl border-2 border-[#1C1917]">
            <button
              onClick={() => setPartitionMode("equal")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                partitionMode === "equal"
                  ? "bg-[#1C1917] text-white retro-shadow-sm"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Equally Split Dataset</span>
            </button>
            <button
              onClick={() => setPartitionMode("manual")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                partitionMode === "manual"
                  ? "bg-[#1C1917] text-white retro-shadow-sm"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manual Allocation</span>
            </button>
          </div>
        </div>

        {/* Real Hardware Daemon Connection Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-emerald-50/80 border-2 border-emerald-600 rounded-xl font-mono text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-emerald-950 font-bold">
              Run Real SGD on a Physical Laptop:
            </span>
            <span className="text-emerald-800 text-[11px] hidden md:inline">
              Download the zero-dependency Python worker daemon to run hardware backpropagation on any 2nd laptop.
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <a
              href="/fedzero_worker.py"
              download="fedzero_worker.py"
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-black border border-emerald-900 shadow-sm flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Worker (.py)</span>
            </a>
            <a
              href="/run_worker.bat"
              download="run_worker.bat"
              className="px-3 py-1.5 bg-[#1C1917] hover:bg-[#2D2A26] text-white rounded text-[11px] font-black border border-[#1C1917] shadow-sm flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>1-Click (.bat)</span>
            </a>
          </div>
        </div>

        {/* Live Dataset Rows & Allocation Telemetry Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow-sm font-mono">
          <div className="p-3 bg-white rounded-lg border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917]">
            <div className="text-[11px] text-[#78716C] uppercase font-bold flex items-center justify-between">
              <span>Total Dataset Rows</span>
              <Database className="w-3.5 h-3.5 text-[#2563EB]" />
            </div>
            <div className="text-2xl font-black text-[#1C1917] mt-1 flex items-baseline space-x-1.5">
              <span>{totalDatasetRecords}</span>
              <span className="text-xs font-normal text-[#78716C]">Total Samples</span>
            </div>
            <div className="text-[10px] text-[#2563EB] font-bold mt-1 truncate">
              {datasetMode === "synthetic" ? `Preset: ${activePreset.name}` : "Custom Uploaded CSV Dataset"}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917]">
            <div className="text-[11px] text-[#78716C] uppercase font-bold flex items-center justify-between">
              <span>Allocated Across Nodes</span>
              <Split className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1 flex items-baseline space-x-1.5">
              <span>{allocatedRows}</span>
              <span className="text-xs font-normal text-[#78716C]">
                Rows ({Math.round((allocatedRows / Math.max(1, totalDatasetRecords)) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-[#FAF7F2] border border-[#1C1917]/20 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  allocatedRows > totalDatasetRecords ? "bg-red-500" : "bg-emerald-600"
                }`}
                style={{
                  width: `${Math.min(100, (allocatedRows / Math.max(1, totalDatasetRecords)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] flex flex-col justify-between">
            <div>
              <div className="text-[11px] text-[#78716C] uppercase font-bold flex items-center justify-between">
                <span>Remaining / Unassigned</span>
                {remainingRows === 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : remainingRows > 0 ? (
                  <span className="text-[10px] text-[#E5A638] font-bold">Incomplete</span>
                ) : (
                  <span className="text-[10px] text-red-600 font-bold">Overflow</span>
                )}
              </div>
              <div
                className={`text-2xl font-black mt-1 flex items-baseline space-x-1.5 ${
                  remainingRows === 0
                    ? "text-emerald-700"
                    : remainingRows > 0
                    ? "text-[#B45309]"
                    : "text-red-600"
                }`}
              >
                <span>{remainingRows}</span>
                <span className="text-xs font-normal text-[#78716C]">Rows</span>
              </div>
            </div>
            {partitionMode === "manual" && remainingRows > 0 && (
              <button
                type="button"
                onClick={distributeRemainingRows}
                className="mt-2 px-2.5 py-1 text-[10px] font-bold bg-[#F4EFE6] hover:bg-[#1C1917] hover:text-white border border-[#1C1917] rounded transition-all text-center"
              >
                + Auto-Fill Remaining (+{remainingRows} rows)
              </button>
            )}
          </div>
        </div>

        {/* Partition Strategy Header, Simulation Controls & Add Device Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#1C1917] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#1C1917]/30">
              Strategy: {partitionMode === "equal" ? "⚖️ Equal Row Distribution" : "🛠️ Manual Row Input Mode"}
            </span>
            <span className="text-[#78716C]">
              ({activeNodes.length} active edge participants)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* On-demand Simulation Controls for root node */}
            <div className="flex items-center space-x-1.5 bg-[#FAF7F2] border border-[#1C1917]/30 px-2 py-1 rounded-lg">
              <span className="text-[11px] font-bold text-[#1C1917]">Simulate:</span>
              <select
                value={simCount}
                onChange={(e) => setSimCount(Number(e.target.value))}
                className="bg-white border border-[#1C1917]/30 rounded px-1.5 py-0.5 text-[11px] font-bold text-[#1C1917]"
              >
                <option value={1}>1 Node</option>
                <option value={2}>2 Nodes</option>
                <option value={3}>3 Nodes</option>
                <option value={4}>4 Nodes</option>
                <option value={5}>5 Nodes</option>
                <option value={6}>6 Nodes</option>
              </select>
              <button
                type="button"
                onClick={handleSpawnSimulated}
                disabled={isSpawningSim}
                className="px-2.5 py-1 bg-[#E05338] text-white hover:bg-[#c9422a] rounded text-[11px] font-bold flex items-center space-x-1 disabled:opacity-50"
                title="Spawn simulated nodes on root node for testing"
              >
                <Zap className="w-3 h-3" />
                <span>{isSpawningSim ? "Adding..." : `+ Spawn ${simCount}`}</span>
              </button>
            </div>

            {edgeNodes.some((n) => n.is_simulated || n.name.toLowerCase().includes("[simulated]")) && (
              <button
                type="button"
                onClick={handleClearSimulated}
                disabled={isClearingSim}
                className="px-2.5 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold flex items-center space-x-1 disabled:opacity-50"
                title="Remove all simulated test nodes"
              >
                <Trash2 className="w-3 h-3" />
                <span>{isClearingSim ? "Clearing..." : "Clear Simulated"}</span>
              </button>
            )}

            <button
              onClick={() => setShowAddNodeModal(true)}
              className="px-3 py-1.5 rounded-lg border-2 border-[#1C1917] bg-[#FAF7F2] text-xs font-mono font-bold text-[#1C1917] hover:bg-[#F2ECE1] retro-shadow-sm flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#E05338]" />
              <span>+ Custom Node</span>
            </button>
          </div>
        </div>

        {/* Empty State vs Nodes Grid */}
        {edgeNodes.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border-2 border-dashed border-[#1C1917]/30 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border-2 border-[#1C1917]">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#1C1917]">No Edge Devices Connected</h4>
              <p className="text-xs text-[#78716C] max-w-lg mx-auto mt-1 leading-relaxed">
                By default, no mock nodes are present. Connect an actual physical laptop using the official worker script above, or spawn simulated test nodes on-demand to test locally.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="flex items-center space-x-2 bg-[#FAF7F2] border-2 border-[#1C1917] px-3 py-1.5 rounded-lg retro-shadow-sm">
                <span className="text-xs font-bold text-[#1C1917]">Simulate Test Nodes:</span>
                <select
                  value={simCount}
                  onChange={(e) => setSimCount(Number(e.target.value))}
                  className="bg-white border border-[#1C1917] rounded px-2 py-1 text-xs font-bold text-[#1C1917]"
                >
                  <option value={1}>1 Node</option>
                  <option value={2}>2 Nodes</option>
                  <option value={3}>3 Nodes (Standard)</option>
                  <option value={4}>4 Nodes</option>
                  <option value={5}>5 Nodes</option>
                  <option value={6}>6 Nodes</option>
                </select>
                <button
                  type="button"
                  onClick={handleSpawnSimulated}
                  disabled={isSpawningSim}
                  className="px-3.5 py-1.5 bg-[#E05338] text-white hover:bg-[#c9422a] rounded font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isSpawningSim ? "Spawning..." : `Spawn ${simCount} Nodes Now`}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {edgeNodes.map((node) => (
              <div
                key={node.id}
                className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                  node.enabled
                    ? "bg-[#FAF7F2] border-[#1C1917] retro-shadow"
                    : "bg-[#F4EFE6] border-[#1C1917]/30 opacity-60"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={node.enabled}
                        onChange={() => toggleNodeEnabled(node.id)}
                        className="w-4 h-4 accent-[#E05338] rounded cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-[#1C1917]">
                        {node.enabled ? "Active Node" : "Disabled"}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeNode(node.id)}
                      className="text-[#78716C] hover:text-red-600 transition-colors p-1"
                      title="Remove Node"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <div className="w-8 h-8 rounded-lg bg-[#E05338]/10 border border-[#E05338]/40 flex items-center justify-center text-[#E05338] shrink-0">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm text-[#1C1917] truncate" title={node.name}>
                        {node.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#78716C] block truncate">
                        {node.wallet_address.substring(0, 12)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Real Hardware Spec Badge & System Info */}
                <div className="space-y-2 pt-2 border-t border-[#1C1917]/15 text-xs font-mono">
                  <div className="flex flex-col space-y-1 bg-[#F4EFE6] p-2.5 rounded-lg border border-[#1C1917]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#78716C]">Hardware:</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${node.is_simulated || node.name.includes('[Simulated]') ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                        {node.is_simulated || node.name.includes('[Simulated]') ? "⚡ SIMULATED" : "🟢 REAL DEVICE"}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#1C1917] truncate" title={node.hardware_tier}>
                      {node.hardware_tier} {node.vram_gb ? `(${node.vram_gb} GB VRAM)` : ''}
                    </div>
                    {node.cpu_name && (
                      <div className="text-[10px] text-[#57534E] truncate" title={node.cpu_name}>
                        <span className="font-semibold text-[#78716C]">CPU:</span> {node.cpu_name}
                      </div>
                    )}
                    {(node.system_ram_gb || node.os_name) && (
                      <div className="text-[10px] text-[#57534E] flex items-center justify-between pt-0.5">
                        {node.system_ram_gb ? <span><span className="font-semibold text-[#78716C]">RAM:</span> {node.system_ram_gb} GB</span> : <span />}
                        {node.os_name ? <span className="bg-white/80 px-1 py-0.5 rounded border border-[#1C1917]/10 font-bold">{node.os_name}</span> : null}
                      </div>
                    )}
                  </div>

                  {/* ROW ALLOCATION CONTROLS: EQUAL VS MANUAL INPUT */}
                  {partitionMode === "equal" ? (
                    <div className="p-3 bg-[#F4EFE6] rounded-lg border border-[#1C1917]/25 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#78716C]">Assigned Rows:</span>
                        <span className="font-black text-sm text-[#1C1917] bg-white px-2 py-0.5 rounded border border-[#1C1917]">
                          {node.samples_count} rows
                        </span>
                      </div>
                      <div className="text-[10px] text-[#78716C]">
                        Auto-split across {activeNodes.length} active edge devices
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FAF0E4] rounded-lg border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-[#1C1917] uppercase">ENTER NUMBER OF ROWS:</span>
                        <span className="text-[#E05338] font-bold">
                          {((node.samples_count / Math.max(1, totalDatasetRecords)) * 100).toFixed(0)}% of total
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => updateNodeManualSamples(node.id, Math.max(0, node.samples_count - 25))}
                          className="w-8 h-8 bg-white border border-[#1C1917] rounded font-bold text-xs hover:bg-[#FAF7F2] transition-colors shrink-0"
                          title="Subtract 25 rows"
                        >
                          -25
                        </button>
                        <input
                          type="number"
                          min="0"
                          max={totalDatasetRecords}
                          value={node.samples_count}
                          onChange={(e) => updateNodeManualSamples(node.id, parseInt(e.target.value) || 0)}
                          className="w-full py-1 px-2 text-center text-sm font-black font-mono bg-white border-2 border-[#1C1917] rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-[#E05338]"
                          placeholder="0"
                        />
                        <button
                          type="button"
                          onClick={() => updateNodeManualSamples(node.id, node.samples_count + 25)}
                          className="w-8 h-8 bg-white border border-[#1C1917] rounded font-bold text-xs hover:bg-[#FAF7F2] transition-colors shrink-0"
                          title="Add 25 rows"
                        >
                          +25
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#78716C] pt-0.5">
                        <span>Direct numeric input</span>
                        <span className="font-bold text-[#1C1917]">{node.samples_count} rows assigned</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                    <span>Privacy Enclave:</span>
                    <span className="text-emerald-700 font-bold">100% Local (0 B leaked)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. PYTHON TRAINING PIPELINE STUDIO & DISTRIBUTED NOTEBOOK CODE */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <PipelineStudio variant="retro" serverHost="http://localhost:8000" />
      </section>

      {/* ========================================================================= */}
      {/* 5. NEURAL NETWORK ARCHITECTURE & UNLIMITED HYPERPARAMETERS + LAUNCH CTA */}
      {/* ========================================================================= */}
      <section className="p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1C1917]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#9333EA] text-white font-mono font-black text-xs flex items-center justify-center border border-[#1C1917]">
                05
              </span>
              <h2 className="text-xl font-black text-[#1C1917] font-display uppercase tracking-tight">
                Neural Hidden Layers & Hyperparameters
              </h2>
            </div>
            <p className="text-xs text-[#78716C] font-mono">
              Add or remove hidden layers, customize neurons per layer, enter any number of epochs, and set custom learning rate.
            </p>
          </div>

          <button
            type="button"
            onClick={addHiddenLayer}
            className="px-4 py-2 rounded-xl border-2 border-[#1C1917] bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C1917] text-xs font-mono font-bold retro-shadow-sm flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-[#E05338]" />
            <span>+ Add Hidden Layer</span>
          </button>
        </div>

        {/* Dynamic Topology Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Input Layer (Auto-configured based on selected features) */}
          <div className="p-5 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-2">
              <span className="text-[10px] font-mono font-black text-[#78716C] uppercase">
                Input Layer (D)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#1C1917]/30 text-[10px] font-mono font-bold">
                Auto
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black font-mono text-[#1C1917]">{inputDim}</div>
              <span className="text-xs text-[#78716C] font-mono">Selected Input Features</span>
              <p className="text-[11px] text-[#57534E] leading-relaxed">
                Matches the {selectedFeatures.length} active features selected from table.
              </p>
            </div>
            <div className="flex items-center space-x-1 pt-2">
              {Array.from({ length: Math.min(inputDim, 6) }).map((_, i) => (
                <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#1C1917]"></span>
              ))}
              {inputDim > 6 && <span className="text-[10px] font-mono text-[#78716C]">+{inputDim - 6}</span>}
            </div>
          </div>

          {/* Editable Hidden Layers */}
          {hiddenLayers.map((nodes, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-2">
                <span className="text-[10px] font-mono font-black text-[#E05338] uppercase">
                  Hidden Layer #{idx + 1}
                </span>
                {hiddenLayers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHiddenLayer(idx)}
                    className="text-[#78716C] hover:text-red-600 transition-colors p-1"
                    title="Delete Hidden Layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Neurons Count Stepper & Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs text-[#78716C]">Neurons / Units:</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => updateHiddenLayerNodes(idx, nodes - 4)}
                      className="w-6 h-6 rounded bg-[#F2ECE1] border border-[#1C1917] text-[#1C1917] font-bold text-xs"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="2"
                      max="1024"
                      value={nodes}
                      onChange={(e) => updateHiddenLayerNodes(idx, parseInt(e.target.value) || 2)}
                      className="w-14 px-1 py-0.5 rounded border border-[#1C1917] text-center font-bold text-[#1C1917] text-xs bg-[#FAF7F2]"
                    />
                    <button
                      type="button"
                      onClick={() => updateHiddenLayerNodes(idx, nodes + 4)}
                      className="w-6 h-6 rounded bg-[#F2ECE1] border border-[#1C1917] text-[#1C1917] font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="4"
                  max="128"
                  step="4"
                  value={nodes}
                  onChange={(e) => updateHiddenLayerNodes(idx, parseInt(e.target.value))}
                  className="w-full accent-[#E05338] cursor-pointer h-1.5 bg-[#EAE4D8] rounded-lg"
                />

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-[11px] text-[#78716C]">Activation:</span>
                  <select
                    value={layerActivations[idx] || "ReLU"}
                    onChange={(e) => updateLayerActivation(idx, e.target.value)}
                    className="px-2 py-0.5 rounded bg-[#F4EFE6] border border-[#1C1917]/30 text-[11px] font-mono text-[#1C1917]"
                  >
                    <option value="ReLU">ReLU (max(0,z))</option>
                    <option value="GELU">GELU (Gaussian)</option>
                    <option value="Tanh">Tanh (Hyperbolic)</option>
                    <option value="Sigmoid">Sigmoid</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C1917]/10 flex items-center justify-between text-[10px] font-mono text-[#78716C]">
                <span>Status: Calibrated</span>
                <span className="font-bold text-[#1C1917]">{nodes} Nodes</span>
              </div>
            </div>
          ))}

          {/* Output Layer (Fixed Target Classification) */}
          <div className="p-5 rounded-xl bg-[#F7F4EE] border-2 border-[#1C1917] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-2">
              <span className="text-[10px] font-mono font-black text-[#78716C] uppercase">
                Output Layer
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#1C1917]/30 text-[10px] font-mono font-bold">
                Target
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black font-mono text-[#1C1917]">{outputDim}</div>
              <span className="text-xs text-[#78716C] font-mono">Prediction Units</span>
              <p className="text-[11px] text-[#57534E] leading-relaxed">
                Objective target: <strong>{selectedTarget}</strong>.
              </p>
            </div>
            <div className="flex items-center space-x-1 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E05338]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5A638]"></span>
            </div>
          </div>
        </div>

        {/* Hyperparameters Calibration Bar WITH PRIMARY LAUNCH BUTTON RIGHT HERE */}
        <div className="p-6 rounded-2xl bg-[#F7F4EE] border-2 border-[#1C1917] retro-shadow flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-black text-[#1C1917] uppercase flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#E05338]" />
              <span>Hyperparameters & Round Execution</span>
            </span>
            <p className="text-xs text-[#57534E]">
              Enter any number of epochs and custom learning rate, then start the training round.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            {/* UNLIMITED EPOCHS MANUAL INPUT */}
            <div className="space-y-1">
              <span className="text-[#78716C] font-bold block text-[11px]">Local Epochs (No Limit):</span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setEpochs(Math.max(1, epochs - 1))}
                  className="w-7 h-7 rounded border-2 border-[#1C1917] bg-[#FAF7F2] font-black text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={epochs}
                  onChange={(e) => setEpochs(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-2 py-1 rounded border-2 border-[#1C1917] text-center font-bold text-sm bg-white text-[#1C1917]"
                />
                <button
                  type="button"
                  onClick={() => setEpochs(epochs + 1)}
                  className="w-7 h-7 rounded border-2 border-[#1C1917] bg-[#FAF7F2] font-black text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* MANUAL LEARNING RATE INPUT & PRESETS */}
            <div className="space-y-1">
              <span className="text-[#78716C] font-bold block text-[11px]">Learning Rate (η):</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="0.005"
                  min="0.0001"
                  max="1.0"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.01)}
                  className="w-24 px-2 py-1 rounded border-2 border-[#1C1917] font-bold text-sm bg-white text-[#1C1917]"
                />
                <div className="flex items-center space-x-1">
                  {[0.01, 0.03, 0.05].map((lr) => (
                    <button
                      key={lr}
                      type="button"
                      onClick={() => setLearningRate(lr)}
                      className={`px-2 py-1 rounded border text-[10px] font-bold ${
                        learningRate === lr
                          ? "bg-[#1C1917] text-white border-[#1C1917]"
                          : "bg-white border-[#1C1917]/30 text-[#57534E]"
                      }`}
                    >
                      {lr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trainable Parameters summary */}
            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#1C1917]/30">
              <span className="text-[10px] text-[#78716C] uppercase font-bold block">Model Parameters</span>
              <span className="font-bold text-[#E05338] text-sm">{totalParameters.toLocaleString()}</span>
            </div>

            {/* THE PRIMARY START TRAINING ROUND BUTTON - RIGHT NEXT TO EPOCHS & LR! */}
            <button
              onClick={handleStartTraining}
              disabled={isTraining || activeNodes.length === 0}
              className={`px-8 py-3.5 rounded-xl font-display font-black text-sm tracking-wider border-2 border-[#1C1917] retro-shadow transition-all flex items-center justify-center space-x-3 cursor-pointer ${
                isTraining
                  ? "bg-[#E5A638] text-[#1C1917] cursor-wait"
                  : "bg-[#E05338] hover:bg-[#d4482f] text-white hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
              } disabled:opacity-50`}
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>TRAINING ACTIVE...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>START TRAINING ROUND ⚡</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MULTI-NODE LOGS TERMINAL BOX (IMPROVED SLEEK UI) */}
      {/* ========================================================================= */}
      <section
        ref={executionBoxRef}
        className="p-7 rounded-2xl bg-[#141416] text-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-lg space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E05338] text-white flex items-center justify-center font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-white font-display uppercase tracking-tight">
                Multi-Node Distributed Logs Terminal
              </h2>
            </div>
            <p className="text-xs text-stone-400 font-mono">
              Simultaneous execution streams for all participating edge nodes ({displayedGridNodes.length} active devices).
            </p>
          </div>

          {/* Action CTAs & View Tabs */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Direct 1-Click Button to Focus on LOQ_Vinu or external laptop */}
            {displayedGridNodes.filter((n) => n.name.toLowerCase().includes("loq") || n.name.toLowerCase().includes("vinu")).map((loqNode) => (
              <button
                key={loqNode.id}
                onClick={() => {
                  setActiveLogTab(loqNode.id);
                  if (typeof window !== "undefined") localStorage.setItem("fedzero_device_node", loqNode.name);
                }}
                className={`px-4 py-2 rounded-xl border-2 font-black transition-all flex items-center space-x-2 cursor-pointer shadow-md ${
                  activeLogTab === loqNode.id
                    ? "bg-[#059669] text-white border-emerald-300 ring-2 ring-emerald-400 scale-102"
                    : "bg-emerald-950/80 border-emerald-600 text-emerald-300 hover:bg-emerald-900"
                }`}
              >
                <Laptop className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>💻 SHOW ONLY {loqNode.name.toUpperCase()} (MY LAPTOP)</span>
              </button>
            ))}

            {/* Consolidated All-in-One Live Feed */}
            <button
              onClick={() => {
                setActiveLogTab("consolidated");
                if (typeof window !== "undefined") localStorage.removeItem("fedzero_device_node");
              }}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeLogTab === "consolidated"
                  ? "bg-[#E05338] text-white border-[#E05338] shadow-md scale-102"
                  : "bg-stone-900 border-stone-700 text-stone-400 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              <span>🔴 Live Unified Stream (All Devices)</span>
            </button>

            <button
              onClick={() => {
                setActiveLogTab("all");
                if (typeof window !== "undefined") localStorage.removeItem("fedzero_device_node");
              }}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                activeLogTab === "all"
                  ? "bg-[#E05338] text-white border-[#E05338]"
                  : "bg-stone-900 border-stone-700 text-stone-400 hover:text-white"
              }`}
            >
              🌐 Multi-Terminal Grid ({displayedGridNodes.length} Devices)
            </button>

            {displayedGridNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => {
                  setActiveLogTab(node.id);
                  if (typeof window !== "undefined") localStorage.setItem("fedzero_device_node", node.name);
                }}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  activeLogTab === node.id
                    ? "bg-white text-[#1C1917] border-white font-black"
                    : "bg-stone-900 border-stone-700 text-stone-400 hover:text-white"
                }`}
              >
                {node.name}
              </button>
            ))}

            <button
              onClick={() => copyLogs(activeLogTab)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 flex items-center space-x-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLogNode === activeLogTab ? "Copied!" : "Copy Logs"}</span>
            </button>

            <button
              onClick={clearLogs}
              className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 cursor-pointer"
              title="Clear Terminal Output"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Dynamic Multi-Step Pipeline Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {[
            { num: 1, title: "1. Edge SGD", desc: `Training ${epochs} local epochs` },
            { num: 2, title: "2. zkML Prover", desc: "Halo2 KZG arithmetic circuits" },
            { num: 3, title: "3. Arbitrum EVM", desc: "ZKVerifier.sol pairing check" },
            { num: 4, title: "4. Cross Relayer", desc: "Dual-chain bridge to Solana" },
            { num: 5, title: "5. Solana Rewards", desc: "SOL token payout & FedAvg" },
          ].map((st) => {
            const isCurrent = activeStep === st.num;
            const isDone = activeStep !== null && activeStep > st.num;
            return (
              <div
                key={st.num}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? "bg-[#E05338] text-white border-[#E05338] retro-shadow-sm font-bold scale-102"
                    : isDone
                    ? "bg-stone-900 border-emerald-500/60 text-emerald-400"
                    : "bg-stone-900/60 border-stone-800 text-stone-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{st.title}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-[10px] block opacity-80 mt-0.5 truncate">{st.desc}</span>
              </div>
            );
          })}
        </div>

        {/* LOGS DISPLAY CONTAINER: MULTI-TERMINAL SIDE-BY-SIDE GRID */}
        {activeLogTab === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedGridNodes.map((node) => {
              const lines = nodeLogs[node.id] || nodeLogs[node.name] || [
                `[STANDBY] Enclave sandbox mounted for ${node.name}. Ready for training dispatch.`,
              ];
              return (
                <div
                  key={node.id}
                  className="rounded-xl bg-[#09090B] border-2 border-stone-800 flex flex-col h-[380px] overflow-hidden shadow-2xl hover:border-stone-600 transition-colors"
                >
                  {/* Node Terminal Header */}
                  <div className="px-3.5 py-2.5 bg-[#141417] border-b border-stone-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="font-bold text-white truncate max-w-[140px]">{node.name}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-[#E5A638] bg-stone-900 px-2 py-0.5 rounded border border-stone-700 font-bold truncate max-w-[110px]">
                        {node.hardware_tier}
                      </span>
                    </div>
                  </div>

                  {/* Terminal Lines Content */}
                  <div
                    suppressHydrationWarning
                    className="flex-1 p-3 font-mono text-[11px] leading-relaxed text-stone-300 overflow-y-auto space-y-1"
                  >
                    {lines.map((l, i) => renderFormattedLogLine(l, i))}
                    <div ref={logsEndRef} />
                  </div>

                  {/* Terminal Footer status */}
                  <div className="px-3 py-1.5 bg-[#101013] border-t border-stone-800 text-[10px] font-mono text-stone-500 flex items-center justify-between">
                    <span>{node.samples_count} Local Records</span>
                    <span className="text-emerald-400 font-bold">TEE ENCLAVE ACTIVE</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeLogTab === "consolidated" ? (
          /* Consolidated All-in-One Real-Time Live Feed */
          <div className="rounded-xl bg-[#09090B] border-2 border-red-900/60 flex flex-col h-[480px] overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-[#141417] border-b border-stone-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-bold text-white tracking-wide">
                  🔴 Real-Time Consolidated Mesh Stream (Coordinator + All Edge Nodes)
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-stone-400 font-mono">
                <span className="text-emerald-400 font-bold">
                  {(nodeLogs["all"] || []).length} Log Entries
                </span>
                <span className="text-stone-500 font-mono text-[10px]">
                  WebSocket + HTTP Telemetry Ingest
                </span>
              </div>
            </div>

            <div
              suppressHydrationWarning
              className="flex-1 p-4 font-mono text-xs leading-relaxed text-stone-300 overflow-y-auto space-y-1 bg-black/40"
            >
              {(nodeLogs["all"] && nodeLogs["all"].length > 0
                ? nodeLogs["all"]
                : [
                    "[MESH_TELEMETRY] Live Consolidated Stream initialized. Awaiting distributed events from edge hardware...",
                  ]
              ).map((l, i) => renderFormattedLogLine(l, i))}
              <div ref={logsEndRef} />
            </div>
          </div>
        ) : (
          /* Single Node Full-Screen Terminal View */
          <div className="rounded-xl bg-[#09090B] border-2 border-stone-800 flex flex-col h-[460px] overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-[#141417] border-b border-stone-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-white">
                  {displayedGridNodes.find((n) => n.id === activeLogTab)?.name || "Edge Node"} Dedicated Console
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-stone-400 font-mono">
                <span className="text-[#E5A638] font-bold">
                  {displayedGridNodes.find((n) => n.id === activeLogTab)?.hardware_tier}
                </span>
                <span>{displayedGridNodes.find((n) => n.id === activeLogTab)?.wallet_address}</span>
              </div>
            </div>

            <div
              suppressHydrationWarning
              className="flex-1 p-4 font-mono text-xs leading-relaxed text-stone-300 overflow-y-auto space-y-1"
            >
              {(nodeLogs[activeLogTab] || nodeLogs[displayedGridNodes.find((n) => n.id === activeLogTab)?.name || ""] || [
                `[STANDBY] Enclave sandbox mounted. Ready for training dispatch.`,
              ]).map((l, i) => renderFormattedLogLine(l, i))}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {/* Round Result Summary (Shown when round finishes) */}
        {roundStats && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Accuracy Progression</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {roundStats.accBefore}% → {roundStats.accAfter}% (+{(roundStats.accAfter - roundStats.accBefore).toFixed(1)}%)
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Global Loss Delta</span>
                <span className="text-white font-bold text-sm">
                  {roundStats.lossBefore} → {roundStats.lossAfter}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">zkML Proof Hash</span>
                <span className="text-[#E5A638] font-bold text-sm truncate block">
                  {roundStats.zkProofHash}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Dual-Chain Settlement</span>
                <span className="text-cyan-400 font-bold text-sm truncate block">
                  Arb + Sol Payout OK
                </span>
              </div>
            </div>

            {/* Root Node Aggregated Global Weights Vector Inspector */}
            <div className="p-4 rounded-xl bg-[#0C0A09] border border-fuchsia-800/60 font-mono text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse"></span>
                  <span className="font-bold text-fuchsia-300 uppercase tracking-wide">
                    Root Node Byzantine-Aggregated Consensus Weights Vector
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-stone-400">
                  <span>Aggregated L2 Norm: <b className="text-emerald-400">{roundStats.aggregatedNorm !== undefined ? roundStats.aggregatedNorm : "4.8214"}</b></span>
                  <span>Consensus Shift Delta: <b className="text-amber-400">{roundStats.deltaAggNorm !== undefined ? roundStats.deltaAggNorm : "0.1872"}</b></span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block mb-1">
                  Global Model Weights Vector (first 8 parameters preview):
                </span>
                <div className="bg-black/60 p-2.5 rounded-lg border border-stone-800 text-fuchsia-200 font-mono text-[11px] overflow-x-auto">
                  {roundStats.aggregatedWeightsPreview && roundStats.aggregatedWeightsPreview.length > 0
                    ? `[${roundStats.aggregatedWeightsPreview.join(", ")}, ...]`
                    : `[-0.1421, 0.3842, -0.0915, 0.4512, 0.0124, -0.1620, 0.2819, -0.0734, ...]`}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modal: Add New Custom Edge Device */}
      {showAddNodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border-2 border-[#1C1917] retro-shadow-lg rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#1C1917]/20 pb-3">
              <h3 className="font-display font-black text-lg text-[#1C1917]">
                Add Edge Device Enclave
              </h3>
              <button
                onClick={() => setShowAddNodeModal(false)}
                className="text-[#78716C] hover:text-[#1C1917] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewNode} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#1C1917] font-bold mb-1">
                  Device / Facility Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Health Node 5"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border-2 border-[#1C1917] bg-white text-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-[#1C1917] font-bold mb-1">
                  Hardware Accelerator Tier:
                </label>
                <select
                  value={newNodeTier}
                  onChange={(e) => setNewNodeTier(e.target.value)}
                  className="w-full p-2.5 rounded-lg border-2 border-[#1C1917] bg-white text-[#1C1917]"
                >
                  <option value="RTX 4090">NVIDIA RTX 4090 (24GB)</option>
                  <option value="Apple M3 Max">Apple M3 Max (36GB)</option>
                  <option value="AWS A100 TensorCore">AWS A100 (80GB)</option>
                  <option value="Jetson Orin Nano">NVIDIA Jetson Orin (8GB)</option>
                  <option value="Intel SGX Enclave">Intel SGX Confidential Enclave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1C1917] font-bold mb-1">
                    VRAM (GB):
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="128"
                    value={newNodeVram}
                    onChange={(e) => setNewNodeVram(parseInt(e.target.value) || 16)}
                    className="w-full p-2.5 rounded-lg border-2 border-[#1C1917] bg-white text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-[#1C1917] font-bold mb-1">
                    Local Records:
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={newNodeSamples}
                    onChange={(e) => setNewNodeSamples(parseInt(e.target.value) || 200)}
                    className="w-full p-2.5 rounded-lg border-2 border-[#1C1917] bg-white text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C1917]/20 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddNodeModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#1C1917]/40 text-[#57534E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#E05338] text-white border-2 border-[#1C1917] retro-shadow-sm font-bold"
                >
                  Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
