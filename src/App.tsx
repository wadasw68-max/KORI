import { useEffect, useRef, useState, type ReactNode } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";

const heroImg = "https://images.pexels.com/photos/25819973/pexels-photo-25819973.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2400&h=1600";
const volcanoImg = "https://images.pexels.com/photos/8921670/pexels-photo-8921670.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000&h=1400";
const interiorImg = "https://images.pexels.com/photos/5461586/pexels-photo-5461586.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000&h=1400";
const tatamiImg = "https://images.pexels.com/photos/31240278/pexels-photo-31240278.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000&h=1400";
const onsenImg = "https://images.pexels.com/photos/31046939/pexels-photo-31046939.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000&h=1400";
const sunsetImg = "https://images.pexels.com/photos/32369603/pexels-photo-32369603.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=2000&h=1400";

const panoramas = {
  suite: "/images/panorama-suite.jpg",
  onsen: "/images/panorama-onsen.jpg",
  lobby: "/images/panorama-lobby.jpg",
};

type Experience = {
  id: string;
  title: string;
  desc: string;
  time: string;
  img: string;
  longDesc: string;
  details: { label: string; value: string }[];
  highlights: string[];
};

type ExtendedNavigator = Navigator & {
  connection?: { effectiveType?: string; saveData?: boolean };
  deviceMemory?: number;
};

function detectLowPerformanceDevice() {
  const nav = navigator as ExtendedNavigator;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const slowConnection = ["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "");
  const saveData = Boolean(nav.connection?.saveData);
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const lowCpu = navigator.hardwareConcurrency <= 4;
  const compactMobile = window.innerWidth < 768 && window.devicePixelRatio > 2;

  return reducedMotion || slowConnection || saveData || lowMemory || lowCpu || compactMobile;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePano, setActivePano] = useState<keyof typeof panoramas>("suite");
  const [scrolled, setScrolled] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [detailRoomId, setDetailRoomId] = useState("yama");
  const [roomDetailOpen, setRoomDetailOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("yama");
  const [checkIn, setCheckIn] = useState("2024-12-18");
  const [checkOut, setCheckOut] = useState("2024-12-21");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [expDetailOpen, setExpDetailOpen] = useState(false);
  const [activeExpId, setActiveExpId] = useState("heli");
  const [pageLoaded, setPageLoaded] = useState(document.readyState === "complete");
  const [panoramaReady, setPanoramaReady] = useState(false);
  const [lowQuality, setLowQuality] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const preloaderReady = pageLoaded && panoramaReady;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onLoad = () => setPageLoaded(true);
    const fallback = window.setTimeout(() => setPanoramaReady(true), 6500);
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const updatePerformanceMode = () => setLowQuality(detectLowPerformanceDevice());
    updatePerformanceMode();
    window.addEventListener("resize", updatePerformanceMode);
    return () => window.removeEventListener("resize", updatePerformanceMode);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || lowQuality) return;
    const onScroll = () => {
      const y = window.scrollY * 0.4;
      el.style.transform = `translate3d(0, ${y}px, 0) scale(1.05)`;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lowQuality]);

  const rooms = [
    {
      id: "yama",
      name: "YAMA Suite",
      size: "78 м²",
      view: "Вулкан Корякский",
      desc: "Пространство из дуба и камня с панорамным окном на вулкан. Частный онсэн, камин, чайная зона.",
      img: interiorImg,
      price: 85000,
      capacity: 2,
      bed: "King bed и татами-зона",
      bath: "Частный онсэн из базальта",
      mood: "Для пары, которая хочет тишину, камин и самый кинематографичный вид на вулкан.",
      inclusions: ["Завтрак кайсэки", "Вечерний чайный сервис", "Мини-бар с локальными настойками", "Доступ к 3D туру сьюта"],
    },
    {
      id: "mori",
      name: "MORI Residence",
      size: "120 м²",
      view: "Тундра и океан",
      desc: "Двухуровневый сьют с библиотекой и террасой. Ванна из хиноки, вид на Тихий океан.",
      img: tatamiImg,
      price: 135000,
      capacity: 4,
      bed: "Две спальни и зона отдыха",
      bath: "Ванна хиноки и паровая душевая",
      mood: "Для гостей, которые хотят больше пространства, приватную террасу и вид сразу на тундру и океан.",
      inclusions: ["Завтрак и ужин", "Личный камердинер", "Библиотека и винил", "Трансфер до диких источников"],
    },
    {
      id: "kaze",
      name: "KAZE Villa",
      size: "210 м²",
      view: "Приватный",
      desc: "Отдельная вилла с тремя спальнями, шеф-поваром и собственным горячим источником.",
      img: onsenImg,
      price: 245000,
      capacity: 6,
      bed: "Три спальни, гостиная, кабинет",
      bath: "Собственный горячий источник на террасе",
      mood: "Для семьи или закрытого путешествия: полная автономность, свой шеф и отдельный маршрут гидов.",
      inclusions: ["Приватный шеф", "Гид на весь период", "Вертолётный трансфер", "Персональная программа экспедиций"],
    },
  ];

  const experiences: Experience[] = [
    {
      id: "heli",
      title: "Вертолёт к вулканам",
      desc: "Приватный вылет к кратеру Авачинского, посадка на ледник",
      time: "4 часа",
      img: "https://images.pexels.com/photos/9805722/pexels-photo-9805722.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1100",
      longDesc: "Вы поднимаетесь над облаками и через 20 минут оказываетесь над кратером действующего вулкана. Посадка на ледник на высоте 2 800 метров. Горячий чай из термоса, тишина, от которой звенит в ушах, и вид, который невозможно забыть. Пилот — бывший военный лётчик, гид — вулканолог с 15-летним стажем.",
      details: [
        { label: "Длительность", value: "4 часа" },
        { label: "Группа", value: "до 4 человек" },
        { label: "Сезон", value: "Круглый год" },
        { label: "Сложность", value: "Любая подготовка" },
      ],
      highlights: ["Облёт трёх вулканов: Авачинский, Корякский, Козельский", "Посадка на ледник с пикником", "Съёмка с дрона в подарок", "Термобельё и снаряжение включены"],
    },
    {
      id: "onsen",
      title: "Дикий онсэн",
      desc: "Купание в термальных источниках под северным сиянием",
      time: "Закат",
      img: "https://images.pexels.com/photos/5111040/pexels-photo-5111040.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1100",
      longDesc: "Три диких термальных источника в радиусе 8 км от KŌRI, к которым мы добираемся на снегоходах. Температура воды — 42°C, температура воздуха — минус 18°C. Пар поднимается столбом, а над головой — млечный путь или, если повезёт, северное сияние. Гид готовит сакэ прямо на месте.",
      details: [
        { label: "Длительность", value: "3 часа" },
        { label: "Группа", value: "до 6 человек" },
        { label: "Лучший сезон", value: "Ноябрь – Март" },
        { label: "Температура воды", value: "+42°C" },
      ],
      highlights: ["Три локации на выбор: лесной, горный, океанический", "Трансфер на снегоходах", "Сакэ и закуски у источника", "Халаты и полотенца из органического хлопка"],
    },
    {
      id: "fishing",
      title: "Тихоокеанская рыбалка",
      desc: "Камчатский краб и дикий лосось с шефом у костра",
      time: "Весь день",
      img: "https://images.pexels.com/photos/34145851/pexels-photo-34145851.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1100",
      longDesc: "Утром — выход в Тихий океан на 12-метровом катере. Камчатский краб, палтус, дикий лосось — вы ловите сами под руководством капитана, который рыбачит здесь с 1994 года. После обеда — возвращение на берег, где шеф-повар KŌRI готовит ваш улов на открытом огне. Ужин на берегу океана, костёр и закат.",
      details: [
        { label: "Длительность", value: "8–10 часов" },
        { label: "Группа", value: "до 4 человек" },
        { label: "Сезон", value: "Июнь – Октябрь" },
        { label: "Улов", value: "Ваш полностью" },
      ],
      highlights: ["Выход в Тихий океан на катере", "Краб, палтус, чавыча, нерка", "Шеф готовит улов на берегу", "Копчение и засолка с собой"],
    },
    {
      id: "bears",
      title: "Медведи Курильского",
      desc: "Наблюдение с гидом-биологом, безопасно и этично",
      time: "Июль – Сент",
      img: "https://images.pexels.com/photos/27566566/pexels-photo-27566566.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1100",
      longDesc: "Вертолёт доставляет вас к Курильскому озеру — крупнейшему нерестилищу нерки в мире. Здесь одновременно кормятся до 200 бурых медведей. Вы наблюдаете с безопасного расстояния в сопровождении гида-биолога, который знает каждого медведя по имени. Буквально. У медведя по кличке «Борис» — 14-й сезон на этом берегу.",
      details: [
        { label: "Длительность", value: "Весь день" },
        { label: "Группа", value: "до 6 человек" },
        { label: "Сезон", value: "Июль – Сентябрь" },
        { label: "Дистанция", value: "50–100 метров" },
      ],
      highlights: ["Перелёт к Курильскому озеру на Ми-8", "Гид-биолог с 15-летним опытом", "До 200 медведей одновременно", "Обед на смотровой площадке"],
    },
  ];

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? rooms[0];
  const detailRoom = rooms.find((r) => r.id === detailRoomId) ?? rooms[0];
  const activeExp = experiences.find((e) => e.id === activeExpId) ?? experiences[0];
  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) || 1);
  const total = selectedRoom.price * nights;

  const openRoomDetails = (roomId: string) => {
    setDetailRoomId(roomId);
    setRoomDetailOpen(true);
  };

  const selectRoomForBooking = (roomId: string) => {
    setSelectedRoomId(roomId);
    setBookingOpen(true);
  };

  const openExpDetail = (expId: string) => {
    setActiveExpId(expId);
    setExpDetailOpen(true);
  };

  return (
    <div className={`bg-[#050607] text-[#EDEAE3] overflow-x-hidden ${lowQuality ? "motion-reduce" : ""}`}>
      <div
        className={`fixed inset-0 z-[300] flex items-center justify-center bg-[#050607] transition-all duration-700 ease-out ${
          preloaderReady ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={preloaderReady}
      >
        <div className="flex flex-col items-center gap-7">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-0 rounded-full border-t border-[#C9A66B] animate-spin" />
            <div className="absolute inset-4 flex items-center justify-center rounded-full border border-white/10 text-[13px] tracking-[0.18em] text-white/80">
              K
            </div>
          </div>
          <div className="text-center">
            <div className="text-[13px] tracking-[0.32em] text-white/70">KŌRI</div>
            <div className="mt-2 text-[11px] tracking-[0.22em] text-white/35">LOADING KAMCHATKA</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled || menuOpen ? "bg-[#050607]/90 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"}`}>
        <div className="mx-auto max-w-[1800px] px-6 md:px-12 h-[84px] flex items-center justify-between">
          <div className="flex items-center gap-12">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group">
              <div className="text-[22px] tracking-[0.18em] font-light">KŌRI</div>
              <div className="text-[10px] tracking-[0.3em] text-white/50 -mt-1 group-hover:text-white/80 transition">KAMCHATKA</div>
            </button>
            <div className="hidden lg:flex items-center gap-10 text-[13px] tracking-wide text-white/60">
              <a href="#philosophy" className="hover:text-white transition">Философия</a>
              <a href="#rooms" className="hover:text-white transition">Номера</a>
              <a href="#panorama" className="hover:text-white transition">3D тур</a>
              <a href="#experiences" className="hover:text-white transition">Опыт</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setBookingOpen(true)} className="hidden sm:inline-flex items-center h-11 px-7 rounded-full bg-[#EDEAE3] text-black text-[13px] tracking-wide hover:bg-white transition">
              Забронировать
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]">
              <span className={`w-5 h-[1px] bg-white transition ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
              <span className={`w-5 h-[1px] bg-white transition ${menuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
            </button>
          </div>
        </div>
        <div className={`lg:hidden overflow-hidden transition-all duration-500 border-t border-white/5 ${menuOpen ? "max-h-[400px] bg-[#050607]" : "max-h-0"}`}>
          <div className="px-6 py-8 space-y-5 text-[17px] font-light">
            {["Философия", "Номера", "3D тур", "Опыт"].map((l, i) => (
              <a key={l} href={["#philosophy","#rooms","#panorama","#experiences"][i]} onClick={() => setMenuOpen(false)} className="block">{l}</a>
            ))}
            <button onClick={() => { setBookingOpen(true); setMenuOpen(false); }} className="w-full mt-4 h-12 rounded-full bg-[#EDEAE3] text-black">Забронировать</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[100svh] overflow-hidden">
        <div ref={heroRef} className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#050607]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex items-end">
          <Reveal className="w-full max-w-[1800px] mx-auto px-6 md:px-12 pb-20 md:pb-28">
            <div className="max-w-[1200px]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-[1px] bg-[#C9A66B]" />
                <span className="text-[11px] tracking-[0.3em] text-[#C9A66B] uppercase">Открытие 2024</span>
              </div>
              <h1 className="text-[clamp(48px,9vw,140px)] leading-[0.82] tracking-[-0.03em] mb-8">
                Дикая<br /><span className="italic font-light">роскошь</span><br />Камчатки
              </h1>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                <p className="text-[18px] md:text-[20px] leading-relaxed text-white/70 max-w-[520px] font-light">
                  12 сьютов на краю земли. Частные онсэны с видом на вулканы.
                  Японский минимализм, встретивший камчатскую тундру.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-[13px] text-white/50 mb-1">От</div>
                    <div className="text-[28px] font-light">₽85 000 <span className="text-[14px] text-white/50">/ ночь</span></div>
                  </div>
                  <button onClick={() => document.getElementById("panorama")?.scrollIntoView({ behavior: "smooth" })} className="group flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#C9A66B] group-hover:bg-[#C9A66B]/10 transition">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                    <span className="text-[13px] tracking-wide">3D тур</span>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050607] to-transparent pointer-events-none" />
      </section>

      {/* Manifesto */}
      <section id="philosophy" className="border-t border-white/5">
        <Reveal className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 md:py-36">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-start">
            <div>
              <div className="text-[12px] tracking-[0.25em] text-white/40 mb-8">ФИЛОСОФИЯ</div>
              <h2 className="text-[clamp(36px,5vw,72px)] leading-[1.1] tracking-[-0.02em] mb-12">
                Как в <em className="font-light">Niseko Hakuunso</em>,<br />но диче.
              </h2>
              <div className="grid sm:grid-cols-2 gap-12 text-[15px] leading-relaxed text-white/65 font-light">
                <p>Мы построили KŌRI там, где заканчивается дорога. 45 минут на вертолёте от Петропавловска. Никаких соседей, только вулканы, океан и вы.</p>
                <p>Архитектура — ученик Кенго Кумы. Дерево, камень, стекло. Никакого бетона. Каждый сьют повёрнут к своему вулкану.</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={volcanoImg} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 hidden md:block">
                <div className="bg-[#0A0C0E] border border-white/10 p-8 backdrop-blur-xl">
                  <div className="text-[11px] tracking-widest text-white/40 mb-3">КАК В LE MIRABEAU</div>
                  <div className="text-[15px] leading-snug max-w-[220px]">Сервис уровня альпийских шале, но без пафоса. Просто идеально.</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Rooms */}
      <section id="rooms" className="border-t border-white/5 bg-[#080A0C]">
        <Reveal className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="text-[12px] tracking-[0.25em] text-white/40 mb-4">НОМЕРА</div>
              <h2 className="text-[clamp(32px,4.5vw,64px)] leading-[1.05]">Три типа. Двенадцать сьютов.</h2>
            </div>
            <div className="hidden md:block text-[14px] text-white/50">Все с частным онсэном</div>
          </div>
          <div className="grid md:grid-cols-3 gap-[1px] bg-white/10">
            {rooms.map((room, index) => (
              <Reveal key={room.id} delay={index * 120} className="group bg-[#050607] p-[1px]">
                <div className="bg-[#050607] h-full">
                  <button onClick={() => openRoomDetails(room.id)} className="block w-full aspect-[4/3] overflow-hidden text-left cursor-pointer">
                    <img src={room.img} alt="" className="w-full h-full object-cover transition duration-[1.5s] group-hover:scale-105" />
                  </button>
                  <div className="p-8 md:p-10">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-[26px] mb-2">{room.name}</h3>
                        <div className="flex items-center gap-4 text-[12px] text-white/50">
                          <span>{room.size}</span>
                          <span className="w-[3px] h-[3px] rounded-full bg-white/30" />
                          <span>{room.view}</span>
                        </div>
                      </div>
                      <button onClick={() => openRoomDetails(room.id)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center group-hover:border-[#C9A66B] transition" aria-label="Подробнее">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7m10 0v10" /></svg>
                      </button>
                    </div>
                    <p className="text-[14px] leading-relaxed text-white/60 font-light">{room.desc}</p>
                    <div className="mt-8 flex items-center justify-between gap-5">
                      <div>
                        <div className="text-[11px] tracking-widest text-white/35 mb-1">ОТ</div>
                        <div className="text-[18px] font-light">₽{room.price.toLocaleString("ru-RU")} <span className="text-[12px] text-white/40">/ ночь</span></div>
                      </div>
                      <button onClick={() => selectRoomForBooking(room.id)} className="h-10 px-5 border border-white/15 text-[12px] tracking-wide hover:border-[#C9A66B] hover:text-[#C9A66B] transition">
                        Выбрать
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 3D Panorama */}
      <section id="panorama" className="border-t border-white/5">
        <Reveal className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-[900px] mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[1px] bg-[#C9A66B]" />
              <span className="text-[11px] tracking-[0.3em] text-[#C9A66B]">3D ПАНОРАМА</span>
            </div>
            <h2 className="text-[clamp(36px,5vw,72px)] leading-[0.95] tracking-[-0.02em] mb-6">Прогуляйтесь до приезда</h2>
            <p className="text-[17px] text-white/65 font-light leading-relaxed">Полный виртуальный тур. Перемещайтесь между сьютом, онсэном и рестораном. Как Google Street View, только для вулканов.</p>
          </div>
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <div className="lg:sticky lg:top-28 self-start">
              <div className="space-y-3">
                {([
                  { id: "suite", label: "YAMA Suite", sub: "Спальня и онсэн" },
                  { id: "onsen", label: "Дикий онсэн", sub: "На улице, -15°C" },
                  { id: "lobby", label: "Ресторан", sub: "Вид на Корякский" },
                ] as const).map((p) => (
                  <button key={p.id} onClick={() => setActivePano(p.id)} className={`w-full text-left p-5 border transition-all ${activePano === p.id ? "bg-white/5 border-[#C9A66B]/50" : "border-white/10 hover:border-white/20"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-[15px] mb-1 transition ${activePano === p.id ? "text-white" : "text-white/70"}`}>{p.label}</div>
                        <div className="text-[12px] text-white/40">{p.sub}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full transition ${activePano === p.id ? "bg-[#C9A66B]" : "bg-white/20"}`} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 p-5 border border-white/10 bg-white/[0.02]">
                <div className="text-[12px] text-white/50 leading-relaxed">Тяните мышью • Колесо для зума • На телефоне — двигайте устройством</div>
              </div>
            </div>
            <div className="relative aspect-[16/9] lg:aspect-[16/10] overflow-hidden bg-black border border-white/10">
              <ReactPhotoSphereViewer
                key={activePano}
                src={panoramas[activePano]}
                height={"100%"}
                width={"100%"}
                plugins={([
                  [MarkersPlugin, {
                    markers: lowQuality ? [] : [
                      { id: "volcano", position: { yaw: 0.8, pitch: -0.1 }, tooltip: "Вулкан Корякский, 3456м", html: `<div style="background:rgba(0,0,0,0.8);backdrop-filter:blur(12px);padding:8px 12px;border:1px solid rgba(201,166,107,0.5);font-size:12px;letter-spacing:0.05em;">ВУЛКАН</div>` },
                      { id: "ocean", position: { yaw: 3.5, pitch: 0 }, tooltip: "Тихий океан — 12 км", html: `<div style="background:rgba(0,0,0,0.8);backdrop-filter:blur(12px);padding:8px 12px;border:1px solid rgba(255,255,255,0.2);font-size:12px;">ОКЕАН</div>` },
                    ],
                  }],
                  ...(!lowQuality ? [[VirtualTourPlugin, { renderMode: "3d" as const }]] : []),
                ]) as any}
                defaultZoomLvl={lowQuality ? 18 : 30}
                moveInertia={lowQuality ? 0.2 : 0.8}
                rendererParameters={{ alpha: !lowQuality, antialias: !lowQuality, powerPreference: lowQuality ? "low-power" : "high-performance" }}
                navbar={["zoom", "move", "fullscreen"]}
                littlePlanet={false}
                loadingImg="https://photo-sphere-viewer.js.org/assets/photosphere-logo.gif"
                containerClass="w-full h-full"
                onReady={() => setPanoramaReady(true)}
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 text-[11px] tracking-widest">360° • KŌRI</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Experiences — redesigned */}
      <section id="experiences" className="border-t border-white/5 bg-[#080A0C]">
        <Reveal className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="mb-16">
            <div className="text-[12px] tracking-[0.25em] text-white/40 mb-6">ОПЫТ</div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-[clamp(32px,4vw,56px)] leading-[1.1] max-w-[700px]">Чем заняться, когда надоест смотреть на вулкан</h2>
              <p className="text-[15px] text-white/50 leading-relaxed font-light max-w-[380px]">Всё включено. Гид, вертолёт, снаряжение. Мы не продаём экскурсии — мы открываем доступ.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10">
            {experiences.map((exp, index) => (
              <Reveal key={exp.id} delay={index * 90} className="bg-[#050607]">
              <button onClick={() => openExpDetail(exp.id)} className="group h-full w-full bg-[#050607] text-left cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={exp.img} alt="" className="w-full h-full object-cover transition duration-[1.2s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="text-[11px] tracking-widest text-[#C9A66B] mb-2">{exp.time}</div>
                    <h3 className="text-[22px] leading-tight">{exp.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[13px] text-white/55 font-light leading-relaxed mb-4">{exp.desc}</p>
                  <div className="flex items-center gap-2 text-[12px] text-[#C9A66B] group-hover:gap-3 transition-all">
                    <span>Подробнее</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </button>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Image break */}
      <section className="relative h-[70vh] overflow-hidden border-y border-white/5">
        <img src={sunsetImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#050607]/50" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 w-full">
            <Reveal className="max-w-[700px]">
              <h2 className="text-[clamp(36px,5vw,72px)] leading-[0.95] mb-6">Приезжайте зимой.</h2>
              <p className="text-[18px] text-white/80 font-light leading-relaxed">Северное сияние отражается в онсэне. Вулканы розовые на закате. И никого в радиусе 50 км.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="border-t border-white/5">
        <Reveal className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[clamp(32px,4.5vw,64px)] leading-[1.05] mb-6">12 сьютов.<br />365 дней в году.</h2>
              <p className="text-[16px] text-white/65 leading-relaxed font-light max-w-[480px]">Бронирование напрямую. Трансфер из аэропорта Петропавловска на вертолёте включён при проживании от 3 ночей.</p>
            </div>
            <div className="bg-[#0A0C0E] border border-white/10 p-8 md:p-12">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-[11px] text-white/40 tracking-widest mb-2">ЗАЕЗД</div>
                  <div className="text-[18px]">Гибко</div>
                </div>
                <div>
                  <div className="text-[11px] text-white/40 tracking-widest mb-2">ВЫЕЗД</div>
                  <div className="text-[18px]">12:00</div>
                </div>
                <div>
                  <div className="text-[11px] text-white/40 tracking-widest mb-2">ГОСТЕЙ</div>
                  <div className="text-[18px]">2 взрослых</div>
                </div>
                <div>
                  <div className="text-[11px] text-white/40 tracking-widest mb-2">ВЕРТОЛЁТ</div>
                  <div className="text-[18px]">Включён</div>
                </div>
              </div>
              <button onClick={() => setBookingOpen(true)} className="w-full h-14 bg-[#EDEAE3] text-black text-[14px] tracking-wide hover:bg-white transition">Проверить наличие</button>
              <div className="mt-4 text-center text-[12px] text-white/40">Отвечаем в мессенджерах за 7 минут</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">
            <div>
              <a href="#" className="block text-[24px] tracking-[0.18em] font-light mb-3 hover:text-[#C9A66B] transition-colors">KŌRI</a>
              <div className="text-[13px] text-white/50 leading-relaxed">Камчатский край, Елизовский район<br />Координаты по запросу после бронирования</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-[13px]">
              <div>
                <div className="text-white/40 mb-3">Связь</div>
                <div className="space-y-2 text-white/70">
                  <a href="https://wa.me/79990000000" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#C9A66B] transition-colors">
                    <span>WhatsApp</span>
                    <span className="text-[10px] text-[#C9A66B]">основной</span>
                  </a>
                  <a href="https://t.me/kori_kamchatka" target="_blank" rel="noreferrer" className="block hover:text-[#C9A66B] transition-colors">Telegram</a>
                  <a href="https://max.ru/kori_kamchatka" target="_blank" rel="noreferrer" className="block hover:text-[#C9A66B] transition-colors">Max Messenger</a>
                  <a href="mailto:hello@kori.kamchatka" className="block text-[12px] text-white/50 mt-2 hover:text-[#C9A66B] transition-colors">hello@kori.kamchatka</a>
                </div>
              </div>
              <div>
                <div className="text-white/40 mb-3">Соцсети</div>
                <div className="space-y-2 text-white/70">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="block hover:text-[#C9A66B] transition-colors">Instagram</a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="block hover:text-[#C9A66B] transition-colors">YouTube</a>
                  <a href="https://vk.com" target="_blank" rel="noreferrer" className="block hover:text-[#C9A66B] transition-colors">VK</a>
                </div>
              </div>
              <div>
                <div className="text-white/40 mb-3">Пресса</div>
                <div className="space-y-2 text-white/70">
                  <a href="https://www.forbes.ru/forbeslife" target="_blank" rel="noreferrer" className="block hover:text-[#C9A66B] transition-colors">Forbes Life</a>
                  <a href="https://www.admagazine.ru" target="_blank" rel="noreferrer" className="block hover:text-[#C9A66B] transition-colors">AD Russia</a>
                </div>
              </div>
              <div>
                <div className="text-white/40 mb-3">Правовое</div>
                <div className="space-y-2 text-white/70">
                  <a href="#privacy" className="block hover:text-[#C9A66B] transition-colors">Политика</a>
                  <a href="#offer" className="block hover:text-[#C9A66B] transition-colors">Оферта</a>
                  <a href="mailto:legal@kori.kamchatka" className="block hover:text-[#C9A66B] transition-colors">legal@kori</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between text-[12px] text-white/30">
            <div>© 2024 KŌRI Kamchatka Wilderness Retreat</div>
            <div>Сделано для тех, кто ищет тишину</div>
          </div>
        </div>
      </footer>

      {/* ===== BOOKING MODAL ===== */}
      <div className={`fixed inset-0 z-[200] transition ${bookingOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/80 backdrop-blur-2xl transition-opacity ${bookingOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setBookingOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-[640px] bg-[#0A0C0E] border-l border-white/10 transition-transform duration-500 ${bookingOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="h-full overflow-y-auto p-8 md:p-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="text-[11px] tracking-[0.28em] text-[#C9A66B] mb-2">KŌRI RESERVATION</div>
                <h3 className="text-[32px] leading-none">Настройте пребывание</h3>
              </div>
              <button onClick={() => setBookingOpen(false)} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-white/30 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-8">
              {/* STEP 1 — Даты */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full border border-[#C9A66B]/40 flex items-center justify-center text-[12px] text-[#C9A66B]">1</div>
                  <div className="text-[13px] tracking-widest text-white/50">ДАТЫ ПРОЖИВАНИЯ</div>
                </div>
                <div className="grid grid-cols-2 gap-[1px] bg-white/10">
                  <label className="block bg-[#0A0C0E] p-4">
                    <span className="block text-[11px] text-white/35 mb-2">Заезд</span>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent text-[16px] outline-none [color-scheme:dark]" />
                  </label>
                  <label className="block bg-[#0A0C0E] p-4">
                    <span className="block text-[11px] text-white/35 mb-2">Выезд</span>
                    <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent text-[16px] outline-none [color-scheme:dark]" />
                  </label>
                </div>
                <div className="mt-2 text-[12px] text-white/30">{nights} {nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей"}</div>
              </div>

              {/* STEP 2 — Номер (MOVED BEFORE GUESTS) */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full border border-[#C9A66B]/40 flex items-center justify-center text-[12px] text-[#C9A66B]">2</div>
                  <div className="text-[13px] tracking-widest text-white/50">ВЫБЕРИТЕ НОМЕР</div>
                </div>
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        // Reset guests if over capacity
                        const newCap = room.capacity;
                        if (adults + children > newCap) {
                          setAdults(Math.min(adults, newCap));
                          setChildren(Math.max(0, newCap - Math.min(adults, newCap)));
                        }
                      }}
                      className={`w-full text-left border p-4 transition ${selectedRoomId === room.id ? "border-[#C9A66B]/60 bg-[#C9A66B]/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}
                    >
                      <div className="flex gap-4">
                        <img src={room.img} alt="" className="w-20 h-20 object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[17px] mb-1">{room.name}</div>
                              <div className="text-[12px] text-white/45">{room.size} · до {room.capacity} гостей · {room.view}</div>
                            </div>
                            <div className="text-right text-[13px] whitespace-nowrap shrink-0">₽{room.price.toLocaleString("ru-RU")}</div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[12px] text-white/35 truncate">{room.bath}</span>
                            <span onClick={(e) => { e.stopPropagation(); openRoomDetails(room.id); }} className="text-[12px] text-[#C9A66B] underline underline-offset-4 shrink-0 ml-2 cursor-pointer">Подробнее</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 3 — Гости (NOW AFTER ROOM) */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full border border-[#C9A66B]/40 flex items-center justify-center text-[12px] text-[#C9A66B]">3</div>
                  <div className="text-[13px] tracking-widest text-white/50">КОЛИЧЕСТВО ГОСТЕЙ</div>
                </div>
                <div className="divide-y divide-white/10 border border-white/10">
                  {[
                    { label: "Взрослые", sub: "от 18 лет", value: adults, set: setAdults, min: 1 },
                    { label: "Дети", sub: "0–17 лет", value: children, set: setChildren, min: 0 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-white/[0.02]">
                      <div>
                        <div className="text-[15px]">{item.label}</div>
                        <div className="text-[12px] text-white/35">{item.sub} · макс. {selectedRoom.capacity} всего</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => item.set(Math.max(item.min, item.value - 1))} className="w-9 h-9 rounded-full border border-white/15 hover:border-[#C9A66B] transition disabled:opacity-30" disabled={item.value <= item.min}>−</button>
                        <span className="w-5 text-center tabular-nums">{item.value}</span>
                        <button onClick={() => item.set(item.value + 1)} className="w-9 h-9 rounded-full border border-white/15 hover:border-[#C9A66B] transition disabled:opacity-30" disabled={adults + children >= selectedRoom.capacity}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="pt-6 border-t border-white/10">
                <div className="text-[11px] tracking-widest text-white/40 mb-5">ИТОГО</div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">{selectedRoom.name} × {nights} {nights === 1 ? "ночь" : nights < 5 ? "ночи" : "ночей"}</span>
                    <span>₽{total.toLocaleString("ru-RU")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Гости</span>
                    <span>{adults} взр.{children > 0 ? ` + ${children} дет.` : ""}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Вертолёт (туда-обратно)</span>
                    <span className="text-[#C9A66B]">{nights >= 3 ? "Включено" : "+₽120 000"}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[18px]">
                    <span>Всего</span>
                    <span className="font-light">₽{(nights >= 3 ? total : total + 120000).toLocaleString("ru-RU")}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <button onClick={() => window.open(`https://wa.me/79990000000?text=${encodeURIComponent(`Здравствуйте! Хочу забронировать ${selectedRoom.name}: ${checkIn} — ${checkOut} (${nights} ночей), ${adults} взр.${children > 0 ? `, ${children} дет.` : ""}. Итого ₽${(nights >= 3 ? total : total + 120000).toLocaleString("ru-RU")}`)}`, "_blank")} className="w-full h-14 bg-[#EDEAE3] text-black font-medium hover:bg-white transition text-[14px] tracking-wide flex items-center justify-center gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    Забронировать в WhatsApp
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`KŌRI Kamchatka — хочу забронировать ${selectedRoom.name} на ${checkIn} (${nights} н.)`)}`, "_blank")} className="h-12 border border-white/15 text-[13px] tracking-wide hover:border-white/25 hover:bg-white/5 transition flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.894 8.553l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.242-.213-.054-.334-.373-.12l-6.878 4.326-2.967-.946c-.645-.199-.659-.645.134-.955l11.598-4.458c.538-.196 1.006.12.818.962z"/></svg>
                      Telegram
                    </button>
                    <button onClick={() => window.open("https://max.ru/kori_kamchatka", "_blank")} className="h-12 border border-white/15 text-[13px] tracking-wide hover:border-[#C9A66B] hover:text-[#C9A66B] hover:bg-[#C9A66B]/5 transition flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-[5px] bg-[#C9A66B] text-black flex items-center justify-center font-bold text-[10px] tracking-tighter">MAX</span>
                      Max Messenger
                    </button>
                  </div>

                  <button onClick={() => { navigator.clipboard.writeText(`kori.kamchatka@gmail.com?subject=Бронирование ${selectedRoom.name} ${checkIn}`); }} className="w-full h-11 bg-white/[0.03] border border-white/10 text-[12px] text-white/60 hover:border-white/20 hover:text-white/80 transition flex items-center justify-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Скопировать email: kori.kamchatka@gmail.com
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-center">
                  <div className="p-3 bg-white/[0.02] border border-white/10">
                    <div className="text-white/30 mb-1">ОТВЕЧАЕМ</div>
                    <div className="text-white/70">за 7 минут</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/10">
                    <div className="text-white/30 mb-1">ЯЗЫКИ</div>
                    <div className="text-white/70">RU • EN • JP</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/10">
                    <div className="text-white/30 mb-1">24/7</div>
                    <div className="text-white/70">в сезон</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 p-6 bg-white/[0.02] border border-white/10">
              <div className="text-[13px] leading-relaxed text-white/60">KŌRI — это не отель в привычном смысле. Это 12 домов на 400 гектарах тундры. Без ресепшена, без лобби-баров. Только вы, гид и вулканы.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROOM DETAIL MODAL ===== */}
      <div className={`fixed inset-0 z-[210] transition ${roomDetailOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/75 backdrop-blur-xl transition-opacity ${roomDetailOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setRoomDetailOpen(false)} />
        <div className={`absolute left-1/2 top-1/2 w-[calc(100%-32px)] max-w-[1080px] max-h-[86vh] overflow-y-auto bg-[#0A0C0E] border border-white/10 transition duration-500 ${roomDetailOpen ? "-translate-x-1/2 -translate-y-1/2 opacity-100" : "-translate-x-1/2 -translate-y-[45%] opacity-0"}`}>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="min-h-[320px] lg:min-h-[420px] relative">
              <img src={detailRoom.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute left-6 bottom-6 text-[11px] tracking-[0.25em] text-white/70">{detailRoom.view}</div>
            </div>
            <div className="p-8 md:p-12">
              <div className="flex items-start justify-between gap-8 mb-10">
                <div>
                  <div className="text-[11px] tracking-[0.28em] text-[#C9A66B] mb-3">ПОДРОБНО О НОМЕРЕ</div>
                  <h3 className="text-[clamp(28px,4vw,42px)] leading-none mb-4">{detailRoom.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/45">
                    <span>{detailRoom.size}</span>
                    <span className="w-[3px] h-[3px] rounded-full bg-white/30" />
                    <span>до {detailRoom.capacity} гостей</span>
                    <span className="w-[3px] h-[3px] rounded-full bg-white/30" />
                    <span>₽{detailRoom.price.toLocaleString("ru-RU")} / ночь</span>
                  </div>
                </div>
                <button onClick={() => setRoomDetailOpen(false)} className="shrink-0 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-white/30 transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-[16px] leading-relaxed text-white/65 font-light mb-10">{detailRoom.mood}</p>
              <div className="grid sm:grid-cols-2 gap-[1px] bg-white/10 mb-10">
                <div className="bg-[#0A0C0E] p-5">
                  <div className="text-[11px] text-white/35 tracking-widest mb-2">СОН</div>
                  <div className="text-[15px]">{detailRoom.bed}</div>
                </div>
                <div className="bg-[#0A0C0E] p-5">
                  <div className="text-[11px] text-white/35 tracking-widest mb-2">ВОДА</div>
                  <div className="text-[15px]">{detailRoom.bath}</div>
                </div>
              </div>
              <div className="mb-10">
                <div className="text-[11px] tracking-widest text-white/40 mb-4">ВКЛЮЧЕНО</div>
                <div className="space-y-3">
                  {detailRoom.inclusions.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-[14px] text-white/65">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setSelectedRoomId(detailRoom.id); setRoomDetailOpen(false); setBookingOpen(true); }} className="h-12 px-7 bg-[#EDEAE3] text-black text-[13px] tracking-wide hover:bg-white transition">Выбрать этот номер</button>
                <button onClick={() => { setActivePano("suite"); setRoomDetailOpen(false); document.getElementById("panorama")?.scrollIntoView({ behavior: "smooth" }); }} className="h-12 px-7 border border-white/15 text-[13px] tracking-wide hover:border-[#C9A66B] hover:text-[#C9A66B] transition">Смотреть 3D тур</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== EXPERIENCE DETAIL MODAL ===== */}
      <div className={`fixed inset-0 z-[210] transition ${expDetailOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/75 backdrop-blur-xl transition-opacity ${expDetailOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setExpDetailOpen(false)} />
        <div className={`absolute left-1/2 top-1/2 w-[calc(100%-32px)] max-w-[1080px] max-h-[86vh] overflow-y-auto bg-[#0A0C0E] border border-white/10 transition duration-500 ${expDetailOpen ? "-translate-x-1/2 -translate-y-1/2 opacity-100" : "-translate-x-1/2 -translate-y-[45%] opacity-0"}`}>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Image side */}
            <div className="min-h-[300px] lg:min-h-[520px] relative">
              <img src={activeExp.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <div className="absolute left-6 bottom-6">
                <div className="text-[11px] tracking-[0.25em] text-[#C9A66B] mb-1">{activeExp.time}</div>
                <div className="text-[28px] leading-tight lg:hidden">{activeExp.title}</div>
              </div>
            </div>

            {/* Content side */}
            <div className="p-8 md:p-12">
              <div className="flex items-start justify-between gap-6 mb-8">
                <div>
                  <div className="text-[11px] tracking-[0.28em] text-[#C9A66B] mb-3">КАМЧАТСКИЙ ОПЫТ</div>
                  <h3 className="text-[clamp(28px,4vw,42px)] leading-[1.05] mb-2">{activeExp.title}</h3>
                </div>
                <button onClick={() => setExpDetailOpen(false)} className="shrink-0 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-white/30 transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              <p className="text-[15px] leading-[1.8] text-white/65 font-light mb-10">{activeExp.longDesc}</p>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-[1px] bg-white/10 mb-10">
                {activeExp.details.map((d) => (
                  <div key={d.label} className="bg-[#0A0C0E] p-4">
                    <div className="text-[11px] text-white/35 tracking-widest mb-1.5">{d.label.toUpperCase()}</div>
                    <div className="text-[15px]">{d.value}</div>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div className="mb-10">
                <div className="text-[11px] tracking-widest text-white/40 mb-4">ЧТО ВХОДИТ</div>
                <div className="space-y-3">
                  {activeExp.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-3 text-[14px] text-white/65">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setExpDetailOpen(false); setBookingOpen(true); }} className="h-12 px-7 bg-[#EDEAE3] text-black text-[13px] tracking-wide hover:bg-white transition">
                  Забронировать проживание
                </button>
                <button onClick={() => setExpDetailOpen(false)} className="h-12 px-7 border border-white/15 text-[13px] tracking-wide hover:border-[#C9A66B] hover:text-[#C9A66B] transition">
                  Закрыть
                </button>
              </div>

              <div className="mt-8 p-5 bg-white/[0.02] border border-white/10">
                <div className="text-[12px] text-white/45 leading-relaxed">Все опыты включены в стоимость проживания для гостей KAZE Villa. Для YAMA Suite и MORI Residence доступны по запросу.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #050607; }
        ::-webkit-scrollbar-thumb { background: #C9A66B; border-radius: 2px; }
        .motion-reduce img { transition-duration: 300ms !important; }
        .motion-reduce .group:hover img { transform: none !important; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  );
}
