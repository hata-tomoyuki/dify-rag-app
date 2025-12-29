import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL が設定されていません（.env を確認してください）");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 既存データを削除
    await prisma.case.deleteMany({});
    await prisma.user.deleteMany({});

    const cases = [
      {
        title: "士業事務所サイト：信頼性重視のコーポレート刷新",
        clientName: "佐藤法律事務所",
        industry: "士業",
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
        industry: "製造業",
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
        industry: "スタートアップ",
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
        industry: "教育",
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
        industry: "SaaS",
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
        industry: "観光業",
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
        industry: "企業・社内",
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
        industry: "EC・小売",
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
        industry: "企業・社内",
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
        industry: "SaaS",
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
      },
      {
        title: "医療クリニック：予約導線改善＋来院数増加",
        clientName: "みどり内科クリニック",
        industry: "医療",
        companySize: "11-30",
        budgetMin: 450000,
        budgetMax: 850000,
        goals: ["予約完了率向上", "来院数増加"],
        challenges: ["予約フォームが複雑", "スマホで操作しづらい"],
        proposal: ["予約導線の短縮", "フォーム項目の最適化", "診療科別のLP整備"],
        stack: ["Next.js", "Google Analytics"],
        durationWeeks: 5,
        deliverables: ["予約導線改善", "診療科LP", "計測設計"],
        result: "予約完了率が18%改善、来院数が12%増加",
        lessonsLearned: ["医療系は表現規制があるため、原稿チェックフローを先に決める"]
      },
      {
        title: "不動産：物件検索UX改善＋問い合わせ増",
        clientName: "グッドホーム不動産",
        industry: "不動産",
        companySize: "31-50",
        budgetMin: 800000,
        budgetMax: 1400000,
        goals: ["問い合わせ増加", "検索離脱率改善"],
        challenges: ["検索条件が分かりづらい", "一覧→詳細の遷移が遅い"],
        proposal: ["検索UI再設計", "絞り込みの段階表示", "SSR/キャッシュ最適化"],
        stack: ["Next.js", "PostgreSQL"],
        durationWeeks: 8,
        deliverables: ["検索UI", "一覧/詳細改善", "運用ガイド"],
        result: "問い合わせが20%増加、検索離脱率が15%改善",
        lessonsLearned: ["条件設計は営業/接客の実態をヒアリングしてから決める"]
      },
      {
        title: "飲食チェーン：店舗LP統一＋メニュー更新運用改善",
        clientName: "SORA DINING",
        industry: "飲食",
        companySize: "51-200",
        budgetMin: 600000,
        budgetMax: 1000000,
        goals: ["店舗情報の統一", "更新工数削減"],
        challenges: ["店舗ごとに情報がバラバラ", "メニュー更新が属人化"],
        proposal: ["店舗LPテンプレ化", "CMS運用ルール整備", "更新権限の分離"],
        stack: ["Next.js", "MDX"],
        durationWeeks: 6,
        deliverables: ["店舗LPテンプレ", "メニュー更新フロー", "運用マニュアル"],
        result: "更新作業時間が月10時間削減",
        lessonsLearned: ["運用担当者のスキルに合わせて入力UIを設計する"]
      },
      {
        title: "金融：資料請求フォーム最適化＋CVR改善",
        clientName: "K-フィナンシャル",
        industry: "金融",
        companySize: "51-200",
        budgetMin: 700000,
        budgetMax: 1200000,
        goals: ["CVR改善", "入力離脱率改善"],
        challenges: ["入力項目が多い", "エラー表示が分かりづらい"],
        proposal: ["フォーム分割（ステップ化）", "入力補助の強化", "検証用イベント設計"],
        stack: ["Next.js", "Google Tag Manager"],
        durationWeeks: 5,
        deliverables: ["フォーム改修", "計測設計", "改善レポート"],
        result: "資料請求CVRが14%改善",
        lessonsLearned: ["法務/審査レビューのリードタイムを織り込んで計画する"]
      },
      {
        title: "物流：問い合わせ一次対応の自動化PoC",
        clientName: "北関東ロジスティクス",
        industry: "物流",
        companySize: "201-500",
        budgetMin: 900000,
        budgetMax: 1700000,
        goals: ["問い合わせ削減", "一次回答の迅速化"],
        challenges: ["回答が担当者依存", "問い合わせ分類ができていない"],
        proposal: ["問い合わせカテゴリ整理", "回答テンプレ整備", "簡易BotのPoC構築"],
        stack: ["Next.js", "OpenAI"],
        durationWeeks: 7,
        deliverables: ["分類設計", "テンプレ回答", "PoC UI"],
        result: "一次回答までの平均時間が35%短縮",
        lessonsLearned: ["問い合わせログの整備が最優先（分類がないと精度が出ない）"]
      },
      {
        title: "メディア：記事検索とタグ設計の刷新",
        clientName: "TechPress",
        industry: "メディア",
        companySize: "11-30",
        budgetMin: 500000,
        budgetMax: 900000,
        goals: ["回遊率向上", "関連記事の発見性向上"],
        challenges: ["タグが乱立", "検索結果の精度が低い"],
        proposal: ["タグ統廃合ルール策定", "検索UI改善", "関連記事レコメンド導線追加"],
        stack: ["Next.js", "Algolia"],
        durationWeeks: 6,
        deliverables: ["タグ設計", "検索UI", "関連記事導線"],
        result: "回遊率が10%向上",
        lessonsLearned: ["タグは運用ルールがないと必ず崩れる→ガバナンスを設計する"]
      },
      {
        title: "建設：施工事例ポートフォリオ整備＋営業資料化",
        clientName: "大成建装",
        industry: "建設",
        companySize: "51-200",
        budgetMin: 650000,
        budgetMax: 1100000,
        goals: ["営業効率化", "信頼性向上"],
        challenges: ["事例写真が散在", "強みが言語化されていない"],
        proposal: ["事例テンプレ作成", "カテゴリ整理", "PDF資料生成の導線追加"],
        stack: ["Next.js"],
        durationWeeks: 6,
        deliverables: ["事例一覧/詳細", "営業用テンプレ", "運用手順"],
        result: "商談化率が8%改善",
        lessonsLearned: ["写真/図面の権利確認を早めに実施する"]
      },
      {
        title: "美容：予約LP制作＋SNS流入の受け皿改善",
        clientName: "Bloom Hair",
        industry: "美容",
        companySize: "1-10",
        budgetMin: 300000,
        budgetMax: 650000,
        goals: ["予約増加", "SNS流入のCVR改善"],
        challenges: ["SNSからの導線が弱い", "メニューが分かりづらい"],
        proposal: ["メニュー整理", "予約導線の固定CTA", "SNS向け短尺LP制作"],
        stack: ["Next.js"],
        durationWeeks: 4,
        deliverables: ["予約LP", "メニュー整理", "計測設定"],
        result: "SNS経由予約が月+25件増加",
        lessonsLearned: ["撮影素材の用意がボトルネック→撮影日程を先に押さえる"]
      },
      {
        title: "公共：申請ページの分かりやすさ改善（アクセシビリティ対応）",
        clientName: "〇〇市役所",
        industry: "公共",
        companySize: "201-500",
        budgetMin: 800000,
        budgetMax: 1500000,
        goals: ["申請完了率向上", "問い合わせ削減"],
        challenges: ["説明が難解", "アクセシビリティ未対応"],
        proposal: ["情報設計の整理", "読みやすさ改善", "WCAG観点の改善"],
        stack: ["Next.js"],
        durationWeeks: 8,
        deliverables: ["申請ページ改修", "アクセシビリティチェック表", "運用ガイド"],
        result: "申請完了率が12%改善",
        lessonsLearned: ["専門用語の言い換えには担当部署の合意形成が必要"]
      },
      {
        title: "人材紹介：求人検索と応募導線の改善",
        clientName: "CareerBridge",
        industry: "人材",
        companySize: "31-50",
        budgetMin: 700000,
        budgetMax: 1300000,
        goals: ["応募数増加", "検索離脱率改善"],
        challenges: ["検索条件が多すぎる", "応募フォームで離脱する"],
        proposal: ["検索UIの段階化", "求人詳細の情報設計見直し", "応募フォームの短縮"],
        stack: ["Next.js", "PostgreSQL"],
        durationWeeks: 7,
        deliverables: ["求人検索UI", "応募導線改善", "計測設計"],
        result: "応募完了数が16%増加、検索離脱率が11%改善",
        lessonsLearned: ["求人情報の正規化が不十分だと検索改善が進まない"]
      },
      {
        title: "SaaS：オンボーディング改善（初回到達率向上）",
        clientName: "CloudDesk",
        industry: "SaaS",
        companySize: "11-30",
        budgetMin: 600000,
        budgetMax: 1100000,
        goals: ["初回利用到達率向上", "解約率低下"],
        challenges: ["初回設定が難しい", "ヘルプが見つけづらい"],
        proposal: ["初回チュートリアル導入", "設定ウィザード化", "ヘルプ導線の常設"],
        stack: ["Next.js"],
        durationWeeks: 6,
        deliverables: ["オンボーディングUI", "ヘルプ導線", "改善レポート"],
        result: "初回到達率が20%改善",
        lessonsLearned: ["サポートチームのFAQ更新フローを同時に整備する"]
      },
      {
        title: "製造業：製品カタログサイト刷新＋問い合わせフォーム改善",
        clientName: "山城機工",
        industry: "製造業",
        companySize: "201-500",
        budgetMin: 900000,
        budgetMax: 1600000,
        goals: ["問い合わせ増加", "製品情報の整理"],
        challenges: ["製品分類が分かりづらい", "問い合わせが電話に偏っている"],
        proposal: ["カテゴリ設計の再構築", "用途別導線の追加", "フォームの必須項目最適化"],
        stack: ["Next.js"],
        durationWeeks: 8,
        deliverables: ["カタログサイト", "用途別LP", "問い合わせフォーム"],
        result: "Web経由問い合わせが25%増加",
        lessonsLearned: ["型番・規格の表記揺れを先に正規化する"]
      },
      {
        title: "教育：体験申込の導線改善＋日程調整の自動化",
        clientName: "StudyLink",
        industry: "教育",
        companySize: "31-50",
        budgetMin: 650000,
        budgetMax: 1200000,
        goals: ["体験申込数増加", "運営工数削減"],
        challenges: ["日程調整がメールで煩雑", "入力項目が多い"],
        proposal: ["日程選択UI導入", "自動返信テンプレ整備", "申込フォームの短縮"],
        stack: ["Next.js"],
        durationWeeks: 6,
        deliverables: ["申込導線", "日程選択UI", "運用テンプレ"],
        result: "体験申込数が18%増加、調整工数が30%削減",
        lessonsLearned: ["現場の運用フローを先に書き出してから実装する"]
      },
      {
        title: "EC・小売：カート離脱対策（送料表示と在庫表示の改善）",
        clientName: "Lumi Store",
        industry: "EC・小売",
        companySize: "11-30",
        budgetMin: 550000,
        budgetMax: 950000,
        goals: ["購入完了率向上"],
        challenges: ["送料が分かりづらい", "在庫切れで不満が出る"],
        proposal: ["送料表示の早期提示", "在庫表示の改善", "カートUIの整理"],
        stack: ["Next.js"],
        durationWeeks: 5,
        deliverables: ["カートUI改善", "送料表示改善", "計測設計"],
        result: "購入完了率が9%改善",
        lessonsLearned: ["在庫同期の仕様を把握しないと表示改善が破綻する"]
      },
      {
        title: "観光業：予約前FAQ整備＋多言語サポート導線の追加",
        clientName: "SkyTravel",
        industry: "観光業",
        companySize: "31-50",
        budgetMin: 500000,
        budgetMax: 950000,
        goals: ["問い合わせ削減", "予約率向上"],
        challenges: ["問い合わせが多い", "外国語対応が弱い"],
        proposal: ["予約前FAQ整備", "多言語FAQテンプレ", "問い合わせ導線の整理"],
        stack: ["Next.js", "i18n"],
        durationWeeks: 5,
        deliverables: ["FAQ", "多言語導線", "運用ルール"],
        result: "問い合わせが15%削減",
        lessonsLearned: ["翻訳の更新フローがないとすぐに陳腐化する"]
      },
      {
        title: "士業：セミナー集客LP＋申込管理の簡素化",
        clientName: "山田税理士法人",
        industry: "士業",
        companySize: "11-30",
        budgetMin: 350000,
        budgetMax: 700000,
        goals: ["セミナー申込数増加"],
        challenges: ["申込フォームが使いづらい", "申込管理が手作業"],
        proposal: ["LPの訴求整理", "フォーム最適化", "申込通知と管理の自動化"],
        stack: ["Next.js"],
        durationWeeks: 4,
        deliverables: ["セミナーLP", "申込フォーム", "管理フロー"],
        result: "申込数が25%増加",
        lessonsLearned: ["ターゲット別の訴求軸を分けるとCVが伸びる"]
      },
      {
        title: "建設：採用サイト刷新＋応募導線の最短化",
        clientName: "北陽建設",
        industry: "建設",
        companySize: "51-200",
        budgetMin: 600000,
        budgetMax: 1200000,
        goals: ["採用応募数増加", "採用ブランディング"],
        challenges: ["仕事内容が伝わらない", "応募のハードルが高い"],
        proposal: ["職種別ページの整備", "現場写真/動画の導入", "応募導線の短縮"],
        stack: ["Next.js"],
        durationWeeks: 7,
        deliverables: ["採用サイト", "職種別ページ", "応募フォーム"],
        result: "応募数が17%増加",
        lessonsLearned: ["素材収集（写真/動画）を先行タスクにしないと遅延する"]
      },
      {
        title: "メディア：広告枠管理ページのUI改善",
        clientName: "NewsWave",
        industry: "メディア",
        companySize: "31-50",
        budgetMin: 700000,
        budgetMax: 1300000,
        goals: ["運用工数削減", "入力ミス削減"],
        challenges: ["画面が複雑", "入力ルールが属人化"],
        proposal: ["フォームの分割", "バリデーション強化", "操作ガイドの整備"],
        stack: ["Next.js", "React"],
        durationWeeks: 8,
        deliverables: ["管理UI改善", "入力ガイド", "運用ルール"],
        result: "入力ミスが30%削減",
        lessonsLearned: ["現場の例外パターンを洗い出してから画面を作る"]
      },
      {
        title: "公共：お知らせ配信のCMS化＋更新フロー整備",
        clientName: "△△県庁",
        industry: "公共",
        companySize: "501-1000",
        budgetMin: 1200000,
        budgetMax: 2200000,
        goals: ["更新スピード向上", "情報発信の一元化"],
        challenges: ["更新が特定担当に集中", "掲載ルールが曖昧"],
        proposal: ["CMS導入", "権限設計", "掲載ガイドライン策定"],
        stack: ["Next.js"],
        durationWeeks: 10,
        deliverables: ["CMS運用", "権限設計", "掲載ガイド"],
        result: "更新までのリードタイムが50%短縮",
        lessonsLearned: ["権限設計は最初に合意を取らないと後戻りが大きい"]
      }
    ];



    await prisma.case.createMany({ data: cases });

    console.log(`✅ 案件データ ${cases.length} 件を投入しました`);

    // 固定ユーザーを作成
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.create({
      data: {
        email: "admin@aaa.test",
        password: hashedPassword,
        name: "管理者",
      },
    });

    console.log(`✅ ユーザーデータを投入しました（admin@aaa.test）`);
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


