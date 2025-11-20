import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormValues } from "@/app/agriform2/page";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { ReusableFormField, ReusableTextareaField } from "@/components/form/ReusableFormField";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';

interface InputStepProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
}

export const InputStep: React.FC<InputStepProps> = ({ form, onSubmit }) => {
  const crops = useFieldArray({ control: form.control, name: "crops" });
  const lands = useFieldArray({ control: form.control, name: "lands" });
  const machines = useFieldArray({ control: form.control, name: "machines" });
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

          {/* 作物名と面積 */}

          <Card>
            <CardHeader><CardTitle>農業経営の規模に関する目標（作目・部門）</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>作目・部門名</TableHead>
                    <TableHead>作付面積（現状/a）</TableHead>
                    <TableHead>生産量（現状/kg）</TableHead>
                    <TableHead>作付面積（目標/a）</TableHead>
                    <TableHead>生産量（目標/kg）</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crops.fields.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Input {...form.register(`crops.${i}.name` as const)} placeholder="例：タマネギ" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} {...form.register(`crops.${i}.areaCurrent` as const, { valueAsNumber: true })} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} {...form.register(`crops.${i}.productionCurrent` as const, { valueAsNumber: true })} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} {...form.register(`crops.${i}.areaTarget` as const, { valueAsNumber: true })} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} {...form.register(`crops.${i}.productionTarget` as const, { valueAsNumber: true })} />
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" onClick={() => crops.remove(i)}>削除</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="secondary" onClick={() => crops.append({ name: "", areaCurrent: undefined, productionCurrent: undefined, areaTarget: undefined, productionTarget: undefined })}>行を追加</Button>
            </CardContent>
          </Card>

            
       {/* 農地面積 */}

          <Card>
            <CardHeader><CardTitle>農地の面積（所有地/借入地）</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>区分</TableHead>
                    <TableHead>地目</TableHead>
                    <TableHead>所在地（市町村名）</TableHead>
                    <TableHead>現状（a）</TableHead>
                    <TableHead>目標（a）</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lands.fields.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Input {...form.register(`lands.${i}.typeofCrops` as const)} placeholder="所有地/借入地" />
                      </TableCell>
                      <TableCell>
                        <Input {...form.register(`lands.${i}.landType` as const)} placeholder="畑・田など" />
                      </TableCell>
                      <TableCell>
                        <Input {...form.register(`lands.${i}.location` as const)} placeholder="○○市△地区" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} {...form.register(`lands.${i}.currentArea` as const, { valueAsNumber: true })} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} {...form.register(`lands.${i}.targetArea` as const, { valueAsNumber: true })} />
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" onClick={() => lands.remove(i)}>削除</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="secondary" onClick={() => lands.append({ typeofCrops: "所有地", landType: "畑", location: "", currentArea: undefined, targetArea: undefined })}>行を追加</Button>
            </CardContent>
          </Card>


          {/* 利用する機械 */}

          <Card>
            <CardHeader><CardTitle>生産方式に関する目標（機械・施設）</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>機械・施設名</TableHead>
                    <TableHead>現状（型式・台数）</TableHead>
                    <TableHead>目標（型式・台数）</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machines.fields.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Input {...form.register(`machines.${i}.name` as const)} placeholder="トラクター" />
                      </TableCell>
                      <TableCell>
                        <div className="grid grid-cols-3 gap-2">
                          <Input className="col-span-2" placeholder="26馬力 等" {...form.register(`machines.${i}.currentSpec` as const)} />
                          <Input type="number" min={0} placeholder="台" {...form.register(`machines.${i}.currentUnits` as const, { valueAsNumber: true })} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="grid grid-cols-3 gap-2">
                          <Input className="col-span-2" placeholder="26馬力 等" {...form.register(`machines.${i}.targetSpec` as const)} />
                          <Input type="number" min={0} placeholder="台" {...form.register(`machines.${i}.targetUnits` as const, { valueAsNumber: true })} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" onClick={() => machines.remove(i)}>削除</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="secondary" onClick={() => machines.append({ name: "", currentSpec: "", currentUnits: undefined, targetSpec: "", targetUnits: undefined })}>行を追加</Button>
            </CardContent>
          </Card>

      <Card>
        <CardHeader><CardTitle>経営に関する目標</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <ReusableTextareaField name="targetAgricultural" label="将来の農業経営の構想" rows={4} placeholder="例　青色申告の実施、PC活用による経理"  control={form.control} />
          <ReusableTextareaField name="targetemployee" label="農業従事の態様等に関する目標" rows={4} placeholder="例　月に○日程度を休日とする" control={form.control} />
        </CardContent>
      </Card>
      
      <Button type="submit">確認画面へ進む</Button>
    </form>
  );
};