import { optional, z } from 'zod'

const farmingTypeOptions = ["start_new", "new_department", "inherit"] as const;

//作物名と生産量
const CropRowSchema = z.object({
  name: z.string().min(1, "必須"),
  areaCurrent: z.string().optional(), //numberの型にできない
  productionCurrent: z.string().optional(), //numberの型にできない
  areaTarget: z.string().optional(), //numberの型にできない
  productionTarget: z.string().optional(), //numberの型にできない
});

//農地面積
const LandRowSchema = z.object({
  typeofCrops: z.string().optional(),
  landType: z.string().min(1, "必須"),
  location: z.string().min(1, "必須"),
  currentArea: z.string().optional(), //numberの型にできない z.coerce.number().nonnegative().default(0),
  targetArea: z.string().optional(), //numberの型にできない
});

//利用する機械
const MachineRowSchema = z.object({
  name: z.string().min(1, "必須"),
  currentSpec: z.string().optional(), //z.string().optional().default(""),
  currentUnits: z.string().optional(), //numberの型にできない
  targetSpec: z.string().optional(), //z.string().optional().default(""),
  targetUnits: z.string().optional(), //numberの型にできない
});

//目的達成のための措置
const MeasureRowSchema = z.object({
  title: z.string().min(1, "必須"),
  spec: z.string().optional(),
  when: z.string().optional(),
  cost: z.string().optional(), //z.string().optional().default(""),
  fund: z.string().optional(),
});

//構成
const MemberRowSchema = z.object({
  name: z.string().min(1, "必須"),
  relationOrRole: z.string().min(1, "必須"),
  age: z.string().optional(), //z.coerce.number().nonnegative().default(0),
  currentTask: z.string().optional(),
  currentDays: z.string().optional(), //z.coerce.number().nonnegative().default(0),
  futureTask: z.string().optional(),
  futureDays: z.string().optional(), //z.coerce.number().nonnegative().default(0),
});



export const agriFormSchema = z.object({
  //基本情報
  name: z.string().min(1, '名前は必須です'),
  kana: z.string().min(1, '名前（カナ）は必須です').regex(/^[ァ-ヶー　]+$/, '全角カタカナで入力してください'),
  applicationDate: z.string().min(1, "必須"),
  mayor: z.string().min(1, "必須"),
  applicantAddress: z.string().min(1, "必須"),
  applicantName: z.string().min(1, "必須"),
  birthDate: z.string().min(1, "必須"),
  age: z.string().min(1, "必須"),      //ageの方をnumberにできない
  corpEstablishedDate: z.string().optional(),

//経歴
  jobdetails: z.string().optional(),
  companyname: z.string().optional(),
  companystartdate: z.string().optional(),
  companyenddate: z.string().optional(),
  companyAdress: z.string().optional(),
  retirementDate: z.string().optional(),
  qualification: z.string().max(255).optional(),
  skillAgricultural: z.string().max(255).optional(),

  //就業計画
  farmCity: z.string().min(1, "必須"),
  businessStartDate: z.string().min(1, "必須"),

  //農業の形態
  farmingType: z.enum(farmingTypeOptions).refine((val) => val !== undefined, {message: "就農形態を選択してください",}),
  inheritScope: z.enum(["all", "part"]).optional(),
  inheritPeriodYears: z.string().optional(), //numberの型にできない
  inheritPeriodMonths: z.string().optional(), //numberの型にできない

  targetFarmingType: z.string().min(1, "必須"),
  futurePlan: z.string().min(1, "SS必須"),
  
  //経営の構想
  incomeCurrent: z.string().optional(), //numberの型にできない
  incomeTarget: z.string().optional(), //numberの型にできない
  hoursCurrent: z.string().optional(), //numberの型にできない
  hoursTarget: z.string().optional(), //numberの型にできない

  //作物名、生産量など
  crops: z.array(CropRowSchema).min(1),
  //面積
  lands: z.array(LandRowSchema).min(1),
  //利用する機械
  machines: z.array(MachineRowSchema).optional(), //z.array(MachineRowSchema).optional().default([]),
  //経営の目標
  targetAgricultural: z.string().max(255).optional(),
  targetemployee: z.string().max(255).optional(),
  //目的達成のための措置
  measures: z.array(MeasureRowSchema).optional(),
  members: z.array(MemberRowSchema).optional(),

  employeemember: z.string().optional(),
});



// スキーマから型を生成する
export type agriFormValues = z.infer<typeof agriFormSchema>