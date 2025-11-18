// components/ReusableFormField.tsx
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; // ui/form などのパスは適宜調整してください
import { Input } from "@/components/ui/input"; 

interface ReusableFormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  // ... any ではなく、適切な型定義を推奨しますが、ここでは簡略化します
  // inputProps?: React.ComponentProps<typeof Input>; 
}

export const ReusableFormField: React.FC<ReusableFormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
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
            <Input placeholder={placeholder} type={type} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};