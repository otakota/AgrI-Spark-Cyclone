// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // クッキーから認証トークンを取得
  const authToken = request.cookies.get('auth-token')?.value;

  // 認証トークンがなく、かつ保護対象のページにアクセスしようとしている場合
  if (!authToken && request.nextUrl.pathname.startsWith('/agriform')) {
    // ログインページへリダイレクト
    const loginUrl = new URL('/login', request.url);  
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
export const config = {
    matcher: ['/:path*']
}
