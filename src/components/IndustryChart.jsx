function buildTableData(scoredRows) {
  const byIndustry = {}
  for (const row of scoredRows) {
    const industry = row['Industry'] || 'Unknown'
    if (!byIndustry[industry]) byIndustry[industry] = []
    byIndustry[industry].push(row._score)
  }
  return Object.entries(byIndustry)
    .map(([industry, scores]) => ({
      industry,
      avg: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100,
      count: scores.length,
      high: Math.round(Math.max(...scores) * 100) / 100,
      low: Math.round(Math.min(...scores) * 100) / 100,
    }))
    .sort((a, b) => b.avg - a.avg)
}

export default function IndustryChart({ scoredRows }) {
  if (!scoredRows) return null

  const data = buildTableData(scoredRows)
  const maxAvg = data[0]?.avg

  return (
    <div className="chart-panel">
      <h2 className="chart-title">Average WSJ Pro Score by Industry</h2>
      <table className="results-table industry-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Industry</th>
            <th>WSJ Pro Score</th>
            <th>High</th>
            <th>Low</th>
            <th>Companies</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.industry} className={i === 0 ? 'top-rank' : ''}>
              <td className="rank-col">{i + 1}</td>
              <td>{row.industry}</td>
              <td className={`score-col score-value${row.avg === maxAvg ? ' score-top' : ''}`}>
                {row.avg.toFixed(2)}
              </td>
              <td>{row.high.toFixed(2)}</td>
              <td>{row.low.toFixed(2)}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
