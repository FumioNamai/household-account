const { isReadonlyKeywordOrPlusOrMinusToken } = require("typescript");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // サーバーアクションズを有効にする
  // experimental: {
  //   serverActions: true,
  // },
  images: {
    domains: ["tirkygyugjdovnrbqzvx.supabase.co"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
