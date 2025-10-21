// app/page.tsx
"use client";

import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

// -----------------------------------------------------------------------------
// ヘッダーコンポーネント (認証状態によって表示を切り替える)
// -----------------------------------------------------------------------------

interface HeaderProps {
  isLoggedIn: boolean;
  toggleDebugLogin: () => void;
  authAvailable: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, toggleDebugLogin, authAvailable }) => {
  const { auth } = require('@/lib/firebase'); // ログアウト処理のためにauthインスタンスを取得
  const router = require('next/navigation').useRouter();

  const handleLogout = async () => {
    // Firebaseが利用可能な場合はFirebaseログアウト
    if (authAvailable && auth) {
      try {
        await auth.signOut();
        console.log('Firebase Logout successful');
        router.push('/');
      } catch (error) {
        console.error("Firebase Logout error:", error);
      }
    } else {
      // Firebaseが利用不可の場合はデバッグログアウト
      toggleDebugLogin();
    }
  };

  const NavLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <Link href={href} className="text-gray-600 hover:text-green-600 transition duration-150 ease-in-out font-medium px-4 py-2 rounded-md">
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* 左側: ロゴ */}
        <div className="flex items-center space-x-2">
          <span className="text-white bg-green-600 p-2 rounded-full font-bold text-lg">A</span>
          <Link href="/" className="text-xl font-bold text-green-700">
            AgriSparkCyclone
          </Link>
        </div>

        {/* 中央: ナビゲーションリンク (ログイン時のみ表示) */}
        {isLoggedIn && (
          <nav className="hidden md:flex space-x-1">
            <NavLink href="/">ホーム</NavLink>
            <NavLink href="/plan/create">申請書作成</NavLink>
            <NavLink href="/plan/list">申請書一覧</NavLink>
            <NavLink href="/ai-predict">収支予測(AI)</NavLink>
          </nav>
        )}

        {/* 右側: ログアウトボタン (ログイン時のみ表示) */}
        <div className="flex items-center space-x-4">
            {/* デバッグボタン (開発専用) */}
            {!authAvailable && (
                <button
                    onClick={toggleDebugLogin}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition duration-150 ease-in-out ${
                        isLoggedIn ? 'text-white bg-blue-500 hover:bg-blue-600' : 'text-blue-500 border border-blue-500 hover:bg-blue-50'
                    }`}
                >
                    {isLoggedIn ? 'DEBUGログアウト' : 'DEBUGログイン'}
                </button>
            )}

            {isLoggedIn ? (
            <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition duration-150 ease-in-out"
            >
                ログアウト
            </button>
            ) : (
            <div className="w-24 h-1"></div> // スペース調整用
            )}
        </div>
      </div>
    </header>
  );
};


// -----------------------------------------------------------------------------
// ヒーローセクションコンポーネント
// -----------------------------------------------------------------------------
// ... HeroSection, Footer は変更なし
// -----------------------------------------------------------------------------

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isLoggedIn }) => (
  <main className="flex-grow flex items-center justify-center p-8 text-center bg-gray-50">
    <div className="max-w-3xl space-y-6">
      <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
        ようこそ<span className="text-green-600">AgriSparkCyclone</span>へ！
      </h1>
      <p className="text-lg text-gray-600">
        新規就農者のための申請書自動入力、作物トップ10と耕地面積からAIで収支予測を行えるWebサイトです。シンプルな操作で、就農計画の第一歩をサポートします。
      </p>
      
      {/* ログイン前のボタン (ログアウト時は表示) */}
      {!isLoggedIn && (
        <div className="flex justify-center space-x-4 pt-4">
          <Link href="/login" 
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg transition duration-150 ease-in-out">
            ログイン
          </Link>
          <Link href="/login" 
            className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 shadow-lg transition duration-150 ease-in-out">
            アカウント登録
          </Link>
        </div>
      )}
    </div>
  </main>
);

const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
      {/* 左側: ロゴと説明 */}
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <span className="text-white bg-green-600 p-2 rounded-full font-bold text-lg">A</span>
        <div>
          <p className="text-base font-bold text-green-700">AgriSparkCyclone</p>
          <p className="text-xs">新規就農者のための申請書自動入力とAI収支予測プラットフォーム。</p>
        </div>
      </div>
      {/* 右側: 著作権情報 */}
      <div>
        &copy; 2025 AgriSparkCyclone All Rights Reserved.
      </div>
    </div>
  </footer>
);


// -----------------------------------------------------------------------------
// メインページコンポーネント
// -----------------------------------------------------------------------------

export default function HomePage() {
  const { user, isLoading, toggleDebugLogin } = useAuth();
  const { auth } = require('@/lib/firebase');
  const authAvailable = !!auth;

  // 認証情報のロード中は何も表示しない
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-green-600">認証情報をロード中です...</p>
      </div>
    );
  }

  // userが存在すればログイン済み
  const isLoggedIn = !!user;

  // TailwindのFlexboxを使用して、フッターが常に画面下部に固定されるように設定
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        toggleDebugLogin={toggleDebugLogin} 
        authAvailable={authAvailable} 
      />
      <HeroSection isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
}