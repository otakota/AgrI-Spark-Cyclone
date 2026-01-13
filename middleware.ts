import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const guestOnlyRoutes = ['/', '/login'];
const authOnlyRoutes = ['/home', '/agriform', '/files'];

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // 完全一致、または指定パスで始まるかを確認（startsWith('/') を避ける）
    const isAuthPage = guestOnlyRoutes.includes(pathname);
    const isProtectedPage = authOnlyRoutes.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    );

    // 未ログインで保護ページにアクセス
    if (isProtectedPage && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // ログイン済みでゲスト専用ページ（ログイン画面など）にアクセス
    if (isAuthPage && token) {
        // すでにログインしているならホームへ飛ばす
        return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
}

// 静的ファイルやAPIルートを除外する設定
export const config = {
    matcher: [
        /*
         * 次のパス以外のすべてにマッチ:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};