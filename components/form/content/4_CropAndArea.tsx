{/* フォーム４　農業経営の規模に関する目標（作目・部門） */ }

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableFormField } from "@/components/form/ui_form/ReusableFormField";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { AddRowButton } from "@/components/form/ui_form/AddRowButton";

interface ApplicantInfoCardProps {
    form: UseFormReturn<FormValues>;
}

export const CropAndArea: React.FC<ApplicantInfoCardProps> = ({ form }) => {

    const crops = useFieldArray({ control: form.control, name: "crops" });
    const { formState: { errors } } = form;

    return (
        <Card>
            <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">
                農業経営の規模に関する目標（作目・部門）
            </CardTitle></CardHeader>
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
                                    <Input {...form.register(`crops.${i}.name` as const)} placeholder="例：タマネギ" className="w-50" />
                                    {errors.crops?.[i]?.name && (
                                        <p className="text-red-500 text-xs">{errors.crops[i].name.message}</p>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Input type="number" className="" min={0} {...form.register(`crops.${i}.areaCurrent` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`crops.${i}.productionCurrent` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`crops.${i}.areaTarget` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`crops.${i}.productionTarget` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" onClick={() => crops.remove(i)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 行を追加ボタン */}
                <AddRowButton
                    onClick={() => crops.append({
                        name: "", areaCurrent: "", productionCurrent: "", areaTarget: "", productionTarget: ""
                    })}
                    currentCount={crops.fields.length}
                    maxCount={6}
                />



                <div className="mt-8 mb-6">
                    <h3 className="text-green-700 font-bold text-lg border-b-2 border-green-700 pb-2 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-green-700 rounded-full"></span>
                        経営面積合計
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                        {/* 現状セクション */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2 py-1 bg-gray-600 text-white text-xs font-bold rounded">現状</span>
                                <p className="text-sm font-bold text-gray-700">現在の実績値</p>
                            </div>
                            <div className="space-y-4 col-span-2">
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <ReusableFormField
                                            name="sumAreaCurrent"
                                            label="作付面積合計"
                                            type="number"
                                            control={form.control}
                                            required={true}
                                            helptext="本欄には、「作付面積・飼養頭数」欄の面積だけでなく、「特定作業受託」の「作業受託面積」欄の面積を加えて入力します。"
                                        />
                                    </div>
                                    <span className="pb-2.5 text-sm font-bold">a</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <ReusableFormField
                                            name="sumProductionCurrent"
                                            label="生産量合計"
                                            type="number"
                                            control={form.control}
                                            required={true}
                                        />
                                    </div>
                                    <span className="pb-2.5 text-sm font-bold">a</span>
                                </div>
                            </div>
                        </div>

                        {/* 目標セクション */}
                        <div className="bg-green-50/30 p-6 rounded-xl border border-green-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2 py-1 bg-green-700 text-white text-xs font-bold rounded">目標</span>
                                <p className="text-sm font-bold text-green-800">今後の達成目標</p>
                            </div>
                            <div className="space-y-4 col-span-2">
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <ReusableFormField
                                            name="sumAreaTarget"
                                            label="作付面積合計"
                                            type="number"
                                            control={form.control}
                                            required={true}
                                            helptext="本欄には、「作付面積・飼養頭数」欄の面積だけでなく、「特定作業受託」の「作業受託面積」欄の面積を加えて入力します。"
                                        />
                                    </div>
                                    <span className="pb-2.5 text-sm font-bold">a</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <ReusableFormField
                                            name="sumProductionTarget"
                                            label="生産量合計"
                                            type="number"
                                            control={form.control}
                                            required={true}
                                        />
                                    </div>
                                    <span className="pb-2.5 text-sm font-bold">a</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700 col-span-3">
                            <p>
                                「作業受託」欄に、「特定作業受託」欄に記載した作業受託以外の作業受託について、作目別、基幹作業別に、作業受託面積を入力するとともに、
                                <span className="font-semibold text-gray-900">「換算後」欄に「作業受託面積÷作業数」により換算した面積</span>を入力します。
                            </p>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};