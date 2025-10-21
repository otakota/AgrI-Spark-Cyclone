"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider'; // 認証状態を取得

/**
 * ログイン画面コンポーネント
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth(); // 認証コンテキストからユーザー状態を取得

  // 既にログインしている場合はホームにリダイレクト
  if (user) {
    router.replace('/');
    return null;
  }

  /**
   * ログイン処理を実行する関数
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase Authが初期化されていません。");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Firebaseでメール/パスワード認証を実行
      await signInWithEmailAndPassword(auth, email, password);
      
      // 成功したらホーム画面へ遷移
      router.push('/');
    } catch (err: any) {
      console.error("Login failed:", err);
      // Firebaseのエラーコードに基づいてユーザーフレンドリーなメッセージを設定
      if (err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found') {
        setError('無効なメールアドレスまたはパスワードです。');
      } else if (err.code === 'auth/wrong-password') {
        setError('パスワードが間違っています。');
      } else {
        setError('ログインに失敗しました。再度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          AgriSparkCycloneにログイン
        </h2>
        <p className="text-center text-sm text-gray-600">
            アカウントをお持ちでない方は 
            <a 
              href="/register" 
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              こちらから登録
            </a>
        </p>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* エラーメッセージ */}
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}

          {/* メールアドレス入力 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* パスワード入力 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ログインボタン */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors'
                }`}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
