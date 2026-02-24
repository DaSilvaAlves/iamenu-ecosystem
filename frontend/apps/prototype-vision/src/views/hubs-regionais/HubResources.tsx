import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Star, Phone, ExternalLink } from 'lucide-react';

interface Document {
    id: number;
    title: string;
    type: string;
    size: string;
    icon: string;
}

interface Partner {
    id: number;
    name: string;
    category: string;
    rating: number;
    phone: string;
}

interface Hub {
    name: string;
    region: string;
}

interface HubResourcesProps {
    hub: Hub;
}

const HubResources = ({ hub }: HubResourcesProps) => {
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const documents: Document[] = [
        { id: 1, title: `Guia de Sazonalidade ${hub.region} 2024`, type: 'PDF', size: '2.4 MB', icon: 'picture_as_pdf' },
        { id: 2, title: 'Calculadora de Margem de Verao', type: 'XLSX', size: '1.1 MB', icon: 'table_view' },
        { id: 3, title: 'Regulamentacao Local Esplanadas', type: 'PDF', size: '800 KB', icon: 'picture_as_pdf' },
        { id: 4, title: 'Fornecedores Certificados Locais', type: 'PDF', size: '1.5 MB', icon: 'picture_as_pdf' },
    ];

    const partners: Partner[] = [
        { id: 1, name: 'Peixe Fresco Lda', category: 'Fornecedor', rating: 4.8, phone: '+351 282 123 456' },
        { id: 2, name: 'EcoCleaning Services', category: 'Manutencao', rating: 4.5, phone: '+351 282 987 654' },
        { id: 3, name: 'Digital Taste Studio', category: 'Marketing Local', rating: 4.9, phone: '+351 282 456 789' },
        { id: 4, name: 'Vinhos do Sul', category: 'Fornecedor', rating: 4.7, phone: '+351 282 321 654' },
    ];

    const handleDownload = (id: number, _title: string) => {
        setDownloadingId(id);
        setTimeout(() => {
            setDownloadingId(null);
            // Simulate download complete
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Documents Section */}
            <div className="glass-panel p-8 rounded-[30px]">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary text-2xl">folder_open</span>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Recursos Locais</h2>
                </div>

                <div className="grid gap-4">
                    {documents.map((doc) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-all">
                                    <span className="material-symbols-outlined text-primary">{doc.icon}</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">{doc.title}</h4>
                                    <p className="text-xs text-white/40 font-medium">
                                        {doc.type} - {doc.size}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDownload(doc.id, doc.title)}
                                disabled={downloadingId !== null}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                                    downloadingId === doc.id
                                        ? 'bg-white/10 text-white/40 cursor-wait'
                                        : 'text-primary hover:bg-primary/10 active:scale-95'
                                }`}
                            >
                                {downloadingId === doc.id ? (
                                    <>
                                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                        <span className="text-xs font-black uppercase">A baixar...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        <span className="text-xs font-black uppercase">Baixar</span>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Partners Section */}
            <div className="glass-panel p-8 rounded-[30px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">handshake</span>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                            Parceiros Recomendados
                        </h2>
                    </div>
                    <button className="text-xs font-black text-primary hover:underline uppercase">Ver todos</button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {partners.map((partner) => (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center font-black text-white border border-primary/20">
                                        {partner.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{partner.name}</h4>
                                        <p className="text-xs text-white/40 font-bold uppercase tracking-wider">
                                            {partner.category}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                                    <Star size={12} className="text-yellow-400" fill="currentColor" />
                                    <span className="text-xs font-black text-yellow-400">{partner.rating}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl transition-all text-xs font-black uppercase">
                                    <Phone size={14} />
                                    Contactar
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl transition-all">
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-[30px] p-6 flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl">info</span>
                <div>
                    <h4 className="text-white font-bold mb-1">Sobre os Recursos</h4>
                    <p className="text-sm text-white/60 leading-relaxed">
                        Os recursos aqui listados sao especificos para o <strong className="text-white">{hub.name}</strong>.
                        Se precisar de ajuda para encontrar um parceiro ou documento, use o canal de Feedback.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HubResources;
