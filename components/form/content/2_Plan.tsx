{/* フォーム２ 就業計画 */ }

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableFormField, ReusableTextareaField } from "@/components/form/ui_form/ReusableFormField";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface ApplicantInfoCardProps {
  form: UseFormReturn<FormValues>;
}

export const Plan: React.FC<ApplicantInfoCardProps> = ({ form }) => {
  return (
    <Card className="px-7 py-10">
      <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">
        就業計画
      </CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">

        <ReusableFormField
          name="farmCity"
          label="就農地（市町村名）"
          placeholder="○○市"
          className="col-span-2"
          control={form.control}
          required={true}
        />
        
        <div className="bg-gray-50 p-2 rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700 col-span-3">
          「就農地」欄には、就農地の市町村名を入力します。また、就農予定地の場合は、市町村名の後に（予定）と入力します。
        </div>
        
        <hr className="md:col-span-3 my-6" />

        <ReusableFormField
          name="businessStartDate"
          label="農業経営開始日"
          type="date"
          control={form.control}
          required={true}
        />

          <hr className="md:col-span-3 my-6" />

        <FormField control={form.control} name="farmingType" render={({ field }) => (
          <FormItem className="md:col-span-3">
            <FormLabel>
              就農形態
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">必須</span>
            </FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="新たに農業経営を開始" id="t1" />
                  <label htmlFor="t1" className="cursor-pointer">新たに農業経営を開始</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="親の経営とは別に新部門" id="t2" />
                  <label htmlFor="t2" className="cursor-pointer">親の経営とは別に新部門</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="親の農業経営を継承" id="t3" />
                  <label htmlFor="t3" className="cursor-pointer">親の農業経営を継承</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="bg-gray-50 p-2 rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700 col-span-3">
          「親の農業経営を継承」の場合は継承範囲と従事期間を入力してください
        </div>

        {form.watch("farmingType") === "親の農業経営を継承" && (
          <div>
            <FormField name="inheritScope" control={form.control} render={({ field }) => (
              <FormItem className="md:col-span-3 ml-6 border-l-2 border-primary/30 pl-4">
                <FormLabel>継承範囲</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="全体" id="scope1" />
                      <label htmlFor="scope1" className="cursor-pointer">全体</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="一部" id="scope2" />
                      <label htmlFor="scope2" className="cursor-pointer">一部</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="md:col-span-3 ml-6 border-l-2 border-primary/30 pl-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-4 col-span-2 mt-6">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <ReusableFormField
                      name="inheritPeriodYears"
                      label="従事期間(年)"
                      type="number"
                      control={form.control}
                    />

                  </div>
                  <span className="pb-2.5 text-sm font-bold">年</span>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <ReusableFormField
                      name="inheritPeriodMonths"
                      label="従事期間(月)"
                      type="number"
                      control={form.control} />
                  </div>
                  <span className="pb-2.5 text-sm font-bold">か月</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <hr className="md:col-span-3 my-6" />

        <FormField control={form.control} name="targetFarmingType" render={({ field }) => (
          <FormItem>
            <FormLabel>
              目標とする営農類型
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">必須</span>
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>営農類型</SelectLabel>
                    <SelectItem value="水稲">水稲</SelectItem>
                    <SelectItem value="麦類">麦類</SelectItem>
                    <SelectItem value="雑穀">雑穀</SelectItem>
                    <SelectItem value="いも類">いも類</SelectItem>
                    <SelectItem value="豆類">豆類</SelectItem>
                    <SelectItem value="工芸農作物">工芸農作物</SelectItem>
                    <SelectItem value="露地野菜">露地野菜</SelectItem>
                    <SelectItem value="施設野菜">施設野菜</SelectItem>
                    <SelectItem value="露地花き・花木">露地花き・花木</SelectItem>
                    <SelectItem value="施設花き・花木">施設花き・花木</SelectItem>
                    <SelectItem value="複合経営">複合経営</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="col-span-2" />

        {/* 備考 */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700 col-span-3">
          <div className="text-sm leading-relaxed">
            <div className="mb-4">
              <p className="font-bold">１ 単一経営</p>
              <p className="ml-4 text-gray-700">
                （農産物販売金額１位の部門の販売金額が、農産物総販売金額の80％以上を占める場合）の営農類型（例：露地野菜）
              </p>
              <div className="ml-4 mt-1 p-2 bg-gray-50 border-l-2 border-gray-300">
                水稲、麦類、雑穀、いも類、豆類、工芸農作物、露地野菜、施設野菜、露地果樹、施設果樹、露地花き・花木、施設花き・花木
              </div>
            </div>
            <div className="mb-4">
              <p className="font-bold">２ 複合経営</p>
              <p className="ml-4 text-gray-700">
                （農産物販売金額１位の部門が水稲であって、水稲の販売金額が、農産物総販売金額の80％に満たない場合）
              </p>
            </div>
            <div className="mb-4">
              <p className="font-bold">３ その他</p>
              <p className="ml-4 text-gray-700">（１及び２に該当しない場合）</p>
            </div>
          </div>
        </div>

        <hr className="md:col-span-3 my-6" />

        <ReusableTextareaField
          name="futurePlan"
          label="将来の農業経営の構想"
          rows={4}
          placeholder="将来像や目標（5年後目安）を記入"
          className="md:col-span-3"
          control={form.control}
          required={true}
        />
      </CardContent>
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700 col-span-3">
        <p>
          「将来の農業経営の構想」欄には、計画作成時において構想している将来<span className="font-semibold text-gray-900">（経営開始後おおむね５年後）</span>の農業経営の概要を入力します。
        </p>
      </div>
    </Card>

  );
};