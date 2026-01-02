import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesTrendChart = ({ data = [], period = 'hoje' }) => {
  const chartRef = useRef(null);

  // Preparar dados para o gráfico
  const labels = data.map(d => {
    if (period === 'hoje') {
      // Para hoje, mostrar hora (ex: "12:00", "13:00")
      return d.label;
    } else {
      // Para semana/mês, mostrar data formatada
      const date = new Date(d.label);
      return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
    }
  });

  const revenues = data.map(d => d.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Receita (€)',
        data: revenues,
        borderColor: 'rgb(251, 146, 60)', // orange-400
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(251, 146, 60)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(251, 146, 60, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Receita: €${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 11
          },
          callback: function(value) {
            return '€' + value.toFixed(0);
          }
        }
      }
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
        <p className="text-white/40 text-sm">Sem dados disponíveis</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default SalesTrendChart;
