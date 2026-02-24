import { motion } from 'framer-motion';
import {
    Sparkles,
    Target,
    Heart,
    Users,
    TrendingUp,
    Zap,
    Shield,
    Globe,
    Lightbulb,
    Rocket,
    Award,
    ChevronRight
} from 'lucide-react';

const VisaoEcossistemaView = () => {
    const valores = [
        {
            icon: Lightbulb,
            title: 'Inovação',
            description: 'Usar tecnologia para resolver problemas reais da restauração',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: Users,
            title: 'Comunidade',
            description: 'Criar uma rede de apoio entre donos de restaurantes',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: TrendingUp,
            title: 'Crescimento',
            description: 'Capacitar restaurantes a crescerem de forma sustentável',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Shield,
            title: 'Confiança',
            description: 'Transparência e segurança em todas as operações',
            color: 'from-purple-500 to-pink-500'
        }
    ];

    const modulos = [
        { name: 'Community', icon: 'groups', description: 'Rede social para restaurantes' },
        { name: 'Marketplace', icon: 'store', description: 'Fornecedores e cotações' },
        { name: 'Reputação Online', icon: 'star', description: 'Gestão de reviews com AI' },
        { name: 'Escalas de Staff AI', icon: 'calendar_today', description: 'Gestão inteligente de equipas e turnos' },
        { name: 'Business Intelligence', icon: 'analytics', description: 'Dashboards e métricas' },
        { name: 'Food Cost', icon: 'restaurant', description: 'Gestão de custos e fichas técnicas' },
        { name: 'Marketing Planner', icon: 'campaign', description: 'Planeamento de marketing com AI' },
        { name: 'GastroLens', icon: 'photo_camera', description: 'Computer vision para pratos' },
        { name: 'Academia', icon: 'school', description: 'Formação e capacitação' },
        { name: 'Hubs Regionais', icon: 'hub', description: 'Comunidades locais' },
    ];

    const estatisticas = [
        { valor: '10+', label: 'Módulos Integrados' },
        { valor: '100%', label: 'Foco em Restauração' },
        { valor: 'AI', label: 'Powered' },
        { valor: '∞', label: 'Potencial de Crescimento' },
    ];

    return (
        <div className="space-y-0 -m-8">
            {/* Hero Section */}
            <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#1a1a1a] to-[#0c0c0c]"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <Sparkles size={16} className="text-primary" />
                            <span className="text-primary text-sm font-black uppercase tracking-wider">Visão do Ecossistema</span>
                        </div>

                        <h1 className="text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">
                            Revolucionar a
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400">
                                Restauração
                            </span>
                            <br />
                            em Portugal
                        </h1>

                        <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-8">
                            O iaMenu é mais do que software. É um ecossistema completo que une tecnologia,
                            comunidade e inteligência artificial para transformar a forma como os restaurantes
                            operam, crescem e prosperam.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 transition-all"
                            >
                                <Rocket size={20} />
                                Explorar Módulos
                                <ChevronRight size={20} />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-4 gap-6 mt-16"
                    >
                        {estatisticas.map((stat, index) => (
                            <div key={index} className="glass-panel p-6 rounded-[30px]">
                                <div className="text-4xl font-black text-primary mb-2">{stat.valor}</div>
                                <div className="text-sm text-white/60 font-bold uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Missão Section */}
            <section className="py-24 px-8 bg-gradient-to-b from-transparent to-primary/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                            <Target size={16} className="text-primary" />
                            <span className="text-white/60 text-xs font-black uppercase tracking-wider">Nossa Missão</span>
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">
                            Capacitar Restaurantes
                            <br />
                            com Tecnologia Inteligente
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="glass-panel p-8 rounded-[30px]"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <Heart size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">O Problema</h3>
                            <p className="text-white/60 leading-relaxed">
                                Donos de restaurantes enfrentam desafios diários: margens apertadas, gestão de equipas,
                                reputação online, fornecedores, marketing. Tudo isto enquanto tentam servir os melhores
                                pratos aos seus clientes.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="glass-panel p-8 rounded-[30px] bg-gradient-to-br from-primary/10 to-transparent border-primary/20"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <Zap size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">A Solução</h3>
                            <p className="text-white/60 leading-relaxed">
                                O iaMenu reúne todas as ferramentas essenciais num único ecossistema integrado.
                                Com IA, automação e uma comunidade ativa, libertamos tempo para os donos focarem
                                no que fazem de melhor: criar experiências gastronómicas incríveis.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Valores Section */}
            <section className="py-24 px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                            <Award size={16} className="text-primary" />
                            <span className="text-white/60 text-xs font-black uppercase tracking-wider">Nossos Valores</span>
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">
                            O Que Nos Move
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {valores.map((valor, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="glass-panel p-8 rounded-[30px] hover:border-primary/30 transition-all group"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${valor.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <valor.icon size={32} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3">{valor.title}</h3>
                                <p className="text-white/60 leading-relaxed">{valor.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ecossistema Section */}
            <section className="py-24 px-8 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                            <Globe size={16} className="text-primary" />
                            <span className="text-white/60 text-xs font-black uppercase tracking-wider">O Ecossistema</span>
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">
                            Todos os Módulos
                            <br />
                            Trabalhando Juntos
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            Cada módulo foi desenhado para resolver um desafio específico, mas a verdadeira magia
                            acontece quando trabalham em conjunto.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {modulos.map((modulo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="glass-panel p-6 rounded-[24px] hover:bg-white/10 transition-all group cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-all flex-shrink-0">
                                        <span className="material-symbols-outlined text-primary text-2xl">{modulo.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black mb-1">{modulo.name}</h4>
                                        <p className="text-xs text-white/40 leading-relaxed">{modulo.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto glass-panel p-12 rounded-[40px] text-center bg-gradient-to-br from-primary/20 to-transparent border-primary/30"
                >
                    <Sparkles size={48} className="text-primary mx-auto mb-6" />
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                        Juntos, Transformamos a Restauração
                    </h2>
                    <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
                        Esta é apenas o início da jornada. Com cada restaurante que se junta ao ecossistema,
                        ficamos mais fortes e mais capazes de criar impacto real.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 transition-all"
                    >
                        Explorar o Ecossistema
                    </motion.button>
                </motion.div>
            </section>
        </div>
    );
};

export default VisaoEcossistemaView;
