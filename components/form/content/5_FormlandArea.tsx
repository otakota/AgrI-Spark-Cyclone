{/* フォーム5　農地面積 */ }

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

export const FormlandArea: React.FC<ApplicantInfoCardProps> = ({ form }) => {

    const lands = useFieldArray({ control: form.control, name: "lands" });
    const rentallands = useFieldArray({ control: form.control, name: "rentallands" });
    const specialwork = useFieldArray({ control: form.control, name: "specialwork" });
    const outsourcing = useFieldArray({ control: form.control, name: "outsourcing" });

    return (
        <Card>
            <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">
                農地の面積（所有地）
            </CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <h3 className="text-green-700 font-bold text-lg border-b-2 border-green-700 pb-2 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-green-700 rounded-full"></span>
                    区分：所有地
                </h3>
                <Table>
                    <TableHeader>
                        <TableRow>
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
                                    <Input {...form.register(`lands.${i}.landType` as const)} placeholder="畑・田など" />
                                </TableCell>
                                <TableCell>
                                    <Input {...form.register(`lands.${i}.location` as const)} placeholder="○○市△地区" className="w-70" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`lands.${i}.currentArea` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`lands.${i}.targetArea` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" onClick={() => lands.remove(i)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 行を追加ボタン */}
                <AddRowButton
                    onClick={() => lands.append({
                        landType: "", location: "", currentArea: "", targetArea: ""
                    })}
                    currentCount={lands.fields.length}
                    maxCount={3}
                />
            </CardContent>

            <hr className="my-6 border-gray-300 dark:border-gray-700" />

            <CardContent className="space-y-3">
                <h3 className="text-green-700 font-bold text-lg border-b-2 border-green-700 pb-2 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-green-700 rounded-full"></span>
                    区分：借入地
                </h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>地目</TableHead>
                            <TableHead>所有地</TableHead>
                            <TableHead>現状（a）</TableHead>
                            <TableHead>目標（a）</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rentallands.fields.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Input {...form.register(`rentallands.${i}.landType` as const)} placeholder="畑・田など" />
                                </TableCell>
                                <TableCell>
                                    <Input {...form.register(`rentallands.${i}.location` as const)} placeholder="○○市△地区" className="w-70" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`rentallands.${i}.currentArea` as const)} placeholder="" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`rentallands.${i}.targetArea` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" onClick={() => rentallands.remove(i)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 行を追加ボタン */}
                <AddRowButton
                    onClick={() => rentallands.append({
                        landType: "", location: "", currentArea: "", targetArea: ""
                    })}
                    currentCount={rentallands.fields.length}
                    maxCount={3}
                />
            </CardContent>

            <hr className="my-6 border-gray-300 dark:border-gray-700" />

            <CardContent className="space-y-3">
                <h3 className="text-green-700 font-bold text-lg border-b-2 border-green-700 pb-2 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-green-700 rounded-full"></span>
                    区分：特定作業委託
                </h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>作物</TableHead>
                            <TableHead>作業</TableHead>
                            <TableHead>作業委託面積（現状）</TableHead>
                            <TableHead>生産量（現状）</TableHead>
                            <TableHead>作業委託面積（目標）</TableHead>
                            <TableHead>生産量（目標）</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {specialwork.fields.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Input {...form.register(`specialwork.${i}.crop` as const)}  className="w-40" />
                                </TableCell>
                                <TableCell>
                                    <Input {...form.register(`specialwork.${i}.work` as const)} className="w-50" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`specialwork.${i}.currentland` as const)} className="w-30"  />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`specialwork.${i}.currentproduction` as const)}  className="w-30" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`specialwork.${i}.targetland` as const)}  className="w-30" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`specialwork.${i}.targetproduction` as const)}  className="w-30" />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" onClick={() => specialwork.remove(i)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 行を追加ボタン */}
                <AddRowButton
                    onClick={() => specialwork.append({
                        crop: "", work: "", currentland: "", currentproduction: "", targetland: "", targetproduction: ""
                    })}
                    currentCount={specialwork.fields.length}
                    maxCount={3}
                />
            </CardContent>

            <hr className="my-6 border-gray-300 dark:border-gray-700" />

            <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">
                作業委託の場合
            </CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>作目</TableHead>
                            <TableHead>作業</TableHead>
                            <TableHead>現状（a）</TableHead>
                            <TableHead>目標（a）</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {outsourcing.fields.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Input {...form.register(`outsourcing.${i}.crop` as const)} placeholder="畑・田など" />
                                </TableCell>
                                <TableCell>
                                    <Input {...form.register(`outsourcing.${i}.work` as const)} placeholder="" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`outsourcing.${i}.currentArea` as const)} placeholder="" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`outsourcing.${i}.targetArea` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" onClick={() => outsourcing.remove(i)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 行を追加ボタン */}
                <AddRowButton
                    onClick={() => outsourcing.append({
                        crop: "", work: "", currentArea: "", targetArea: ""
                    })}
                    currentCount={outsourcing.fields.length}
                    maxCount={3}
                />
            </CardContent>


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
                                    name="sumAreacurrent"
                                    label="単純計（現在）"
                                    type="number"
                                    helptext="入力した「現状」の合計を入力します。このとき、単位についても入力します。"
                                    control={form.control}
                                    required={true}
                                />
                            </div>
                            <span className="pb-2.5 text-sm font-bold">a</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <ReusableFormField
                                    name="kanzancurrent"
                                    label="換算後（現在）"
                                    type="number"
                                    helptext="「作業受託面積÷作業数」により換算した面積（「0」のときはその旨）を単位を付して入力します。"
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
                                    name="sumAreatarget"
                                    label="単純計（目標）"
                                    helptext="入力した「目標」の合計を入力します。このとき、単位についても入力します。"
                                    type="number"
                                    control={form.control}
                                    required={true}
                                />
                            </div>
                            <span className="pb-2.5 text-sm font-bold">a</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <ReusableFormField
                                    name="kanzantarget"
                                    label="換算後（目標）"
                                    helptext="「作業受託面積÷作業数」により換算した面積（「0」のときはその旨）を単位を付して入力します。"
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
        </Card>
    );
};