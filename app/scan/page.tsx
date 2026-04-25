'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Result = {
  result: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'NOT_FOUND'
  customer?: {
    name: string
    email: string | null
    phone: string | null
    address: string | null
    birthday: string | null
    note: string | null
    expiresAt: string | null
  }
}

function ScanContent() {
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')
  const [data, setData] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setLoading(false)
      return
    }
    const tid = searchParams.get('tid')
    fetch(`/api/scan?uid=${uid}${tid ? `&tid=${tid}` : ''}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
  }, [uid])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">確認中...</p>
      </main>
    )
  }

  if (!uid) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">UIDが指定されていません</p>
      </main>
    )
  }

  const isActive = data?.result === 'ACTIVE'
  const isExpired = data?.result === 'EXPIRED'
  const isSuspended = data?.result === 'SUSPENDED'

  return (
    <main className={`min-h-screen flex items-center justify-center p-8 ${
      isActive ? 'bg-green-50' :
      isExpired ? 'bg-red-50' :
      isSuspended ? 'bg-orange-50' :
      'bg-gray-50'
    }`}>
      <div className="text-center max-w-sm w-full">
        <div className={`text-8xl mb-6 ${
          isActive ? 'text-green-500' :
          isExpired ? 'text-red-500' :
          isSuspended ? 'text-orange-500' :
          'text-gray-400'
        }`}>
          {isActive ? '✓' : '✗'}
        </div>
        <h1 className={`text-3xl font-bold mb-6 ${
          isActive ? 'text-green-700' :
          isExpired ? 'text-red-700' :
          isSuspended ? 'text-orange-700' :
          'text-gray-600'
        }`}>
          {isActive ? '会員有効' :
           isExpired ? '期限切れ' :
           isSuspended ? '利用停止中' :
           '未登録のタグ'}
        </h1>

        {data?.customer && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-left space-y-3">
            <div>
              <p className="text-xs text-gray-400">氏名</p>
              <p className="font-semibold text-gray-800 text-lg">{data.customer.name}</p>
            </div>
            {data.customer.email && (
              <div>
                <p className="text-xs text-gray-400">メールアドレス</p>
                <p className="text-sm text-gray-700">{data.customer.email}</p>
              </div>
            )}
            {data.customer.phone && (
              <div>
                <p className="text-xs text-gray-400">電話番号</p>
                <p className="text-sm text-gray-700">{data.customer.phone}</p>
              </div>
            )}
            {data.customer.address && (
              <div>
                <p className="text-xs text-gray-400">住所</p>
                <p className="text-sm text-gray-700">{data.customer.address}</p>
              </div>
            )}
            {data.customer.birthday && (
              <div>
                <p className="text-xs text-gray-400">誕生日</p>
                <p className="text-sm text-gray-700">{data.customer.birthday}</p>
              </div>
            )}
            {data.customer.note && (
              <div>
                <p className="text-xs text-gray-400">メモ</p>
                <p className="text-sm text-gray-700">{data.customer.note}</p>
              </div>
            )}
            {data.customer.expiresAt && (
              <div className={`pt-3 border-t border-gray-100`}>
                <p className="text-xs text-gray-400">有効期限</p>
                <p className="text-sm font-medium text-gray-700">{new Date(data.customer.expiresAt).toLocaleDateString('ja-JP')}</p>
              </div>
            )}
          </div>
        )}

        <a href="/dashboard" className="inline-block mt-8 text-sm text-gray-400 hover:text-gray-600">
          管理画面に戻る
        </a>
      </div>
    </main>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </main>
    }>
      <ScanContent />
    </Suspense>
  )
}