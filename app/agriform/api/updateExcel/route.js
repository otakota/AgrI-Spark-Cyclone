export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";


export async function POST(req) {
  try {
    // === (A) 認証：userId は必ずセッションから ===
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    // === (B) テンプレートパス ===
    const templatePath = path.join(
      process.cwd(),
      "public",
      "excel",
      "syuunoukeikaku.xlsx"
    );

    // テンプレート存在チェック（最低限）
    if (!fs.existsSync(templatePath)) {
      console.error("Template not found at:", templatePath);
      return Response.json(
        { error: "テンプレートファイルが見つかりません。", templatePath },
        { status: 500 }
      );
    }

    // === (C) JSON受け取り ===
    const body = await req.json();

    // bodyの中身はそのまま使ってOK（userIdは使わない）
    const {
      mayor,
      applicationDate,
      applicantAddress,
      applicantName,
      birthDate,
      age,
      phoneNumber,
      corpEstablishedDate,
      farmCity,
      businessStartDate,
      inheritPeriodYears,
      inheritPeriodMonths,
      targetFarmingType,
      futurePlan,
      incomeCurrent,
      incomeTarget,
      hoursCurrent,
      hoursTarget,
      sumAreaCurrent,
      sumProductionCurrent,
      sumAreaTarget,
      sumProductionTarget,
      sumAreacurrent,
      sumAreatarget,
      kanzancurrent,
      kanzantarget,
      targetAgricultural,
      targetemployee,
      currentmember,
      targetmember,
      emergencycurrentmember,
      emergencytargetmember,
      sumcurrentmember,
      sumtargetmember,
      jobdetails,
      companyname,
      companystartdate,
      companyenddate,
      companyAdress,
      retirementDate,
      qualification,
      skillAgricultural,
      trainingname,
      trainingAdress,
      trainingSection,
      trainingStartDate,
      trainingEndDate,
      trainingContent,
      trainingAssist,
      crops = [],
      lands = [],
      rentallands = [],
      machines = [],
      farmingType,
      inheritScope,
    } = body;

    // === (D) ExcelJSでテンプレート読み込み ===
    const { Workbook } = await import("exceljs");
    const workbook = new Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);

    // === (E) ここから先は「既存のセル埋め処理」をそのまま ===
    worksheet.getCell("A5").value = mayor ? `${mayor}　殿` : "";

    const applicationDateObj = new Date(applicationDate);
    const year_app = applicationDateObj.getFullYear().toString();
    const month_app = (applicationDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_app = applicationDateObj.getDate().toString().padStart(2, " ");
    worksheet.getCell("AB4").value = `${year_app}年 ${month_app}月 ${day_app}日`;

    worksheet.getCell("W7").value = applicantAddress || "";
    worksheet.getCell("AA8").value = applicantName ? ` ${applicantName}` : "";

    const birthDateObj = new Date(birthDate);
    const year = birthDateObj.getFullYear().toString();
    const month = (birthDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day = birthDateObj.getDate().toString().padStart(2, " ");
    const formattedAge = (age ?? "").toString().padStart(3, " ");
    worksheet.getCell("X9").value = `${year}年 ${month}月 ${day}日生（${formattedAge}歳）`;

    if (corpEstablishedDate) {
      const d = new Date(corpEstablishedDate);
      const y = d.getFullYear().toString();
      const m = (d.getMonth() + 1).toString().padStart(2, " ");
      const dd = d.getDate().toString().padStart(2, " ");
      worksheet.getCell("V10").value = `＜法人設立年月日　${y}年 ${m}月 ${dd}日設立＞`;
    } else {
      worksheet.getCell("V10").value = "＜法人設立年月日　　　年　　月　　日設立＞";
    }

    worksheet.getCell("V11").value = `＜申請者電話番号　${(phoneNumber || "").padEnd(15, " ")}＞`;

    worksheet.getCell("K18").value = farmCity || "";

    const businessStartDateObj = new Date(businessStartDate);
    const year_biz = businessStartDateObj.getFullYear().toString();
    const month_biz = (businessStartDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_biz = businessStartDateObj.getDate().toString().padStart(2, " ");
    worksheet.getCell("AH18").value = `${year_biz}年 ${month_biz}月 ${day_biz}日`;

    const check1 = farmingType === "新たに農業経営を開始" ? "☑" : "□";
    const check2 = farmingType === "親の経営とは別に新部門" ? "☑" : "□";
    const check3 = farmingType === "親の農業経営を継承" ? "☑" : "□";
    worksheet.getCell("K21").value = `${check1} 新たに農業経営を開始`;
    worksheet.getCell("K22").value =
      `${check2} 親（三親等以内の親族を含む。以下同じ。）の農業経営とは別に\n   新たな部門を開始`;
    worksheet.getCell("K22").alignment = { wrapText: true, vertical: "top" };
    worksheet.getCell("K24").value = `${check3} 親の農業経営を継承`;

    if (farmingType === "親の農業経営を継承") {
      worksheet.getCell("K25").value =
        `     　 ${inheritScope === "全体" ? "☑" : "□"} 全体　` +
        `${inheritScope === "一部" ? "☑" : "□"} 一部`;
    } else {
      worksheet.getCell("K25").value = "     　 □ 全体　□ 一部";
    }

    worksheet.getCell("K26").value =
      `        　 継承する経営での従事期間　　　${inheritPeriodYears}年 ${inheritPeriodMonths}か月`;

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

    worksheet.getCell("I144").value = `   ${companyStartDateString} ～ ${companyEndDateString}`;
    worksheet.getCell("I147").value = companyAdress || "";

    const retirementDateObj = new Date(retirementDate);
    const year_ret = retirementDateObj.getFullYear().toString();
    const month_ret = (retirementDateObj.getMonth() + 1).toString().padStart(2, " ");
    const day_ret = retirementDateObj.getDate().toString().padStart(2, " ");
    worksheet.getCell("I149").value = `${year_ret}年 ${month_ret}月 ${day_ret}日`;

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

    worksheet.getCell("Q164").value = `   ${trainingStartDateString} ～ ${trainingEndDateString}`;
    worksheet.getCell("I167").value = trainingContent || "";
    worksheet.getCell("I171").value = trainingAssist || "";

    // === (5) 繰り返し項目 ===
    const CROPS_START_ROW = 41;
    crops.forEach((c, i) => {
      const r = CROPS_START_ROW + i;
      worksheet.getCell(`C${r}`).value = c.name || "";
      worksheet.getCell(`K${r}`).value = c.areaCurrent ? Number(c.areaCurrent) : null;
      worksheet.getCell(`S${r}`).value = c.productionCurrent ? Number(c.productionCurrent) : null;
      worksheet.getCell(`AA${r}`).value = c.areaTarget ? Number(c.areaTarget) : null;
      worksheet.getCell(`AI${r}`).value = c.productionTarget ? Number(c.productionTarget) : null;
    });

    const LANDS_START_ROW = 51;
    lands.forEach((l, i) => {
      const r = LANDS_START_ROW + i;
      worksheet.getCell(`I${r}`).value = l.landType || "";
      worksheet.getCell(`O${r}`).value = l.location || "";
      worksheet.getCell(`W${r}`).value = l.currentArea ? Number(l.currentArea) : null;
      worksheet.getCell(`AG${r}`).value = l.targetArea ? Number(l.targetArea) : null;
    });

    const RENTLANDS_START_ROW = 54;
    rentallands.forEach((l, i) => {
      const r = RENTLANDS_START_ROW + i;
      worksheet.getCell(`I${r}`).value = l.landType || "";
      worksheet.getCell(`O${r}`).value = l.location || "";
      worksheet.getCell(`W${r}`).value = l.currentArea ? Number(l.currentArea) : null;
      worksheet.getCell(`AG${r}`).value = l.targetArea ? Number(l.targetArea) : null;
    });

    const MACHINES_START_ROW = 77;
    machines.forEach((m, i) => {
      const r = MACHINES_START_ROW + i;
      worksheet.getCell(`C${r}`).value = m.name || "";
      worksheet.getCell(`O${r}`).value = (m.currentSpec ?? "") + "　・　" + (m.currentUnits ?? "");
      worksheet.getCell(`AC${r}`).value = (m.targetSpec ?? "") + "　・　" + (m.targetUnits ?? "");
    });

    // === (F) ここが本題：Supabase Storageに保存（ローカル保存なし） ===
    const timestamp = Date.now();
    const fileName = `keikaku_${timestamp}.xlsx`;

    const xlsxBuffer = Buffer.from(await workbook.xlsx.writeBuffer());

    const objectPath = `files/${userId}/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from("documents")
      .upload(objectPath, xlsxBuffer, {
        upsert: true,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return Response.json(
        { error: "Supabase upload failed", details: error.message },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Excelファイルが正常に生成され、Storageに保存されました。",
      path: data.path, // files/<userId>/keikaku_....xlsx
      fileName,
    });
  } catch (err) {
    console.error("Excel Generation Error:", err);
    return Response.json(
      { error: "Excel生成中に予期せぬエラーが発生しました。", details: err?.message },
      { status: 500 }
    );
  }
}
