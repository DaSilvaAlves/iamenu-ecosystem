import React from 'react';
import { motion } from 'framer-motion';

const ProfilesTab = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto w-full">
            <nav aria-label="Breadcrumb" className="flex mb-6">
                <ol className="flex items-center space-x-2">
                    <li><a className="text-text-muted hover:text-primary text-sm" href="#">Mercado</a></li>
                    <li><span className="text-text-muted">/</span></li>
                    <li><a className="text-text-muted hover:text-primary text-sm" href="#">Frescos</a></li>
                    <li><span className="text-text-muted">/</span></li>
                    <li aria-current="page" className="text-primary text-sm font-medium">Distribuidora Lisboa Central</li>
                </ol>
            </nav>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-8 flex flex-col gap-6">
                    <section className="bg-background-card rounded-xl border border-border-color overflow-hidden relative group">
                        <div className="h-56 bg-cover bg-center relative" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAaitveJWLd3H9MNPShAzL7KaQPSz35bx5KiIbKS6HeTYdSfqlMOzfjEe_JecFOAz7hVOfjQGnSaHoOo8t6kF47M5FBOjwnemhd12PQQk2G42TaFkcbvvgay0LJxok4A7KeO9IwJtpQnTtN5Tkg-7j507PW57_2urgo_AF_DeAf7sAf5XvHQQcErLgjIgemtSMCU_ipw1F3SmksQI21Z8izgZoPPimS38SsPf5nCB8hTtQxHuOjsMM32Rx0VIKVeixgrUzu_zjaSA')"}}>
                            <div className="absolute inset-0 bg-gradient-to-t from-background-card via-background-card/80 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-end sm:items-end gap-6">
                                <div className="size-28 rounded-xl bg-background-card p-3 shadow-2xl border border-border-color flex items-center justify-center shrink-0">
                                    <div className="w-full h-full bg-contain bg-center bg-no-repeat rounded-lg" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfu-pieyIOnDBMuEUbC1TfCLyriUgnq7ghePyClmVMnsK9e6EywDvSAfU4UChQHpSQzIfp-lNMPb-hGzGWESbXg341RifKsAs1lS-NeWMSsgGJTGSi5O5QWRWq8YHRm_u6Cj2UULwut2Z5zPBiUk_87hBrEcbZbF8gK8rEbCSMgNebxwBzrzdJqAG2t9Ln2ppI-OAJKv43fsabdvuW2hbXs3SPCKBIeOc0kh2uYiophV5kfMicsYXi_8wETaYOm1l_T58fm-xTEA')"}}></div>
                                </div>
                                <div className="mb-1 flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-primary/20 text-primary border border-primary/30">Fornecedor Premium</span>
                                        <span className="flex items-center gap-1 text-yellow-500 text-sm">
                                            <span className="material-symbols-outlined icon-filled text-[16px]">star</span>
                                            <span className="font-bold">4.8</span>
                                            <span className="text-text-muted font-normal">(124 avaliações)</span>
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Distribuidora Lisboa Central</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                            Lisboa, Portugal
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-text-muted/30"></span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                                            Frescos &amp; Laticínios
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border-color border-t border-border-color bg-white/5 backdrop-blur-sm">
                            <div className="p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Mínimo Enc.</span>
                                <span className="text-xl font-bold text-white">150,00 €</span>
                            </div>
                            <div className="p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Lead Time</span>
                                <span className="text-xl font-bold text-white">24h</span>
                            </div>
                            <div className="p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Entrega</span>
                                <span className="text-xl font-bold text-primary">Grátis &gt; 300€</span>
                            </div>
                            <div className="p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Taxa de Resposta</span>
                                <span className="text-xl font-bold text-primary">98%</span>
                            </div>
                        </div>
                    </section>
                    <div className="border-b border-border-color">
                        <div className="flex gap-8">
                            <button className="pb-3 text-sm font-bold text-primary border-b-2 border-primary">Visão Geral</button>
                            <button className="pb-3 text-sm font-medium text-text-muted hover:text-white border-b-2 border-transparent transition-colors">Catálogo <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded ml-1">840</span></button>
                            <button className="pb-3 text-sm font-medium text-text-muted hover:text-white border-b-2 border-transparent transition-colors">Avaliações</button>
                            <button className="pb-3 text-sm font-medium text-text-muted hover:text-white border-b-2 border-transparent transition-colors">Políticas</button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-1 gap-6">
                            <div className="bg-background-card p-6 rounded-xl border border-border-color">
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    Sobre o Fornecedor
                                </h3>
                                <p className="text-text-muted leading-relaxed text-sm">
                                    Líder na distribuição de produtos frescos e laticínios na região da Grande Lisboa há mais de 15 anos. Somos o parceiro de confiança para mais de 500 restaurantes, hotéis e cafés. Trabalhamos diretamente com produtores locais para garantir a máxima frescura, com entregas diárias antes das 10h da manhã. A nossa frota refrigerada garante a cadeia de frio desde o armazém até à sua porta.
                                </p>
                            </div>
                            <div className="bg-background-card p-6 rounded-xl border border-border-color">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">loyalty</span>
                                    Marcas em Distribuição
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    <div className="h-14 w-20 bg-white/5 border border-border-color rounded-lg flex items-center justify-center p-2 hover:bg-white/10 transition-colors">
                                        <img alt="Compal" className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIjwweTc10eBGpsqv3bVOpPeDL8Ip374Ij8aQpKrMRm0dnpAydc_8aYPqJjrl23gI1nQP1hE9Kplv9SM-aNrGE2vKbVr-YDbdn_Wh8II1o4MEyj1DhJ-w8k8PSt0-S1Cg-UnuQq63ZvkGFyI8l3X9UWPuGaRAJe75FJ5ba8nAu2bH6InT_XiIcjNZioXSpFpmCfOd3yEeydF-kZspGsPo4gY1JgHeT9TMcFArxBX3d48_JrEgDx1RFyvw8APHu4ofkM6ZUFSjZta6p1HFuOm3A"/>
                                    </div>
                                    <div className="h-14 w-20 bg-white/5 border border-border-color rounded-lg flex items-center justify-center p-2 hover:bg-white/10 transition-colors">
                                        <img alt="Delta" className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd1_0DuFAiaF_us8QIzmkP4XN40c2tV17aAgiu5nA1DjYIa4t_ZPniwkC92hxUqagXwR3CTc-b6uQJqpkPVv-TsYYOdrINKBgLne_gUSxKZL4J9DGAWTaKDuUuRKdooJ9X8OOVJymalgI0XG83Cch0V4gP8MjE8__eILMoNcgVJSVZtaZSZYZ9sN05VO_f9hP2D1HW2zebpAr9AlhBhUVkbbLSBi03BfCpw6WSQzYtDaWxwPC7pL-LCxjLXcNUjlJkL-GcGgZsMw"/>
                                    </div>
                                    <div className="h-14 w-20 bg-white/5 border border-border-color rounded-lg flex items-center justify-center p-2 hover:bg-white/10 transition-colors">
                                        <img alt="Mimosa" className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRtr4nI0oJNLaPJze091Jix15qc_Ylnu6xHV4QqDyihAoix5B9zA5Um7Gb0Kgc7QHXdJujHTQNOX_Zw4rriAat5QCtL6GPD2SE0goP_mWyGG1a4UPvHwr7j8UTmJEU36ww0g9xFKMTOHhHpwqO9bEb6gH1I5c48hh6cF7eCS6ZIuB8L1SrvuuhINN6DZBxSmV-W_sqWS7di4FcfgeF93i9DaeTTEG33pMDUYzcfY5FzBPrz42kq37RrXisX8N7rB-SjS68rJcW5Yv7v6-XkR92Q0"/>
                                    </div>
                                    <div className="h-14 w-20 bg-white/5 border border-border-color rounded-lg flex items-center justify-center p-2 hover:bg-white/10 transition-colors">
                                        <img alt="Danone" className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5PDuiAgiJm__k1QK3BOfuAE3F8NJ56KN1IUg0Ir1RYTMIwQr-PLDWr6D9BXu_cjOdqnfg_LwPRgWChViWGbcfd2n01qIqBXVLd2z2QAvIVVAPYhag_uv1vVSlJZzWblb1IXbvqkUZj2UuJ0aKbQldtgITcB95IIEDz2cBugfGulGk4YtMrvV_J1NSdKqBBWT01Jf4IVnEOK95RifjWwwMDTSly-KlergYZkSWAcJPeQsdWTREonXFE1SweVyk5KhMBHVCq2dTbw"/>
                                    </div>
                                    <div className="h-14 w-20 bg-white/5 border border-border-color rounded-lg flex items-center justify-center p-2 hover:bg-white/10 transition-colors cursor-pointer group">
                                        <span className="text-[10px] text-center font-bold text-text-muted group-hover:text-white transition-colors">+ 25 Marcas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-background-card p-6 rounded-xl border border-border-color">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-blue-500/10 text-blue-500 p-2 rounded-lg border border-blue-500/20">
                                        <span className="material-symbols-outlined">local_shipping</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Entrega e Logística</h3>
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start gap-3 text-text-muted">
                                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                                        <span>Entregas de Seg a Sáb (06:00 - 14:00)</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-text-muted">
                                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                                        <span>Cut-off para dia seguinte: 16:00</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-text-muted">
                                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                                        <span>Área: Grande Lisboa, Sintra, Cascais</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-text-muted">
                                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                                        <span>Custo fixo de 15€ para encomendas &lt; 300€</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-background-card p-6 rounded-xl border border-border-color">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-orange-500/10 text-orange-500 p-2 rounded-lg border border-orange-500/20">
                                        <span className="material-symbols-outlined">assignment_return</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Devoluções e Qualidade</h3>
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start gap-3 text-text-muted">
                                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                                        <span>Devolução no ato da entrega aceite</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-text-muted">
                                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                                        <span>Reclamações até 24h para perecíveis</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-text-muted">
                                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                                        <span>Certificação HACCP em toda a frota</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <section className="bg-background-card rounded-xl border border-border-color p-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Destaques da Semana</h3>
                                    <p className="text-sm text-text-muted">Produtos com maior procura nesta época</p>
                                </div>
                                <button className="px-4 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-border-color transition-colors">
                                    Ver Todos
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="group cursor-pointer bg-background-page rounded-lg p-3 border border-border-color hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                    <div className="aspect-square bg-background-input rounded-md mb-3 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCX9oWx8LoU8D-PgE06XrZdvEaxFbaEo3MCieGAniY21Jj0QJgLaU8v3GBfdlV0Xdn90Dde11f96GUqugD9t10EdAv8SLbywT_Rg8D1uM0p6pqCaNboZw72lOtThdDX2xFRKwFDyzTZT5xkYCSATEUvBzqrgoz2_c9NiW_bgUR9buulSyK5d53XLY1cWqw90pLsCANVvtSNw1U7C40ZXChKFR524Vnbxwc4ulnGu_pb-jeoKQJmDTTCVUt7r5bZ-lDcuv1hMj0pUg')"}}></div>
                                    </div>
                                    <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-primary transition-colors">Batata Doce Nacional - Saco 5kg</h4>
                                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">Ref: 20491 • Kg</p>
                                    <div className="mt-2 flex items-baseline justify-between">
                                        <p className="font-bold text-white">1,25 € <span className="text-xs font-normal text-text-muted">/ kg</span></p>
                                        <button className="size-6 rounded bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="group cursor-pointer bg-background-page rounded-lg p-3 border border-border-color hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                    <div className="aspect-square bg-background-input rounded-md mb-3 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBckBpOfjV91LxpHix_XiR1J78By2aeQmYPBQqtCQ5xB5YVaueSKfqx-5fa9_CIlgDZzW0XeXXDPB2K0z_qCJq7p1Kyq2YgN7hwIeKR9w-1HA03k4M1kG6ldDrhoxG85Pg-y7w4XWW-ZEhyViIeIWsqPz2ZhlAKE38KU-zQnxWji8CjIz-v5GUnovUiOAy5wNMbQGUk_AAxji7eZFYruteqA')"}}></div>
                                    </div>
                                    <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-primary transition-colors">Tomate Cherry Rama Premium</h4>
                                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">Ref: 10234 • Cx 3kg</p>
                                    <div className="mt-2 flex items-baseline justify-between">
                                        <p className="font-bold text-white">3,45 € <span className="text-xs font-normal text-text-muted">/ kg</span></p>
                                        <button className="size-6 rounded bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="group cursor-pointer bg-background-page rounded-lg p-3 border border-border-color hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                    <div className="aspect-square bg-background-input rounded-md mb-3 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLqQ3Qs2slWkwFK7mR-DQ7xYyMMRx3ZWy0hWyXdLHmkNhBr-j0MLjMy9nReROLo9x4cwkbAsNa0aLFY8NunWoC-GdjJ3D2T-lV6d8exIq3MNFBpn0uArQU9G5tncZ6Ab_1yZi_qNgFZpcDbnfi6wlbuCg55o_ptDyqq4-UH1rHzlm7a_kNmNjh_aajJjQRBt0FAmCaqBO4NhwqRP0D7_uk-2OoNqeWKSLrEyMXy_JM3uz3m0rabrmSiBzk2GPWb9GjKxTC8boQcg')"}}></div>
                                    </div>
                                    <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-primary transition-colors">Alface Iceberg Fresca</h4>
                                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">Ref: 30112 • Unid</p>
                                    <div className="mt-2 flex items-baseline justify-between">
                                        <p className="font-bold text-white">0,89 € <span className="text-xs font-normal text-text-muted">/ un</span></p>
                                        <button className="size-6 rounded bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="group cursor-pointer bg-background-page rounded-lg p-3 border border-border-color hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                    <div className="aspect-square bg-background-input rounded-md mb-3 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiqthhrioq_zdNOzHQsypklNsWEIi7OmW-WY6cFGvXVmFf94WmVdkBaj3kFO8VI8XCzBXA00PiWv4C17dkuSaDAeKmZHFYxJtvrJXjU-lEeLRTTNMQUKebEza5U1Rcrbx5bQZgjX0rgsNd7-owBszyALhhIKW9ck11Kkz_xkUXzlByJ95cbSn1I6VZbvoXFoaykfpqJdK5hSd4qtyhz1h1Q20hc3AoklOHCD7TXOImC_TEO7ZNQiL9lLvvhTkoVYi2a9fsdjT96Q')"}}></div>
                                    </div>
                                    <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-primary transition-colors">Queijo Flamengo Bola Inteira</h4>
                                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">Ref: 55019 • Un ~2kg</p>
                                    <div className="mt-2 flex items-baseline justify-between">
                                        <p className="font-bold text-white">7,90 € <span className="text-xs font-normal text-text-muted">/ kg</span></p>
                                        <button className="size-6 rounded bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="xl:col-span-4 space-y-6 sticky top-24">
                    <div className="bg-background-card p-6 rounded-xl border border-border-color relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined text-[150px] text-white">store</span>
                        </div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                <span className="block size-2 rounded-full bg-green-500 animate-pulse"></span>
                                Aberto Agora
                            </span>
                            <span className="text-xs text-text-muted font-medium bg-white/5 px-2 py-1 rounded">Fecha às 18:00</span>
                        </div>
                        <div className="space-y-3 mb-6 relative z-10">
                            <button className="w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                                <span className="material-symbols-outlined">menu_book</span>
                                Ver Catálogo
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 h-12 bg-transparent hover:bg-white/5 border border-primary text-primary font-bold rounded-lg transition-colors">
                                <span className="material-symbols-outlined">request_quote</span>
                                Enviar RFQ
                            </button>
                        </div>
                        <div className="pt-4 border-t border-border-color flex items-center justify-center relative z-10">
                            <button className="flex items-center gap-2 text-text-muted hover:text-red-500 transition-colors text-sm font-medium group">
                                <span className="material-symbols-outlined group-hover:icon-filled transition-all">favorite</span>
                                Adicionar aos Meus Fornecedores
                            </button>
                        </div>
                    </div>
                    <div className="bg-background-card p-6 rounded-xl border border-border-color">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Certificações &amp; Selos</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-background-page border border-border-color hover:border-primary/30 transition-colors group">
                                <div className="size-10 rounded bg-green-900/30 text-green-400 flex items-center justify-center border border-green-800/50 group-hover:text-green-300 transition-colors">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Fornecedor Verificado</h4>
                                    <p className="text-xs text-text-muted">Validado pela iaMenu em 2023</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-background-page border border-border-color hover:border-primary/30 transition-colors group">
                                <div className="size-10 rounded bg-blue-900/30 text-blue-400 flex items-center justify-center border border-blue-800/50 group-hover:text-blue-300 transition-colors">
                                    <span className="material-symbols-outlined">safety_check</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">HACCP Certificado</h4>
                                    <p className="text-xs text-text-muted">Segurança alimentar garantida</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-background-page border border-border-color hover:border-primary/30 transition-colors group">
                                <div className="size-10 rounded bg-emerald-900/30 text-emerald-400 flex items-center justify-center border border-emerald-800/50 group-hover:text-emerald-300 transition-colors">
                                    <span className="material-symbols-outlined">eco</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Produtor Local</h4>
                                    <p className="text-xs text-text-muted">Apoio à economia regional</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background-card p-6 rounded-xl border border-border-color">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Contacto Comercial</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-full bg-cover bg-center border-2 border-border-color" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHz0RJMJyWVODgIynM4h_kTAgaa5ob6QQGg6m9ZO79BKX7ISVesHhSDO00ZZ94xJt0qEmlnc2o8coTriIal94T8gJ6mz1Y5o00i6leXI-uug-8VJ2TbCpbFQm1LRGKHjQ0jSHg7WybGyxtHI2Ldche_gI4iP8PycPDrrguuldp5_MgZI7REzS0YrvjajTNqAop9L-4RS5NKJnQTR147g0xf5hqwnf5gLV0IXOlXt1m09d7r9MnoNW9-XvKxx1rM8Oy0UEU4Ier9g')"}}></div>
                            <div>
                                <p className="text-sm font-bold text-white">Carlos Silva</p>
                                <p className="text-xs text-text-muted">Gestor de Conta</p>
                                <p className="text-xs text-primary mt-0.5">Disponível</p>
                            </div>
                        </div>
                        <button className="w-full text-sm text-text-muted hover:text-white border border-border-color rounded-lg py-2 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">mail</span>
                            Enviar Mensagem
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilesTab;
