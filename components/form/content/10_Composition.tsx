{/* フォーム10　農業経営の構成（家族・役員等） */ }

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { ReusableFormField } from "@/components/form/ui_form/ReusableFormField";
import { AddRowButton } from '@/components/form/ui_form/AddRowButton'

interface ApplicantInfoCardProps {
  form: UseFormReturn<FormValues>;
}

export const Composition: React.FC<ApplicantInfoCardProps> = ({ form }) => {

  const members = useFieldArray({ control: form.control, name: "members" });

  return (
    <Card>
      <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">農業経営の構成（家族・役員等）</CardTitle></CardHeader>
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
                <TableCell><Input {...form.register(`members.${i}.name` as const)} className="w-40" /></TableCell>
                <TableCell><Input {...form.register(`members.${i}.relationOrRole` as const)}  /></TableCell>
                <TableCell><Input type="number" min={0} {...form.register(`members.${i}.age` as const)} className="w-15" /></TableCell>
                <TableCell><Input {...form.register(`members.${i}.currentTask` as const)} className="w-50" /></TableCell>
                <TableCell><Input type="number" min={0} {...form.register(`members.${i}.currentDays` as const)} /></TableCell>
                <TableCell><Input {...form.register(`members.${i}.futureTask` as const)} className="w-50" /></TableCell>
                <TableCell><Input type="number" min={0} {...form.register(`members.${i}.futureDays` as const)} /></TableCell>
                <TableCell>
                  <Button type="button" variant="ghost" onClick={() => members.remove(i)}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* 行を追加ボタン */}
        <AddRowButton
          onClick={() => members.append({
            name: "", relationOrRole: "", age: "", currentTask: "", currentDays: "", futureTask: "", futureDays: ""
          })}
          currentCount={members.fields.length}
          maxCount={6}
        />
        <div className="bg-gray-50 my-10 rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 text-sm leading-relaxed text-gray-700">
            <div className="mb-8 pl-4 border-l-2 border-green-700">
              <p className="font-semibold text-gray-800">
                農業経営に携わる方の「担当業務」や「従事日数」の現状と見通しを入力してください。
              </p>
              <p className="mt-2 text-xs text-gray-500 leading-normal">
                ※5年後の離農予定者や、将来の経営参画見込み者についても入力が必要です。
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4">
                <p>
                  <span className="mr-1">氏名の入力：</span>
                  家族経営の場合は「農業に携わる家族」、法人経営の場合は「役員」の氏名を入力します。
                </p>
              </div>

              <div className="flex gap-4">
                <p>
                  <span className="mr-1">続柄・役職：</span>
                  代表者を基準とした続柄、または法人での役職を入力してください。
                </p>
              </div>

              <div className="flex gap-4">
                <span className="font-bol block mb-1">従事日数の換算ルール：</span>
                <span className="font-bold underline">1日8時間</span>として計算します。
                <span className="block font-bold underline">
                  （例：毎日1時間働く場合、8日間で1日と換算）
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 mb-4">
          雇用者人数
        </CardTitle>

        <div className="space-y-8 max-w-4xl mx-auto p-4">
          <div className="space-y-4">
            <div className="hidden md:grid md:grid-cols-11 gap-4 px-6 text-sm font-bold text-gray-500">
              <div className="col-span-5 text-left ml-2">カテゴリ</div>
              <div className="col-span-3 text-center">現状 (実人数)</div>
              <div className="col-span-3 text-center">見通し (実人数)</div>
            </div>

            {/* 項目: 常時雇 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 md:py-4">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                <div className="col-span-5 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-green-500 rounded-full hidden md:block"></span>
                  <p className="font-bold text-gray-800 text-lg md:text-base">常時雇（年間）</p>
                </div>
                <div className="col-span-3">
                  <div className="md:hidden text-xs font-semibold text-gray-400 mb-1">現状</div>
                  <div className="flex items-end gap2">
                    <div className="flex-1">
                      <ReusableFormField
                        name="currentmember"
                        type="number"
                        control={form.control}
                        className="bg-gray-50/50 rounded-lg focus-within:bg-white transition-colors"
                        required={true}
                      />
                    </div>
                    <span className="pb-2.5 text-sm font-bold">人</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="md:hidden text-xs font-semibold text-green-600 mb-1">見通し</div>
                  <div className="flex items-end gap2">
                    <div className="flex-1">
                      <ReusableFormField
                        name="targetmember"
                        type="number"
                        control={form.control}
                        className="bg-green-50/30 border-green-100 rounded-lg focus-within:bg-white transition-colors"
                        required={true}
                      />
                    </div>
                    <span className="pb-2.5 text-sm font-bold">人</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 項目: 臨時雇 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 md:py-4">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                <div className="col-span-5 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-green-500 rounded-full hidden md:block"></span>
                  <p className="font-bold text-gray-800 text-lg md:text-base">臨時雇（年間）</p>
                </div>
                <div className="col-span-3">
                  <div className="md:hidden text-xs font-semibold text-gray-400 mb-1">現状</div>
                  <div className="flex items-end gap2">
                    <div className="flex-1">
                      <ReusableFormField
                        name="emergencycurrentmember"
                        type="number"
                        control={form.control}
                        className="bg-gray-50/50 rounded-lg"
                        required={true}
                      />
                    </div>
                    <span className="pb-2.5 text-sm font-bold">人</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="md:hidden text-xs font-semibold text-green-600 mb-1">見通し</div>
                  <div className="flex items-end gap2">
                    <div className="flex-1">
                      <ReusableFormField
                        name="emergencytargetmember"
                        type="number"
                        control={form.control}
                        className="bg-green-50/30 border-green-100 rounded-lg"
                        required={true}
                      />
                    </div>
                    <span className="pb-2.5 text-sm font-bold">人</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 合計セクション */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-5 md:py-4 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                <div className="col-span-5 flex items-center gap-3 md:pl-2">
                  <p className="font-extrabold text-gray-700 text-lg">延べ人数（合計）</p>
                </div>
                <div className="col-span-3">
                  <div className="md:hidden text-xs font-semibold text-gray-400 mb-1">現状合計</div>

                  <div className="flex items-end gap2">
                    <div className="flex-1">
                      <ReusableFormField
                        name="sumcurrentmember"
                        type="number"
                        control={form.control}
                        className="font-bold border-gray-300"
                        required={true}
                      />
                    </div>
                    <span className="pb-2.5 text-sm font-bold">人</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="md:hidden text-xs font-semibold text-green-600 mb-1">見通し合計</div>
                  <div className="flex items-end gap2">
                    <div className="flex-1">
                      <ReusableFormField
                        name="sumtargetmember"
                        type="number"
                        control={form.control}
                        className="font-bold border-green-300 text-green-700 outline-green-500"
                        required={true}
                      />
                    </div>
                    <span className="pb-2.5 text-sm font-bold">人</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>

  );
};