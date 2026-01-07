export const runtime = "nodejs";

import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    // === (0) フォルダ・パス定義 ===
    const templatePath = path.join(process.cwd(), "public", "excel", "syuunoukeikaku.xlsx");
    const userExcelDir = path.join(process.cwd(), "excel_user");

    // 保存先フォルダが無い場合は作成（再帰的作成を有効化）
    if (!fs.existsSync(userExcelDir)) {
      fs.mkdirSync(userExcelDir, { recursive: true });
    }

    // === (1) リクエスト JSON取得 ===
    const body = await req.json();
    const {
      userId = "guest",
      mayor, // 5
      applicationDate, // 4
      applicantAddress, // 6
      applicantName, // 8
      birthDate, // 9
      age, // 9
      corpEstablishedDate, // 10
      farmCity, // 18
      businessStartDate, // 18
      inheritPeriodYears, // 26
      inheritPeriodMonths, // 26
      targetFarmingType, // 27
      futurePlan, // 30
      incomeCurrent, // 36
      incomeTarget, // 36
      hoursCurrent, // 37
      hoursTarget, // 37
      sumAreaCurrent, //47
      sumProductionCurrent, //47
      sumAreaTarget, //47
      sumProductionTarget, //47
      sumAreacurrent, //66
      sumAreatarget, //66
      kanzancurrent, //68
      kanzantarget, //68
      targetAgricultural, //90
      targetemployee, //94
      currentmember, //132
      targetmember, //132
      emergencycurrentmember, //133
      emergencytargetmember, //133
      sumcurrentmember, //134
      sumtargetmember, //134
      jobdetails, // 140
      companyname, //142
      companystartdate, //144
      companyenddate, //144
      companyAdress, //147
      retirementDate, //149
      qualification, //151
      skillAgricultural, //153
      trainingname, //161
      trainingAdress, //161
      trainingSection, //161
      trainingStartDate, //164
      trainingEndDate, //164
      trainingContent, //167
      trainingAssist, //171
      crops = [],
      lands = [],
      rentallands = [],
      machines = [],
    } = body;

    // === (2) テンプレート読み込みチェック ===
    if (!fs.existsSync(templatePath)) {
      console.error("Template not found at:", templatePath);
      return Response.json({ error: "テンプレートファイルが見つかりません。" }, { status: 500 });
    }

    // === (3) ExcelJSでテンプレートをロード ===
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1); // 最初のシート

    // 日付フォーマット関数
    const formatJP = (date) => (date ? new Date(date).toLocaleDateString("ja-JP") : "");

    // === (4) 基本情報の入力 (書式を維持) ===
    worksheet.getCell("A5").value = mayor ? `${mayor}　殿` : "";

    const applicationDateObj = new Date(applicationDate);
    const year_app = applicationDateObj.getFullYear().toString();
    const month_app = (applicationDateObj.getMonth() + 1).toString().padStart(2, " "); // 1桁なら左スペース
    const day_app = applicationDateObj.getDate().toString().padStart(2, " "); 

    const applicationDateString = `${year_app}年 ${month_app}月 ${day_app}日`;

    worksheet.getCell("AB4").value = applicationDateString;
    
    worksheet.getCell("W7").value = applicantAddress || "";
    
    worksheet.getCell("AA8").value = applicantName ? ` ${applicantName}` : "";
    
    const birthDateObj = new Date(birthDate); // birthDateは "2025-12-17" などの文字列
    const year = birthDateObj.getFullYear().toString();
    const month = (birthDateObj.getMonth() + 1).toString().padStart(2, " "); // 1桁なら左スペース
    const day = birthDateObj.getDate().toString().padStart(2, " ");         // 1桁なら左スペース

    // 年齢 (age) も1桁や2桁に対応できるよう整形
    const formattedAge = age.toString().padStart(3, " "); // 3桁分確保

    // X9セル（またはCSV構造に基づいた該当セル）に流し込む文字列を作成  
    // テンプレートの見た目に合わせてスペースを調整してください
    const birthDateString = `${year}年 ${month}月 ${day}日生（${formattedAge}歳）`;

    // セルへの書き込み
    worksheet.getCell("X9").value = birthDateString;
    
    if (corpEstablishedDate) {
  const corpEstablishedDateObj = new Date(corpEstablishedDate);
  const year_cor = corpEstablishedDateObj.getFullYear().toString();
  const month_cor = (corpEstablishedDateObj.getMonth() + 1).toString().padStart(2, " ");
  const day_cor = corpEstablishedDateObj.getDate().toString().padStart(2, " ");

  const corpEstablishedDateString = `${year_cor}年 ${month_cor}月 ${day_cor}日`;

  worksheet.getCell("V10").value =
    `＜法人設立年月日　${corpEstablishedDateString}設立＞`;
    } else {
      worksheet.getCell("V10").value = "＜法人設立年月日　　　年　　月　　日設立＞";
    }
    
    const phoneNumber = body.phoneNumber || ""; 
    worksheet.getCell("V11").value = `＜申請者電話番号　${phoneNumber.padEnd(15, " ")}＞`;

    worksheet.getCell("K18").value = farmCity || "";

    const businessStartDateObj = new Date(businessStartDate);
    const year_biz = businessStartDateObj.getFullYear().toString();
    const month_biz = (businessStartDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_biz = businessStartDateObj.getDate().toString().padStart(2, " ");

    const businessStartDateString = `${year_biz}年 ${month_biz}月 ${day_biz}日`;

    worksheet.getCell("AH18").value = businessStartDateString;

    const farmingType = body.farmingType;
    const check1 = farmingType === "新たに農業経営を開始" ? "☑" : "□";
    const check2 = farmingType === "親の経営とは別に新部門" ? "☑" : "□";
    const check3 = farmingType === "親の農業経営を継承" ? "☑" : "□";

    worksheet.getCell("K21").value = `${check1} 新たに農業経営を開始`;
    worksheet.getCell("K22").value =
      `${check2} 親（三親等以内の親族を含む。以下同じ。）の農業経営とは別に\n   新たな部門を開始`;
    worksheet.getCell("K22").alignment = { wrapText: true, vertical: "top" };
    worksheet.getCell("K24").value = `${check3} 親の農業経営を継承`;

    if (farmingType === "親の農業経営を継承") {
      const scope = body.inheritScope;
      worksheet.getCell("K25").value =
        `     　 ${scope === "全体" ? "☑" : "□"} 全体　` +
        `${scope === "一部" ? "☑" : "□"} 一部`;
    } else {
      worksheet.getCell("K25").value = "     　 □ 全体　□ 一部";
    }


    worksheet.getCell("K26").value =  `        　 継承する経営での従事期間　　　${inheritPeriodYears}年 ${inheritPeriodMonths}か月`;
    
    worksheet.getCell("K27").value = targetFarmingType || "";

    worksheet.getCell("K30").value = futurePlan || "";

    worksheet.getCell("T36").value = `${incomeCurrent}千円`;

    worksheet.getCell("AF36").value = `${incomeTarget}千円`;

    worksheet.getCell("T37").value = `${hoursCurrent}時間`;

    worksheet.getCell("AF37").value = `${hoursTarget}時間`;

    worksheet.getCell("K47").value = sumAreaCurrent || "";
    
    worksheet.getCell("S47").value = sumProductionCurrent || "";
    
    worksheet.getCell("AA47").value = sumAreaTarget || "";
    
    worksheet.getCell("AI47").value = sumProductionTarget || "";

    worksheet.getCell("W66").value = sumAreacurrent || "";

    worksheet.getCell("AG66").value = sumAreatarget || "";
    
    worksheet.getCell("W68").value = kanzancurrent || "";
    
    worksheet.getCell("AG68").value = kanzantarget || "";

    worksheet.getCell("K90").value = targetAgricultural || "";

    worksheet.getCell("K94").value = targetemployee || "";

    worksheet.getCell("Y132").value = currentmember || "";

    worksheet.getCell("AJ132").value = targetmember || "";
    
    worksheet.getCell("Y133").value = emergencycurrentmember || "";
    
    worksheet.getCell("AJ133").value = emergencytargetmember || "";
    
    worksheet.getCell("Y134").value = sumcurrentmember || "";
    
    worksheet.getCell("AJ134").value = sumtargetmember || "";

    worksheet.getCell("I140").value = jobdetails || "";

    worksheet.getCell("I142").value = companyname || "";

    const companyStartDateObj = new Date(companystartdate);
    const year_com_sta = companyStartDateObj.getFullYear().toString();
    const month_com_sta = (companyStartDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_com_sta = companyStartDateObj.getDate().toString().padStart(2, " ");

    const companyStartDateString = `${year_com_sta}年 ${month_com_sta}月 ${day_com_sta}日`;

    const companyEndDateObj = new Date(companyenddate);
    const year_com_end = companyEndDateObj.getFullYear().toString();
    const month_com_end = (companyEndDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_com_end = companyEndDateObj.getDate().toString().padStart(2, " ");

    const companyEndDateString = `${year_com_end}年 ${month_com_end}月 ${day_com_end}日`;

    worksheet.getCell("I144").value =  `   ${companyStartDateString} ～ ${companyEndDateString}`;

    worksheet.getCell("I147").value = companyAdress || "";

    const retirementDateObj = new Date(retirementDate);
    const year_ret = retirementDateObj.getFullYear().toString();
    const month_ret = (retirementDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_ret = retirementDateObj.getDate().toString().padStart(2, " ");

    const retirementDateObjString = `${year_ret}年 ${month_ret}月 ${day_ret}日`;

    worksheet.getCell("I149").value = retirementDateObjString;

    worksheet.getCell("I151").value = qualification || "";

    worksheet.getCell("I153").value = skillAgricultural || "";

    worksheet.getCell("C161").value = trainingname || "";

    worksheet.getCell("Q161").value = trainingAdress || "";

    worksheet.getCell("AE161").value = trainingSection || "";

    const trainingStartDateObj = new Date(trainingStartDate);
    const year_train_sta = trainingStartDateObj.getFullYear().toString();
    const month_train_sta = (trainingStartDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_train_sta = trainingStartDateObj.getDate().toString().padStart(2, " ");

    const trainingStartDateString = `${year_train_sta}年 ${month_train_sta}月 ${day_train_sta}日`;

    const trainingEndDateObj = new Date(trainingEndDate);
    const year_train_end = trainingEndDateObj.getFullYear().toString();
    const month_train_end = (trainingEndDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_train_end = trainingEndDateObj.getDate().toString().padStart(2, " ");

    const trainingEndDateString = `${year_train_end}年 ${month_train_end}月 ${day_train_end}日`;

    worksheet.getCell("Q164").value =  `   ${trainingStartDateString} ～ ${trainingEndDateString}`;

    worksheet.getCell("I167").value = trainingContent || "";

    worksheet.getCell("I171").value = trainingAssist || "";



  


    // === (5) 繰り返し項目の入力 ===

    // 作目 (Row 41〜)
    const CROPS_START_ROW = 41;
    crops.forEach((c, i) => {
      const r = CROPS_START_ROW + i;
      worksheet.getCell(`C${r}`).value = c.name || "";
      worksheet.getCell(`K${r}`).value = c.areaCurrent ? Number(c.areaCurrent) : null;
      worksheet.getCell(`S${r}`).value = c.productionCurrent ? Number(c.productionCurrent) : null;
      worksheet.getCell(`AA${r}`).value = c.areaTarget ? Number(c.areaTarget) : null;
      worksheet.getCell(`AI${r}`).value = c.productionTarget ? Number(c.productionTarget) : null;
    });

    // 農地 (Row 51〜)
    const LANDS_START_ROW = 51;
    lands.forEach((l, i) => {
      const r = LANDS_START_ROW + i;
      worksheet.getCell(`I${r}`).value = l.landType || ""; // I列: (必要に応じて調整)
      worksheet.getCell(`O${r}`).value = l.location || "";  // O列: 所在
      worksheet.getCell(`W${r}`).value = l.currentArea ? Number(l.currentArea) : null;
      worksheet.getCell(`AG${r}`).value = l.targetArea ? Number(l.targetArea) : null;
    });

    const RENTLANDS_START_ROW = 56;
    rentallands.forEach((l, i) => {
      const r = RENTLANDS_START_ROW + i;
      worksheet.getCell(`I${r}`).value = l.landType || ""; // I列: (必要に応じて調整)
      worksheet.getCell(`O${r}`).value = l.location || "";  // O列: 所在
      worksheet.getCell(`W${r}`).value = l.currentArea ? Number(l.currentArea) : null;
      worksheet.getCell(`AG${r}`).value = l.targetArea ? Number(l.targetArea) : null;
    });

    // 機械・施設 (Row 77〜)
    const MACHINES_START_ROW = 77;
    machines.forEach((m, i) => {
      const r = MACHINES_START_ROW + i;
      worksheet.getCell(`C${r}`).value = m.name || "";
      worksheet.getCell(`O${r}`).value = m.currentSpec + "　・　" + m.currentUnits || "";
      //worksheet.getCell(`E${r}`).value = m.currentUnits ? Number(m.currentUnits) : null;
      worksheet.getCell(`AC${r}`).value = m.targetSpec + "　・　" + m.targetUnits || "";
      //worksheet.getCell(`I${r}`).value = m.targetUnits ? Number(m.targetUnits) : null;
    });

    // === (6) 別名で保存 ===
    const timestamp = Date.now();
    const fileName = `keikaku_${userId}_${timestamp}.xlsx`;
    const userExcelPath = path.join(userExcelDir, fileName);

    await workbook.xlsx.writeFile(userExcelPath);

    // フロントエンドに結果を返す
    return Response.json({
      success: true,
      message: "Excelファイルが正常に生成されました。",
      fileUrl: `/excel_user/${fileName}`, // 静的ファイルとしてアクセス可能な場合
      fileName: fileName
    });

  } catch (err) {
    console.error("Excel Generation Error:", err);
    return Response.json(
      { error: "Excel生成中に予期せぬエラーが発生しました。", details: err.message },
      { status: 500 }
    );
  }
}