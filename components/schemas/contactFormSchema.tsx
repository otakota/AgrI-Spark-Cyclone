import { optional, z } from 'zod'

//作物名、生産量など
const CropRowSchema = z.object({
  name: z.string().min(1, { message: "必須" }),
  areaCurrent: z.string().optional(), 
  productionCurrent: z.string().optional(), 
  areaTarget: z.string().min(1, { message: "必須" }), 
  productionTarget: z.string().min(1, { message: "必須" }), 
});

//所有地
const LandRowSchema = z.object({
  landType: z.string().optional(),
  location: z.string().optional(),
  currentArea: z.string().optional(),
  targetArea: z.string().optional(),
});

//借入地
const rentalSchema = z.object({
  landType: z.string().min(1, { message: "必須" }),
  location: z.string().min(1, { message: "必須" }),
  currentArea: z.string().optional(),
  targetArea: z.string().min(1, { message: "必須" }),
});

//特定作業委託
const SpecialWorkSchema = z.object({
  crop: z.string().optional(),
  work: z.string().optional(),
  currentland: z.string().optional(),
  currentproduction: z.string().optional(),
  targetland: z.string().optional(),
  targetproduction: z.string().optional(),
})

//作業委託
const OutsourcingSchema = z.object({
  crop: z.string().optional(),
  work: z.string().optional(),
  currentArea: z.string().optional(),
  targetArea: z.string().optional(),
})

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


export const formSchema = z.object({
  //基本情報
  name: z.string().min(1, { message: "必須" }),
  birthDate: z.string().min(1, { message: "必須" }),
  applicationDate: z.string().min(1, { message: "必須"}), //日付と月と都市の間に「-」が入った形で登録される
  mayor: z.string().min(1, { message: "必須"}),
  applicantAddress:z.string().min(1, { message: "必須" }),
  applicantName: z.string().min(1, { message: "必須" }),
  age: z.string().min(1, { message: "必須"}),
  corpEstablishedDate:z.string().optional(),
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
  rentallands: z.array(rentalSchema).min(1, { message: "必須" }),
  specialwork: z.array(SpecialWorkSchema).min(1, {message: "必須"}),
  outsourcing: z.array(OutsourcingSchema).min(1, {message: "必須"}),

  sumAreacurrent: z.string().optional(),
  sumAreatarget: z.string().optional(),
  kanzancurrent: z.string().optional(),
  kanzantarget: z.string().optional(),


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
  //経歴
  jobdetails: z.string().min(1, { message: "必須" }),
  companyname: z.string().min(1, { message: "必須" }),
  companystartdate: z.string().min(1, { message: "必須" }),
  companyenddate: z.string().min(1, { message: "必須" }),
  companyAdress: z.string().min(1, { message: "必須" }),
  retirementDate: z.string().min(1, { message: "必須" }),
  qualification: z.string().max(255, { message: "255文字以内で記入してください"}).optional(),
  skillAgricultural: z.string().max(255, { message: "255文字以内で記入してください"}).optional(),
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
