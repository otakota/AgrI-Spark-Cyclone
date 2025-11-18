"use client"

import { useState } from 'react'; 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"

import { InputStep } from "@/components/form/InputStep";     
import { ConfirmStep } from "@/components/form/ConfirmStep"; 

const formSchema = z.object({
  //基本情報
  name: z.string().min(1, { message: "名前を入力してください" }),
  applicationDate: z.string().min(1, { message: "申請日を入力してください"}), //日付と月と都市の間に「-」が入った形で登録される
  mayor: z.string().min(1, { message: "必須"}),
  applicantAddress:z.string().min(1, { message: "必須" }),
  applicantName: z.string().min(1, { message: "必須" }),
  birthDate: z.string().min(1, { message: "必須" }),
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
})

export type FormValues = z.output<typeof formSchema>; 

export default function ProfileForm() {
  const [step, setStep] = useState(1); // 1:入力, 2:確認
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      applicationDate: "",
      mayor: "",
      applicantAddress: "",
      applicantName: "",
      birthDate: "",
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
    }
  })

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
    <div className='container mx-auto px-15 py-30'>
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