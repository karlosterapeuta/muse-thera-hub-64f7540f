
import React from 'react';

interface StaticChartProps {
  data: any[];
  type: 'bar' | 'pie' | 'radar';
  width?: number;
  height?: number;
  colors?: string[];
}

export const StaticChart: React.FC<StaticChartProps> = ({
  data,
  type,
  width = 300,
  height = 200,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1']
}) => {
  if (type === 'bar') {
    const maxValue = Math.max(...data.map(item => item.value));
    const barWidth = (width - 60) / data.length - 10;
    
    return (
      <div style={{ width, height, position: 'relative', border: '1px solid #e2e8f0', backgroundColor: 'white' }}>
        <svg width={width} height={height} style={{ position: 'absolute' }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(tick => (
            <g key={tick}>
              <line
                x1={40}
                y1={height - 40 - (tick * (height - 80) / 100)}
                x2={width - 20}
                y2={height - 40 - (tick * (height - 80) / 100)}
                stroke="#e2e8f0"
                strokeDasharray="2,2"
              />
              <text
                x={35}
                y={height - 35 - (tick * (height - 80) / 100)}
                fontSize={10}
                textAnchor="end"
                fill="#6b7280"
              >
                {tick}
              </text>
            </g>
          ))}
          
          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / 100) * (height - 80);
            const x = 50 + index * (barWidth + 10);
            const y = height - 40 - barHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={colors[index % colors.length]}
                  rx={2}
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 20}
                  fontSize={8}
                  textAnchor="middle"
                  fill="#374151"
                  transform={`rotate(-45, ${x + barWidth / 2}, ${height - 20})`}
                >
                  {item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  fontSize={9}
                  textAnchor="middle"
                  fill="#374151"
                  fontWeight="bold"
                >
                  {item.value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    return (
      <div style={{ width, height, position: 'relative', backgroundColor: 'white' }}>
        <svg width={width} height={height} style={{ position: 'absolute' }}>
          {data.map((item, index) => {
            const sliceAngle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArc = sliceAngle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += sliceAngle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth={2}
              />
            );
          })}
        </svg>
        
        {/* Legend */}
        <div style={{ position: 'absolute', right: 10, top: 10 }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 4, fontSize: 10 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: colors[index % colors.length],
                  marginRight: 6,
                  borderRadius: 2
                }}
              />
              <span style={{ color: '#374151' }}>{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'radar') {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const angleStep = (2 * Math.PI) / data.length;

    return (
      <div style={{ width, height, position: 'relative', backgroundColor: 'white' }}>
        <svg width={width} height={height} style={{ position: 'absolute' }}>
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map(level => (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={(level / 100) * radius}
              fill="none"
              stroke="#e2e8f0"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Axis lines */}
          {data.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#e2e8f0"
              />
            );
          })}
          
          {/* Data polygon */}
          <polygon
            points={data.map((item, index) => {
              const angle = index * angleStep - Math.PI / 2;
              const distance = (item.value / 100) * radius;
              const x = centerX + distance * Math.cos(angle);
              const y = centerY + distance * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill={colors[0]}
            fillOpacity={0.3}
            stroke={colors[0]}
            strokeWidth={2}
          />
          
          {/* Labels */}
          {data.map((item, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const labelRadius = radius + 20;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            
            return (
              <text
                key={index}
                x={x}
                y={y}
                fontSize={9}
                textAnchor="middle"
                fill="#374151"
              >
                {item.name.length > 6 ? item.name.substring(0, 6) + '...' : item.name}
              </text>
            );
          })}
        </svg>
      </div>
    );
  }

  return null;
};
