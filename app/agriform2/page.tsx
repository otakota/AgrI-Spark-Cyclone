"use client"

import { useState } from 'react'; 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { InputStep } from "@/components/form/InputStep";     
import { ConfirmStep } from "@/components/form/ConfirmStep"; 

//作物名、生産量など
const CropRowSchema = z.object({
  name: z.string().optional(), 
  areaCurrent: z.number().nullable().optional(), 
  productionCurrent: z.number().nullable().optional(), 
  areaTarget: z.number().nullable().optional(), 
  productionTarget: z.number().nullable().optional(), 
});

//農地面積
const LandRowSchema = z.object({
  typeofCrops: z.string().optional(),
  landType: z.string().optional(),
  location: z.string().optional(),
  currentArea: z.number().optional(),
  targetArea: z.number().optional(),
});

//利用する機械
const MachineRowSchema = z.object({
  name: z.string().optional(),
  currentSpec: z.string().optional(), 
  currentUnits: z.number().optional(), 
  targetSpec: z.string().optional(), 
  targetUnits: z.number().optional(), 
});

const formSchema = z.object({
  //基本情報
  name: z.string().min(1, { message: "必須" }),
  birthDate: z.string().min(1, { message: "必須" }),
  applicationDate: z.string().min(1, { message: "必須"}), //日付と月と都市の間に「-」が入った形で登録される
  mayor: z.string().min(1, { message: "必須"}),
  applicantAddress:z.string().min(1, { message: "必須" }),
  applicantName: z.string().min(1, { message: "必須" }),
  age: z.string().min(1, { message: "必須"}),
  corpEstablishedDate:z.string().optional(),
  //経歴
  jobdetails: z.string().min(1, { message: "必須" }),
  companyname: z.string().min(1, { message: "必須" }),
  companystartdate: z.string().min(1, { message: "必須" }),
  companyenddate: z.string().min(1, { message: "必須" }),
  companyAdress: z.string().min(1, { message: "必須" }),
  retirementDate: z.string().min(1, { message: "必須" }),
  qualification: z.string().max(255, { message: "255文字以内で記入してください"}).optional(),
  skillAgricultural: z.string().max(255, { message: "255文字以内で記入してください"}).optional(),
  //就業計画
  farmCity: z.string().min(1, { message: "必須" }),
  businessStartDate: z.string().min(1, { message: "必須" }),
  farmingType: z.string().nonempty({ message: "就農形態を選択してください"}),
  inheritScope: z.string().nonempty({ message: "必須"}),
  inheritPeriodYears: z.string().min(1, { message: "必須" }),
  inheritPeriodMonths: z.string().min(1, { message: "必須" }),
  targetFarmingType: z.string().min(1, { message: "必須" }), //テキスト形式にしているが選択できるようにする？
  futurePlan: z.string().min(1, { message: "必須" }),
  //経営の構想
  incomeCurrent: z.string().min(1, { message: "必須" }),
  hoursCurrent: z.string().min(1, { message: "必須" }),
  incomeTarget: z.string().min(1, { message: "必須" }),  
  hoursTarget: z.string().min(1, { message: "必須" }),
  //作物名、生産量など
  crops: z.array(CropRowSchema).optional(),
  lands: z.array(LandRowSchema).optional(),
  machines: z.array(MachineRowSchema).optional(), 

  //経営の構想
  targetAgricultural: z.string().min(1, { message: "必須"}).max(255, { message: "255文字以内で記入してください"}),
  targetemployee: z.string().min(1, { message: "必須"}).max(255, { message: "255文字以内で記入してください"}),
})

export type FormValues = z.output<typeof formSchema>; 

export default function ProfileForm() {
  const [step, setStep] = useState(1); // 1:入力, 2:確認
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //基本情報
      name: "",
      birthDate: "",
      applicationDate: "",
      mayor: "",
      applicantAddress: "",
      applicantName: "",
      age: "",
      corpEstablishedDate: "",
      //経歴
      jobdetails: "",
      companyname: "",
      companystartdate: "",
      companyenddate:"",
      companyAdress: "",
      retirementDate: "",
      qualification: "",
      skillAgricultural: "",
      //就業計画
      farmCity: "",
      businessStartDate: "",
      farmingType: "",
      inheritScope: "",
      inheritPeriodYears: "",
      inheritPeriodMonths: "",
      targetFarmingType: "",
      futurePlan: "",
      //経営の構想
      incomeCurrent: "",
      incomeTarget: "", 
      hoursCurrent: "", 
      hoursTarget: "", 
      //作物
      crops: [{
        name: "",
        areaCurrent: undefined,
        productionCurrent: undefined,
        areaTarget: undefined,
        productionTarget: undefined,
      }],
      //農地面積
      lands: [{
        typeofCrops: "",
        landType: "",
        location: "",
        currentArea: undefined,
        targetArea: undefined,
      }],
      machines: [{
        name: "",
        currentSpec: "",
        currentUnits: undefined,
        targetSpec: "",
        targetUnits: undefined,
      }],
      //経営の構想
      targetAgricultural: "",
      targetemployee: "",
    }
  })

  console.log(form.formState.errors);

  // 1. 入力画面からの送信（確認画面へ遷移）
  const handleInputSubmit = (values: FormValues) => {
    setFormData(values);
    setStep(2); // 確認ステップへ
  }

  // 2. 確認画面からの最終送信
  const handleFinalSubmit = () => {
    if (formData) {
      console.log("最終送信データ:", formData);
      alert("申請を送信しました！");
    }
  }

  return (
    <div className='container mx-auto px-60 py-30'>
      <Form {...form}>
        {/* ステップに応じてコンポーネントを切り替える */}
        {step === 1 ? (
          <InputStep form={form} onSubmit={handleInputSubmit} />
        ) : (
          <ConfirmStep 
            data={formData as FormValues} // データは必ずあるので型アサーション
            onBack={() => setStep(1)} 
            onFinalSubmit={handleFinalSubmit} 
          />
        )}
      </Form>
    </div>
  )
}