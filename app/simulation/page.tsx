"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  LayoutDashboard, 
  Settings2, 
  TrendingUp, 
  Wallet, 
  Package, 
  Info,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";

interface Options {
  crops: string[];
  crop_to_regions: { [key: string]: string[] }; 
}

interface PredictionResult {
  summary: { 売上高: number; 経営費計: number; 農業所得: number; };
  details: { [key: string]: number };
}

export default function SimulationPage() {
  const [options, setOptions] = useState<Options>({ crops: [], crop_to_regions: {} });
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isCustom, setIsCustom] = useState(false);

  const [formData, setFormData] = useState({
    crop: "",
    region: "",
    area: 20,
    months: 12,
    inflation_rev: 1.40,
    inflation_exp: 1.50,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/options")
      .then((res) => res.json())
      .then((data: Options) => {
        setOptions(data);
        if (data.crops.length > 0) {
          const firstCrop = data.crops[0];
          const regions = data.crop_to_regions[firstCrop] || [];
          setAvailableRegions(regions);
          setFormData(prev => ({ ...prev, crop: firstCrop, region: regions.length > 0 ? regions[0] : "" }));
        }
      });
  }, []);

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCrop = e.target.value;
    const newRegions = options.crop_to_regions[newCrop] || [];
    setAvailableRegions(newRegions);
    setFormData({ ...formData, crop: newCrop, region: newRegions.length > 0 ? newRegions[0] : "" });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, is_custom: isCustom }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("AIサーバーエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg"><LayoutDashboard className="text-white" size={20} /></div>
          <h1 className="text-xl font-bold text-slate-800">営農収支ダッシュボード</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-[360px] bg-white border-r border-slate-200 p-6 space-y-6 overflow-y-auto shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Settings2 size={16} /><h2 className="font-bold text-[11px] uppercase tracking-wider">Simulation Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-700">品目</Label>
              <select className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" value={formData.crop} onChange={handleCropChange}>
                {options.crops.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-700">地域</Label>
              <select className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                {availableRegions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-700">面積 (are)</Label>
                <Input type="number" className="h-11 rounded-xl bg-slate-50" value={formData.area} onChange={(e) => setFormData({...formData, area: Number(e.target.value)})} />
              </div>
              <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-700">期間 (月)</Label>
                <Input type="number" className="h-11 rounded-xl bg-slate-50" value={formData.months} onChange={(e) => setFormData({...formData, months: Number(e.target.value)})} />
              </div>
            </div>

            <Separator />

            {/* モード切り替え */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-1">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <SlidersHorizontal size={14} /> 詳細設定 (手動補正)
                  </Label>
                </div>
                <Switch checked={isCustom} onCheckedChange={setIsCustom} className="data-[state=checked]:bg-green-600" />
              </div>

              {isCustom ? (
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">売上高の補正倍率</Label>
                    <div className="flex items-center gap-3">
                      <Input type="number" step="0.1" className="h-9 rounded-lg" value={formData.inflation_rev} onChange={(e) => setFormData({...formData, inflation_rev: Number(e.target.value)})} />
                      <span className="text-xs font-bold text-slate-400">x</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">経営費の補正倍率</Label>
                    <div className="flex items-center gap-3">
                      <Input type="number" step="0.1" className="h-9 rounded-lg" value={formData.inflation_exp} onChange={(e) => setFormData({...formData, inflation_exp: Number(e.target.value)})} />
                      <span className="text-xs font-bold text-slate-400">x</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex gap-3">
                  <div className="mt-0.5"><Info size={14} className="text-green-600" /></div>
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-green-700 uppercase tracking-tighter">統計データ自動適用中</span>
                    <p className="text-[10px] text-green-600/80 leading-relaxed">
                      e-Stat農業物価統計に基づき、売上1.4倍・経費1.5倍の補正を適用しています。
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handlePredict} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl shadow-lg transition-all active:scale-95">
              {loading ? "計算中..." : "シミュレーションを実行"}
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {result ? (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 農業所得カード */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden group">
                  <div className="h-1.5 bg-green-500 w-full" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Profit</span>
                      <TrendingUp className="text-green-500" size={18} />
                    </div>
                    <CardTitle className="text-sm text-slate-500 font-medium pt-1">予想農業所得</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-slate-800">¥{result.summary.農業所得.toLocaleString()}</div>
                    <div className="mt-4 flex items-center gap-2 py-1 px-2 bg-green-50 rounded-lg w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-700">{formData.months}ヶ月間の純利益予測</span>
                    </div>
                  </CardContent>
                </Card>

                {/* 売上高カード */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
                  <div className="h-1.5 bg-blue-500 w-full" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                      <Package className="text-blue-500" size={18} />
                    </div>
                    <CardTitle className="text-sm text-slate-500 font-medium pt-1">想定売上高</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-slate-800">¥{result.summary.売上高.toLocaleString()}</div>
                    <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">農産物の総販売収入の予測値</p>
                  </CardContent>
                </Card>

                {/* 経営費カード */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
                  <div className="h-1.5 bg-amber-500 w-full" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Expenses</span>
                      <Wallet className="text-amber-500" size={18} />
                    </div>
                    <CardTitle className="text-sm text-slate-500 font-medium pt-1">想定経営費</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-slate-800">¥{result.summary.経営費計.toLocaleString()}</div>
                    <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">肥料、農薬、労賃等の合計経費</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* 経費内訳 */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl">
                  <CardHeader className="border-b border-slate-50 pb-4">
                    <CardTitle className="text-base font-bold text-slate-800">経費項目の詳細内訳</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {Object.entries(result.details).map(([key, value]) => {
                        const ratio = Math.min(100, (value / result.summary.売上高) * 100);
                        return (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-600">{key}</span>
                              <div className="text-right">
                                <span className="text-xs font-extrabold text-slate-800 block">¥{value.toLocaleString()}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">ratio: {ratio.toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${ratio}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* AIアドバイス */}
                <div className="space-y-6">
                  <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-green-900 rounded-3xl text-white overflow-hidden relative min-h-[300px]">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                    <CardHeader><CardTitle className="text-base font-bold text-green-100 flex items-center gap-2"><Info size={18} />AI診断アドバイス</CardTitle></CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                      <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <p className="text-sm leading-relaxed font-medium">
                          {formData.region}における{formData.crop}の栽培は、
                          所得率が約<span className="text-green-300 font-bold text-xl mx-1">{Math.round((result.summary.農業所得 / result.summary.売上高) * 100)}%</span>と予測されます。
                          {formData.months > 12 && <span className="block mt-3 pt-3 border-t border-white/10 text-xs text-green-100/70 italic">※長期計画では修穫サイクルの変動や資材価格の再上昇を考慮した内部留保の確保が推奨されます。</span>}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-400">免責事項</h4>
                        <ul className="text-[10px] space-y-2 text-green-100/60">
                          <li className="flex items-start gap-2"><ChevronRight size={12} className="mt-0.5 text-green-500" /><span>農林水産省 e-Stat 経営統計をベースにした推計値です。</span></li>
                          <li className="flex items-start gap-2"><ChevronRight size={12} className="mt-0.5 text-green-500" /><span>実際の収支は天候、災害、市場価格により大きく変動します。</span></li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400 space-y-6">
              <TrendingUp size={80} className="text-slate-200 animate-pulse" />
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-slate-400">シミュレーション準備完了</p>
                <p className="text-sm text-slate-400/70">左側のパネルから条件を入力してください</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}