{/* フォーム6　農畜産物の加工・販売その他の関連・附帯事業 */ }

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { AddRowButton } from '@/components/form/ui_form/AddRowButton'

interface ApplicantInfoCardProps {
    form: UseFormReturn<FormValues>;
}

export const BusinessScope: React.FC<ApplicantInfoCardProps> = ({ form }) => {

    const business = useFieldArray({ control: form.control, name: "business" });

    return (
        <Card>
            <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">
                農畜産物の加工・販売その他の関連・附帯事業
            </CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>事業名</TableHead>
                            <TableHead>内容</TableHead>
                            <TableHead>現状</TableHead>
                            <TableHead>目標</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {business.fields.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Input {...form.register(`business.${i}.name` as const)} placeholder="" />
                                </TableCell>
                                <TableCell>
                                    <Input {...form.register(`business.${i}.content` as const)} placeholder="" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`business.${i}.currentbusiness` as const)} placeholder="" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" min={0} {...form.register(`business.${i}.targetbusiness` as const)} />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" onClick={() => business.remove(i)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 行を追加ボタン */}
                <AddRowButton
                    onClick={() => business.append({
                        name: "", content: "", currentbusiness: "", targetbusiness: ""
                    })}
                    currentCount={business.fields.length}
                    maxCount={4}
                />

                <div className="bg-gray-50 p-4 my-6 rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700 col-span-3">
                    <p>
                        「農畜産物の加工・販売その他の関連・附帯事業」欄には、農業経営に関連・附帯する事業として、
                        <br />
                        （1）農畜産物を原料又は材料として使用して行う製造又は加工
                        <br />
                        （2）農畜産物の貯蔵、運搬又は販売
                        <br />
                        （3）農業生産に必要な資材の製造等
                        <br />
                        について入力します。
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};