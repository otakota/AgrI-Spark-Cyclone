// components/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Unsubscribe } from 'firebase/auth';
// lib/firebaseからインスタンスとヘルパー関数をインポート
import { auth, initializeAuth, onAuthStateChanged } from '@/lib/firebase';
// uuidの依存を削除し、標準のcrypto APIを使用

// -----------------------------------------------------------------------------
// 1. Contextの定義
// -----------------------------------------------------------------------------

/** 認証状態の型定義 */
interface AuthContextType {
  user: User | null;         // ログインしているユーザー情報
  userId: string | null;     // ユーザーのUIDまたは匿名ID
  isLoading: boolean;        // 認証状態のロード中フラグ
  toggleDebugLogin: () => void; // 擬似ログイン状態を切り替える
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -----------------------------------------------------------------------------
// 2. 擬似ユーザーオブジェクトの作成
// -----------------------------------------------------------------------------

/** authがnullの場合に使用する擬似Userオブジェクト */
const createDebugUser = (): User => {
  // 標準のcrypto.randomUUID()でランダムなUIDを生成
  const debugUid = `debug-user-${crypto.randomUUID().slice(0, 8)}`;

  return ({
    // 必要なプロパティのみを実装
    uid: debugUid,
    email: 'debug@example.com',
    displayName: 'デバッグユーザー',
    isAnonymous: false,
    emailVerified: true,
    // その他のUserプロパティは最小限の実装またはnull
    providerId: 'debug',
    refreshToken: 'debug_token',
    tenantId: null,
    delete: () => Promise.resolve(),
    getIdToken: () => Promise.resolve('debug_token'),
    getIdTokenResult: () => Promise.resolve({ token: 'debug_token', issuedAtTime: '', expirationTime: '', authTime: '', claims: {} as any, signInProvider: 'debug', signInSecondFactor: null }),
    // ...その他のメソッドは省略
  } as unknown as User);
};


// -----------------------------------------------------------------------------
// 3. Providerコンポーネント
// -----------------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証状態を管理し、子コンポーネントに提供するプロバイダ
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDebugLoggedIn, setIsDebugLoggedIn] = useState(false); // デバッグログイン状態

  // デバッグ用トグル機能
  const toggleDebugLogin = () => {
    if (isDebugLoggedIn) {
      setUser(null);
      setUserId(null);
      setIsDebugLoggedIn(false);
      console.log('DEBUG: ログアウトしました。');
    } else {
      const debugUser = createDebugUser();
      setUser(debugUser);
      setUserId(debugUser.uid);
      setIsDebugLoggedIn(true);
      console.log('DEBUG: 擬似ログインしました。UID:', debugUser.uid);
    }
  };


  useEffect(() => {
    // Firebase Authを初期化
    initializeAuth();

    let unsubscribe: Unsubscribe | undefined;

    // authインスタンスが存在する場合にのみ認証状態の監視を開始
    if (auth && onAuthStateChanged) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        // Firebase認証が成功した場合、デバッグ状態を上書きしてリセット
        if(currentUser) {
            setIsDebugLoggedIn(false);
        }
        setUser(currentUser);
        setUserId(currentUser ? currentUser.uid : null);
        setIsLoading(false);
        console.log("Auth state changed. User UID:", currentUser?.uid);
      });
    } else {
      // authがnullの場合（APIキーエラーなど）、ロードを完了させ、デフォルトでログアウト状態とする
      setIsLoading(false);
      console.error("Firebase Auth instance is null. Authentication features are disabled.");
    }

    // クリーンアップ関数
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // ロード中、またはAPIエラーでauthがnullだがデバッグモードでない場合はメッセージ表示
  if (isLoading && !isDebugLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-green-600">認証情報をロード中です...</p>
      </div>
    );
  }

  // 擬似ログインがアクティブな場合、Firebaseの認証状態（user）より優先する
  const effectiveUser = isDebugLoggedIn ? user : user;
  const effectiveUserId = isDebugLoggedIn ? userId : userId;

  const value: AuthContextType = {
    user: effectiveUser,
    userId: effectiveUserId,
    isLoading,
    toggleDebugLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// -----------------------------------------------------------------------------
// 4. Custom Hook
// -----------------------------------------------------------------------------

/**
 * 認証コンテキストにアクセスするためのカスタムフック
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
