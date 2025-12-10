"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 型定義
interface Options {
  crops: string[];
  regions: string[];
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
  const [options, setOptions] = useState<Options>({ crops: [], regions: [] });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // フォームの状態
  const [formData, setFormData] = useState({
    crop: "",
    region: "",
    area: 20,
    months: 12,
    inflation: 1.2,
  });

  // 初回ロード時にPythonサーバーから選択肢を取得
  useEffect(() => {
    fetch("http://127.0.0.1:8000/options")
      .then((res) => res.json())
      .then((data) => {
        setOptions(data);
        // 初期値設定
        if (data.crops.length > 0) setFormData(prev => ({ ...prev, crop: data.crops[0] }));
        if (data.regions.length > 0) setFormData(prev => ({ ...prev, region: data.regions[0] }));
      })
      .catch((err) => console.error("AIサーバーが起動していません:", err));
  }, []);

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
      alert("予測に失敗しました。Pythonサーバーを確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">営農収支シミュレーション</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* 入力フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>条件設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>品目</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.crop}
                onChange={(e) => setFormData({...formData, crop: e.target.value})}
              >
                {options.crops.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <Label>地域</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              >
                {options.regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>面積 (アール)</Label>
                <Input 
                  type="number" 
                  value={formData.area} 
                  onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>期間 (ヶ月)</Label>
                <Input 
                  type="number" 
                  max={12} min={1}
                  value={formData.months} 
                  onChange={(e) => setFormData({...formData, months: Number(e.target.value)})}
                />
              </div>
            </div>

            <Button onClick={handlePredict} disabled={loading} className="w-full">
              {loading ? "AI計算中..." : "収支を予測する"}
            </Button>
          </CardContent>
        </Card>

        {/* 結果表示 */}
        <Card>
          <CardHeader>
            <CardTitle>予測結果 (単位: 円)</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>予想農業所得</span>
                    <span className={result.summary.農業所得 > 0 ? "text-green-600" : "text-red-600"}>
                      {result.summary.農業所得.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>売上高</span>
                    <span>{result.summary.売上高.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">経費内訳</h3>
                  <div className="space-y-1 text-sm">
                    {Object.entries(result.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-dashed py-1">
                        <span>{key}</span>
                        <span>{value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-10">
                左のフォームから条件を入力して<br/>予測を実行してください
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}