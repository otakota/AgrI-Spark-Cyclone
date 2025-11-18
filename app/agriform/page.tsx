'use client'

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// components
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage , FormDescription} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// schema
import { agriFormSchema, agriFormValues } from '@/schemas/contactFormSchema';

const STORAGE_KEY = "agrispark.apply.create.v1";


export default function ContactForm () {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<agriFormValues>({
    resolver: zodResolver(agriFormSchema),
  });

  const onSubmit = (data: agriFormValues) => {
    console.log('送信するデータ:', data);
    setIsSubmitted(true);
  }

  const crops = useFieldArray({ control: form.control, name: "crops" });
  const lands = useFieldArray({ control: form.control, name: "lands" });
  const machines = useFieldArray({ control: form.control, name: "machines" });
  const measures = useFieldArray({ control: form.control, name: "measures" });
  const members = useFieldArray({ control: form.control, name: "members" });


  return (
    <div className='container mx-auto px-15 py-30'>
      {isSubmitted ? (
        <div className='text-green-700 bg-green-100 border border-green-300 p-4 rounded-md'>
          送信が完了しました。
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>

            {/* 基本情報 */}
            <Card>
              <CardHeader><CardTitle>青年等就農計画認定申請書（基本情報）</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">

                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>名前</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                <FormField control={form.control} name="kana" render={({ field }) => (
                    <FormItem>
                      <FormLabel>名前（カナ）</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="applicationDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>申請日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="mayor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>宛先（○○市長 殿）</FormLabel>
                      <FormControl>
                        <Input placeholder="例：○○市長 殿" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="applicantAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>申請者住所</FormLabel>
                      <FormControl>
                        <Input placeholder="○○県○○市○丁目○-○" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="applicantName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>氏名（名称・代表者）</FormLabel>
                      <FormControl>
                        <Input placeholder="農林 太郎 など" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>生年月日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>年齢</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value ?? ''}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="corpEstablishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>法人設立年月日（任意）</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </CardContent>
            </Card>

            {/* 経歴 */}
            <Card>
              <CardHeader><CardTitle>経歴</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-1">
                <FormField control={form.control} name="jobdetails" render={({ field }) => (
                    <FormItem>
                      <FormLabel>職務内容</FormLabel>
                      <FormControl>
                        <Input {...field}  value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="companyname" render={({ field }) => (
                    <FormItem>
                      <FormLabel>勤務機関名</FormLabel>
                      <FormControl>
                        <Input placeholder='株式会社○○' {...field}  value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="companystartdate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>勤務期間開始日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="companyenddate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>勤務期間終了日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="companyAdress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>勤務機関住所</FormLabel>
                      <FormControl>
                        <Input placeholder="株式会社○○" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="retirementDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>退職年月日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="qualification" render={({ field }) => (
                    <FormItem>
                      <FormLabel>資格</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="skillAgricultural" render={({ field }) => (
                    <FormItem>
                      <FormLabel>農業経営に活用できる知識および技能の内容</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 就業計画 */}
            <Card>
              <CardHeader><CardTitle>就業計画</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-1">

                <FormField control={form.control} name="farmCity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>就農地（市町村名）</FormLabel>
                      <FormControl>
                        <Input placeholder="○○市" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="businessStartDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>農業経営開始日</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="farmingType" render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>就農形態</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="flex items-center gap-2"><RadioGroupItem value="start_new" id="t1" /><label htmlFor="t1">新たに農業経営を開始</label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="new_department" id="t2" /><label htmlFor="t2">親の経営とは別に新部門</label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="inherit" id="t3" /><label htmlFor="t3">親の農業経営を継承</label></div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>継承の場合は以下も入力</FormDescription>
                </FormItem>
              )} />
              <div className="grid grid-cols-3 gap-3 md:col-span-3">
                <FormField control={form.control} name="inheritScope" render={({ field }) => (
                  <FormItem>
                    <FormLabel>継承範囲</FormLabel>
                    <FormControl>
                      <Input placeholder="全体 or 一部" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="inheritPeriodYears" render={({ field }) => (
                  <FormItem>
                    <FormLabel>従事期間（年）</FormLabel>
                    <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="inheritPeriodMonths" render={({ field }) => (
                  <FormItem>
                    <FormLabel>従事期間（月）</FormLabel>
                    <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="targetFarmingType" render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>目標とする営農類型</FormLabel>
                  <FormControl><Input placeholder="例：露地野菜" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="futurePlan" render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>将来の農業経営の構想</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="将来像や目標（5年後目安）を記入" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              </CardContent>
            </Card>

            {/* 経営の構想 */}

            <Card>
            <CardHeader><CardTitle>経営の構想（所得・労働時間）</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-1">
              <FormField control={form.control} name="incomeCurrent" render={({ field }) => (
                <FormItem>
                  <FormLabel>年間農業所得（現状/千円）</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="incomeTarget" render={({ field }) => (
                <FormItem>
                  <FormLabel>年間農業所得（目標/千円）</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="hoursCurrent" render={({ field }) => (
                <FormItem>
                  <FormLabel>年間労働時間（現状/時間）</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="hoursTarget" render={({ field }) => (
                <FormItem>
                  <FormLabel>年間労働時間（目標/時間）</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                </FormItem>
              )} />
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
              <Button type="button" variant="secondary" onClick={() => crops.append({ name: "", areaCurrent: "", productionCurrent: "", areaTarget: "", productionTarget: "" })}>行を追加</Button>
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
              <Button type="button" variant="secondary" onClick={() => lands.append({ typeofCrops: "所有地", landType: "畑", location: "", currentArea: "", targetArea: "" })}>行を追加</Button>
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
              <Button type="button" variant="secondary" onClick={() => machines.append({ name: "", currentSpec: "", currentUnits: "", targetSpec: "", targetUnits: "" })}>行を追加</Button>
            </CardContent>
          </Card>

          <Card>
              <CardHeader><CardTitle>経営に関する目標</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-1">
                <FormField control={form.control} name="targetAgricultural" render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>将来の農業経営の構想</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="例　青色申告の実施、PC活用による経理" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
                <FormField control={form.control} name="targetemployee" render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>将来の農業経営の構想</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="例　月に○日程度を休日とする" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              </CardContent>
            </Card>

            <Card>
            <CardHeader><CardTitle>目標を達成するために必要な措置（事業）</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>事業内容</TableHead>
                    <TableHead>規模・構造等（仕様）</TableHead>
                    <TableHead>実施時期</TableHead>
                    <TableHead>事業費（千円）</TableHead>
                    <TableHead>資金名等</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measures.fields.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Input {...form.register(`measures.${i}.title` as const)} placeholder="トラクター導入 等" />
                      </TableCell>
                      <TableCell>
                        <Input {...form.register(`measures.${i}.spec` as const)} placeholder="26馬力 等" />
                      </TableCell>
                      <TableCell>
                        <Input {...form.register(`measures.${i}.when` as const)} placeholder="○年○月" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} {...form.register(`measures.${i}.cost` as const, { valueAsNumber: true })} />
                      </TableCell>
                      <TableCell>
                        <Input {...form.register(`measures.${i}.fund` as const)} placeholder="青年等就農資金 等" />
                      </TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" onClick={() => measures.remove(i)}>削除</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="secondary" onClick={() => measures.append({ title: "", spec: "", when: "", cost: "", fund: "" })}>行を追加</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>農業経営の構成（家族・役員等）</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>氏名</TableHead>
                    <TableHead>続柄/役職</TableHead>
                    <TableHead>年齢</TableHead>
                    <TableHead>担当業務（現状）</TableHead>
                    <TableHead>従事日数（現状）</TableHead>
                    <TableHead>担当業務（見通し）</TableHead>
                    <TableHead>従事日数（見通し）</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.fields.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell><Input {...form.register(`members.${i}.name` as const)} /></TableCell>
                      <TableCell><Input {...form.register(`members.${i}.relationOrRole` as const)} placeholder="代表者/妻 等" /></TableCell>
                      <TableCell><Input type="number" min={0} {...form.register(`members.${i}.age` as const, { valueAsNumber: true })} /></TableCell>
                      <TableCell><Input {...form.register(`members.${i}.currentTask` as const)} /></TableCell>
                      <TableCell><Input type="number" min={0} {...form.register(`members.${i}.currentDays` as const, { valueAsNumber: true })} /></TableCell>
                      <TableCell><Input {...form.register(`members.${i}.futureTask` as const)} /></TableCell>
                      <TableCell><Input type="number" min={0} {...form.register(`members.${i}.futureDays` as const, { valueAsNumber: true })} /></TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" onClick={() => members.remove(i)}>削除</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" variant="secondary" onClick={() => members.append({ name: "", relationOrRole: "", age: "", currentTask: "", currentDays: "", futureTask: "", futureDays: "" })}>行を追加</Button>
            </CardContent>
          </Card>

          <Card>
              <CardHeader><CardTitle>雇用者</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-1">

                <FormField control={form.control} name="employeemember"render={({ field }) => (
                    <FormItem>
                      <FormLabel>人数</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value ?? ''}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </CardContent>
            </Card>


            

            {Object.keys(form.formState.errors).length > 0 && (
              <div className='text-red-600 font-medium rounded-xl bg-red-100 p-4 mb-6'>
                入力内容に不備があります。
              </div>
            )}

            <Button type='submit'>送信</Button>

          </form>
        </Form>
      )}
    </div>
  )
}

function loadDefaults(reset = false) {
  if (!reset) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
  }
  const today = new Date().toISOString().slice(0, 10);
  return {
    applicationDate: today,
    mayor: "",
    applicantAddress: "",
    applicantName: "",
    birthDate: "",
    age: 0,
    corpEstablishedDate: "",
    farmCity: "",
    businessStartDate: today,
    farmingType: "start_new",
    inheritScope: "",
    inheritPeriodYears: 0,
    inheritPeriodMonths: 0,
    targetFarmingType: "露地野菜",
    futurePlan: "",
    incomeCurrent: 0,
    incomeTarget: 0,
    hoursCurrent: 0,
    hoursTarget: 0,
    crops: [
      { name: "タマネギ", areaCurrent: 40, productionCurrent: 15600, areaTarget: 80, productionTarget: 31200 },
    ],
    lands: [
      { category: "所有地", landType: "畑", location: "", currentArea: 20, targetArea: 40 },
      { category: "借入地", landType: "畑", location: "", currentArea: 20, targetArea: 80 },
    ],
    machines: [
      { name: "トラクター", currentSpec: "26馬力", currentUnits: 1, targetSpec: "26馬力", targetUnits: 1 },
    ],
    managementGoals: "",
    workStyleGoals: "",
    measures: [
      { title: "トラクター導入", spec: "26馬力", when: "", cost: 3500, fund: "青年等就農資金" },
    ],
    members: [
      { name: "農林 太郎", relationOrRole: "代表者", age: 39, currentTask: "全般", currentDays: 250, futureTask: "全般", futureDays: 225 },
    ],
  } as const;
}



