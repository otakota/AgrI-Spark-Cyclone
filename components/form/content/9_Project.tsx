{/* フォーム9　目標を達成するために必要な措置（事業） */ }

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

export const Project: React.FC<ApplicantInfoCardProps> = ({ form }) => {

  const measures = useFieldArray({ control: form.control, name: "measures" });

  return (
    <Card>
      <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">
        目標を達成するために必要な措置（事業）
      </CardTitle></CardHeader>
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
                  <Input {...form.register(`measures.${i}.when` as const)} type="date" placeholder="○年○月" />
                </TableCell>
                <TableCell>
                  <Input type="number" min={0} {...form.register(`measures.${i}.cost` as const)} />
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
        {/* 行を追加ボタン */}
        <AddRowButton
          onClick={() => measures.append({
            title: "", spec: "", when: "", cost: "", fund: ""
          })}
          currentCount={measures.fields.length}
          maxCount={5}
        />
        <div className="bg-gray-50 p-4 my-4 mb-10  rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700">
          <p>
            「目標を達成するために必要な措置」欄には、「将来の農業経営の構想」、「農業経営の規模に関する目標」、「生産方式に関する目標」、「経営管理に関する目標」及び「農業従事の態様等に関する目標」に掲げた目標を達成するために必要な施設の設置、機械の購入、その他のリース農場の利用、農用地の購入・賃借等の措置を行うのに必要な資金を入力します。
          </p>
        </div>
      </CardContent>
    </Card>

  );
};