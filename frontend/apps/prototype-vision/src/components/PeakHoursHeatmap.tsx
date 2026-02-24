import React from 'react';

interface HourData {
  hour: number;
  intensity: number;
  count: number;
  revenue: number;
}

interface DayData {
  day: number;
  dayName: string;
  hours: HourData[];
}

interface PeakHour {
  day: string;
  hour: number;
  count: number;
  revenue: number;
}

interface HeatmapSummary {
  busiestDay?: { dayName: string };
  busiestHour: number;
  totalOrders: number;
}

interface PeakHoursData {
  heatmap: DayData[];
  peakHours: PeakHour[];
  summary: HeatmapSummary;
}

interface PeakHoursHeatmapProps {
  data: PeakHoursData | null | undefined;
}

/**
 * Componente de Mapa de Calor de Horários de Pico
 * Exibe uma matriz 7 dias x 24 horas com intensidade de pedidos
 */
const PeakHoursHeatmap: React.FC<PeakHoursHeatmapProps> = ({ data }) => {
  if (!data || !data.heatmap) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Carregando heatmap...
      </div>
    );
  }

  const { heatmap, peakHours, summary } = data;

  // Função para calcular cor baseado na intensidade (0-100)
  const getColorFromIntensity = (intensity: number): string => {
    if (intensity === 0) return 'bg-gray-50';
    if (intensity < 20) return 'bg-blue-100';
    if (intensity < 40) return 'bg-blue-200';
    if (intensity < 60) return 'bg-blue-300';
    if (intensity < 80) return 'bg-blue-400';
    return 'bg-blue-500';
  };

  // Horários relevantes para mostrar (7h-23h = horário de restaurante)
  const relevantHours = Array.from({ length: 17 }, (_, i) => i + 7); // 7-23h

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Dia Mais Movimentado</div>
          <div className="text-lg font-semibold text-gray-900">
            {summary.busiestDay?.dayName || 'N/A'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Hora de Pico</div>
          <div className="text-lg font-semibold text-gray-900">
            {summary.busiestHour}:00
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total de Pedidos</div>
          <div className="text-lg font-semibold text-gray-900">
            {summary.totalOrders}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-md font-semibold text-gray-900 mb-4">
          Mapa de Calor Semanal (7h-23h)
        </h3>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header com horas */}
            <div className="flex mb-2">
              <div className="w-16 flex-shrink-0"></div>
              {relevantHours.map(hour => (
                <div
                  key={hour}
                  className="w-10 flex-shrink-0 text-xs text-gray-600 text-center font-medium"
                >
                  {hour}h
                </div>
              ))}
            </div>

            {/* Linhas de dias */}
            {heatmap.map((dayData) => (
              <div key={dayData.day} className="flex mb-1">
                {/* Label do dia */}
                <div className="w-16 flex-shrink-0 text-sm font-medium text-gray-700 py-2">
                  {dayData.dayName}
                </div>

                {/* Células de horas */}
                {relevantHours.map(hour => {
                  const hourData = dayData.hours.find(h => h.hour === hour);
                  const intensity = hourData?.intensity || 0;
                  const count = hourData?.count || 0;
                  const revenue = hourData?.revenue || 0;

                  return (
                    <div
                      key={hour}
                      className={`w-10 h-10 flex-shrink-0 ${getColorFromIntensity(intensity)}
                        border border-gray-200 flex items-center justify-center
                        transition-all duration-200 hover:ring-2 hover:ring-blue-500
                        cursor-pointer group relative`}
                      title={`${dayData.dayName} ${hour}:00\n${count} pedidos\n€${revenue}`}
                    >
                      {/* Número de pedidos (se > 0) */}
                      {count > 0 && (
                        <span className={`text-xs font-medium ${
                          intensity > 60 ? 'text-white' : 'text-gray-700'
                        }`}>
                          {count}
                        </span>
                      )}

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                        hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1
                        whitespace-nowrap z-10 pointer-events-none">
                        <div className="font-semibold">{dayData.dayName} {hour}:00</div>
                        <div>{count} pedidos | €{revenue}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2
                          border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Intensidade:</span>
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-gray-50 border border-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-blue-100 border border-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-blue-200 border border-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-blue-300 border border-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-blue-400 border border-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-blue-500 border border-gray-200 rounded"></div>
            </div>
            <span className="ml-2">
              <span className="text-gray-400">Baixa</span>
              <span className="mx-2">&rarr;</span>
              <span className="text-blue-600">Alta</span>
            </span>
          </div>
        </div>
      </div>

      {/* Top 5 Peak Hours */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-md font-semibold text-gray-900 mb-4">
          Top 5 Horários de Pico
        </h3>
        <div className="space-y-3">
          {peakHours.slice(0, 5).map((peak, index) => (
            <div
              key={`${peak.day}-${peak.hour}`}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full
                  flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {peak.day} às {peak.hour}:00
                  </div>
                  <div className="text-sm text-gray-600">
                    {peak.count} pedidos
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600">
                  €{peak.revenue}
                </div>
                <div className="text-xs text-gray-500">revenue</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeakHoursHeatmap;
