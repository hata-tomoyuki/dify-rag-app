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
        customer: "田中商事",
        issue: "先月分の請求書が届いていないのですが、再発行は可能でしょうか？",
        response: "管理画面の「請求履歴」からPDFを再ダウンロードできます。",
      },
      {
        customer: "株式会社ブルースカイ",
        issue: "請求書の宛名を会社名ではなく部署名に変更したいです。",
        response: "請求先情報の編集画面から宛名を変更できます。",
      },
      {
        customer: "佐藤製作所",
        issue: "支払い方法を銀行振込からクレジットカードに変更できますか？",
        response: "お支払い方法の変更は契約設定画面から可能です。",
      },
      {
        customer: "山田不動産",
        issue: "ログインしようとするとパスワードエラーになります。",
        response: "パスワード再設定画面から再設定をお試しください。",
      },
      {
        customer: "株式会社GreenTech",
        issue: "登録しているメールアドレスを変更したいのですが。",
        response: "アカウント設定からメールアドレスの変更が可能です。",
      },
      {
        customer: "ABC物流",
        issue: "社員を新しく追加したいのですが、何人まで登録できますか？",
        response: "ご契約プランごとに登録可能人数が異なります。プラン詳細をご確認ください。",
      },
      {
        customer: "サンプル商会",
        issue: "一般ユーザーと管理者ユーザーの違いは何ですか？",
        response: "管理者はユーザー管理や設定変更が可能です。",
      },
      {
        customer: "株式会社ライト",
        issue: "誤ってデータを削除してしまいました。復元できますか？",
        response: "削除後7日以内であれば復元対応が可能です。サポートまでご連絡ください。",
      },
      {
        customer: "FutureWorks",
        issue: "CSVでデータを一括登録したいのですが、フォーマットはどこで確認できますか？",
        response: "ヘルプページにCSVテンプレートを用意しています。",
      },
      {
        customer: "オレンジ電機",
        issue: "CSVアップロード時にエラーが出ます。",
        response: "文字コードがUTF-8になっているかをご確認ください。",
      },
      {
        customer: "株式会社ネクスト",
        issue: "昨日から画面が真っ白になり操作できません。",
        response: "一時的な障害の可能性があります。現在状況を確認中です。",
      },
      {
        customer: "中央企画",
        issue: "対応状況はどこで確認できますか？",
        response: "案件一覧画面のステータス欄をご確認ください。",
      },
      {
        customer: "Alpha Systems",
        issue: "通知メールが届かないのですが。",
        response: "迷惑メールフォルダと通知設定をご確認ください。",
      },
      {
        customer: "株式会社ミライ",
        issue: "ログイン履歴を確認することはできますか？",
        response: "セキュリティ設定画面から確認できます。",
      },
      {
        customer: "サクラ工業",
        issue: "二段階認証を有効にしたいです。",
        response: "セキュリティ設定から二段階認証を有効化できます。",
      },
      {
        customer: "NorthWind",
        issue: "アカウントを一時的に停止することはできますか？",
        response: "管理者設定から利用停止が可能です。",
      },
      {
        customer: "東日本サービス",
        issue: "契約内容を確認したいのですが、どこに表示されていますか？",
        response: "契約情報はアカウント設定画面で確認できます。",
      },
      {
        customer: "西村商店",
        issue: "解約した場合、データはいつまで保持されますか？",
        response: "解約後30日間はデータを保持しています。",
      },
      {
        customer: "株式会社Horizon",
        issue: "操作マニュアルはどこにありますか？",
        response: "ヘルプセンターに最新版のマニュアルがあります。",
      },
      {
        customer: "BlueOcean",
        issue: "検索機能で一部のデータが表示されません。",
        response: "検索条件が正しいか、権限設定をご確認ください。",
      }
    ];

    await prisma.case.createMany({ data: cases });

    console.log(`✅ 意味のある問い合わせデータ ${cases.length} 件を投入しました`);
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


