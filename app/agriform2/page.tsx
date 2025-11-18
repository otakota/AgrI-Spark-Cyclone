"use client"

import { useState } from 'react'; 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"

import { InputStep } from "@/components/form/InputStep";     
import { ConfirmStep } from "@/components/form/ConfirmStep"; 

const formSchema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  kana: z.string().min(1, { message: "カナを入力してください" }), 
  applicationDate: z.string().optional(), 
})

export type FormValues = z.output<typeof formSchema>; 

export default function ProfileForm() {
  const [step, setStep] = useState(1); // 1:入力, 2:確認
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      kana: "",
      applicationDate: "",
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
      // 完了後、リダイレクトやステップ1へ戻るなどの処理
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