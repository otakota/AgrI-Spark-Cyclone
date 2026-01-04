"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Settings2, TrendingUp, Wallet, Package } from "lucide-react";

interface Options {
  crops: string[];
  crop_to_regions: { [key: string]: string[] }; 
}

interface PredictionResult {
  summary: {
    売上高: number;
    経営費計: number;
    農業所得: number;
  };
  details: { [key: string]: number };
}

export default function SimulationPage() {
  const [options, setOptions] = useState<Options>({ crops: [], crop_to_regions: {} });
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const [formData, setFormData] = useState({
    crop: "",
    region: "",
    area: 20,
    months: 12, // デフォルト1年
    inflation: 1.4,
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
          setFormData(prev => ({ 
            ...prev, 
            crop: firstCrop,
            region: regions.length > 0 ? regions[0] : ""
          }));
        }
      })
      .catch((err) => console.error("AIサーバーエラー:", err));
  }, []);

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCrop = e.target.value;
    const newRegions = options.crop_to_regions[newCrop] || [];
    setAvailableRegions(newRegions);
    setFormData({ 
      ...formData, 
      crop: newCrop,
      region: newRegions.length > 0 ? newRegions[0] : "" 
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("予測に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b px-8 py-4 flex items-center gap-2">
        <LayoutDashboard className="text-green-600" />
        <h1 className="text-xl font-bold text-slate-800">営農収支ダッシュボード</h1>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* サイドバー（設定エリア） */}
        <aside className="w-full md:w-80 bg-white border-r p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Settings2 size={18} />
            <h2 className="font-semibold text-sm uppercase tracking-wider">シミュレーション設定</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">育てたい作物</Label>
              <select 
                className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.crop}
                onChange={handleCropChange}
              >
                {options.crops.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">栽培地域(※学習データ(e-stat)にある作物に限ります)</Label>
              <select 
                className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              >
                {availableRegions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">面積 (are)</Label>
                <Input 
                  type="number" 
                  className="bg-slate-50"
                  value={formData.area} 
                  onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">期間 (ヶ月)</Label>
                <Input 
                  type="number" 
                  min={1} // 12ヶ月以上の制限を撤廃
                  className="bg-slate-50"
                  value={formData.months} 
                  onChange={(e) => setFormData({...formData, months: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">物価補正係数 (推奨: 1.4以上)</Label>
              <Input 
                type="number" step="0.1"
                className="bg-slate-50"
                value={formData.inflation} 
                onChange={(e) => setFormData({...formData, inflation: Number(e.target.value)})}
              />
            </div>

            <Button onClick={handlePredict} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 h-12">
              {loading ? "AI計算中..." : "シミュレーション実行"}
            </Button>
          </div>
        </aside>

        {/* メインコンテンツ（結果表示エリア） */}
        <main className="flex-1 p-8 overflow-y-auto">
          {result ? (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* サマリーカード */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <div className="h-1 bg-green-500" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">予想農業所得</CardTitle>
                    <TrendingUp className="text-green-500" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800">
                      ¥{result.summary.農業所得.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{formData.months}ヶ月間の純利益予測</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <div className="h-1 bg-blue-500" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">想定売上高</CardTitle>
                    <Package className="text-blue-500" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800">
                      ¥{result.summary.売上高.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <div className="h-1 bg-amber-500" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">想定経営費</CardTitle>
                    <Wallet className="text-amber-500" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800">
                      ¥{result.summary.経営費計.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 詳細内訳 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">経費項目の詳細</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(result.details).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-600">{key}</span>
                            <span className="text-sm font-bold text-slate-800">¥{value.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-green-500 h-full rounded-full" 
                              style={{ width: `${Math.min(100, (value / result.summary.売上高) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-green-900 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-100">AI診断アドバイス</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white/10 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        {formData.region}における{formData.crop}の栽培は、
                        売上高に対する所得率が約{Math.round((result.summary.農業所得 / result.summary.売上高) * 100)}%と予測されます。
                        {formData.months > 12 && "長期的な計画においては、機材のメンテナンス費用や減価償却を考慮した資金繰りが重要です。"}
                      </p>
                    </div>
                    <ul className="text-xs space-y-2 text-green-200">
                      <li>• この数値は過去の統計データに基づいた推計です。</li>
                      <li>• 物価変動や気象条件により結果は前後します。</li>
                      <li>• 青年等就農計画の申請には、別途自己資金の証明が必要です。</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <TrendingUp size={48} className="text-slate-200" />
              <p>設定を入力して「シミュレーション実行」をクリックしてください</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}