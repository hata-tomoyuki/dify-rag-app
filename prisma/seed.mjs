import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL が設定されていません（.env を確認してください）");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.case.deleteMany({});

    const cases = [
      {
        title: "士業事務所サイト：信頼性重視のコーポレート刷新",
        clientName: "佐藤法律事務所",
        industry: "PROFESSIONAL",
        companySize: "1-10",
        budgetMin: 400000,
        budgetMax: 700000,
        goals: ["信頼感の向上", "問い合わせ獲得"],
        challenges: ["デザインが古い", "スマホで読みにくい"],
        proposal: ["情報設計の整理", "実績・強みの見せ方改善", "スマホ最適化"],
        stack: ["Next.js"],
        durationWeeks: 4,
        deliverables: ["コーポレートサイト", "問い合わせフォーム"],
        result: "問い合わせ件数が40%増加",
        lessonsLearned: ["士業は実績の見せ方がCVに直結→構成設計が重要"]
      },
      {
        title: "製造業：採用LP制作＋エントリー導線改善",
        clientName: "東日本サービス",
        industry: "MANUFACTURING",
        companySize: "51-200",
        budgetMin: 500000,
        budgetMax: 900000,
        goals: ["採用応募数増加"],
        challenges: ["応募が集まらない", "仕事内容が伝わらない"],
        proposal: ["職種別LP作成", "社員インタビュー掲載", "応募フォーム簡略化"],
        stack: ["Next.js"],
        durationWeeks: 6,
        deliverables: ["採用LP", "応募フォーム"],
        result: "応募件数が60%増加",
        lessonsLearned: ["現場写真・声の準備が遅れがち→早期依頼必須"]
      },
      {
        title: "スタートアップ：MVP用LP＋事前登録導線",
        clientName: "FutureWorks",
        industry: "STARTUP",
        companySize: "1-10",
        budgetMin: 300000,
        budgetMax: 600000,
        goals: ["サービス検証", "事前登録獲得"],
        challenges: ["要件が固まっていない"],
        proposal: ["仮説ベースLP", "最小構成で検証", "A/Bテスト前提設計"],
        stack: ["Next.js", "Vercel"],
        durationWeeks: 3,
        deliverables: ["LP", "登録フォーム"],
        result: "事前登録数180件を獲得",
        lessonsLearned: ["完璧を目指さず検証速度を優先"]
      },
      {
        title: "教育サービス：教材PDFのWeb化＋検索機能",
        clientName: "ミライ教育",
        industry: "EDUCATION",
        companySize: "11-30",
        budgetMin: 600000,
        budgetMax: 1000000,
        goals: ["教材の利便性向上"],
        challenges: ["PDFが探しにくい"],
        proposal: ["教材構造化", "全文検索導入", "章単位ナビゲーション"],
        stack: ["Next.js", "MDX"],
        durationWeeks: 7,
        deliverables: ["教材Web", "検索機能"],
        result: "平均読了時間が35%向上",
        lessonsLearned: ["PDF構造が崩れていると移行コスト増"]
      },
      {
        title: "BtoB SaaS：管理画面UI改善プロジェクト",
        clientName: "NorthWind",
        industry: "SAAS",
        companySize: "31-50",
        budgetMin: 700000,
        budgetMax: 1200000,
        goals: ["操作ミス削減"],
        challenges: ["画面が複雑", "問い合わせが多い"],
        proposal: ["UI整理", "ラベル・文言改善", "操作ガイド追加"],
        stack: ["React", "Next.js"],
        durationWeeks: 8,
        deliverables: ["管理画面UI", "操作ガイド"],
        result: "サポートチケットが25%削減",
        lessonsLearned: ["文言改善だけでも効果が出る"]
      },
      {
        title: "観光業：多言語対応LP制作",
        clientName: "BlueOcean",
        industry: "TOURISM",
        companySize: "11-30",
        budgetMin: 500000,
        budgetMax: 900000,
        goals: ["訪日客対応"],
        challenges: ["日本語のみ", "情報が不足"],
        proposal: ["英語LP制作", "翻訳フロー整備"],
        stack: ["Next.js", "i18n"],
        durationWeeks: 6,
        deliverables: ["多言語LP"],
        result: "海外からのアクセスが80%増加",
        lessonsLearned: ["翻訳精度より更新フローが重要"]
      },
      {
        title: "社内DX：業務マニュアルRAG化",
        clientName: "株式会社ライト",
        industry: "CORPORATE",
        companySize: "51-200",
        budgetMin: 900000,
        budgetMax: 1500000,
        goals: ["問い合わせ削減", "属人化解消"],
        challenges: ["マニュアルが読まれない"],
        proposal: ["ドキュメント整理", "検索/RAG導入"],
        stack: ["Next.js", "Dify"],
        durationWeeks: 9,
        deliverables: ["ナレッジBot", "マニュアル整理"],
        result: "社内問い合わせが45%削減",
        lessonsLearned: ["ナレッジ更新ルールが成否を分ける"]
      },
      {
        title: "EC：商品検索UX改善",
        clientName: "オレンジ電機",
        industry: "ECOMMERCE",
        companySize: "31-50",
        budgetMin: 600000,
        budgetMax: 1000000,
        goals: ["検索離脱率改善"],
        challenges: ["検索結果が使いづらい"],
        proposal: ["絞り込みUI改善", "検索速度向上"],
        stack: ["Next.js"],
        durationWeeks: 5,
        deliverables: ["検索UI"],
        result: "検索離脱率が22%改善",
        lessonsLearned: ["選択肢が多すぎると逆効果"]
      },
      {
        title: "社内ポータル：情報集約サイト構築",
        clientName: "中央企画",
        industry: "CORPORATE",
        companySize: "51-200",
        budgetMin: 500000,
        budgetMax: 800000,
        goals: ["情報探し時間削減"],
        challenges: ["情報が散在"],
        proposal: ["ポータル設計", "カテゴリ整理"],
        stack: ["Next.js"],
        durationWeeks: 6,
        deliverables: ["社内ポータル"],
        result: "情報検索時間が30%短縮",
        lessonsLearned: ["分類設計を最初に詰める"]
      },
      {
        title: "AI PoC：FAQ自動応答Bot検証",
        clientName: "株式会社Horizon",
        industry: "SAAS",
        companySize: "11-30",
        budgetMin: 400000,
        budgetMax: 700000,
        goals: ["AI活用検証"],
        challenges: ["FAQ整備不足"],
        proposal: ["FAQ整理", "RAG PoC構築"],
        stack: ["Next.js", "Dify"],
        durationWeeks: 4,
        deliverables: ["PoC Bot"],
        result: "PoCが成功し、本番導入を決定",
        lessonsLearned: ["FAQの質が回答精度を左右"]
      }
    ];



    await prisma.case.createMany({ data: cases });

    console.log(`✅ 案件データ ${cases.length} 件を投入しました`);
  }


main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });


