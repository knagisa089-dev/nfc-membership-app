'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Customer = {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  birthday: string | null
  note: string | null
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
  plan: string
  isAdmin: boolean
}

type ScanLog = {
  id: string
  nfcUid: string
  result: string
  scannedAt: string
  customerName: string
}

function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
        <div className="font-bold text-xl text-gray-800">NFC会員管理</div>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100">ログイン</Link>
          <Link href="/signup" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">無料で始める</Link>
        </div>
      </header>
      <section className="text-center px-8 py-24 max-w-3xl mx-auto">
        <div className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-6">NFCタグ × 会員管理</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">タグをかざすだけで<br />会員確認ができる</h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">NFCタグに顧客情報を登録して、スマホをかざすだけでサブスク会員かどうかを即座に判定。小規模店舗の会員管理をシンプルに。</p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700">無料で始める</Link>
          <Link href="/pricing" className="border border-gray-200 text-gray-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-50">料金を見る</Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">クレジットカード不要・30人まで無料</p>
      </section>
      <section className="bg-gray-50 px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">こんなお悩みを解決します</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📋', title: '会員証の管理が大変', desc: '紙の会員証やアプリの切り替えが不要。NFCタグ1枚で完結します。' },
              { icon: '⏱', title: 'チェックに時間がかかる', desc: 'タグをかざすだけで即座に有効・無効を判定。会計待ちもゼロに。' },
              { icon: '💰', title: '高額なシステムは不要', desc: '月額0円から始められます。使った分だけ、必要な分だけ。' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="text-center px-8 py-10 border-t border-gray-100">
        <p className="text-sm text-gray-400">© 2026 NFC会員管理</p>
      </footer>
    </main>
  )
}

function Dashboard({ tenant }: { tenant: Tenant }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [birthday, setBirthday] = useState('')
  const [note, setNote] = useState('')
  const [nfcUid, setNfcUid] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [expiresAt, setExpiresAt] = useState('')
  const [showScanUrl, setShowScanUrl] = useState(false)
  const [origin, setOrigin] = useState('')
  const [search, setSearch] = useState('')
  const [limitError, setLimitError] = useState('')

  const load = () =>
    fetch('/api/customers').then(r => r.json()).then(setCustomers)

  useEffect(() => {
    load()
    setOrigin(window.location.origin)
  }, [])

  const loadLogs = () => {
    fetch('/api/scan-logs').then(r => r.json()).then(setScanLogs)
    setShowLogs(true)
  }

  const addCustomer = async () => {
    if (!name) return
    setLimitError('')
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, address, birthday, note }),
    })
    const data = await res.json()
    if (!res.ok) { setLimitError(data.error); return }
    setName(''); setEmail(''); setPhone(''); setAddress(''); setBirthday(''); setNote('')
    setShowForm(false)
    load()
  }

  const saveCustomer = async () => {
    if (!selected) return
    await fetch(`/api/customers/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, address, birthday, note, nfcUid, status, expiresAt }),
    })
    setSelected(null)
    load()
  }

  const deleteCustomer = async (id: string) => {
    if (!confirm('この顧客を削除しますか？')) return
    await fetch(`/api/customers/${id}`, { method: 'DELETE' })
    load()
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const scanUrl = `${origin}/scan?tid=${tenant?.id}&uid=`
  const active = customers.filter(c => c.subscription?.status === 'ACTIVE').length
  const expired = customers.filter(c => c.subscription?.status === 'EXPIRED').length

  const filtered = customers.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.address?.toLowerCase().includes(q)
    )
  })

  const planLabel = tenant?.plan === 'PRO' ? 'プロ' : tenant?.plan === 'STANDARD' ? 'スタンダード' : tenant?.plan === 'LIFETIME' ? 'ライフタイム' : 'フリー'
  const planColor = tenant?.plan === 'PRO' ? 'text-purple-600 border-purple-200 bg-purple-50' : tenant?.plan === 'STANDARD' ? 'text-blue-600 border-blue-200 bg-blue-50' : tenant?.plan === 'LIFETIME' ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-gray-500 border-gray-200'

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">NFC会員管理</h1>
            {tenant?.shopName && <p className="text-sm text-gray-400">{tenant.shopName}</p>}
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <span className={`text-xs border px-3 py-2 rounded-lg ${planColor}`}>{planLabel}プラン</span>
            {tenant?.isAdmin && <a href="/admin" className="text-sm text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50">管理者</a>}
            <button onClick={() => setShowScanUrl(!showScanUrl)} className="text-sm text-blue-600 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50">スキャンURL</button>
            <button onClick={loadLogs} className="text-sm text-purple-600 border border-purple-200 px-3 py-2 rounded-lg hover:bg-purple-50">来店履歴</button>
            <button onClick={() => window.location.href = '/api/export'} className="text-sm text-green-600 border border-green-200 px-3 py-2 rounded-lg hover:bg-green-50">CSV出力</button>
            <a href="/pricing" className="text-sm text-yellow-600 border border-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-50">プラン変更</a>
            <button onClick={logout} className="text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100">ログアウト</button>
          </div>
        </div>

        {showScanUrl && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-blue-800 mb-2">iPhoneショートカット用スキャンURL</p>
            <p className="text-xs text-blue-600 font-mono break-all">{scanUrl}【タグUID】</p>
            <p className="text-xs text-gray-500 mt-2">【タグUID】の部分をNFCタグのUIDに置き換えてください</p>
          </div>
        )}

        {showLogs && (
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">来店履歴（直近100件）</h2>
              <button onClick={() => setShowLogs(false)} className="text-sm text-gray-400 hover:text-gray-600">閉じる</button>
            </div>
            {scanLogs.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">まだ履歴がありません</div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {scanLogs.map(l => (
                  <div key={l.id} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{l.customerName}</p>
                      <p className="text-xs text-gray-400">{new Date(l.scannedAt).toLocaleString('ja-JP')}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      l.result === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      l.result === 'EXPIRED' ? 'bg-red-100 text-red-600' :
                      l.result === 'NOT_FOUND' ? 'bg-gray-100 text-gray-500' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {l.result === 'ACTIVE' ? '有効' : l.result === 'EXPIRED' ? '期限切れ' : l.result === 'NOT_FOUND' ? '未登録' : '停止中'}
                    </span>
                  </div>
                ))}
              </div>
            )}
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

        {limitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-700">{limitError}</p>
            <a href="/pricing" className="inline-block mt-2 text-sm font-medium text-red-600 underline">プランをアップグレードする →</a>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
            <h2 className="font-semibold text-gray-800 mb-4">顧客を追加</h2>
            <div className="space-y-3">
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="名前（必須）" value={name} onChange={e => setName(e.target.value)} />
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="電話番号" value={phone} onChange={e => setPhone(e.target.value)} />
              <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="住所" value={address} onChange={e => setAddress(e.target.value)} />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">誕生日</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={birthday} onChange={e => setBirthday(e.target.value)} />
              </div>
              <textarea className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="メモ" rows={2} value={note} onChange={e => setNote(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={addCustomer} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">追加する</button>
                <button onClick={() => setShowForm(false)} className="text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-100">キャンセル</button>
              </div>
            </div>
          </div>
        )}

        {selected && (
          <div className="bg-white rounded-xl border border-blue-200 p-6 mb-4">
            <h2 className="font-semibold text-gray-800 mb-4">{selected.name} を編集</h2>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500 mb-1 block">名前</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={name} onChange={e => setName(e.target.value)} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">メールアドレス</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">電話番号</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">住所</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={address} onChange={e => setAddress(e.target.value)} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">誕生日</label><input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={birthday} onChange={e => setBirthday(e.target.value)} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">メモ</label><textarea className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" rows={2} value={note} onChange={e => setNote(e.target.value)} /></div>
              <div className="border-t border-gray-100 pt-3">
                <label className="text-xs text-gray-500 mb-1 block">NFCタグUID</label>
                <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm font-mono" placeholder="例: 04:A1:B2:C3" value={nfcUid} onChange={e => setNfcUid(e.target.value)} />
              </div>
              <div><label className="text-xs text-gray-500 mb-1 block">会員ステータス</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="ACTIVE">有効</option>
                  <option value="EXPIRED">期限切れ</option>
                  <option value="SUSPENDED">停止中</option>
                </select>
              </div>
              <div><label className="text-xs text-gray-500 mb-1 block">有効期限</label><input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} /></div>
              <div className="flex gap-2">
                <button onClick={saveCustomer} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">保存する</button>
                <button onClick={() => setSelected(null)} className="text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-100">キャンセル</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <h2 className="font-semibold text-gray-800 flex-shrink-0">顧客一覧</h2>
            <input className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="名前・メール・電話・住所で検索" value={search} onChange={e => setSearch(e.target.value)} />
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 flex-shrink-0">+ 追加</button>
          </div>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">{search ? '検索結果がありません' : 'まだ顧客が登録されていません'}</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(c => (
                <div key={c.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-400">{c.email ?? '—'} {c.phone ? `/ ${c.phone}` : ''}</p>
                    {c.address && <p className="text-xs text-gray-300 mt-1">{c.address}</p>}
                    <p className="text-xs text-gray-300 mt-1">タグ: {c.nfcTag?.uid ?? '未登録'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      c.subscription?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      c.subscription?.status === 'EXPIRED' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {c.subscription?.status === 'ACTIVE' ? '有効' : c.subscription?.status === 'EXPIRED' ? '期限切れ' : '未設定'}
                    </span>
                    <button onClick={() => {
                      setSelected(c); setName(c.name); setEmail(c.email ?? ''); setPhone(c.phone ?? ''); setAddress(c.address ?? ''); setBirthday(c.birthday ?? ''); setNote(c.note ?? ''); setNfcUid(c.nfcTag?.uid ?? ''); setStatus(c.subscription?.status ?? 'ACTIVE'); setExpiresAt(c.subscription?.expiresAt ? c.subscription.expiresAt.slice(0, 10) : '')
                    }} className="text-xs text-blue-600 hover:underline">編集</button>
                    <button onClick={() => deleteCustomer(c.id)} className="text-xs text-red-400 hover:underline">削除</button>
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

export default function Home() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setTenant(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">読み込み中...</p>
    </main>
  )

  if (tenant?.id) return <Dashboard tenant={tenant} />
  return <LandingPage />
}