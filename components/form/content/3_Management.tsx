{/* フォーム３ 経営の構想 */ }

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableFormField } from "@/components/form/ui_form/ReusableFormField";

interface ApplicantInfoCardProps {
    form: UseFormReturn<FormValues>;
}

export const Management: React.FC<ApplicantInfoCardProps> = ({ form }) => {
    return (
        <Card className="px-7 py-10">
            <CardHeader>
                <CardTitle className="text-green-700 text-2xl border-b-2 border-green-700 pb-1 inline-block">
                    経営の構想
                </CardTitle>
            </CardHeader>
            <CardContent className="">
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 現状セクション */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2 py-1 bg-gray-600 text-white text-xs font-bold rounded">現状</span>
                                <p className="text-sm font-bold text-gray-700">現在の実績値</p>
                            </div>
                            <div className="space-y-4 col-span-2">
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <ReusableFormField
                                            name="incomeCurrent"
                                            label="年間農業所得"
                                            helptext="初年度の場合は１年間の見込みを入力し、既に経営を開始している場合は計画作成時点の前年の状況を入力します。農畜産物の生産及び農畜産物の加工・販売その他の関連・附帯事業に係る年間所得（現状）を入力（単位：千円）します。"
                                            control={form.control}
                                            required={true}
                                        />
                                    </div>
                                    <span className="pb-2.5 text-sm font-bold">千円</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <ReusableFormField
                                            name="hoursCurrent"
                                            label="年間労働時間"
                                            helptext="初年度の場合は１年間の見込みを入力し、既に経営を開始している場合は計画作成時点の前年の状況を入力します。農畜産物の生産及び農畜産物の加工・販売その他の関連・附帯事業に係る年間労働時間（現状）を入力します。"
                                            control={form.control}
                                            required={true}
                                        />
                                    </div>
                                    <span className="pb-2.5 text-sm font-bold">時間</span>
                                </div>
                            </div>
                        </div>

                        {/* 目標セクション */}
                        <div className="bg-green-50/30 p-6 rounded-xl border border-green-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-2 py-1 bg-green-700 text-white text-xs font-bold rounded">目標</span>
                                <p className="text-sm font-bold text-green-800">今後の達成目標</p>
                            </div>
                            <div className="space-y-4 col-span-2">
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <ReusableFormField
                                            name="incomeTarget"
                                            label="年間農業所得"
                                            helptext="経営開始後おおむね５年後に達成すべき農業経営の目標について入力します。農畜産物の生産及び農畜産物の加工・販売その他の関連・附帯事業に係る年間所得（現状）を入力（単位：千円）します。"
                                            control={form.control} 
                                            required={true}
                                        />
                                    </div>
                                    <span className="pb-2.5 text-sm font-bold">千円</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <ReusableFormField
                                            name="hoursTarget"
                                            label="年間労働時間"
                                            helptext="経営開始後おおむね５年後に達成すべき農業経営の目標について入力します。農畜産物の生産及び農畜産物の加工・販売その他の関連・附帯事業に係る年間労働時間（目標）を入力します。"
                                            control={form.control} 
                                            required={true}
                                        />
                                    </div>
                                    <span className="pb-2.5 text-sm font-bold">時間</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </CardContent>
        </Card>
    );
};