import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './TrendChart.css'

function CustomTooltip({ active, payload, label, valuePrefix }) {
  if (!active || !payload?.length) return null
  return (
    <div className="trend-chart__tooltip">
      <p className="trend-chart__tooltip-label">{label}</p>
      <p className="trend-chart__tooltip-value">
        {valuePrefix}
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

/**
 * Reusable area-chart card. Powers both the Dashboard's "Recharge
 * Trends" (with a Week/Month toggle) and Recharge Link's
 * "Engagement Timeline" (single continuous dataset, no toggle).
 *
 * rangeOptions: [{ id, label, data }] — when provided, renders a
 * toggle group and switches datasets. When omitted, `data` is used
 * directly and no toggle is shown.
 */
function TrendChart({ title, subtitle, data, rangeOptions, valuePrefix = '₦', height = 280 }) {
  const [activeRange, setActiveRange] = useState(rangeOptions?.[0]?.id)
  const chartData = rangeOptions ? rangeOptions.find((opt) => opt.id === activeRange)?.data : data

  return (
    <div className="trend-chart">
      <div className="trend-chart__header">
        <div>
          <h3 className="trend-chart__title">{title}</h3>
          <p className="trend-chart__subtitle">{subtitle}</p>
        </div>
        {rangeOptions && (
          <div className="trend-chart__toggle" role="group" aria-label="Chart time range">
            {rangeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`trend-chart__toggle-btn ${activeRange === opt.id ? 'trend-chart__toggle-btn--active' : ''}`}
                onClick={() => setActiveRange(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="trend-chart__canvas">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border-default)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} width={44} />
            <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-brand-primary)"
              strokeWidth={2.5}
              fill="url(#trendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrendChart
