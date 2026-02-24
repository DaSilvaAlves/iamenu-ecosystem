import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, TrendingUp } from 'lucide-react';
import HubFeed from './hubs-regionais/HubFeed';
import HubResources from './hubs-regionais/HubResources';
import HubFeedback from './hubs-regionais/HubFeedback';

const HUBS = [
  { id: 'h1', name: 'Hub Algarve', description: 'Restaurantes & Foodservice Algarve', region: 'Algarve', memberCount: 124 },
  { id: 'h2', name: 'Hub Lisboa', description: 'Lisboa & Vale do Tejo Innovation', region: 'Lisboa', memberCount: 450 },
  { id: 'h3', name: 'Hub Norte', description: 'Culinária e Negócios Porto & Norte', region: 'Porto', memberCount: 320 },
  { id: 'h4', name: 'Hub Centro', description: 'Restauração Centro de Portugal', region: 'Centro', memberCount: 186 },
  { id: 'h5', name: 'Hub Alentejo', description: 'Gastronomia Tradicional Alentejo', region: 'Alentejo', memberCount: 92 },
];

const HubsRegionaisView = () => {
    const [selectedHub, setSelectedHub] = useState(HUBS[0]);
    const [activeTab, setActiveTab] = useState('feed');

    const tabs = [
        { id: 'feed', label: 'Feed', icon: 'forum' },
        { id: 'resources', label: 'Recursos', icon: 'folder_open' },
        { id: 'feedback', label: 'Feedback', icon: 'campaign' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Hero Section */}
            <div className="glass-panel p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-primary text-4xl">hub</span>
                                <h1 className="font-black text-4xl text-white uppercase tracking-tighter">
                                    Hubs Regionais
                                </h1>
                            </div>
                            <p className="text-white/60 text-sm max-w-2xl">
                                Conecta-te com donos de restaurantes da tua região. Partilha desafios, aprende com casos locais e
                                ajuda a moldar o futuro do iaMenu.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                            <Users size={16} className="text-primary" />
                            <span className="text-white/80 text-sm font-bold">{selectedHub.memberCount} Membros</span>
                        </div>
                    </div>

                    {/* Hub Selector */}
                    <div className="grid grid-cols-5 gap-3">
                        {HUBS.map((hub) => (
                            <button
                                key={hub.id}
                                onClick={() => setSelectedHub(hub)}
                                className={`p-4 rounded-2xl transition-all border ${
                                    selectedHub.id === hub.id
                                        ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin size={14} className={selectedHub.id === hub.id ? 'text-primary' : 'text-white/40'} />
                                    <span className={`text-xs font-black uppercase ${selectedHub.id === hub.id ? 'text-primary' : 'text-white/60'}`}>
                                        {hub.region}
                                    </span>
                                </div>
                                <h3 className={`text-sm font-bold ${selectedHub.id === hub.id ? 'text-white' : 'text-white/60'}`}>
                                    {hub.name}
                                </h3>
                                <p className="text-xs text-white/40 mt-1">{hub.memberCount} membros</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hub Banner */}
            <div className="relative h-48 rounded-[40px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200"
                    alt="Hub Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                            Comunidade iaMenu
                        </span>
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                            <TrendingUp size={12} className="text-green-400" />
                            <span className="text-white text-xs font-bold">+12% este mês</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white">{selectedHub.name}</h2>
                    <p className="text-white/80 text-sm mt-1">{selectedHub.description}</p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="glass-panel rounded-[30px] p-2 flex gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] font-black text-sm uppercase tracking-wider transition-all ${
                            activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                        }`}
                    >
                        <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'feed' && <HubFeed hub={selectedHub} />}
                    {activeTab === 'resources' && <HubResources hub={selectedHub} />}
                    {activeTab === 'feedback' && <HubFeedback hub={selectedHub} />}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default HubsRegionaisView;
