// components/form/InputStep.tsx
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/app/agriform2/page"; // page.tsxから型をインポート

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { ReusableFormField } from "@/components/form/ReusableFormField";

interface InputStepProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
}

export const InputStep: React.FC<InputStepProps> = ({ form, onSubmit }) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader><CardTitle>青年等就農計画認定申請書（基本情報）</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <ReusableFormField control={form.control} name="name" label="名前" />
          <ReusableFormField control={form.control} name="kana" label="名前（カナ）" />
          <ReusableFormField control={form.control} name="applicationDate" label="申請日" type="date" />
        </CardContent>
      </Card>
      
      <Button type="submit">確認画面へ進む</Button>
    </form>
  );
};