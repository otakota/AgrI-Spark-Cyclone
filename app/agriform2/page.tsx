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
  name: z.string().min(1, { message: "必須" }),
  areaCurrent: z.string().optional(), 
  productionCurrent: z.string().optional(), 
  areaTarget: z.string().min(1, { message: "必須" }), 
  productionTarget: z.string().min(1, { message: "必須" }), 
});

//農地面積
const LandRowSchema = z.object({
  typeofCrops: z.string().min(1, { message: "必須" }),
  landType: z.string().min(1, { message: "必須" }),
  location: z.string().min(1, { message: "必須" }),
  currentArea: z.string().optional(),
  targetArea: z.string().min(1, { message: "必須" }),
});

//利用する機械
const MachineRowSchema = z.object({
  name: z.string().optional(), 
  currentSpec: z.string().optional(), 
  currentUnits: z.string().optional(), 
  targetSpec: z.string().optional(), 
  targetUnits: z.string().optional(), 
});

//目的達成のための措置
const MeasureRowSchema = z.object({
  title: z.string().optional(),
  spec: z.string().optional(),
  when: z.string().optional(),
  cost: z.string().optional(), //z.string().optional().default(""),
  fund: z.string().optional(),
});

//構成
const MemberRowSchema = z.object({
  name: z.string().optional(),
  relationOrRole: z.string().optional(),
  age: z.string().optional(), 
  currentTask: z.string().optional(),
  currentDays: z.string().optional(), 
  futureTask: z.string().optional(),
  futureDays: z.string().optional(), 
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
  crops: z.array(CropRowSchema).min(1, { message: "必須" }),

  sumAreaCurrent: z.string().optional(), 
  sumProductionCurrent: z.string().optional(), 
  sumAreaTarget: z.string().min(1, { message: "必須" }), 
  sumProductionTarget: z.string().min(1, { message: "必須" }), 

  lands: z.array(LandRowSchema).min(1, { message: "必須" }),
  machines: z.array(MachineRowSchema).min(1, { message: "必須" }),

  //経営に関する目標
  targetAgricultural: z.string().min(1, { message: "必須"}).max(255, { message: "255文字以内で記入してください"}),
  targetemployee: z.string().min(1, { message: "必須"}).max(255, { message: "255文字以内で記入してください"}),

  //農業経営の構成
  measures: z.array(MeasureRowSchema).min(1, { message: "必須" }),
  members: z.array(MemberRowSchema).min(1, {message: "必須"}),
  //雇用者の人数
  currentmember: z.string().optional(),
  targetmember: z.string().optional(),
  emergencycurrentmember: z.string().optional(),
  emergencytargetmember: z.string().optional(),
  sumcurrentmember: z.string().optional(),
  sumtargetmember: z.string().optional(),
  //研修
  trainingname: z.string().optional(),
  trainingAdress: z.string().optional(),
  trainingSection: z.string().optional(),
  trainingStartDate: z.string().optional(),
  trainingEndDate: z.string().optional(),
  trainingContent: z.string().max(255, { message: "255文字以内で記入してください"}).optional(),
  trainingAssist: z.string().max(255, { message: "255文字以内で記入してください"}).optional(),
})

export type FormValues = z.output<typeof formSchema>; 

export default function ProfileForm() {
  const [step, setStep] = useState(1); // 1:入力, 2:確認
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      applicationDate: "",
      mayor: "",
      applicantAddress: "",
      applicantName: "",
      age: "",
      corpEstablishedDate: "",
      
      jobdetails: "",
      companyname: "",
      companystartdate: "",
      companyenddate:"",
      companyAdress: "",
      retirementDate: "",
      qualification: "",
      skillAgricultural: "",

      farmCity: "",
      businessStartDate: "",
      farmingType: "",
      inheritScope: "",
      inheritPeriodYears: "",
      inheritPeriodMonths: "",
      targetFarmingType: "",
      futurePlan: "",

      incomeCurrent: "",
      incomeTarget: "", 
      hoursCurrent: "", 
      hoursTarget: "", 
      crops: [{
        name: "",
        areaCurrent: "",
        productionCurrent: "",
        areaTarget: "",
        productionTarget: "",
      }],

      sumAreaCurrent: "", 
      sumProductionCurrent: "", 
      sumAreaTarget: "",
      sumProductionTarget: "",

      lands: [{
        typeofCrops: "",
        landType: "",
        location: "",
        currentArea: "",
        targetArea: "",
      }],
      machines: [{
        name: "",
        currentSpec: "",
        currentUnits: "",
        targetSpec: "",
        targetUnits: "",
      }],

      targetAgricultural: "",
      targetemployee: "",

      measures:[{
        title: "",
        spec: "",
        when: "",
        cost: "",
        fund: "",
      }],

      members:[{
        name: "",
        relationOrRole: "",
        age: "",
        currentTask: "",
        currentDays: "",
        futureTask:"",
        futureDays: "",
      }],
      currentmember: "",
      targetmember: "",
      emergencycurrentmember: "",
      emergencytargetmember: "",
      sumcurrentmember: "",
      sumtargetmember: "",

      trainingname: "",
      trainingAdress: "",
      trainingSection: "",
      trainingStartDate: "",
      trainingEndDate: "",
      trainingContent: "",
      trainingAssist: "",
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
    <div className='container mx-auto md:px-60 py-20'>
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

