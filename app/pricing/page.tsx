'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PricingContent() {
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const subscribe = async (plan: 'STANDARD' | 'PRO' | 'LIFETIME') => {
    setLoading(plan)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
    setLoading(null)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">料金プラン</h1>
          <p className="text-gray-400">NFCタグで会員管理をもっとスマートに</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center">
            <p className="text-green-700 font-medium">🎉 支払いが完了しました！プランがアップグレードされました。</p>
            <a href="/dashboard" className="inline-block mt-2 text-sm text-green-600 underline">管理画面に戻る</a>
          </div>
        )}

        {canceled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-center">
            <p className="text-yellow-700">支払いがキャンセルされました。</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* フリープラン */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800">フリー</h2>
              <p className="text-sm text-gray-400 mt-1">まずは試してみたい方に</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-800">¥0</span>
                <span className="text-gray-400 text-sm">/月</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {['会員数30人まで', '基本的な会員管理', 'NFCタグ連携', 'スキャン判定'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>{f}
                </li>
              ))}
              {['CSV出力', '来店履歴', '複数スタッフ'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <span>✗</span>{f}
                </li>
              ))}
            </ul>
            <button className="w-full border border-gray-200 text-gray-400 text-sm px-4 py-3 rounded-xl" disabled>
              現在のプラン
            </button>
          </div>

          {/* スタンダードプラン */}
          <div className="bg-blue-600 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">人気No.1</span>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">スタンダード</h2>
              <p className="text-sm text-blue-200 mt-1">小規模店舗に最適</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">¥980</span>
                <span className="text-blue-200 text-sm">/月</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {['会員数200人まで', '基本的な会員管理', 'NFCタグ連携', 'スキャン判定', 'CSV出力', '来店履歴'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white">
                  <span className="text-blue-200">✓</span>{f}
                </li>
              ))}
              {['複数スタッフ'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-blue-300">
                  <span>✗</span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => subscribe('STANDARD')}
              disabled={loading === 'STANDARD'}
              className="w-full bg-white text-blue-600 font-medium text-sm px-4 py-3 rounded-xl hover:bg-blue-50 disabled:opacity-50"
            >
              {loading === 'STANDARD' ? '処理中...' : 'アップグレード'}
            </button>
          </div>

          {/* プロプラン */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800">プロ</h2>
              <p className="text-sm text-gray-400 mt-1">本格的に使いたい方に</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-800">¥1,480</span>
                <span className="text-gray-400 text-sm">/月</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {['会員数無制限', '基本的な会員管理', 'NFCタグ連携', 'スキャン判定', 'CSV出力', '来店履歴', '複数スタッフ'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => subscribe('PRO')}
              disabled={loading === 'PRO'}
              className="w-full bg-gray-800 text-white text-sm px-4 py-3 rounded-xl hover:bg-gray-700 disabled:opacity-50"
            >
              {loading === 'PRO' ? '処理中...' : 'アップグレード'}
            </button>
          </div>

          {/* ライフタイムプラン */}
          <div className="bg-gradient-to-b from-purple-600 to-purple-800 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">買い切り</span>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">ライフタイム</h2>
              <p className="text-sm text-purple-200 mt-1">一度払えば永久に使える</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">¥29,800</span>
                <span className="text-purple-200 text-sm"> 一括</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {['会員数無制限', '基本的な会員管理', 'NFCタグ連携', 'スキャン判定', 'CSV出力', '来店履歴', '複数スタッフ', '永久ライセンス', '月額費用なし'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white">
                  <span className="text-purple-200">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => subscribe('LIFETIME')}
              disabled={loading === 'LIFETIME'}
              className="w-full bg-white text-purple-600 font-medium text-sm px-4 py-3 rounded-xl hover:bg-purple-50 disabled:opacity-50"
            >
              {loading === 'LIFETIME' ? '処理中...' : '今すぐ購入'}
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">管理画面に戻る</a>
        </div>
      </div>
    </main>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </main>
    }>
      <PricingContent />
    </Suspense>
  )
}