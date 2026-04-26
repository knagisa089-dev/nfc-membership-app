'use client'

import { useEffect, useState } from 'react'

type Tenant = {
  id: string
  email: string
  shopName: string | null
  plan: string
  isAdmin: boolean
  createdAt: string
  _count: { customers: number }
}

export default function AdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/tenants')
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setTenants(data)
        }
        setLoading(false)
      })
  }, [])

  const deleteTenant = async (id: string, email: string) => {
    if (!confirm(`${email} を削除しますか？`)) return
    await fetch(`/api/admin/tenants/${id}`, { method: 'DELETE' })
    setTenants(tenants.filter(t => t.id !== id))
  }

  const changePlan = async (id: string, plan: string) => {
    await fetch(`/api/admin/tenants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    setTenants(tenants.map(t => t.id === id ? { ...t, plan } : t))
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">読み込み中...</p>
    </main>
  )

  if (error) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">管理者ダッシュボード</h1>
            <p className="text-sm text-gray-400 mt-1">全ユーザー管理</p>
          </div>
          <a href="/dashboard" className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100">
            管理画面に戻る
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500">総ユーザー数</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{tenants.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500">有料ユーザー</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{tenants.filter(t => t.plan !== 'FREE').length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500">ライフタイム</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">{tenants.filter(t => t.plan === 'LIFETIME').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">ユーザー一覧</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {tenants.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">{t.email}</p>
                    {t.isAdmin && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Admin</span>}
                  </div>
                  {t.shopName && <p className="text-sm text-gray-400">{t.shopName}</p>}
                  <p className="text-xs text-gray-300 mt-1">
                    登録: {new Date(t.createdAt).toLocaleDateString('ja-JP')} / 顧客数: {t._count.customers}人
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={t.plan}
                    onChange={e => changePlan(t.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                  >
                    <option value="FREE">フリー</option>
                    <option value="STANDARD">スタンダード</option>
                    <option value="PRO">プロ</option>
                    <option value="LIFETIME">ライフタイム</option>
                  </select>
                  {!t.isAdmin && (
                    <button
                      onClick={() => deleteTenant(t.id, t.email)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}