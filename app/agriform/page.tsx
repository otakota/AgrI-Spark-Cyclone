"use client"

import { useState } from 'react'; 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { InputStep } from "@/components/form/InputStep";     
import { ConfirmStep } from "@/components/form/ConfirmStep"; 
// schema
import { formSchema, FormValues } from '@/components/schemas/contactFormSchema';


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
        landType: "",
        location: "",
        currentArea: "",
        targetArea: "",
      }],

      rentallands: [{
        landType: "",
        location: "",
        currentArea: "",
        targetArea: "",
      }],

      specialwork: [{
          crop: "",
          work: "",
          currentland: "",
          currentproduction: "",
          targetland: "",
          targetproduction: "",
      }],

      outsourcing: [{
        crop: "",
        work: "",
        currentArea: "",
        targetArea: "",
      }],

      business: [{
        name: "",
        content: "",
        currentbusiness: "",
        targetbusiness: "",
      }],

      sumAreacurrent: "",
      sumAreatarget: "",
      kanzancurrent: "",
      kanzantarget: "",

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

      jobdetails: "",
      companyname: "",
      companystartdate: "",
      companyenddate:"",
      companyAdress: "",
      retirementDate: "",
      qualification: "",
      skillAgricultural: "",

      trainingname: "",
      trainingAdress: "",
      trainingSection: "",
      trainingStartDate: "",
      trainingEndDate: "",
      trainingContent: "",
      trainingAssist: "",

      certification:[{
        Certificationname: "",
        CertificationDate: "",
        biko: "",
      }],
    }
  })

  console.log(form.formState.errors);

  // 1. 入力画面からの送信（確認画面へ遷移）
  const handleInputSubmit = (values: FormValues) => {
    setFormData(values);
    setStep(2); 
  }

  // 2. 確認画面からの最終送信
  const handleFinalSubmit = async () => {
  if (formData) {
    try {
      const response = await fetch('/agriform/api/updateExcel', { // route.js のパス
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("送信エラー:", errorData);
        alert(`送信に失敗しました: ${errorData.error}`);
        return;
      }

      const result = await response.json();
      console.log("送信成功:", result);
      alert("申請を送信しました！ Excel ファイルへの書き込みも完了しています。");

      // 必要に応じてフォームリセットやステップを戻す
      setStep(1);
      form.reset();

    } catch (err) {
      console.error("通信エラー:", err);
      alert("送信に失敗しました。ネットワークを確認してください。");
    }
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
