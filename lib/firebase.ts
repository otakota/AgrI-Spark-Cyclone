// lib/firebase.ts

import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  setPersistence, 
  browserSessionPersistence,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import { getFirestore, setLogLevel, Firestore } from "firebase/firestore";

// -----------------------------------------------------------------------------
// 1. 環境設定の取得と調整
// -----------------------------------------------------------------------------

// Canvas環境から提供される設定を取得
const rawFirebaseConfig = (typeof __firebase_config === 'string' && __firebase_config.length > 0)
    ? JSON.parse(__firebase_config)
    : {};

// Canvas環境からアプリIDを取得 (Firestoreのパスやフォールバックに使用)
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// 不完全な設定に対する防御策: projectIdがないとinitializeAppが失敗するため、強制的に追加
const firebaseConfig = {
    // 既存の設定をすべて展開
    ...rawFirebaseConfig,
    // projectIdがない場合はappIdでフォールバック
    projectId: rawFirebaseConfig.projectId || appId,
    // apiKeyがない場合は空文字列で初期化を続行できるようにする
    apiKey: rawFirebaseConfig.apiKey || '',
};

// -----------------------------------------------------------------------------
// 2. サービスインスタンスの定義と初期化
// -----------------------------------------------------------------------------

// 変数をトップレベルで定義し、ブロックスコープ（try/catch）の外でエクスポートできるようにする
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

try {
  // Firebase Appの初期化
  appInstance = initializeApp(firebaseConfig);
  
  // Authインスタンスの取得
  try {
    authInstance = getAuth(appInstance);
  } catch (error) {
    // auth/invalid-api-keyなどのエラーはここで捕捉し、アプリのクラッシュを防ぐ
    console.error("FIREBASE INITIALIZATION ERROR: Auth unavailable. Check your Firebase config (apiKey).", error);
  }

  // Firestoreインスタンスの取得
  try {
    dbInstance = getFirestore(appInstance);
    setLogLevel('debug'); // デバッグログを有効化
  } catch (error) {
    console.error("FIREBASE INITIALIZATION ERROR: Firestore unavailable.", error);
  }

} catch (e) {
  // Appの初期化自体に失敗した場合のログ
  console.error("FATAL ERROR: Failed to initialize Firebase App.", e);
}

// -----------------------------------------------------------------------------
// 3. サービスインスタンスとヘルパー関数のエクスポート
// -----------------------------------------------------------------------------

/** Firebase Authインスタンス (エラー時は null) */
export const auth = authInstance;
/** Firebase Firestoreインスタンス (エラー時は null) */
export const db = dbInstance;
/** AuthProviderで利用するためにonAuthStateChangedをエクスポート */
export { onAuthStateChanged };
export { signInWithCustomToken, signInAnonymously }; // 認証ヘルパー関数もエクスポート

/**
 * アプリ起動時の認証初期化処理
 */
export async function initializeAuth() {
  // authインスタンスがnullの場合（初期化エラー）は処理をスキップ
  if (!auth) {
    console.warn("Authentication initialization skipped because Firebase Auth is unavailable.");
    return;
  }
  
  try {
    // セッション永続性を設定
    await setPersistence(auth, browserSessionPersistence);
    
    // トークン取得ロジック
    const initialAuthToken = (typeof __initial_auth_token === 'string' && __initial_auth_token.length > 0) 
      ? __initial_auth_token 
      : null;

    if (initialAuthToken) {
      console.log("Signing in with custom token...");
      await signInWithCustomToken(auth, initialAuthToken);
    } else {
      console.log("Signing in anonymously...");
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Failed to execute initial sign-in:", error);
  }
}
