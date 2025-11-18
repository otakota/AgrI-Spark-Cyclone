// components/form/ConfirmStep.tsx
import { FormValues } from "@/app/agriform2/page"; // page.tsxから型をインポート
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";

interface ConfirmStepProps {
  data: FormValues;
  onBack: () => void;
  onFinalSubmit: () => void;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({ data, onBack, onFinalSubmit }) => {
  return (
    <Card>
      <CardHeader><CardTitle>入力内容の確認</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        
        {/* 確認データの表示セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <ConfirmItem label="名前" value={data.name} />
          <ConfirmItem label="名前（カナ）" value={data.kana} />
          <ConfirmItem label="申請日" value={data.applicationDate || "未入力"} />
        </div>
        
        {/* ボタンセクション */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            ← 入力内容を修正する
          </Button>
          <Button type="button" onClick={onFinalSubmit}>
            この内容で送信する
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// 確認画面での表示を簡潔にするヘルパーコンポーネント
const ConfirmItem: React.FC<{ label: string, value: string | undefined }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    <p className="text-base font-semibold">{value}</p>
  </div>
);