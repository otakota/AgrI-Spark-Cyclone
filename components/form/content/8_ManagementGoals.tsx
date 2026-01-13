{/* フォーム8　経営に関する目標 */ }

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableTextareaField } from "@/components/form/ui_form/ReusableFormField";

interface ApplicantInfoCardProps {
  form: UseFormReturn<FormValues>;
}

export const ManagementGoals: React.FC<ApplicantInfoCardProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">経営に関する目標</CardTitle></CardHeader>
      <CardContent className="grid">
        <ReusableTextareaField
          name="targetAgricultural"
          label="将来の農業経営の構想"
          rows={4}
          placeholder="例 青色申告の実施、PC活用による経理"
          control={form.control}
          required={true}
        />
        <div className="bg-gray-50 p-4 mb-10  rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700">
          <p>
            「経営管理に関する目標」欄には、簿記記帳、経営内役割分担等の経営管理に関する目標を入力します。
          </p>
        </div>
        <ReusableTextareaField
          name="targetemployee"
          label="農業従事の態様等に関する目標"
          rows={4}
          placeholder="例 月に○日程度を休日とする"
          control={form.control}
          required={true}
        />
        <div className="bg-gray-50 p-4 mb-10  rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700">
          <p>
            「農業従事の態様等に関する目標」欄には、休日制の導入、ヘルパー制度活用による労働負担の軽減等について入力します。なお、家族経営協定を締結している場合には、その旨と当該協定に基づく家族間の役割分担等の内容を入力します。
          </p>
        </div>
      </CardContent>
    </Card>
  );
};