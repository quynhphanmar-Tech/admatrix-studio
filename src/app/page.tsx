"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  FootageAsset,
  FootageTag,
  DeconstructedScript,
  ScriptVariant,
  VideoTimeline,
  ABTestCampaign,
  ABTestVariant,
  ABTestMetrics,
  ViralComment,
  FOOTAGE_TAG_LABELS as FTL_TYPE,
  ARCHETYPE_LABELS as AL_TYPE,
  ScriptArchetype,
  Category,
} from "@/types/core";
import { FOOTAGE_TAG_LABELS, ARCHETYPE_LABELS } from "@/types/core";

// ═══════════════════════════════════════════════════════════════
// STEP WIZARD
// ═══════════════════════════════════════════════════════════════
const STEPS = [
  { id: 1, label: "Chọn Video Gốc", icon: "🔍" },
  { id: 2, label: "Upload Footage", icon: "📦" },
  { id: 3, label: "12 Kịch Bản", icon: "🎬" },
  { id: 4, label: "A/B Test", icon: "📊" },
];

// ═══════════════════════════════════════════════════════════════
// TOP AD CARD TYPE (for Step 1)
// ═══════════════════════════════════════════════════════════════
interface TopAdItem {
  id: string;
  title: string;
  brandName: string;
  category: string;
  verbalHook: string;
  likes: string;
  comments: string;
  saves: string;
  views: string;
  ctrRank: string;
  imgUrl: string;
  videoSampleUrl: string;
  durationSec: number;
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function HomePage() {
  // ── Navigation ──
  const [currentStep, setCurrentStep] = useState(1);

  // ── Step 1: Source Video ──
  const [topAds, setTopAds] = useState<TopAdItem[]>([]);
  const [topAdsLoading, setTopAdsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("PET_SUPPLIES");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAd, setSelectedAd] = useState<TopAdItem | null>(null);
  const [deconstructedScript, setDeconstructedScript] = useState<DeconstructedScript | null>(null);
  const [deconstructing, setDeconstructing] = useState(false);

  // ── Step 2: Footage Library ──
  const [footageAssets, setFootageAssets] = useState<FootageAsset[]>([]);
  const [productName, setProductName] = useState("");
  const [productBenefit, setProductBenefit] = useState("");
  const [commentInsight, setCommentInsight] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [stockResults, setStockResults] = useState<FootageAsset[]>([]);
  const [stockSearching, setStockSearching] = useState(false);
  const [stockSearchType, setStockSearchType] = useState<"video" | "photo">("photo");
  const [isDragging, setIsDragging] = useState(false);

  // ── Step 3: 12 Scripts Matrix ──
  const [scripts, setScripts] = useState<ScriptVariant[]>([]);
  const [generatingScripts, setGeneratingScripts] = useState(false);
  const [previewScript, setPreviewScript] = useState<ScriptVariant | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState<Record<string, number>>({});

  // ── Step 4: A/B Test ──
  const [abCampaign, setAbCampaign] = useState<ABTestCampaign | null>(null);

  // ── Backend Admin User (Direct Passless Auth) ──
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string; isAdmin: boolean }>({
    email: "quynhphan.mar@gmail.com",
    role: "Admin (Backend Owner)",
    isAdmin: true
  });
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<string>("Active • Direct Token Auth");

  // ═════════════════ STEP 1: FETCH TOP ADS ═════════════════

  const fetchTopAds = useCallback(async () => {
    setTopAdsLoading(true);
    try {
      const params = new URLSearchParams({
        industry: selectedCategory,
        q: searchQuery,
      });
      const res = await fetch(`/api/tiktok-topads?${params}`);
      const data = await res.json();
      setTopAds(data.results || data || []);
    } catch {
      setTopAds([]);
    } finally {
      setTopAdsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchTopAds();
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectAd = async (ad: TopAdItem) => {
    setSelectedAd(ad);
    setDeconstructing(true);
    try {
      const res = await fetch("/api/deconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: ad.videoSampleUrl || ad.imgUrl,
          videoTitle: ad.title,
          category: ad.category,
        }),
      });
      const data = await res.json();
      setDeconstructedScript(data);
      // Auto-fill product info from ad
      if (!productName) setProductName(ad.title.split(" ").slice(0, 5).join(" "));
      if (!productBenefit) setProductBenefit(ad.verbalHook);
    } catch {
      // Silently handle
    } finally {
      setDeconstructing(false);
    }
  };

  // ═════════════════ STEP 2: FOOTAGE UPLOAD ═════════════════

  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      const newAssets: FootageAsset[] = [];
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        const url = URL.createObjectURL(file);
        const id = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        // Get dimensions
        let width = 720, height = 1280;
        if (!isVideo) {
          try {
            const img = new Image();
            img.src = url;
            await new Promise((resolve) => { img.onload = resolve; });
            width = img.naturalWidth;
            height = img.naturalHeight;
          } catch { /* use defaults */ }
        }

        // Auto-tag via API
        let tags: FootageTag[] = ['PRODUCT_HERO'];
        try {
          const res = await fetch("/api/footage/auto-tag", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: url, fileName: file.name }),
          });
          const tagData = await res.json();
          if (tagData.tags && tagData.tags.length > 0) {
            tags = tagData.tags;
          }
        } catch { /* use default */ }

        newAssets.push({
          id,
          type: isVideo ? "VIDEO" : "IMAGE",
          source: "USER_UPLOAD",
          url,
          thumbnailUrl: url,
          tags,
          width,
          height,
          license: "User Owned",
          fileName: file.name,
          durationSec: isVideo ? 10 : undefined,
        });
      }
      setFootageAssets((prev) => [...prev, ...newAssets]);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  const searchStockFootage = async () => {
    if (!stockSearchQuery.trim()) return;
    setStockSearching(true);
    try {
      const params = new URLSearchParams({
        q: stockSearchQuery,
        type: stockSearchType,
        per_page: "12",
      });
      const res = await fetch(`/api/footage/search?${params}`);
      const data = await res.json();
      setStockResults(data.assets || data || []);
    } catch {
      setStockResults([]);
    } finally {
      setStockSearching(false);
    }
  };

  const addStockToLibrary = (asset: FootageAsset) => {
    setFootageAssets((prev) => {
      if (prev.find((a) => a.id === asset.id)) return prev;
      return [...prev, asset];
    });
  };

  const removeFootage = (id: string) => {
    setFootageAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // ═════════════════ STEP 3: GENERATE 12 SCRIPTS ═════════════════

  const generate12Scripts = async () => {
    if (!deconstructedScript) return;
    setGeneratingScripts(true);
    try {
      const res = await fetch("/api/generate-12-scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName || "Sản phẩm",
          productBenefit: productBenefit || "Hiệu quả tuyệt vời",
          category: selectedCategory,
          commentInsight: commentInsight,
          sourceScript: deconstructedScript,
        }),
      });
      const data = await res.json();
      setScripts(data.scripts || data || []);
      // Initialize A/B campaign
      setAbCampaign({
        id: `campaign_${Date.now()}`,
        name: `${productName || "Campaign"} — ${new Date().toLocaleDateString("vi-VN")}`,
        productName: productName || "Sản phẩm",
        createdAt: new Date().toISOString(),
        variants: (data.scripts || data || []).map((s: ScriptVariant) => ({
          scriptVariantId: s.id,
          archetype: s.archetype,
          label: s.label,
          videoExported: false,
          metrics: { impressions: 0, views: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 },
          ctr: 0,
          cvr: 0,
          cpa: 0,
          roas: 0,
        })),
        status: "DRAFT",
      });
    } catch {
      // Handle error
    } finally {
      setGeneratingScripts(false);
    }
  };

  const downloadAllScripts = () => {
    const text = scripts
      .map(
        (s, i) =>
          `═══ KỊCH BẢN #${i + 1}: ${s.label} ═══\nArchetype: ${s.archetype}\nHook: ${s.hookStrategy}\nStory Arc: ${s.storyArc}\nProof: ${s.proofType}\nCTA: ${s.ctaMechanism}\nThời lượng: ${s.totalDurationSec}s\n\n--- Voiceover Script ---\n${s.voiceoverScript}\n\n--- Timeline ---\n${s.phases.map((p) => `[${p.startSec}s-${p.endSec}s] ${p.label}: ${p.spokenText}\n  Visual: ${p.visualDescription}\n  Overlay: ${p.textOverlay}\n  Camera: ${p.cameraWork}\n  Footage: ${p.requiredFootageTag}`).join("\n\n")}\n\n--- Caption ---\n${s.caption}\n${s.hashtags.join(" ")}\n`
      )
      .join("\n\n" + "═".repeat(60) + "\n\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AdMatrix_12_KichBan_${productName.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSingleVideo = async (script: ScriptVariant) => {
    setExportProgress((prev) => ({ ...prev, [script.id]: 5 }));
    try {
      // Dynamically import videoRenderer to keep bundle smaller
      const { exportAndDownloadMP4 } = await import("@/utils/videoRenderer");
      const { buildTimeline } = await import("@/services/timelineBuilder");

      const timeline = buildTimeline(
        script,
        footageAssets,
        deconstructedScript?.viralComments?.[0]
      );

      await exportAndDownloadMP4(
        timeline,
        `${script.id}_${productName.replace(/\s+/g, "_")}.mp4`,
        (percent, msg) => {
          setExportProgress((prev) => ({ ...prev, [script.id]: percent }));
        }
      );
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExportProgress((prev) => ({ ...prev, [script.id]: 100 }));
      setTimeout(() => {
        setExportProgress((prev) => {
          const next = { ...prev };
          delete next[script.id];
          return next;
        });
      }, 2000);
    }
  };

  // ═════════════════ STEP 4: A/B METRICS ═════════════════

  const updateMetric = (variantId: string, field: keyof ABTestMetrics, value: number) => {
    if (!abCampaign) return;
    setAbCampaign((prev) => {
      if (!prev) return prev;
      const variants = prev.variants.map((v) => {
        if (v.scriptVariantId !== variantId) return v;
        const metrics = { ...v.metrics, [field]: value };
        const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
        const cvr = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0;
        const cpa = metrics.conversions > 0 ? metrics.spend / metrics.conversions : 0;
        const roas = metrics.spend > 0 ? metrics.revenue / metrics.spend : 0;
        return { ...v, metrics, ctr, cvr, cpa, roas };
      });
      return { ...prev, variants };
    });
  };

  const getWinner = (): ABTestVariant | null => {
    if (!abCampaign) return null;
    const eligible = abCampaign.variants.filter((v) => v.metrics.conversions > 0);
    if (eligible.length === 0) return null;
    return eligible.reduce((best, v) => (v.roas > best.roas ? v : best));
  };

  // ═════════════════ PHASE COLORS ═════════════════

  const PHASE_COLORS: Record<string, string> = {
    HOOK: "#fe2c55",
    PROBLEM: "#ef4444",
    SOLUTION: "#3b82f6",
    DEMO: "#8b5cf6",
    PROOF: "#10b981",
    CTA: "#f59e0b",
    TURNING: "#06b6d4",
    RESULT: "#22c55e",
    STEP_1: "#6366f1",
    STEP_2: "#8b5cf6",
    STEP_3: "#a855f7",
    MORNING: "#fb923c",
    EVENING: "#7c3aed",
    EXPLAIN: "#0ea5e9",
    MECHANISM: "#14b8a6",
    COMPARE: "#f97316",
    ANSWER: "#22d3ee",
    SETUP: "#64748b",
    STOCK: "#dc2626",
    BONUS: "#eab308",
    TOTAL: "#84cc16",
    DAY1: "#06b6d4",
    DAY7: "#8b5cf6",
    REVEAL: "#f59e0b",
    CONTRAST: "#ef4444",
    PROCESS: "#6366f1",
    AFTER: "#10b981",
    RECOMMEND: "#3b82f6",
    GUARANTEE: "#059669",
    SCIENCE: "#0891b2",
    USER1: "#ec4899",
    USER2: "#f97316",
    USER3: "#84cc16",
    COMPILATION: "#8b5cf6",
    ITEM1: "#22d3ee",
    ITEM2: "#a855f7",
    ITEM3: "#f472b6",
    PRODUCT: "#3b82f6",
    DATA: "#14b8a6",
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0c14]/90 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#fe2c55] to-pink-600 flex items-center justify-center text-sm font-black">
              A
            </div>
            <span className="font-bold text-base tracking-tight">AdMatrix</span>
            <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
              v2 • 12 Scripts Engine
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all text-xs"
              title="Quản lý Tài Khoản & Backend Access"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-slate-300 hidden md:inline">{currentUser.email}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                ADMIN
              </span>
            </button>
            <div className="text-xs text-slate-500 hidden sm:block">
              Clone 12 Kịch Bản Video
            </div>
          </div>
        </div>
      </header>

      {/* ── STEP WIZARD ── */}
      <div className="border-b border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {STEPS.map((step, i) => (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id <= currentStep || (step.id === 2 && deconstructedScript) || (step.id === 3 && scripts.length > 0) || (step.id === 4 && abCampaign)) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  currentStep === step.id
                    ? "step-active"
                    : currentStep > step.id
                    ? "step-done"
                    : "step-pending"
                }`}
              >
                <span>{currentStep > step.id ? "✅" : step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-6">
        {/* ═════════════════ STEP 1: CHỌN VIDEO GỐC ═════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeInUp">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "PET_SUPPLIES", label: "🐶 Thú Cưng" },
                { id: "COSMETICS", label: "💄 Mỹ Phẩm" },
                { id: "EDUCATION", label: "📚 Giáo Dục" },
                { id: "FASHION", label: "👗 Thời Trang" },
                { id: "TECH", label: "💻 Công Nghệ" },
                { id: "HOME", label: "🏠 Gia Dụng" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`tag-chip ${selectedCategory === cat.id ? "tag-chip-active" : ""}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchTopAds()}
                placeholder="Tìm kiếm video viral theo từ khóa..."
                className="input-field flex-1"
              />
              <button onClick={fetchTopAds} className="btn-primary text-sm px-5">
                🔍 Tìm
              </button>
            </div>

            {/* Selected ad info */}
            {selectedAd && (
              <div className="glass-card p-4 flex items-center gap-4">
                <img src={selectedAd.imgUrl} alt="" className="w-16 h-28 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-emerald-400">✅ Video Gốc Đã Chọn</p>
                  <p className="text-xs text-slate-300 truncate">{selectedAd.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedAd.verbalHook}</p>
                </div>
                {deconstructing ? (
                  <div className="text-xs text-cyan-400 animate-pulse">⏳ Đang bóc tách kịch bản...</div>
                ) : deconstructedScript ? (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-primary text-sm"
                  >
                    Tiếp → Upload Footage
                  </button>
                ) : null}
              </div>
            )}

            {/* Deconstructed script preview */}
            {deconstructedScript && (
              <div className="glass-card p-5 space-y-4">
                <h3 className="text-sm font-bold text-cyan-400">📋 Cấu Trúc Kịch Bản Gốc (6 Phases)</h3>
                <div className="flex gap-1 h-10">
                  {deconstructedScript.phases.map((phase, i) => (
                    <div
                      key={i}
                      className="phase-bar"
                      style={{
                        flex: phase.durationSec,
                        backgroundColor: PHASE_COLORS[phase.phaseType] || "#6366f1",
                      }}
                      title={`${phase.label}: ${phase.spokenText}`}
                    >
                      {phase.label}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="glass-card p-3">
                    <p className="text-slate-500">JTBD</p>
                    <p className="text-slate-200 mt-1 font-medium">{deconstructedScript.primaryJTBD}</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-slate-500">Cảm xúc</p>
                    <p className="text-slate-200 mt-1 font-medium">{deconstructedScript.targetEmotion}</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-slate-500">Nhịp độ</p>
                    <p className="text-slate-200 mt-1 font-medium">{deconstructedScript.pacing}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Top Ads Grid */}
            <div>
              <h2 className="text-sm font-bold text-slate-400 mb-3">
                {topAdsLoading ? "⏳ Đang tải..." : `📺 Top Ads Viral (${topAds.length} kết quả)`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
                {topAds.map((ad) => (
                  <div
                    key={ad.id}
                    onClick={() => handleSelectAd(ad)}
                    className={`script-card cursor-pointer ${
                      selectedAd?.id === ad.id ? "ring-2 ring-cyan-400" : ""
                    }`}
                  >
                    <div className="relative aspect-[9/14] bg-slate-900">
                      <img
                        src={ad.imgUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                        <p className="text-xs font-bold text-white line-clamp-2">{ad.title}</p>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white font-bold">
                        {ad.durationSec}s
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-[11px] text-pink-400 font-semibold line-clamp-1">{ad.verbalHook}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span>👁 {ad.views}</span>
                        <span>❤️ {ad.likes}</span>
                        <span>💬 {ad.comments}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-cyan-400 font-bold">{ad.ctrRank}</span>
                        <span className="text-slate-500">{ad.brandName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════ STEP 2: UPLOAD FOOTAGE ═════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeInUp">
            {/* Product info */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-bold">📝 Thông Tin Sản Phẩm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Tên Sản Phẩm</label>
                  <input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="VD: Sữa tắm chó mèo KindioPet"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Lợi Ích / USP</label>
                  <input
                    value={productBenefit}
                    onChange={(e) => setProductBenefit(e.target.value)}
                    placeholder="VD: Thơm mượt 7 ngày, diệt khuẩn 99%"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Insight / Bình Luận Khách Hàng (tuỳ chọn)</label>
                <input
                  value={commentInsight}
                  onChange={(e) => setCommentInsight(e.target.value)}
                  placeholder="VD: Khách hay hỏi: Chó con 2 tháng tắm có an toàn không?"
                  className="input-field"
                />
              </div>
            </div>

            {/* Upload zone + Stock search side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold">📤 Upload Ảnh/Video Sản Phẩm</h3>
                <div
                  className={`dropzone ${isDragging ? "dropzone-active" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="text-3xl">📁</span>
                  <p className="text-sm text-slate-400">Kéo thả hoặc nhấp để tải ảnh/video</p>
                  <p className="text-[10px] text-slate-600">Hỗ trợ MP4, MOV, PNG, JPG (tối đa 6 file)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                </div>
              </div>

              {/* Stock search */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold">🌐 Tìm Footage Free (Pexels)</h3>
                <div className="flex gap-2">
                  <input
                    value={stockSearchQuery}
                    onChange={(e) => setStockSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchStockFootage()}
                    placeholder="VD: cute puppy bath, skincare routine..."
                    className="input-field flex-1"
                  />
                  <select
                    value={stockSearchType}
                    onChange={(e) => setStockSearchType(e.target.value as "video" | "photo")}
                    className="input-field w-24"
                  >
                    <option value="photo">📷 Ảnh</option>
                    <option value="video">🎥 Video</option>
                  </select>
                  <button onClick={searchStockFootage} className="btn-secondary text-sm px-4">
                    {stockSearching ? "⏳" : "🔍"}
                  </button>
                </div>
                {stockResults.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                    {stockResults.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => addStockToLibrary(asset)}
                        className="footage-card aspect-[3/4]"
                      >
                        <img src={asset.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-xl transition-opacity">+</span>
                        </div>
                        <div className="absolute bottom-1 left-1">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/80 text-white">
                            {asset.type === "VIDEO" ? "🎥" : "📷"} FREE
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footage Library Grid */}
            {footageAssets.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">📚 Thư Viện Footage ({footageAssets.length} file)</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {footageAssets.map((asset) => (
                    <div key={asset.id} className="footage-card">
                      <div className="aspect-[3/4] relative">
                        <img src={asset.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFootage(asset.id); }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="flex flex-wrap gap-0.5">
                            {asset.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-1 py-0.5 rounded text-[7px] font-bold bg-cyan-500/30 text-cyan-300">
                                {FOOTAGE_TAG_LABELS[tag]?.split(" ")[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                        {asset.source !== "USER_UPLOAD" && (
                          <div className="absolute top-1 left-1">
                            <span className="px-1 py-0.5 rounded text-[7px] font-bold bg-violet-500/80 text-white">
                              Pexels
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setCurrentStep(1)} className="btn-ghost">
                ← Quay lại
              </button>
              <button
                onClick={() => { generate12Scripts(); setCurrentStep(3); }}
                disabled={!deconstructedScript || generatingScripts}
                className="btn-primary"
              >
                {generatingScripts ? "⏳ Đang tạo 12 kịch bản..." : "🎬 Tạo 12 Video Ads Ma Trận"}
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════ STEP 3: 12 SCRIPTS MATRIX ═════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeInUp">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">🎬 Ma Trận 12 Kịch Bản Video</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mỗi kịch bản có cấu trúc câu chuyện riêng biệt • {footageAssets.length} footage khả dụng
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={downloadAllScripts} className="btn-secondary text-xs">
                  📥 Tải 12 Kịch Bản (TXT)
                </button>
                <button onClick={() => setCurrentStep(4)} className="btn-secondary text-xs">
                  📊 A/B Test
                </button>
              </div>
            </div>

            {generatingScripts ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
                <p className="text-sm text-slate-400">Đang tạo 12 kịch bản video khác cấu trúc...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
                {scripts.map((script, i) => {
                  const archetypeInfo = ARCHETYPE_LABELS[script.archetype];
                  const isExporting = exportProgress[script.id] !== undefined;
                  return (
                    <div key={script.id} className="script-card">
                      {/* Card header with archetype color */}
                      <div
                        className="px-4 py-2.5 flex items-center justify-between"
                        style={{ backgroundColor: archetypeInfo?.color + "20" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{archetypeInfo?.emoji}</span>
                          <span className="text-xs font-bold" style={{ color: archetypeInfo?.color }}>
                            #{i + 1} {archetypeInfo?.vi}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            script.estimatedCTR === "HIGH"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : script.estimatedCTR === "MEDIUM"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          CTR {script.estimatedCTR}
                        </span>
                      </div>

                      {/* Phase timeline minibar */}
                      <div className="px-3 py-2">
                        <div className="flex gap-0.5 h-5 rounded overflow-hidden">
                          {script.phases.map((phase, j) => (
                            <div
                              key={j}
                              className="flex items-center justify-center text-[7px] font-bold text-white/80 truncate px-0.5"
                              style={{
                                flex: phase.durationSec,
                                backgroundColor: PHASE_COLORS[phase.phaseType] || "#6366f1",
                              }}
                              title={`${phase.label}: ${phase.spokenText.slice(0, 40)}...`}
                            >
                              {phase.durationSec > 3 ? phase.label.slice(0, 6) : ""}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Content preview */}
                      <div className="px-4 pb-3 space-y-2">
                        <p className="text-[11px] text-pink-400 font-semibold line-clamp-2">
                          &quot;{script.phases[0]?.spokenText}&quot;
                        </p>
                        <div className="text-[10px] text-slate-500 space-y-0.5">
                          <p>🎯 Hook: {script.hookStrategy}</p>
                          <p>📖 Arc: {script.storyArc}</p>
                          <p>⏱️ {script.totalDurationSec}s</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-3 pb-3 flex gap-2">
                        <button
                          onClick={() => setPreviewScript(script)}
                          className="btn-ghost flex-1 text-[11px]"
                        >
                          👁 Xem
                        </button>
                        <button
                          onClick={() => exportSingleVideo(script)}
                          disabled={isExporting}
                          className="btn-ghost flex-1 text-[11px]"
                        >
                          {isExporting
                            ? `${exportProgress[script.id]}%`
                            : "📥 Xuất MP4"}
                        </button>
                      </div>

                      {/* Export progress bar */}
                      {isExporting && (
                        <div className="h-1 bg-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-300"
                            style={{ width: `${exportProgress[script.id]}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Preview Modal */}
            {previewScript && (
              <div className="modal-overlay" onClick={() => setPreviewScript(null)}>
                <div
                  className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6 space-y-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <span>{ARCHETYPE_LABELS[previewScript.archetype]?.emoji}</span>
                      {ARCHETYPE_LABELS[previewScript.archetype]?.vi}
                    </h3>
                    <button onClick={() => setPreviewScript(null)} className="btn-ghost">✕</button>
                  </div>

                  {/* Phase timeline */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Timeline ({previewScript.totalDurationSec}s)</p>
                    <div className="flex gap-1 h-10 rounded-xl overflow-hidden">
                      {previewScript.phases.map((phase, i) => (
                        <div
                          key={i}
                          className="phase-bar"
                          style={{
                            flex: phase.durationSec,
                            backgroundColor: PHASE_COLORS[phase.phaseType] || "#6366f1",
                          }}
                        >
                          {phase.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phases detail */}
                  <div className="space-y-3">
                    {previewScript.phases.map((phase, i) => (
                      <div key={i} className="glass-card p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: PHASE_COLORS[phase.phaseType] || "#6366f1" }}
                          />
                          <span className="text-xs font-bold text-white">
                            [{phase.startSec}s - {phase.endSec}s] {phase.label}
                          </span>
                          <span className="tag-chip text-[9px]">{FOOTAGE_TAG_LABELS[phase.requiredFootageTag]}</span>
                        </div>
                        <p className="text-xs text-slate-300">🎤 {phase.spokenText}</p>
                        <p className="text-[11px] text-slate-500">📷 {phase.visualDescription}</p>
                        <div className="flex gap-4 text-[10px] text-slate-600">
                          <span>🎥 {phase.cameraWork}</span>
                          <span>💭 {phase.emotionBeat}</span>
                        </div>
                        {phase.textOverlay && (
                          <p className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-lg inline-block">
                            📝 {phase.textOverlay}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Voiceover */}
                  <div className="glass-card p-4">
                    <p className="text-xs text-slate-500 mb-2">📜 Full Voiceover Script</p>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {previewScript.voiceoverScript}
                    </p>
                  </div>

                  {/* Caption */}
                  <div className="glass-card p-4">
                    <p className="text-xs text-slate-500 mb-2">📱 Caption & Hashtags</p>
                    <p className="text-sm text-slate-200">{previewScript.caption}</p>
                    <p className="text-xs text-cyan-400 mt-1">{previewScript.hashtags.join(" ")}</p>
                  </div>

                  {/* Export button */}
                  <button
                    onClick={() => { exportSingleVideo(previewScript); setPreviewScript(null); }}
                    className="btn-primary w-full"
                  >
                    🎬 Xuất Video MP4
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════ STEP 4: A/B TEST DASHBOARD ═════════════════ */}
        {currentStep === 4 && abCampaign && (
          <div className="space-y-6 animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">📊 A/B Test Dashboard</h2>
                <p className="text-xs text-slate-500">{abCampaign.name}</p>
              </div>
              <button onClick={() => setCurrentStep(3)} className="btn-ghost">← Quay lại ma trận</button>
            </div>

            {/* Winner highlight */}
            {getWinner() && (
              <div className="glass-card p-5 border-emerald-500/30 bg-emerald-500/[0.05]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-sm font-bold text-emerald-400">
                      TOP PERFORMER: {getWinner()?.label}
                    </p>
                    <p className="text-xs text-slate-400">
                      ROAS {getWinner()?.roas.toFixed(1)}x • CTR {getWinner()?.ctr.toFixed(1)}% • CVR {getWinner()?.cvr.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Metrics table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3 px-2 text-slate-500 font-semibold">Kịch Bản</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">Impressions</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">Views</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">Clicks</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">Conversions</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">Spend (₫)</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">Revenue (₫)</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">CTR</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">CVR</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-semibold">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {abCampaign.variants.map((v) => {
                    const isWinner = getWinner()?.scriptVariantId === v.scriptVariantId;
                    return (
                      <tr
                        key={v.scriptVariantId}
                        className={`border-b border-white/[0.04] ${isWinner ? "bg-emerald-500/[0.05]" : ""}`}
                      >
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5">
                            <span>{ARCHETYPE_LABELS[v.archetype]?.emoji}</span>
                            <span className="font-semibold text-slate-200">{v.label}</span>
                            {isWinner && <span className="text-[9px] text-emerald-400 font-bold">🏆</span>}
                          </div>
                        </td>
                        {(["impressions", "views", "clicks", "conversions", "spend", "revenue"] as const).map(
                          (field) => (
                            <td key={field} className="py-2.5 px-2 text-right">
                              <input
                                type="number"
                                value={v.metrics[field] || ""}
                                onChange={(e) =>
                                  updateMetric(v.scriptVariantId, field, Number(e.target.value) || 0)
                                }
                                placeholder="0"
                                className="w-20 text-right bg-transparent border-b border-white/[0.06] text-slate-300 focus:border-cyan-500 focus:outline-none px-1 py-0.5"
                              />
                            </td>
                          )
                        )}
                        <td className="py-2.5 px-2 text-right font-bold text-cyan-400">{v.ctr.toFixed(1)}%</td>
                        <td className="py-2.5 px-2 text-right font-bold text-emerald-400">{v.cvr.toFixed(1)}%</td>
                        <td className="py-2.5 px-2 text-right font-bold text-yellow-400">{v.roas.toFixed(1)}x</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Insight */}
            <div className="glass-card p-4">
              <p className="text-xs text-slate-500 mb-1">💡 Phân Tích & Đề Xuất</p>
              <p className="text-sm text-slate-200">
                {getWinner()
                  ? `Hook dạng "${getWinner()?.label}" đang outperform với ROAS ${getWinner()?.roas.toFixed(1)}x. Đề xuất: Scale budget lên 5x cho script này, kill các script có ROAS < 1.0x. Xem xét tạo Round 2 với 12 biến thể mới từ winner.`
                  : "Nhập dữ liệu metrics từ TikTok Ads Manager vào bảng trên để xem phân tích. Cần ít nhất 1 variant có conversions > 0."}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── BACKEND OWNER & ACCOUNT MANAGEMENT MODAL ── */}
      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div
            className="glass-card max-w-lg w-full p-6 m-4 space-y-5 border border-pink-500/40 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-pink-500/30">
                  🔐
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Quản Trị Backend & Tài Khoản</h3>
                  <p className="text-xs text-slate-400">Thiết lập đăng nhập không cần mật khẩu</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Account Info Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Email Quản Trị Viên:</span>
                <span className="text-xs font-bold text-emerald-400">{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Vai Trò Hệ Thống:</span>
                <span className="text-xs font-bold text-pink-400">{currentUser.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Cơ Chế Đăng Nhập:</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ⚡ Passless (Không cần mật khẩu)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Trạng Thái Backend:</span>
                <span className="text-xs text-slate-300 font-mono">{backendStatus}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Đổi Email Chủ Sở Hữu (Backend Owner)
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  placeholder="Nhập email mới..."
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
                💡 <strong>Ghi chú bảo mật:</strong> Tài khoản đã được cấp quyền quản trị cấp cao nhất (Backend Owner). Bạn có thể truy cập toàn bộ tính năng trích xuất video, tạo ma trận 12 kịch bản và xuất file MP4 mà không bị hạn chế phiên làm việc. Khi muốn thiết lập mật khẩu cứng, bạn có thể bổ sung trong mục cấu hình backend bất kỳ lúc nào.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setBackendStatus("Đã lưu thiết lập lúc " + new Date().toLocaleTimeString('vi-VN'));
                  setTimeout(() => setShowAdminModal(false), 800);
                }}
                className="btn-primary flex-1 text-xs py-3"
              >
                💾 Lưu Thiết Lập
              </button>
              <button
                onClick={() => setShowAdminModal(false)}
                className="btn-secondary text-xs px-5"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
