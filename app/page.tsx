"use client";

// Next.jsのApp Routerでは、デフォルトでexportされた関数がページコンポーネントとして扱われます。
// Tailwind CSSを使用し、画像のデザインを再現します。

// アイコンとして、ここではLucide Reactのファーム関連のアイコンをシミュレートするために、
// 単純なSVGアイコンを使用します。

/**
 * 簡易的なアプリケーションロゴアイコン
 */
const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-white"
  >
    {/* 農業をイメージした葉っぱのアイコン */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 18s-4-2-4-7" />
    <path d="M12 18s4-2 4-7" />
  </svg>
);

/**
 * ヘッダーナビゲーションバーコンポーネント
 * ログイン前の状態では、ナビゲーションリンクとログアウトボタンは表示しません。
 */
const Header = () => (
  <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
      
      {/* 左側のロゴとタイトル (変更なし) */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500">
          <LogoIcon />
        </div>
        <a href="/" className="text-xl font-bold text-gray-800">
          AgriSparkCyclone
        </a>
      </div>

      {/* 中央のナビゲーションリンクと右側のログアウトボタンを非表示にするため、空のdivを配置してjustify-betweenを機能させる */}
      <div className="hidden md:block w-4">
        {/* ナビゲーションを非表示 */}
      </div>
      
      {/* ログイン・登録ボタンはHeroSectionにあるため、ここでは何も表示しない */}
      <div className="w-4">
        {/* ログアウトボタンを非表示 */}
      </div>
    </div>
  </header>
);

/**
 * メインのヒーローセクションコンポーネント (変更なし)
 */
const HeroSection = () => (
  <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
    {/* タイトル */}
    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
      ようこそ<span className="text-green-600">AgriSparkCyclone</span>へ！
    </h1>

    {/* 説明文 */}
    <p className="max-w-3xl text-lg text-gray-600 mb-12 leading-relaxed">
      新規就農者のための申請書自動入力、作物トップ10と耕地面積からAIで収支予測を行えるWebサイトです。シンプルな操作で、就農計画の第一歩をサポートします。
    </p>

    {/* アクションボタン群 */}
    <div className="flex space-x-6">
      {/* ログインボタン (画像では緑色) */}
      <button
        onClick={() => console.log('ログインページへ遷移')}
        className="px-8 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
      >
        ログイン
      </button>

      {/* アカウント登録ボタン (画像では白色背景) */}
      <button
        onClick={() => console.log('アカウント登録ページへ遷移')}
        className="px-8 py-3 text-lg font-semibold text-green-600 bg-white border-2 border-green-500 rounded-lg shadow-lg hover:bg-green-50 transition-all transform hover:scale-105"
      >
        アカウント登録
      </button>
    </div>
  </main>
);

/**
 * フッターコンポーネント (変更なし)
 */
const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
      
      {/* 左側のロゴと説明 */}
      <div className="flex items-center space-x-3 mb-4 md:mb-0">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500">
          <LogoIcon />
        </div>
        <div>
          <p className="font-bold text-gray-800">AgriSparkCyclone</p>
          <p className="text-xs mt-1">新規就農者のための申請書自動入力とAI収支予測プラットフォーム。</p>
        </div>
      </div>
      
      {/* 右側の著作権表示 */}
      <p>
        &copy; 2025 AgriSparkCyclone. All Rights Reserved.
      </p>
    </div>
  </footer>
);


/**
 * メインのTopページコンポーネント
 * @returns 
 */
export default function HomePage() {
  return (
    // TailwindのFlexboxを使用して、フッターが常に画面下部に固定されるように設定
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}
