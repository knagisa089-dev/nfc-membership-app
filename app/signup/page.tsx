'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const signup = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, shopName }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/')
    } else {
      setError(data.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-2">新規登録</h1>
        <p className="text-sm text-gray-400 mb-6">アカウントを作成してください</p>
        <div className="space-y-3">
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
            placeholder="お店の名前（任意）"
            value={shopName}
            onChange={e => setShopName(e.target.value)}
          />
          <input
            type="email"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={signup}
            disabled={loading || !email || !password}
            className="w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '登録中...' : '登録する'}
          </button>
          <p className="text-center text-sm text-gray-400">
            すでにアカウントをお持ちの方は{' '}
            <a href="/login" className="text-blue-600 hover:underline">ログイン</a>
          </p>
        </div>
      </div>
    </main>
  )
}