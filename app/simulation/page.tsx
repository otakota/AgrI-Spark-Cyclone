"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  LayoutDashboard, Settings2, TrendingUp, Wallet, Package, Info, ChevronRight, SlidersHorizontal, BarChart3
} from "lucide-react";

// Rechartsのインポート
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface Options {
  crops: string[];
  crop_to_regions: { [key: string]: string[] }; 
}

interface TrendData {
  name: string;
  売上: number;
  経費: number;
  累積利益: number;
}

interface PredictionResult {
  summary: { 売上高: number; 経営費計: number; 農業所得: number; };
  details: { [key: string]: number };
  trend: TrendData[]; // 追加
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

            <div className="space-y-1.5"><Label className="text-xs font-bold text-slate-700">地域(※選択した作物が栽培されている地域が反映されます)</Label>
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

            <div className="space-y-4">
              <div className="flex items-center justify-between p-1">
                <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <SlidersHorizontal size={14} /> 詳細設定 (手動補正)
                </Label>
                <Switch checked={isCustom} onCheckedChange={setIsCustom} className="data-[state=checked]:bg-green-600" />
              </div>

              {isCustom ? (
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
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
                    <p className="text-[10px] text-green-600/80 leading-relaxed">e-Stat統計に基づき、売上1.4倍・経費1.5倍の補正を適用しています。</p>
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
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* サマリーカード */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                  <div className="h-1.5 bg-green-500 w-full" />
                  <CardContent className="pt-6">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Profit</span>
                    <div className="text-3xl font-extrabold text-slate-800 mt-1">¥{result.summary.農業所得.toLocaleString()}</div>
                    <p className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded w-fit mt-3">{formData.months}ヶ月間の所得予測</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                  <div className="h-1.5 bg-blue-500 w-full" />
                  <CardContent className="pt-6">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                    <div className="text-3xl font-extrabold text-slate-800 mt-1">¥{result.summary.売上高.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                  <div className="h-1.5 bg-amber-500 w-full" />
                  <CardContent className="pt-6">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Expenses</span>
                    <div className="text-3xl font-extrabold text-slate-800 mt-1">¥{result.summary.経営費計.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* キャッシュフロー推移グラフ (Recharts) */}
              <Card className="border-none shadow-sm bg-white rounded-3xl p-6">
                <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 size={18} className="text-green-600" /> 収支推移シミュレーション
                  </CardTitle>
                </CardHeader>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={result.trend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${(value / 10000).toLocaleString()}万`} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                          fontSize: '12px',
                          padding: '12px'
                        }}
                        // value: any とすることで、TypeScriptのエラーを回避しつつ数値を整形します
                        formatter={(value: any) => [
                          typeof value === 'number' ? `¥${value.toLocaleString()}` : value, 
                          ""
                        ]}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Bar dataKey="売上" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="経費" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                      <Line type="monotone" dataKey="累積利益" stroke="#10B981" strokeWidth={3} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 px-2 py-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    ※ 収穫時期による変動を標準化し、月次平均の経営バランスを表示しています。<br/>
                    長期的な資金推移（累積利益）の確認にご活用ください。
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* 経費内訳 */}
                <Card className="border-none shadow-sm bg-white rounded-3xl p-6">
                  <CardTitle className="text-base font-bold text-slate-800 mb-6">経費項目の詳細内訳</CardTitle>
                  <div className="space-y-6">
                    {Object.entries(result.details).map(([key, value]) => {
                      const ratio = Math.min(100, (value / result.summary.売上高) * 100);
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-600">{key}</span>
                            <span className="text-xs font-extrabold text-slate-800">¥{value.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${ratio}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* AIアドバイス */}
                <Card className="border-none shadow-sm bg-green-900 rounded-3xl text-white overflow-hidden p-6 relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                  <CardTitle className="text-base font-bold text-green-100 flex items-center gap-2 mb-6"><Info size={18} />AI診断アドバイス</CardTitle>
                  <div className="space-y-6 relative z-10">
                    <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                      <p className="text-sm leading-relaxed">
                        {formData.region}における{formData.crop}の栽培は、所得率が約
                        <span className="text-green-300 font-bold text-xl mx-1">{Math.round((result.summary.農業所得 / result.summary.売上高) * 100)}%</span>
                        と予測されます。
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-400">経営上のヒント</h4>
                      <ul className="text-[10px] space-y-2 text-green-100/60">
                        <li className="flex items-start gap-2"><ChevronRight size={12} className="mt-0.5 text-green-500" /><span>月次の売上・経費バランスをグラフで確認し、資金不足が起きないかチェックしましょう。</span></li>
                        <li className="flex items-start gap-2"><ChevronRight size={12} className="mt-0.5 text-green-500" /><span>累積利益のラインが右肩上がりになる計画が理想的です。</span></li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400 space-y-6">
              <TrendingUp size={80} className="text-slate-200 animate-pulse" />
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-slate-400">シミュレーション準備完了</p>
                <p className="text-sm text-slate-400/70">条件を入力して「シミュレーションを実行」をクリックしてください</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}