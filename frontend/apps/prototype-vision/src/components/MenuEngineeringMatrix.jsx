import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const MenuEngineeringMatrix = ({ data }) => {
  const chartRef = useRef(null);

  if (!data || (!data.stars && !data.gems && !data.populars && !data.dogs)) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40">Sem dados disponíveis para o gráfico</p>
      </div>
    );
  }

  // Calcular medianas para os eixos divisórios
  const allProducts = [
    ...(data.stars || []),
    ...(data.gems || []),
    ...(data.populars || []),
    ...(data.dogs || [])
  ];

  const margins = allProducts.map(p => parseFloat(p.margin) || 0);
  const sales = allProducts.map(p => p.sales || 0);

  const medianMargin = margins.sort((a, b) => a - b)[Math.floor(margins.length / 2)] || 50;
  const medianSales = sales.sort((a, b) => a - b)[Math.floor(sales.length / 2)] || 50;

  // Preparar datasets para cada categoria
  const createDataset = (products, label, color) => {
    return products.map(p => ({
      x: parseFloat(p.margin) || 0,
      y: p.sales || 0,
      name: p.name,
      revenue: p.revenue,
      classification: p.classification || label
    }));
  };

  const datasets = [
    {
      label: 'Stars ⭐',
      data: createDataset(data.stars || [], 'Star', '#facc15'),
      backgroundColor: 'rgba(250, 204, 21, 0.8)',
      borderColor: 'rgba(250, 204, 21, 1)',
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 12,
    },
    {
      label: 'Gems 💎',
      data: createDataset(data.gems || [], 'Gem', '#22c55e'),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 12,
    },
    {
      label: 'Populars 🐴',
      data: createDataset(data.populars || [], 'Popular', '#3b82f6'),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 12,
    },
    {
      label: 'Dogs 🐕',
      data: createDataset(data.dogs || [], 'Dog', '#ef4444'),
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 12,
    },
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 15,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return context[0].raw.name;
          },
          label: (context) => {
            const data = context.raw;
            return [
              `Margem: ${data.x.toFixed(1)}%`,
              `Vendas: ${data.y} unidades`,
              `Receita: €${data.revenue.toFixed(2)}`,
              `Categoria: ${data.classification}`
            ];
          }
        }
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'MARGEM DE LUCRO (%)',
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawOnChartArea: true,
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return value + '%';
          }
        },
        min: 0,
        max: 100,
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'VOLUME DE VENDAS (QTD)',
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#9ca3af',
        },
        min: 0,
      }
    }
  };

  // Plugin para desenhar os quadrantes de fundo
  const quadrantsPlugin = {
    id: 'quadrants',
    beforeDraw: (chart) => {
      const { ctx, chartArea: { left, top, right, bottom }, scales: { x, y } } = chart;
      const xMid = x.getPixelForValue(medianMargin);
      const yMid = y.getPixelForValue(medianSales);

      ctx.save();

      // Quadrante 1 (Top-Right) - STARS - Verde/Amarelo
      ctx.fillStyle = 'rgba(250, 204, 21, 0.05)';
      ctx.fillRect(xMid, top, right - xMid, yMid - top);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
      ctx.strokeRect(xMid, top, right - xMid, yMid - top);

      // Quadrante 2 (Top-Left) - GEMS - Verde
      ctx.fillStyle = 'rgba(34, 197, 94, 0.05)';
      ctx.fillRect(left, top, xMid - left, yMid - top);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.strokeRect(left, top, xMid - left, yMid - top);

      // Quadrante 3 (Bottom-Right) - POPULARS - Azul
      ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.fillRect(xMid, yMid, right - xMid, bottom - yMid);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.strokeRect(xMid, yMid, right - xMid, bottom - yMid);

      // Quadrante 4 (Bottom-Left) - DOGS - Vermelho
      ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
      ctx.fillRect(left, yMid, xMid - left, bottom - yMid);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.strokeRect(left, yMid, xMid - left, bottom - yMid);

      // Labels dos quadrantes
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // STARS (Top-Right)
      ctx.fillStyle = 'rgba(250, 204, 21, 0.6)';
      ctx.fillText('ESTRELAS (STARS)', (xMid + right) / 2, (top + yMid) / 2 - 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px sans-serif';
      ctx.fillText('Alta Margem + Alto Volume', (xMid + right) / 2, (top + yMid) / 2 + 5);

      // GEMS (Top-Left)
      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('OPORTUNIDADES (GEMS)', (left + xMid) / 2, (top + yMid) / 2 - 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px sans-serif';
      ctx.fillText('Alta Margem + Baixo Volume', (left + xMid) / 2, (top + yMid) / 2 + 5);

      // POPULARS (Bottom-Right)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('POPULARES (WORKHORSES)', (xMid + right) / 2, (yMid + bottom) / 2 - 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px sans-serif';
      ctx.fillText('Baixa Margem + Alto Volume', (xMid + right) / 2, (yMid + bottom) / 2 + 5);

      // DOGS (Bottom-Left)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('PARA REMOVER (DOGS)', (left + xMid) / 2, (yMid + bottom) / 2 - 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px sans-serif';
      ctx.fillText('Baixa Margem + Baixo Volume', (left + xMid) / 2, (yMid + bottom) / 2 + 5);

      ctx.restore();
    }
  };

  return (
    <div style={{ height: '500px', position: 'relative' }}>
      <Scatter
        ref={chartRef}
        data={{ datasets }}
        options={options}
        plugins={[quadrantsPlugin]}
      />
    </div>
  );
};

export default MenuEngineeringMatrix;
