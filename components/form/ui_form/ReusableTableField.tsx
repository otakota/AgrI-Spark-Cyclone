// DynamicTable.tsx

//const columns: Column[] = [
//  { key: "title", label: "事業内容", placeholder: "トラクター導入 等" },
//  { key: "spec", label: "規模・構造等(仕様)", placeholder: "26馬力 等" },
//  { key: "when", label: "実施時期", placeholder: "○年○月", type: "date" },
//  { key: "cost", label: "事業費(千円)", type: "number", min: 0 },
//  { key: "fund", label: "資金名等", placeholder: "青年等就農資金 等" }
//];
//
//<DynamicTable
//  form={form}
//  fieldArrayName="measures"
//  columns={columns}
///>

import { useFieldArray, UseFormReturn, FieldValues, ArrayPath } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Column {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "date" | "number";
  min?: number;
  render?: (row: Record<string, any>, index: number) => React.ReactNode;
}

interface DynamicTableProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  fieldArrayName: ArrayPath<TFieldValues>;
  columns: Column[];
  onRemove?: (index: number) => void;
}

export function ReusableTableField<TFieldValues extends FieldValues>({
  form,
  fieldArrayName,
  columns,
  onRemove
}: DynamicTableProps<TFieldValues>) {
  const fieldArray = useFieldArray({
    control: form.control,
    name: fieldArrayName
  });

  const handleRemove = (index: number) => {
    if (onRemove) {
      onRemove(index);
    }
    fieldArray.remove(index);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldArray.fields.map((row, i) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render ? (
                  col.render(row as Record<string, any>, i)
                ) : (
                  <Input
                    {...form.register(`${fieldArrayName}.${i}.${col.key}` as any)}
                    placeholder={col.placeholder}
                    type={col.type || "text"}
                    min={col.min}
                  />
                )}
              </TableCell>
            ))}
            <TableCell>
              <Button type="button" variant="ghost" onClick={() => handleRemove(i)}>
                削除
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}