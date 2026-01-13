{/* フォーム１　申請者情報 */ }

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableFormField } from "@/components/form/ui_form/ReusableFormField";
import { ReusableDateField } from "@/components/form/ui_form/ReusableFormdate";

interface ApplicantInfoCardProps {
    form: UseFormReturn<FormValues>;
}

export const Userinfo: React.FC<ApplicantInfoCardProps> = ({ form }) => {
    return (
        <div>
            <Card className="px-7 py-10">
                <CardHeader>
                    <CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">
                        申請者情報
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <ReusableFormField
                            name="name"
                            label="名前"
                            placeholder="山田 太郎"
                            control={form.control}
                            className="md:col-span-3"
                            required={true}
                        />
                        <ReusableDateField
                            name="birthDate"
                            label="生年月日"
                            control={form.control}
                            required={true}
                        />
                        <div className="col-span-2" />
                        <ReusableFormField
                            name="age"
                            label="年齢"
                            type="number"
                            control={form.control}
                            required={true}
                        />
                        <ReusableFormField
                            name="phoneNumber"
                            label="電話番号"
                            type="number"
                            control={form.control}
                            required={true}
                        />
                        <ReusableFormField
                            name="applicantName"
                            label="氏名（名称・代表者）"
                            placeholder="農林 太郎"
                            control={form.control}
                            className="md:col-span-3"
                            required={true}
                        />
                        <ReusableFormField
                            name="applicantAddress"
                            label="申請者住所"
                            placeholder="○○県○○市○丁目○-○"
                            control={form.control}
                            className="md:col-span-3"
                            required={true}
                        />
                    </div>
                    <hr className="md:col-span-3 my-12" />
                    <div className="grid gap-10">
                        <ReusableFormField
                            name="mayor"
                            label="市長"
                            placeholder="例：○○市長 殿"
                            control={form.control}
                            className="md:col-span-3"
                            required={true}
                        />
                        <ReusableFormField
                            name="applicationDate"
                            label="申請日"
                            type="date"
                            control={form.control}
                            required={true}
                        />
                        <ReusableDateField
                            name="corpEstablishedDate"
                            label="法人設立年月日（法人の場合のみ）"
                            type="date"
                            control={form.control}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};