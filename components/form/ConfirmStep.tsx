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
        
        {/*  基本情報セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">基本情報</h2>
          <ConfirmItem label="名前" value={data.name} />
          <ConfirmItem label="申請日" value={data.applicationDate} />
          <ConfirmItem label="市長" value={data.mayor} />
          <ConfirmItem label="申請者住所" value={data.applicantAddress} />
          <ConfirmItem label="氏名（名称・代表者）" value={data.applicantName} />
          <ConfirmItem label="生年月日" value={data.birthDate} />
          <ConfirmItem label="年齢" value={data.age} />
          <ConfirmItem label="法人設立年月日（法人の場合のみ）" value={data.corpEstablishedDate} />
        </div>
        
        <hr className="my-6 border-gray-300 dark:border-gray-700" />
        
        {/* 👨‍💻 経歴セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">経歴</h2>
          <ConfirmItem label="職務内容" value={data.jobdetails} />
          <ConfirmItem label="勤務機関名" value={data.companyname} />
          <ConfirmItem label="勤務期間開始日" value={data.companystartdate} />
          <ConfirmItem label="勤務期間終了日" value={data.companyenddate} />
          <ConfirmItem label="勤務機関住所" value={data.companyAdress} />
          <ConfirmItem label="退職年月日" value={data.retirementDate} />
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