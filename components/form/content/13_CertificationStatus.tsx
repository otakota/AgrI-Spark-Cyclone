{/* フォーム13　（参考）他市町村の認定状況 */ }

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { AddRowButton } from '@/components/form/ui_form/AddRowButton'
import { ReusableDateField } from "@/components/form/ui_form/ReusableFormdate";
import { Button } from "@/components/ui/button";

interface ApplicantInfoCardProps {
  form: UseFormReturn<FormValues>;
}

export const CertificationStatus: React.FC<ApplicantInfoCardProps> = ({ form }) => {

  const certification = useFieldArray({ control: form.control, name: "certification" });

  return (
    <Card>
      <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">（参考）他市町村の認定状況</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>認定市区町村</TableHead>
              <TableHead>認定年月日</TableHead>
              <TableHead>備考</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certification.fields.map((row, i) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Input {...form.register(`certification.${i}.Certificationname` as const)} placeholder="" />
                </TableCell>
                <TableCell>
                  <ReusableDateField
                    name={`certification.${i}.CertificationDate`}
                    control={form.control}
                    label=""
                    required={false}
                    className="px-10"
                  />                </TableCell>
                <TableCell>
                  <Input {...form.register(`certification.${i}.biko` as const)} placeholder="" />
                </TableCell>
                                <TableCell>
                  <Button type="button" variant="ghost" onClick={() => certification.remove(i)}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* 行を追加ボタン */}
        <AddRowButton
          onClick={() => certification.append({
            Certificationname: "", CertificationDate: "",
          })}
          currentCount={certification.fields.length}
          maxCount={2}
        />
      </CardContent>
    </Card>
  );
};