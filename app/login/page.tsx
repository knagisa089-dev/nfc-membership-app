'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()

  const login = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/')
    } else {
      setError(data.error)
      setLoading(false)
    }
  }

  const sendReset = async () => {
    setLoading(true)
    setError('')
    await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setResetSent(true)
    setLoading(false)
  }

  if (resetSent) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm text-center">
          <p className="text-green-600 font-medium">メールを送信しました！</p>
          <p className="text-sm text-gray-400 mt-2">メールを確認してリンクをクリックしてください</p>
          <button
            onClick={() => { setResetMode(false); setResetSent(false) }}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            ログインに戻る
          </button>
        </div>
      </main>
    )
  }

  if (resetMode) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-800 mb-2">パスワードリセット</h1>
          <p className="text-sm text-gray-400 mb-6">登録したメールアドレスを入力してください</p>
          <div className="space-y-3">
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
              placeholder="メールアドレス"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              onClick={sendReset}
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '送信中...' : 'リセットメールを送る'}
            </button>
            <button
              onClick={() => setResetMode(false)}
              className="w-full text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              戻る
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-2">NFC会員管理</h1>
        <p className="text-sm text-gray-400 mb-6">ログインしてください</p>
        <div className="space-y-3">
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
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={login}
            disabled={loading || !email || !password}
            className="w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '確認中...' : 'ログイン'}
          </button>
          <div className="flex justify-between text-sm">
            <a href="/signup" className="text-blue-600 hover:underline">新規登録</a>
            <button onClick={() => setResetMode(true)} className="text-gray-400 hover:underline">
              パスワードを忘れた方
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}