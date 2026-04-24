'use client'

import { useEffect, useState } from 'react'

type Customer = {
  id: string
  name: string
  email: string | null
  phone: string | null
  nfcTag: { uid: string } | null
  subscription: {
    status: string
    expiresAt: string
  } | null
}

type Tenant = {
  id: string
  email: string
  shopName: string | null
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nfcUid, setNfcUid] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [expiresAt, setExpiresAt] = useState('')
  const [showScanUrl, setShowScanUrl] = useState(false)
  const [origin, setOrigin] = useState('')

  const load = () =>
    fetch('/api/customers').then(r => r.json()).then(setCustomers)

  useEffect(() => {
    load()
    fetch('/api/auth/me').then(r => r.json()).then(setTenant)
    setOrigin(window.location.origin)
  }, [])

  const addCustomer = async () => {
    if (!name) return
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone }),
    })
    setName(''); setEmail(''); setPhone('')
    setShowForm(false)
    load()
  }

  const saveTag = async () => {
    if (!selected) return
    await fetch(`/api/customers/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nfcUid, status, expiresAt }),
    })
    setSelected(null)
    load()
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const scanUrl = `${origin}/scan?tid=${tenant?.id}&uid=`
  const active = customers.filter(c => c.subscription?.status === 'ACTIVE').length
  const expired = customers.filter(c => c.subscription?.status === 'EXPIRED').length

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">NFC会員管理</h1>
            {tenant?.shopName && <p className="text-sm text-gray-400">{tenant.shopName}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowScanUrl(!showScanUrl)}
              className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              スキャンURL
            </button>
            <button
              onClick={logout}
              className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              ログアウト
            </button>
          </div>
        </div>

        {showScanUrl && tenant && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-blue-800 mb-2">iPhoneショートカット用スキャンURL</p>
            <p className="text-xs text-blue-600 font-mono break-all">{scanUrl}【タグUID】</p>
            <p className="text-xs text-gray-500 mt-2">【タグUID】の部分をNFCタグのUIDに置き換えてください</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500">総会員数</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{customers.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500">有効会員</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{active}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500">期限切れ</p>
            <p className="text-3xl font-bold text-red-500 mt-1">{expired}</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="font-semibold text-gray-800 mb-4">顧客を追加</h2>
            <div className="space-y-3">
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="名前（必須）" value={name} onChange={e => setName(e.target.value)} />
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="電話番号" value={phone} onChange={e => setPhone(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={addCustomer} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">追加する</button>
                <button onClick={() => setShowForm(false)} className="text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-100">キャンセル</button>
              </div>
            </div>
          </div>
        )}

        {selected && (
          <div className="bg-white rounded-xl border border-blue-200 p-6 mb-4">
            <h2 className="font-semibold text-gray-800 mb-4">{selected.name} の設定</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">NFCタグUID</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-mono" placeholder="例: 04:A1:B2:C3" value={nfcUid} onChange={e => setNfcUid(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">会員ステータス</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="ACTIVE">有効</option>
                  <option value="EXPIRED">期限切れ</option>
                  <option value="SUSPENDED">停止中</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">有効期限</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button onClick={saveTag} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">保存する</button>
                <button onClick={() => setSelected(null)} className="text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-100">キャンセル</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">顧客一覧</h2>
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">+ 顧客を追加</button>
          </div>
          {customers.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">まだ顧客が登録されていません</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {customers.map(c => (
                <div key={c.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-400">{c.email ?? '—'} {c.phone ? `/ ${c.phone}` : ''}</p>
                    <p className="text-xs text-gray-300 mt-1">タグ: {c.nfcTag?.uid ?? '未登録'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      c.subscription?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      c.subscription?.status === 'EXPIRED' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {c.subscription?.status === 'ACTIVE' ? '有効' :
                       c.subscription?.status === 'EXPIRED' ? '期限切れ' : '未設定'}
                    </span>
                    <button
                      onClick={() => {
                        setSelected(c)
                        setNfcUid(c.nfcTag?.uid ?? '')
                        setStatus(c.subscription?.status ?? 'ACTIVE')
                        setExpiresAt(c.subscription?.expiresAt ? c.subscription.expiresAt.slice(0, 10) : '')
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      編集
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}