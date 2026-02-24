import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ForecastEntry {
  dayName: string;
  date: string;
  revenue: number;
  orders: number;
  confidence: number;
}

interface DemandForecastData {
  forecast: ForecastEntry[];
}

interface DemandForecastChartProps {
  data: DemandForecastData | null | undefined;
}

/**
 * Componente de Gráfico de Previsão de Demanda (próximos 7 dias)
 * Usa Chart.js para renderizar um gráfico de linha
 */
const DemandForecastChart: React.FC<DemandForecastChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || !data.forecast) return;

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Preparar dados do gráfico
    const labels = data.forecast.map(f => `${f.dayName} ${f.date.split('-')[2]}`);
    const revenues = data.forecast.map(f => f.revenue);
    const orders = data.forecast.map(f => f.orders);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Receita Prevista (€)',
            data: revenues,
            borderColor: 'rgb(59, 130, 246)', // blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'Pedidos Previstos',
            data: orders,
            borderColor: 'rgb(16, 185, 129)', // green-500
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
            yAxisID: 'y1'
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
                size: 12,
                family: 'Inter, sans-serif'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            bodySpacing: 5,
            titleFont: {
              size: 13,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                const forecast = data.forecast[index];
                return `${forecast.dayName}, ${forecast.date}`;
              },
              afterTitle: (context) => {
                const index = context[0].dataIndex;
                const forecast = data.forecast[index];
                return `Confiança: ${forecast.confidence}%`;
              },
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                if (label.includes('Receita')) {
                  return `${label}: €${value.toFixed(0)}`;
                }
                return `${label}: ${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Receita (€)',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            ticks: {
              callback: (value) => `€${value}`
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Pedidos',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            grid: {
              drawOnChartArea: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
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

  if (!data || !data.forecast) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Carregando previsão...
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DemandForecastChart;
