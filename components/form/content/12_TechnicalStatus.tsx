{/* フォーム12　技術知識の習得状況 */ }

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableFormField, ReusableTextareaField } from "@/components/form/ui_form/ReusableFormField";
import { ReusableDateField } from "@/components/form/ui_form/ReusableFormdate";

interface ApplicantInfoCardProps {
    form: UseFormReturn<FormValues>;
}

export const TechnicalStatus: React.FC<ApplicantInfoCardProps> = ({ form }) => {
    return (
        <Card>
            <CardHeader><CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">技術知識の習得状況</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="bg-gray-50 p-4 mb-10  rounded-md border border-gray-200 text-sm leading-relaxed text-gray-700 col-span-2">
                    <p>
                        該当者がいない場合は、「職務内容」欄に「該当者なし」等と入力ください。
                    </p>
                </div>
                <ReusableFormField 
                    name="trainingname" 
                    label="研修先等の名称" 
                    required={true} 
                    control={form.control} 
                    className="md:col-span-2" 
                />
                <ReusableFormField 
                    name="trainingAdress" 
                    label="所在地" 
                    placeholder="○○県○○市○丁目○-○" 
                    control={form.control} 
                    className="md:col-span-2" 
                />
                <ReusableFormField 
                    name="trainingSection" 
                    label="専攻・営農部門" 
                    control={form.control} 
                    className="md:col-span-2" 
                />

                {/* 研修期間 */}
                <div className="col-span-3 flex">
                    <ReusableDateField
                        name="trainingStartDate"
                        label="研修等期間開始日"
                        type="date"
                        control={form.control}
                    />
                    <span className="text-center mt-1 text-6xl mx-16">~</span>

                    <ReusableDateField
                        name="trainingEndDate"
                        label=""
                        type="date"
                        control={form.control}
                        className="mt-3"
                    />
                </div>

                <ReusableTextareaField 
                    name="trainingContent" 
                    label="研修内容等" 
                    rows={4} 
                    control={form.control} 
                    className="md:col-span-3" 
                />
                <ReusableTextareaField 
                    name="trainingAssist" 
                    label=" 活用した補助金等" 
                    rows={4} 
                    control={form.control} 
                    className="md:col-span-3" 
                />
            </CardContent>
        </Card>
    );
};