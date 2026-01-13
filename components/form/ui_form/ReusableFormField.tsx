// Formfieldのコンポーネント

// 利用例
// <ReusableFormField 
//   name="name" 
//   label="名前" 
//   placeholder="入力欄に例として薄く表示されるテキストです" 
//   className="md:col-span-3"
//   type="text"
//   helptext="?マークをlabelの横に表示してホバーするとここに書かれた文字が表示されます"
//   biko="入力欄の下に備考を表示します"
//   control={form.control} 
//   />

// textareaを使う場合
// <ReusableTextareaField 
//  name="targetFarmingType" 
//  label="目標とする営農類型" 
//  rows={2} 
//  placeholder="例：露地野菜" 
//  className="md:col-span-3" 
//  control={form.control} />

import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"; // ui/form などのパスは適宜調整してください
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";
import { FaQuestionCircle } from "react-icons/fa";


interface ReusableFormFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  type?: string;
  helptext?: string;
  biko?: string;
  required?: boolean;
}

interface ReusableTextareaFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  helptext?: string;
  biko?: string;
  required?: boolean;
}

export const ReusableFormField: React.FC<ReusableFormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  className,
  type = "text",
  helptext,
  biko,
  required = false,
}) => {
  const shouldRenderHoverCard = !!helptext;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className} >
          <FormLabel className="flex items-center gap-0">
            {label}
            {/* 必須を表示 */}
            {required && (
              <span className="text-[10px] bg-red-500 text-white mx-2 px-1.5 py-0.5 rounded">必須</span>
            )}
            {/* labelの横にヘルプマークを表示してホバーするとテキストが表示される */}
            {shouldRenderHoverCard && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0 h-2"><FaQuestionCircle /></Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-120 bg-gray-100">
                  <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm">{helptext}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </FormLabel>
          <FormControl>
            {/* type属性を設定し、field.valueがnullまたはundefinedの場合は空文字列を設定 */}
            <Input className="bg-white" placeholder={placeholder} type={type} {...field} value={field.value ?? ""} />
          </FormControl>
          <FormMessage />
          {biko && (
            <FormDescription>（備考）</FormDescription>
          )}
          <FormDescription>{biko}</FormDescription>
        </FormItem>
      )}
    />
  );
};

// Textareaを使う場合
export const ReusableTextareaField: React.FC<ReusableTextareaFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  className,
  rows,
  helptext,
  biko,
  required = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}
            {/* 必須を表示 */}
            {required && (
              <span className="text-[10px] bg-red-500 text-white mx-1 px-1.5 py-0.5 rounded">必須</span>
            )}
            {helptext && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0 h-2"><FaQuestionCircle /></Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-120 bg-gray-100">
                  <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm">{helptext}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              {...field}
              // Textarea も field.value が null/undefined の場合は空文字列を設定
              value={field.value ?? ""}
            />
          </FormControl>
          <FormDescription>{biko}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};