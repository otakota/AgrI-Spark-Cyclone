/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // X(Twitter)とGoogleのプロフィール画像を表示するために追加
    domains: ["pbs.twimg.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;