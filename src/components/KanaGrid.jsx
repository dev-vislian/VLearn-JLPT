export default function KanaGrid({ data }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {data.map((kana) => (
        <div
          key={kana.id}
          className="bg-zen-bg border border-zen-border rounded-lg p-4 flex flex-col items-center justify-center hover:border-zen-accent transition-colors"
        >
          <div className="text-4xl font-medium text-zen-text-dark mb-2">{kana.character}</div>
          <div className="text-sm text-zen-text">{kana.romaji}</div>
        </div>
      ))}
    </div>
  )
}
