const { isReadonlyKeywordOrPlusOrMinusToken } = require('typescript')

/** @type {import('next').NextConfig} */
const nextConfig = {
    // サーバーアクションズを有効にする
    // experimental: {
    //   serverActions: true,
    // },
    images: {
      domains: ['tirkygyugjdovnrbqzvx.supabase.co'],
    },
}

module.exports = nextConfig
