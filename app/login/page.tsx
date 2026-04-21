'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const login = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/')
    } else {
      setError(true)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-2">NFC会員管理</h1>
        <p className="text-sm text-gray-400 mb-6">パスワードを入力してください</p>
        <input
          type="password"
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-3"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
        />
        {error && (
          <p className="text-red-500 text-xs mb-3">パスワードが違います</p>
        )}
        <button
          onClick={login}
          className="w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ログイン
        </button>
      </div>
    </main>
  )
}