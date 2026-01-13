import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormValues } from "@/components/form/schemas/contactFormSchema";
import { Button } from "@/components/ui/button";

//項目ごとのコンポーネント
import { Userinfo } from "@/components/form/content/1_Userinfo";
import { Plan } from "@/components/form/content/2_Plan";
import { Management } from "@/components/form/content/3_Management";
import { CropAndArea } from "@/components/form/content/4_CropAndArea";
import { FormlandArea } from "@/components/form/content/5_FormlandArea";
import { BusinessScope } from "@/components/form/content/6_BussinessScope";
import { UseMachines } from "@/components/form/content/7_UseMachines";
import { ManagementGoals } from "@/components/form/content/8_ManagementGoals";
import { Project } from "@/components/form/content/9_Project";
import { Composition } from "@/components/form/content/10_Composition";
import { Career } from "@/components/form/content/11_Career";
import { TechnicalStatus } from "@/components/form/content/12_TechnicalStatus";
import { CertificationStatus } from "@/components/form/content/13_CertificationStatus";

interface InputStepProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
}

// ステップの定義
const STEPS = [
  { id: 1, title: "申請者情報", component: Userinfo },
  { id: 2, title: "就業計画", component: Plan },
  { id: 3, title: "経営の構想", component: Management },
  { id: 4, title: "農業経営の規模に関する目標（作目・部門）", component: CropAndArea },
  { id: 5, title: "農地面積", component: FormlandArea },
  { id: 6, title: "農畜産物の加工・販売その他の関連・附帯事業", component: BusinessScope },
  { id: 7, title: "利用する機械", component: UseMachines },
];

export const InputStep: React.FC<InputStepProps> = ({ form, onSubmit }) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">

      <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl">
        <span className="text-3xl">
          青年等就農計画認定申請書
        </span>
      </h1>

      {/* 申請者情報 */}
      <Userinfo form={form} />

      {/* 就業計画 */}
      <Plan form={form} />

      {/*経営の構想*/}
      <Management form={form} />

      {/* 作物名と面積 */}
      <CropAndArea form={form} />

      {/* 農地面積 */}
      <FormlandArea form={form} />

      {/* 農畜産物の加工・販売その他の関連・附帯事業 */}
      <BusinessScope form={form} />

      {/* 利用する機械 */}
      <UseMachines form={form} />

      {/* 経営に関する目標 */}
      <ManagementGoals form={form} />

      {/* 目標を達成するために必要な措置（事業） */}
      <Project form={form} />

      {/* 農業経営の構成（家族・役員等） */}
      <Composition form={form} />

      {/* 経歴 */}
      <Career form={form} />

      {/* 技術知識の習得状況 */}
      <TechnicalStatus form={form} />

      {/* （参考）他市町村の認定状況 */}
      <CertificationStatus form={form} />

      <div className="flex justify-end">
        <Button type="submit">確認画面へ進む</Button>
      </div>
    </form>
  );
};
