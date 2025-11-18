import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/app/agriform2/page";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { ReusableFormField, ReusableTextareaField } from "@/components/form/ReusableFormField";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


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
          <ReusableFormField control={form.control} name="name"                label="名前"       placeholder="山田 太郎" />
          <ReusableFormField control={form.control} name="applicationDate"     label="申請日"     type="date" />
          <ReusableFormField control={form.control} name="mayor"               label="市長"       placeholder="例：○○市長 殿"  />
          <ReusableFormField control={form.control} name="applicantAddress"    label="申請者住所"  placeholder="○○県○○市○丁目○-○" />
          <ReusableFormField control={form.control} name="applicantName"       label="氏名（名称・代表者）" placeholder="農林 太郎" />
          <ReusableFormField control={form.control} name="birthDate"           label="生年月日"    type="date"  />
          <ReusableFormField control={form.control} name="age"                 label="年齢"        type="number" />
          <ReusableFormField control={form.control} name="corpEstablishedDate" label="法人設立年月日（法人の場合のみ）" type="date"  />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>経歴</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ReusableFormField control={form.control} name="jobdetails" label="職務内容" />
          <ReusableFormField control={form.control} name="companyname" label="勤務機関名" placeholder="株式会社○○" />
          <ReusableFormField control={form.control} name="companystartdate" label="勤務期間開始日" type="date" />
          <ReusableFormField control={form.control} name="companyenddate" label="勤務期間終了日" type="date" />
          <ReusableFormField control={form.control} name="companyAdress" label="勤務機関住所" placeholder="○○県○○市○丁目○-○" />
          <ReusableFormField control={form.control} name="retirementDate" label="退職年月日" type="date" />
          <ReusableTextareaField control={form.control} name="qualification" label="資格" rows={4} />
          <ReusableTextareaField control={form.control} name="skillAgricultural" label="農業経営に活用できる知識および技能の内容" rows={4} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>就業計画</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ReusableFormField control={form.control} name="farmCity" label="就農地（市町村名）" placeholder="○○市" />
          <ReusableFormField control={form.control} name="businessStartDate" label="農業経営開始日" type="date" />
          <FormField control={form.control} name="farmingType" render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>就農形態</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="flex items-center gap-2"><RadioGroupItem value="新たに農業経営を開始" id="t1" /><label htmlFor="t1">新たに農業経営を開始</label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="親の経営とは別に新部門" id="t2" /><label htmlFor="t2">親の経営とは別に新部門</label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="親の農業経営を継承" id="t3" /><label htmlFor="t3">親の農業経営を継承</label></div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>継承の場合は以下も入力</FormDescription>
                  <FormMessage />
                </FormItem>
              )} /> 
        </CardContent>
      </Card>
      
      <Button type="submit">確認画面へ進む</Button>
    </form>
  );
};