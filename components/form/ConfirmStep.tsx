import { FormValues } from "@/components/schemas/contactFormSchema"; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ConfirmStepProps {
  data: FormValues;
  onBack: () => void;
  onFinalSubmit: () => void;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({ data, onBack, onFinalSubmit }) => {
  const hasCropsData = data.crops && data.crops.length > 0;
  const haslandData = data.lands && data.lands.length > 0;
  const hasrentalData = data.rentallands && data.rentallands.length > 0;
  const hasSpecialData = data.specialwork && data.specialwork.length > 0;
  const hasoutsourcingData = data.outsourcing && data.outsourcing.length > 0;
  const hasmachinesData = data.machines && data.machines.length > 0;
  const hasmeasuresData = data.measures && data.measures.length > 0;
  const hasmembersData = data.members && data.members.length > 0;

  return (
    <Card>
      <CardHeader><CardTitle>入力内容の確認</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        
        {/*  基本情報セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">基本情報</h2>
          <ConfirmItem label="名前" value={data.name} />
          <ConfirmItem label="生年月日" value={data.birthDate} />
          <ConfirmItem label="年齢" value={data.age} />
          <ConfirmItem label="申請日" value={data.applicationDate} />
          <ConfirmItem label="氏名（名称・代表者）" value={data.applicantName} />
          <ConfirmItem label="市長" value={data.mayor} />
          <ConfirmItem label="申請者住所" value={data.applicantAddress} />
          <ConfirmItem label="法人設立年月日（法人の場合のみ）" value={data.corpEstablishedDate || "未入力"} />
        </div>
      
        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 就業計画セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">就業計画</h2>
          <ConfirmItem label="就農地（市町村名）" value={data.farmCity} />
          <ConfirmItem label="農業経営開始日" value={data.businessStartDate} />
          <ConfirmItem label="就農形態" value={data.farmingType} />
          <ConfirmItem label="継承範囲" value={data.inheritScope} />
          <ConfirmItem label="従事期間（年）" value={data.inheritPeriodYears} />
          <ConfirmItem label="従事期間（月）" value={data.inheritPeriodMonths} />
          <ConfirmItem label="目標とする営農類型" value={data.targetFarmingType} />
          <ConfirmItem label="将来の農業経営の構想" value={data.futurePlan} />
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 経営の構想セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">経営の構想</h2>
          <ConfirmItem label="年間農業所得" value={data.incomeCurrent || "未入力"}  />
          <ConfirmItem label="年間労働時間" value={data.hoursCurrent || "未入力"} />
          <ConfirmItem label="年間農業所得" value={data.incomeTarget} />
          <ConfirmItem label="年間労働時間" value={data.hoursTarget} />
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 農業経営の規模に関する目標セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">農業経営の規模に関する目標（作目・部門）</h2>
          
          {hasCropsData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>作目・部門名</TableHead>
                  <TableHead>作付面積（現状/a）</TableHead>
                  <TableHead>生産量（現状/kg）</TableHead>
                  <TableHead>作付面積（目標/a）</TableHead>
                  <TableHead>生産量（目標/kg）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.crops!.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.name || "（未入力）"}</TableCell>
                    {/* 数値データは文字列化し、未入力の場合は「-」を表示 */}
                    <TableCell>{row.areaCurrent != null ? row.areaCurrent.toString() : "-"}</TableCell>
                    <TableCell>{row.productionCurrent != null ? row.productionCurrent.toString() : "-"}</TableCell>
                    <TableCell>{row.areaTarget != null ? row.areaTarget.toString() : "-"}</TableCell>
                    <TableCell>{row.productionTarget != null ? row.productionTarget.toString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">作目・部門の入力がありません。</p>
          )}
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 農地面積 */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">農地の面積（所有地/借入地）</h2>
          {/* 所有地 */}
          
          <p>所有地</p>

          {haslandData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>作付面積（現状/a）</TableHead>
                  <TableHead>生産量（現状/kg）</TableHead>
                  <TableHead>作付面積（目標/a）</TableHead>
                  <TableHead>生産量（目標/kg）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lands!.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.landType != null ? row.landType.toString() : "（未入力）"}</TableCell>
                    <TableCell>{row.location != null ? row.location.toString() : "-"}</TableCell>
                    <TableCell>{row.currentArea != null ? row.currentArea.toString() : "-"}</TableCell>
                    <TableCell>{row.targetArea != null ? row.targetArea.toString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">農地の面積（の入力がありません。</p>
          )}

          {/* 借入地 */}

          <p>借入地</p>

          {hasrentalData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>地目</TableHead>
                  <TableHead>所有地</TableHead>
                  <TableHead>現状（a）</TableHead>
                  <TableHead>目標（a）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rentallands!.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.landType != null ? row.landType.toString() : "（未入力）"}</TableCell>
                    <TableCell>{row.location != null ? row.location.toString() : "-"}</TableCell>
                    <TableCell>{row.currentArea != null ? row.currentArea.toString() : "-"}</TableCell>
                    <TableCell>{row.targetArea != null ? row.targetArea.toString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">農地の面積（の入力がありません。</p>
          )}

          {/* 特定作業委託 */}

          <p>特定作業委託</p>

          {hasSpecialData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>作物</TableHead>
                  <TableHead>作業</TableHead>
                  <TableHead>作業委託面積（現状）</TableHead>
                  <TableHead>生産量（現状）</TableHead>
                  <TableHead>作業委託面積（目標）</TableHead>
                  <TableHead>生産量（目標）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.specialwork!.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.crop || "（未入力）"}</TableCell>
                    <TableCell>{row.work != null ? row.work.toString() : "-"}</TableCell>
                    <TableCell>{row.currentland != null ? row.currentland.toString() : "-"}</TableCell>
                    <TableCell>{row.currentproduction != null ? row.currentproduction.toString() : "-"}</TableCell>
                    <TableCell>{row.targetland != null ? row.targetland.toString() : "-"}</TableCell>
                    <TableCell>{row.targetproduction != null ? row.targetproduction.toString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">農地の面積（の入力がありません。</p>
          )}

          <h2 className="text-xl font-bold">作業委託</h2>

          
          {hasoutsourcingData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>作目</TableHead>
                  <TableHead>作業</TableHead>
                  <TableHead>現状（a）</TableHead>
                  <TableHead>目標（a）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.outsourcing!.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.crop != null ? row.crop.toString() : "（未入力）"}</TableCell>
                    <TableCell>{row.work != null ? row.work.toString() : "-"}</TableCell>
                    <TableCell>{row.currentArea != null ? row.currentArea.toString() : "-"}</TableCell>
                    <TableCell>{row.targetArea != null ? row.targetArea.toString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">農地の面積（の入力がありません。</p>
          )}

          <ConfirmItem label="単純計（現在）" value={data.sumAreacurrent} />
          <ConfirmItem label="単純計（目標）" value={data.sumAreatarget} />
          <ConfirmItem label="換算後（現在）" value={data.kanzancurrent} />
          <ConfirmItem label="換算後（目標）" value={data.kanzantarget} />
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 利用する機械 */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">生産方式に関する目標（機械・施設）</h2>
          
          {hasmachinesData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>機械・施設名</TableHead>
                  <TableHead>現状（型式・台数）</TableHead>
                  <TableHead>目標（型式・台数）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.machines!.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.name || "（未入力）"}</TableCell>
                    <TableCell>
                      <div className="grid grid-cols-3 gap-2">
                        <div>{row.currentSpec != null ? row.currentSpec.toString() : "-"}</div>
                        <div>{row.currentUnits != null ? row.currentUnits.toString() : "-"}</div>
                      </div> 
                    </TableCell>

                    <TableCell>
                      <div className="grid grid-cols-3 gap-2">
                        <div>{row.targetSpec != null ? row.targetSpec.toString() : "-"}</div>
                        <div>{row.targetUnits != null ? row.targetUnits.toString() : "-"}</div>
                      </div> 
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">目標達成するために必要な措置（の入力がありません。</p>
          )}
        </div>


        <hr className="my-6 border-gray-300 dark:border-gray-700" />


        {/* 経営に関する目標セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">経営に関する目標</h2>
          <ConfirmItem label="将来の農業経営の構想" value={data.targetAgricultural} />
          <ConfirmItem label="農業従事の態様等に関する目標" value={data.targetemployee} />
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 目標達成のために必要な措置（事業） */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">目標を達成するために必要な措置（事業）</h2>
          
          {hasmeasuresData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>事業内容</TableHead>
                  <TableHead>規模・構造等（仕様）</TableHead>
                  <TableHead>実施時期</TableHead>
                  <TableHead>事業費（千円）</TableHead>
                  <TableHead>資金名等</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.measures!.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.title || "（未入力）"}</TableCell>
                    <TableCell>{row.spec != null ? row.spec.toString() : "-"}</TableCell>
                    <TableCell>{row.when != null ? row.when.toString() : "-"}</TableCell>
                    <TableCell>{row.cost != null ? row.cost.toString() : "-"}</TableCell>
                    <TableCell>{row.fund != null ? row.fund.toString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">目標を達成するために必要な措置（事業）（の入力がありません。</p>
          )}
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 農業経営の構成（事業） */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">農業経営の構成（家族・役員等）</h2>
          
          {hasmembersData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>氏名</TableHead>
                  <TableHead>続柄</TableHead>
                  <TableHead>年齢</TableHead>
                  <TableHead>担当業務（現状）</TableHead>
                  <TableHead>従事日数（現状）</TableHead>
                  <TableHead>担当業務（見通し）</TableHead>
                  <TableHead>従事日数（見通し）</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.members!.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.name || "（未入力）"}</TableCell>
                    <TableCell>{row.relationOrRole != null ? row.relationOrRole.toString() : "-"}</TableCell>
                    <TableCell>{row.age != null ? row.age.toString() : "-"}</TableCell>
                    <TableCell>{row.currentTask != null ? row.currentTask.toString() : "-"}</TableCell>
                    <TableCell>{row.currentDays != null ? row.currentDays.toString() : "-"}</TableCell>
                    <TableCell>{row.futureTask != null ? row.futureTask.toString() : "-"}</TableCell>
                    <TableCell>{row.futureTask != null ? row.futureTask.toString() : "-"}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">目標を達成するために必要な措置（事業）（の入力がありません。</p>
          )}
          <p className="font-bold text-xl" >常時雇（年間） </p>
          <ConfirmItem label="実人数(現状)" value={data.currentmember} />
          <ConfirmItem label="実人数(見通し)" value={data.targetemployee} />
          <p className="font-bold text-xl" >臨時雇（年間） </p>
          <ConfirmItem label="実人数(現状)" value={data.emergencycurrentmember} />
          <ConfirmItem label="実人数(見通し)" value={data.emergencytargetmember} />
          <p className="font-bold text-xl" >延べ人数（合計） </p>
          <ConfirmItem label="実人数(現状)" value={data.sumcurrentmember} />
          <ConfirmItem label="実人数(見通し)" value={data.sumtargetmember} />
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 経歴セクション */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">経歴</h2>
          <ConfirmItem label="職務内容" value={data.jobdetails} />
          <ConfirmItem label="勤務機関名" value={data.companyname} />
          <ConfirmItem label="勤務機関住所" value={data.companyAdress} />
          <ConfirmItem label="勤務期間開始日" value={data.companystartdate} />
          <ConfirmItem label="勤務期間終了日" value={data.companyenddate} />
          <ConfirmItem label="退職年月日" value={data.retirementDate} />
          <ConfirmItem label="資格" value={data.qualification || "未入力"} />
          <ConfirmItem label="農業経営に活用できる知識および技能の内容" value={data.skillAgricultural || "未入力"} />
        </div>
        
        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* 技術知識の習得状況 */}
        <div className="space-y-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold">技術知識の習得状況</h2>
          <ConfirmItem label="研修先等の名称" value={data.trainingname || "未入力"} />
          <ConfirmItem label="所在地" value={data.trainingAdress || "未入力"} />
          <ConfirmItem label="専攻・営農部門" value={data.trainingSection || "未入力"} />
          <ConfirmItem label="研修等期間開始日" value={data.trainingStartDate || "未入力"} />
          <ConfirmItem label="研修等期間終了日" value={data.trainingEndDate || "未入力"} />
          <ConfirmItem label="研修内容等" value={data.trainingContent || "未入力"} />
          <ConfirmItem label="活用した補助金等" value={data.trainingAssist || "未入力"} />
        </div>


        {/* ボタンセクション */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            ← 入力内容を修正する
          </Button>
          <Button type="button" onClick={onFinalSubmit}>
            この内容で送信する
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// 確認画面での表示を簡潔にするヘルパーコンポーネント
const ConfirmItem: React.FC<{ label: string, value: string | undefined }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    <p className="text-base font-semibold ">{value}</p>
  </div>
);