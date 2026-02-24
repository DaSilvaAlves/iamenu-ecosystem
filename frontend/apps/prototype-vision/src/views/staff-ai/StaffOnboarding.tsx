// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion } from 'framer-motion';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

const StaffOnboarding = () => {
    const onboardingStaff = [
        {
            id: 1,
            name: 'Carlos Ferreira',
            position: 'Empregado Mesa',
            progress: 60,
            avatar: 'CF',
            startDate: '1 Out 2023',
            tasks: {
                completed: 3,
                total: 5
            }
        },
        {
            id: 2,
            name: 'Rita Oliveira',
            position: 'Barman',
            progress: 40,
            avatar: 'RO',
            startDate: '5 Out 2023',
            tasks: {
                completed: 2,
                total: 5
            }
        },
    ];

    const onboardingTasks = [
        { id: 1, title: 'Configurar Perfil', category: 'Essencial', completed: true, urgent: false },
        { id: 2, title: 'Ler Manual de Conduta', category: 'Essencial', completed: true, urgent: false },
        { id: 3, title: 'Visita Guiada à Cozinha', category: 'Essencial', completed: false, urgent: true },
        { id: 4, title: 'Tutorial POS', category: 'Formação', completed: false, urgent: false },
        { id: 5, title: 'Protocolos de Higiene', category: 'Formação', completed: false, urgent: false },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Onboarding Digital</h2>
                <p className="text-sm text-white/60">{onboardingStaff.length} colaboradores em integração</p>
            </div>

            {/* Staff in Onboarding */}
            <div className="grid md:grid-cols-2 gap-6">
                {onboardingStaff.map((staff, index) => (
                    <motion.div
                        key={staff.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel p-8 rounded-[30px]"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center font-black text-white text-lg">
                                    {staff.avatar}
                                </div>
                                <div>
                                    <h3 className="text-white font-black">{staff.name}</h3>
                                    <p className="text-sm text-white/60">{staff.position}</p>
                                    <p className="text-xs text-white/40 mt-1">Início: {staff.startDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-white/60 uppercase">Progresso</span>
                                <span className="text-sm font-black text-primary">{staff.progress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-orange-500 transition-all"
                                    style={{ width: `${staff.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Tasks Stats */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                            <div className="text-2xl font-black text-white mb-1">
                                {staff.tasks.completed}/{staff.tasks.total}
                            </div>
                            <div className="text-xs text-white/60 font-bold uppercase">Tarefas Completas</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Onboarding Checklist */}
            <div className="glass-panel p-8 rounded-[30px]">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary text-2xl">checklist</span>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                        Checklist de Onboarding
                    </h2>
                </div>

                <div className="space-y-3">
                    {onboardingTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 ${
                                task.urgent ? 'border-orange-500/30' : ''
                            }`}
                        >
                            {task.completed ? (
                                <CheckCircle size={24} className="text-green-400 flex-shrink-0" />
                            ) : (
                                <Circle size={24} className="text-white/20 flex-shrink-0" />
                            )}

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`font-bold ${task.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </h4>
                                    {task.urgent && !task.completed && (
                                        <span className="flex items-center gap-1 text-orange-400 text-xs font-black">
                                            <AlertCircle size={12} />
                                            URGENTE
                                        </span>
                                    )}
                                </div>
                                <span className={`text-xs font-bold uppercase ${
                                    task.category === 'Essencial' ? 'text-orange-400' : 'text-blue-400'
                                }`}>
                                    {task.category}
                                </span>
                            </div>

                            {!task.completed && (
                                <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl text-xs font-black uppercase transition-all">
                                    Marcar Completo
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaffOnboarding;
