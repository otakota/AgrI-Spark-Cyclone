import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"; // ui/form などのパスは適宜調整してください
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";
import { FaQuestionCircle } from "react-icons/fa";


interface ReusableDateFieldProps {
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

export const ReusableDateField: React.FC<ReusableDateFieldProps> = ({
    control,
    name,
    label,
    className,
    helptext,
    biko,
    required = false,
}) => {
    const shouldRenderHoverCard = !!helptext;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // 日付文字列を年月日に分解
                const dateValue = field.value || '';
                const parts = dateValue.split('-');
                const year = parts[0] || '';
                const month = parts[1] ? String(parseInt(parts[1], 10) || '') : '';
                const day = parts[2] ? String(parseInt(parts[2], 10) || '') : '';

                const handleDateChange = (newYear: string, newMonth: string, newDay: string) => {
                    if (newYear && newMonth && newDay) {
                        field.onChange(`${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`);
                    } else if (!newYear && !newMonth && !newDay) {
                        field.onChange('');
                    } else {
                        field.onChange(`${newYear}-${newMonth}-${newDay}`);
                    }
                };

                return (
                    <FormItem className={className}>
                        <FormLabel className="flex items-center gap-0">
                            {label}
                            {required && (
                                <span className="text-[10px] bg-red-500 text-white mx-2 px-1.5 py-0.5 rounded">必須</span>
                            )}
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
                            <div className="flex gap-2 items-center">
                                {/* 年入力欄 */}
                                <Input
                                    className="bg-white w-24 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    placeholder="年"
                                    type="number"
                                    min="1900"
                                    max="2100"
                                    value={year || ''}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(0, 4); // 4文字に制限
                                        handleDateChange(value, month || '', day || '');
                                    }}
                                />
                                <span className="text-sm">年</span>

                                {/* 月入力欄 */}
                                <Input
                                    className="bg-white w-16 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    placeholder="月"
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={month || ''}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(0, 2); // 2文字に制限
                                        handleDateChange(year || '', value, day || '');
                                    }}
                                />
                                <span className="text-sm">月</span>

                                {/* 日入力欄 */}
                                <Input
                                    className="bg-white w-16 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    placeholder="日"
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={day || ''}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(0, 2); // 2文字に制限
                                        handleDateChange(year || '', month || '', value);
                                    }}
                                />
                                <span className="text-sm">日</span>
                            </div>
                        </FormControl>
                        <FormMessage />
                        {biko && (
                            <FormDescription>（備考）</FormDescription>
                        )}
                        <FormDescription>{biko}</FormDescription>
                    </FormItem>
                );
            }}
        />
    );
};