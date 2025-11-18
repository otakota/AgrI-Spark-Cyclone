// components/ReusableFormField.tsx
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; // ui/form などのパスは適宜調整してください
import { Input } from "@/components/ui/input"; 

interface ReusableFormFieldProps {
  // form.controlを渡すために必要
  control: Control<any>;
  // formのスキーマにおけるフィールド名
  name: string;
  // <FormLabel>に表示するテキスト
  label: string;
  // <Input>のtype属性（デフォルトはtext）
  type?: string;
  // <Input>に渡す追加のプロパティ（placeholderなど）
  // ... any ではなく、適切な型定義を推奨しますが、ここでは簡略化します
  // inputProps?: React.ComponentProps<typeof Input>; 
}

export const ReusableFormField: React.FC<ReusableFormFieldProps> = ({
  control,
  name,
  label,
  type = "text",
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/* type属性を設定し、field.valueがnullまたはundefinedの場合は空文字列を設定 */}
            <Input type={type} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};