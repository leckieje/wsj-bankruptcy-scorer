const PERCENT_COLUMNS = new Set(['FSS Weekly Change', 'Negative Articles'])
const ROUND2_COLUMNS = new Set(['Z-Score', 'Receivables to Revenue'])
const DOLLAR_COLUMNS = new Set(['Current Open Price', '52-Week High Price', '52-Week Low Price'])

function formatCell(col, value, isScored) {
  if (value === null || value === undefined || value === '') return ''
  if (PERCENT_COLUMNS.has(col) && typeof value === 'number') return `${value}%`
  if (col === 'FSS Score' && isScored && typeof value === 'number')
    return (value * 100).toFixed(2)
  if (ROUND2_COLUMNS.has(col) && typeof value === 'number') return value.toFixed(2)
  if (col === 'Market Capitalization' && typeof value === 'number')
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`
  if (DOLLAR_COLUMNS.has(col) && typeof value === 'number')
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return value
}

export default function ResultsTable({ rows, displayColumns, scoredRows }) {
  const data = scoredRows ?? rows
  const isScored = scoredRows !== null

  if (!data || data.length === 0) return <p className="empty-state">No data loaded.</p>

  // Insert score column after "Company" (index 1), or at index 1 if Company not found
  const companyIndex = displayColumns.indexOf('Company')
  const scoreInsertIndex = companyIndex >= 0 ? companyIndex + 1 : 1

  const colsBefore = displayColumns.slice(0, scoreInsertIndex)
  const colsAfter = displayColumns.slice(scoreInsertIndex)

  return (
    <div className="table-wrapper">
      <table className="results-table">
        <thead>
          <tr>
            {isScored && <th className="rank-col">#</th>}
            {colsBefore.map((col) => (
              <th key={col}>{col === 'Market Capitalization' ? 'Market Capitalization ($M)' : col}</th>
            ))}
            {isScored && <th className="score-col">WSJ Pro Score</th>}
            {colsAfter.map((col) => (
              <th key={col}>{col === 'Market Capitalization' ? 'Market Capitalization ($M)' : col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={isScored && i < 3 ? 'top-rank' : ''}>
              {isScored && <td className="rank-col">{i + 1}</td>}
              {colsBefore.map((col) => (
                <td key={col}>{formatCell(col, row[col], isScored)}</td>
              ))}
              {isScored && (
                <td className="score-col score-value">{row._score.toFixed(2)}</td>
              )}
              {colsAfter.map((col) => (
                <td key={col}>{formatCell(col, row[col], isScored)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
