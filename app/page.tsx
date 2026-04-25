import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
        <div className="font-bold text-xl text-gray-800">NFC会員管理</div>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100">ログイン</Link>
          <Link href="/signup" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">無料で始める</Link>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="text-center px-8 py-24 max-w-3xl mx-auto">
        <div className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-6">
          NFCタグ × 会員管理
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
          タグをかざすだけで<br />会員確認ができる
        </h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          NFCタグに顧客情報を登録して、スマホをかざすだけでサブスク会員かどうかを即座に判定。小規模店舗の会員管理をシンプルに。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700">
            無料で始める
          </Link>
          <Link href="/pricing" className="border border-gray-200 text-gray-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-50">
            料金を見る
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">クレジットカード不要・30人まで無料</p>
      </section>

      {/* 特徴 */}
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

      {/* 使い方 */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">かんたん3ステップ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: '顧客を登録', desc: '名前・連絡先・有効期限を入力して会員を登録します。' },
            { step: '02', title: 'タグを紐付け', desc: 'NFCタグを顧客と紐付けて会員証として発行します。' },
            { step: '03', title: 'スキャンして確認', desc: 'スマホをかざすだけで会員の有効・無効を即座に判定。' },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="text-5xl font-bold text-blue-100 mb-4">{s.step}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 料金 */}
      <section className="bg-gray-50 px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">シンプルな料金プラン</h2>
          <p className="text-gray-500 mb-8">まずは無料から。必要になったらアップグレード。</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'フリー', price: '¥0', limit: '30人まで' },
              { name: 'スタンダード', price: '¥980', limit: '200人まで', popular: true },
              { name: 'プロ', price: '¥1,480', limit: '無制限' },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl p-5 ${p.popular ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                <p className={`text-xs font-medium mb-2 ${p.popular ? 'text-blue-200' : 'text-gray-400'}`}>{p.name}</p>
                <p className={`text-2xl font-bold mb-1 ${p.popular ? 'text-white' : 'text-gray-800'}`}>{p.price}<span className={`text-xs font-normal ${p.popular ? 'text-blue-200' : 'text-gray-400'}`}>/月</span></p>
                <p className={`text-xs ${p.popular ? 'text-blue-200' : 'text-gray-400'}`}>{p.limit}</p>
              </div>
            ))}
          </div>
          <Link href="/signup" className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700">
            無料で始める
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="text-center px-8 py-10 border-t border-gray-100">
        <p className="text-sm text-gray-400">© 2026 NFC会員管理</p>
      </footer>
    </main>
  )
}