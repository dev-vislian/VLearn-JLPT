import { useMemo } from 'react'
import { Volume2 } from 'lucide-react'
import { speak } from '../utils/helper.js'

const VOWEL_HEADERS = ['あ', 'い', 'う', 'え', 'お']
const YOUON_HEADERS = ['ゃ', 'ゅ', 'ょ']

const SEION_HIRA = [
  { label: 'あ', cells: ['あ', 'い', 'う', 'え', 'お'] },
  { label: 'か', cells: ['か', 'き', 'く', 'け', 'こ'] },
  { label: 'さ', cells: ['さ', 'し', 'す', 'せ', 'そ'] },
  { label: 'た', cells: ['た', 'ち', 'つ', 'て', 'と'] },
  { label: 'な', cells: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { label: 'は', cells: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { label: 'ま', cells: ['ま', 'み', 'む', 'め', 'も'] },
  { label: 'や', cells: ['や', null, 'ゆ', null, 'よ'] },
  { label: 'ら', cells: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { label: 'わ', cells: ['わ', null, null, null, 'を'] },
]

const SEION_KATA = [
  { label: 'ア', cells: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
  { label: 'カ', cells: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
  { label: 'サ', cells: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
  { label: 'タ', cells: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
  { label: 'ナ', cells: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
  { label: 'ハ', cells: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
  { label: 'マ', cells: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
  { label: 'ヤ', cells: ['ヤ', null, 'ユ', null, 'ヨ'] },
  { label: 'ラ', cells: ['ラ', 'リ', 'ル', 'レ', 'ロ'] },
  { label: 'ワ', cells: ['ワ', null, null, null, 'ヲ'] },
]

const DAKUON_HIRA = [
  { label: 'が', mark: '゛', cells: ['が', 'ぎ', 'ぐ', 'げ', 'ご'] },
  { label: 'ざ', mark: '゛', cells: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'] },
  { label: 'だ', mark: '゛', cells: ['だ', 'ぢ', 'づ', 'で', 'ど'] },
  { label: 'ば', mark: '゛', cells: ['ば', 'び', 'ぶ', 'べ', 'ぼ'] },
  { label: 'ぱ', mark: '゜', cells: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'] },
]

const DAKUON_KATA = [
  { label: 'ガ', mark: '゛', cells: ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'] },
  { label: 'ザ', mark: '゛', cells: ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'] },
  { label: 'ダ', mark: '゛', cells: ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'] },
  { label: 'バ', mark: '゛', cells: ['バ', 'ビ', 'ブ', 'ベ', 'ボ'] },
  { label: 'パ', mark: '゜', cells: ['パ', 'ピ', 'プ', 'ペ', 'ポ'] },
]

const YOUON_HIRA = [
  { label: 'き', cells: ['きゃ', 'きゅ', 'きょ'] },
  { label: 'ぎ', cells: ['ぎゃ', 'ぎゅ', 'ぎょ'] },
  { label: 'し', cells: ['しゃ', 'しゅ', 'しょ'] },
  { label: 'じ', cells: ['じゃ', 'じゅ', 'じょ'] },
  { label: 'ち', cells: ['ちゃ', 'ちゅ', 'ちょ'] },
  { label: 'に', cells: ['にゃ', 'にゅ', 'にょ'] },
  { label: 'ひ', cells: ['ひゃ', 'ひゅ', 'ひょ'] },
  { label: 'び', cells: ['びゃ', 'びゅ', 'びょ'] },
  { label: 'ぴ', cells: ['ぴゃ', 'ぴゅ', 'ぴょ'] },
  { label: 'み', cells: ['みゃ', 'みゅ', 'みょ'] },
  { label: 'り', cells: ['りゃ', 'りゅ', 'りょ'] },
]

const YOUON_KATA = [
  { label: 'キ', cells: ['キャ', 'キュ', 'キョ'] },
  { label: 'ギ', cells: ['ギャ', 'ギュ', 'ギョ'] },
  { label: 'シ', cells: ['シャ', 'シュ', 'ショ'] },
  { label: 'ジ', cells: ['ジャ', 'ジュ', 'ジョ'] },
  { label: 'チ', cells: ['チャ', 'チュ', 'チョ'] },
  { label: 'ニ', cells: ['ニャ', 'ニュ', 'ニョ'] },
  { label: 'ヒ', cells: ['ヒャ', 'ヒュ', 'ヒョ'] },
  { label: 'ビ', cells: ['ビャ', 'ビュ', 'ビョ'] },
  { label: 'ピ', cells: ['ピャ', 'ピュ', 'ピョ'] },
  { label: 'ミ', cells: ['ミャ', 'ミュ', 'ミョ'] },
  { label: 'リ', cells: ['リャ', 'リュ', 'リョ'] },
]

function Cell({ item }) {
  if (!item) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-zen-border/40 min-h-[70px]">
        <span className="text-zen-border/60 text-lg">・</span>
      </div>
    )
  }
  return (
    <button
      onClick={() => speak(item.character)}
      title={`${item.romaji} — ${item.example?.word || ''} (${item.example?.meaning || ''})`}
      className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-zen-border bg-zen-bg min-h-[70px] py-2 hover:border-zen-accent hover:bg-zen-accent/5 hover:-translate-y-0.5 transition-all"
    >
      <Volume2 size={11} className="absolute top-1.5 right-1.5 text-zen-text/0 group-hover:text-zen-accent transition-colors" />
      <span className="japanese-text text-3xl leading-none text-zen-text-dark">{item.character}</span>
      <span className="text-[11px] text-zen-text mt-1">{item.romaji}</span>
    </button>
  )
}

function RowHeader({ label, mark }) {
  return (
    <div className="flex flex-col items-center justify-center w-10 shrink-0">
      <span className="japanese-text text-xl leading-none text-zen-accent-dark font-bold">{label}</span>
      {mark && (
        <span className="japanese-text text-sm leading-none text-zen-seal mt-0.5" title={mark === '゜' ? '半濁点 handakuten' : '濁点 dakuten'}>
          {mark}
        </span>
      )}
    </div>
  )
}

function SectionTitle({ jp, romaji, desc }) {
  return (
    <div className="mb-4 pb-2 border-b border-zen-border">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="japanese-text text-2xl font-bold text-zen-text-dark">{jp}</span>
        <span className="text-sm font-semibold text-zen-accent-dark">{romaji}</span>
        <span className="text-xs text-zen-text/60">{desc}</span>
      </div>
    </div>
  )
}

function ColumnHeaders({ headers }) {
  return (
    <div className="flex gap-2 mb-2">
      <div className="w-10 shrink-0" />
      <div className="grid gap-2 flex-1" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
        {headers.map((h) => (
          <div key={h} className="japanese-text text-center text-sm text-zen-text/50">
            {h}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function KanaGrid({ data }) {
  const lookup = useMemo(() => new Map(data.map((k) => [k.character, k])), [data])
  const isKatakana = data[0]?.id?.startsWith('k-')
  const at = (char) => (char ? lookup.get(char) : null)

  const seionRows = isKatakana ? SEION_KATA : SEION_HIRA
  const dakuonRows = isKatakana ? DAKUON_KATA : DAKUON_HIRA
  const youonRows = isKatakana ? YOUON_KATA : YOUON_HIRA
  const nChar = isKatakana ? 'ン' : 'ん'
  const nItem = lookup.get(nChar)
  const vowelHeaders = isKatakana ? ['ア', 'イ', 'ウ', 'エ', 'オ'] : VOWEL_HEADERS
  const youonHeaders = isKatakana ? ['ャ', 'ュ', 'ョ'] : YOUON_HEADERS

  return (
    <div className="space-y-10">
      <section>
        <SectionTitle jp="清音" romaji="Seion" desc="Kana dasar — 10 konsonan × 5 vokal" />
        <ColumnHeaders headers={vowelHeaders} />
        {seionRows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 mb-2">
            <RowHeader label={row.label} />
            <div className="grid gap-2 flex-1" style={{ gridTemplateColumns: `repeat(5, minmax(0, 1fr))` }}>
              {row.cells.map((char, i) => (
                <Cell key={`${row.label}-${i}`} item={at(char)} />
              ))}
            </div>
          </div>
        ))}
        {nItem && (
          <div className="flex items-center gap-2 mt-3">
            <RowHeader label={nChar} />
            <div className="flex-1">
              <Cell item={nItem} />
            </div>
          </div>
        )}
      </section>

      <section>
        <SectionTitle jp="濁音・半濁音" romaji="Dakuon / Handakuon" desc="Kana bersuara: ゛dakuten dan ゜handakuten" />
        <ColumnHeaders headers={vowelHeaders} />
        {dakuonRows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 mb-2">
            <RowHeader label={row.label} mark={row.mark} />
            <div className="grid gap-2 flex-1" style={{ gridTemplateColumns: `repeat(5, minmax(0, 1fr))` }}>
              {row.cells.map((char, i) => (
                <Cell key={`${row.label}-${i}`} item={at(char)} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section>
        <SectionTitle jp="拗音" romaji="Yōon" desc="Gabungan palatal: konsonan + y + vokal kecil" />
        <ColumnHeaders headers={youonHeaders} />
        {youonRows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 mb-2">
            <RowHeader label={row.label} />
            <div className="grid gap-2 flex-1" style={{ gridTemplateColumns: `repeat(3, minmax(0, 1fr))` }}>
              {row.cells.map((char, i) => (
                <Cell key={`${row.label}-${i}`} item={at(char)} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
