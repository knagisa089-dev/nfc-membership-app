'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const reset = async () => {
    if (password !== confirm) {
      setError('パスワードが一致しません')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/reset-password/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } else {
      setError(data.error)
      setLoading(false)
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm text-center">
          <p className="text-green-600 font-medium">パスワードを変更しました！</p>
          <p className="text-sm text-gray-400 mt-2">ログイン画面に移動します...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-2">パスワード変更</h1>
        <p className="text-sm text-gray-400 mb-6">新しいパスワードを入力してください</p>
        <div className="space-y-3">
          <input
            type="password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
            placeholder="新しいパスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
            placeholder="パスワード（確認）"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={reset}
            disabled={loading || !password || !confirm}
            className="w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '変更中...' : 'パスワードを変更する'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </main>
    }>
      <ResetContent />
    </Suspense>
  )
}