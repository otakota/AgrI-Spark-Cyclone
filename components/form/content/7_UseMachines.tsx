{/* フォーム7　利用する機械 */ }

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

export const UseMachines: React.FC<ApplicantInfoCardProps> = ({ form }) => {

    const machines = useFieldArray({ control: form.control, name: "machines" });

    return (
        <Card>
            <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">生産方式に関する目標（機械・施設）</CardTitle></CardHeader>
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
                                        <Input type="number" min={0} placeholder="台" {...form.register(`machines.${i}.currentUnits` as const)} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input className="col-span-2" placeholder="26馬力 等" {...form.register(`machines.${i}.targetSpec` as const)} />
                                        <Input type="number" min={0} placeholder="台" {...form.register(`machines.${i}.targetUnits` as const)} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" onClick={() => machines.remove(i)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 行を追加ボタン */}
                <AddRowButton
                    onClick={() => machines.append({
                        name: "", currentSpec: "", currentUnits: "", targetSpec: "", targetUnits: ""
                    })}
                    currentCount={machines.fields.length}
                    maxCount={12}
                />
            </CardContent>
        </Card>
    );
};