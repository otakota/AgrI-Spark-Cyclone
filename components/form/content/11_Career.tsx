{/* フォーム11　経歴 */ }

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableFormField, ReusableTextareaField } from "@/components/form/ui_form/ReusableFormField";
import { ReusableDateField } from "@/components/form/ui_form/ReusableFormdate";

interface ApplicantInfoCardProps {
  form: UseFormReturn<FormValues>;
}

export const Career: React.FC<ApplicantInfoCardProps> = ({ form }) => {
  return (
    <Card className="px-7 py-10">
      <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">経歴</CardTitle></CardHeader>
      <CardContent className="">
        <div className="bg-gray-50 p-4 mb-10  rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700">
          <p>
            該当者がいない場合は、「職務内容」欄に「該当者なし」等と入力ください。
          </p>
        </div>
        <div className="grid gap-4 md: grid-cols-6">
          <ReusableFormField 
            name="jobdetails" 
            label="職務内容" 
            required={true} 
            control={form.control} 
            className="md:col-span-4" 
          />
          <div className="col-span-2" />

          <ReusableFormField 
            name="companyname" 
            label="勤務機関名" 
            placeholder="株式会社○○" 
            control={form.control} 
            className="md:col-span-4" 
          />

          <div className="col-span-2" />

          <ReusableFormField 
            name="companyAdress" 
            label="勤務機関住所" 
            placeholder="○○県○○市○丁目○-○" 
            control={form.control} 
            className="md:col-span-4" 
          />

          <div className="col-span-2" />

          {/* 勤務期間 */}
          <div className="col-span-6 flex">
            <ReusableDateField
              name="companystartdate"
              label="勤務期間"
              type="date"
              control={form.control}
            />

            <div className="text-center mt-1 text-6xl mx-16">
              ~
            </div>

            <ReusableDateField
              name="companyenddate"
              label=""
              type="date"
              className="mt-3"
              control={form.control}
            />
          </div>

          <ReusableDateField 
            name="retirementDate" 
            label="退職年月日" 
            type="date" 
            control={form.control} 
          />

          <div className="col-span-5" />
          <ReusableTextareaField 
            name="qualification" 
            label="資格" 
            rows={4} 
            className="md:col-span-6" 
            control={form.control} 
          />
          <ReusableTextareaField 
            name="skillAgricultural" 
            label="農業経営に活用できる知識および技能の内容" 
            rows={4} 
            className="md:col-span-6" 
            control={form.control} 
          />
        </div>
      </CardContent>
    </Card>

  );
};