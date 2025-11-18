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
          <ReusableFormField name="name"               label="名前"  placeholder="山田 太郎" control={form.control} className="md:col-span-3"/>
          <ReusableFormField name="birthDate"           label="生年月日"  type="date" control={form.control} />
          <ReusableFormField name="age"                 label="年齢" type="number" control={form.control} />
          <ReusableFormField name="applicationDate"     label="申請日"  type="date" control={form.control} />
          <ReusableFormField name="applicantName"       label="氏名（名称・代表者）"  placeholder="農林 太郎" control={form.control} className="md:col-span-3" />
          <ReusableFormField name="mayor"               label="市長"  placeholder="例：○○市長 殿" control={form.control} className="md:col-span-3" />
          <ReusableFormField name="applicantAddress"    label="申請者住所"  placeholder="○○県○○市○丁目○-○" control={form.control} className="md:col-span-3" />
          <ReusableFormField name="corpEstablishedDate" label="法人設立年月日（法人の場合のみ）" type="date" control={form.control}  />
        </CardContent>
      </Card>


      <Card>
        <CardHeader><CardTitle>経歴</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ReusableFormField name="jobdetails" label="職務内容" control={form.control} className="md:col-span-2" />
          <ReusableFormField name="companyname" label="勤務機関名" placeholder="株式会社○○" control={form.control} className="md:col-span-2" />
          <ReusableFormField name="companyAdress" label="勤務機関住所"  placeholder="○○県○○市○丁目○-○" control={form.control} className="md:col-span-2" />
          <ReusableFormField name="companystartdate" label="勤務期間開始日" type="date" control={form.control}  />
          <ReusableFormField name="companyenddate" label="勤務期間終了日" type="date" control={form.control}  />
          <ReusableFormField name="retirementDate" label="退職年月日"  type="date" control={form.control}  />
          <ReusableTextareaField name="qualification" label="資格" rows={4} className="md:col-span-2"  control={form.control} />
          <ReusableTextareaField name="skillAgricultural" label="農業経営に活用できる知識および技能の内容" rows={4} className="md:col-span-2" control={form.control} />
        </CardContent>
      </Card>


      <Card>
        <CardHeader><CardTitle>就業計画</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            
          <ReusableFormField name="farmCity" label="就農地（市町村名）" placeholder="○○市" control={form.control} />
          <ReusableFormField name="businessStartDate" label="農業経営開始日" type="date" control={form.control} />
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
          <FormField name="inheritScope" control={form.control} render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>継承範囲</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="flex items-center gap-2"><RadioGroupItem value="全体" id="t1" /><label htmlFor="t1">全体</label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="一部" id="t2" /><label htmlFor="t2">一部</label></div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />   
            <ReusableFormField name="inheritPeriodYears" label="従事期間（年）" type="number" control={form.control} />
            <ReusableFormField name="inheritPeriodMonths" label="従事期間（月）" type="number" control={form.control} />
            <ReusableTextareaField name="targetFarmingType" label="目標とする営農類型" rows={2} placeholder="例：露地野菜" className="md:col-span-3" control={form.control}/>
            <ReusableTextareaField name="futurePlan" label="将来の農業経営の構想" rows={4} placeholder="将来像や目標（5年後目安）を記入" className="md:col-span-3" control={form.control} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>経営の構想（所得・労働時間）</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <p className="font-bold md:col-span-2">現状</p>
          <ReusableFormField name="incomeCurrent" label="年間農業所得（現状/千円）" control={form.control}  />
          <ReusableFormField name="hoursCurrent"  label="年間労働時間（現状/時間）" control={form.control}  />
          <p className="font-bold md:col-span-2">目標</p>
          <ReusableFormField name="incomeTarget"  label="年間農業所得（目標/千円）" control={form.control}  />
          <ReusableFormField name="hoursTarget"   label="年間労働時間（目標/時間）" control={form.control}  />
        </CardContent>
      </Card>
      
      <Button type="submit">確認画面へ進む</Button>
    </form>
  );
};