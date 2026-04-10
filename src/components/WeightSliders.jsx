import { getTotal } from '../utils/scoringModel.js'

export default function WeightSliders({ weightColumns, weights, defaultWeights, onWeightsChange, onScore }) {
  const total = getTotal(weights)
  const isValid = total === 100

  function handleSliderChange(col, value) {
    onWeightsChange({ ...weights, [col]: Number(value) })
  }

  function handleReset() {
    onWeightsChange({ ...defaultWeights })
  }

  if (weightColumns.length === 0) return null

  return (
    <div className="sliders-panel">
      <div className="sliders-header">
        <h2>Score Weights</h2>
        <span className={`total-display ${isValid ? 'total--valid' : 'total--invalid'}`}>
          Total: {total} / 100 {isValid ? '✓' : ''}
        </span>
      </div>

      <div className="sliders-list">
        {weightColumns.map((col) => (
          <div key={col} className="slider-row">
            <label className="slider-label" title={col}>{col}</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={weights[col] ?? 0}
              onChange={(e) => handleSliderChange(col, e.target.value)}
              className="slider-input"
            />
            <span className="slider-value">{weights[col] ?? 0}</span>
          </div>
        ))}
      </div>

      <div className="sliders-actions">
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset to Default
        </button>
        <button
          className="btn btn-primary"
          onClick={onScore}
          disabled={!isValid}
          title={isValid ? '' : 'Weights must sum to 100'}
        >
          Score
        </button>
      </div>
    </div>
  )
}
