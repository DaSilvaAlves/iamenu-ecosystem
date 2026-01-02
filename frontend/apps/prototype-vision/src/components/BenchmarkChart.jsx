import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

/**
 * Componente de Gráfico de Benchmark (comparação vs. setor)
 * Usa Chart.js para renderizar um gráfico de barras comparativo
 */
const BenchmarkChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || !data.comparisons) return;

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Preparar dados do gráfico
    const metrics = Object.values(data.comparisons);
    const labels = metrics.map(m => m.label);
    const yourValues = metrics.map(m => m.yours);
    const industryValues = metrics.map(m => m.industry);

    // Cores baseadas no status
    const barColors = metrics.map(m =>
      m.status === 'good' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(251, 146, 60, 0.8)'
    );
    const barBorderColors = metrics.map(m =>
      m.status === 'good' ? 'rgb(34, 197, 94)' : 'rgb(251, 146, 60)'
    );

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Seu Restaurante',
            data: yourValues,
            backgroundColor: barColors,
            borderColor: barBorderColors,
            borderWidth: 2,
            borderRadius: 6
          },
          {
            label: 'Média do Setor',
            data: industryValues,
            backgroundColor: 'rgba(148, 163, 184, 0.3)',
            borderColor: 'rgb(148, 163, 184)',
            borderWidth: 2,
            borderRadius: 6,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 13,
                family: 'Inter, sans-serif',
                weight: '600'
              },
              color: '#fff'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: 12,
            bodySpacing: 5,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                const metricIndex = context.dataIndex;
                const metric = metrics[metricIndex];

                // Formatação especial para Food Cost e Taxa de Ocupação (%)
                if (metric.label.includes('%') || metric.label.includes('Food Cost')) {
                  return `${label}: ${value.toFixed(1)}%`;
                }
                // Formatação para valores monetários
                else if (metric.label.includes('Ticket') || metric.label.includes('Seat')) {
                  return `${label}: €${value.toFixed(2)}`;
                }
                return `${label}: ${value.toFixed(1)}`;
              },
              afterLabel: (context) => {
                const metricIndex = context.dataIndex;
                const metric = metrics[metricIndex];
                const diff = metric.diff;

                if (context.datasetIndex === 0) { // Seu restaurante
                  const sign = diff > 0 ? '+' : '';
                  const diffFormatted = metric.label.includes('%') || metric.label.includes('Food Cost')
                    ? `${sign}${diff.toFixed(1)}%`
                    : metric.label.includes('Ticket') || metric.label.includes('Seat')
                    ? `${sign}€${diff.toFixed(2)}`
                    : `${sign}${diff.toFixed(1)}`;

                  return `Diferença: ${diffFormatted}`;
                }
                return '';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 11
              },
              color: '#fff',
              callback: function(value) {
                return value.toFixed(0);
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            border: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          x: {
            ticks: {
              font: {
                size: 11,
                weight: '500'
              },
              color: '#fff'
            },
            grid: {
              display: false
            },
            border: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data || !data.comparisons) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Carregando benchmark...
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BenchmarkChart;
