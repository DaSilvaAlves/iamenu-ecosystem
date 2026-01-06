
import React, { useState } from 'react';

const Resources: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const documents = [
    { id: 1, title: 'Guia de Sazonalidade Algarve 2024', type: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Calculadora de Margem de Verão', type: 'XLSX', size: '1.1 MB' },
    { id: 3, title: 'Regulamentação Local Esplanadas', type: 'PDF', size: '800 KB' },
  ];

  const partners = [
    { id: 1, name: 'Peixe Fresco Lda', category: 'Fornecedor', rating: 4.8 },
    { id: 2, name: 'EcoCleaning Services', category: 'Manutenção', rating: 4.5 },
    { id: 3, name: 'Digital Taste Studio', category: 'Marketing Local', rating: 4.9 },
  ];

  const handleDownload = (id: number, title: string) => {
    setDownloadingId(id);
    
    // Simular atraso de rede para o download
    setTimeout(() => {
      setDownloadingId(null);
      alert(`O ficheiro "${title}" foi descarregado com sucesso para a sua pasta de transferências.`);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">folder_open</span>
          Recursos Locais
        </h2>
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-bg-dark rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">
                    {doc.type === 'PDF' ? 'picture_as_pdf' : 'table_view'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold">{doc.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(doc.id, doc.title)}
                disabled={downloadingId !== null}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  downloadingId === doc.id 
                    ? 'bg-slate-100 text-slate-400 cursor-wait' 
                    : 'text-primary hover:bg-primary/10 active:scale-90'
                }`}
              >
                {downloadingId === doc.id ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">A baixar...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">download</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Baixar</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">handshake</span>
            Parceiros Recomendados
          </h2>
          <button className="text-xs font-bold text-primary hover:underline">Ver todos</button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {partners.map(p => (
            <div key={p.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-bg-dark rounded-full flex items-center justify-center font-black text-slate-300 border border-slate-200 dark:border-white/5">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.category}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-lg text-yellow-600">
                  <span className="material-symbols-outlined text-sm filled">star</span>
                  <span className="text-xs font-black">{p.rating}</span>
                </div>
                <button className="text-[10px] font-bold text-primary p-1">Contactar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-primary">info</span>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Os recursos aqui listados são específicos para o <strong>Hub Algarve</strong>. Se precisar de ajuda para encontrar um parceiro, use o canal de Feedback.
        </p>
      </div>
    </div>
  );
};

export default Resources;
