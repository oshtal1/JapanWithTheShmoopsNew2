
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  ExternalLink,
  MapPin,
  Mountain,
  Menu,
  Search,
  ShoppingBag,
  X,
  Train,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const hotels = [
  { city: "טוקיו", name: "Shinjuku Granbell Hotel", cost: 1828.57, nights: "14–17 במאי" },
  { city: "אוסקה", name: "The Bridge Hotel Shinsaibashi", cost: 1151, nights: "17–20 במאי" },
  { city: "קיוטו", name: "Daiwa Roynet Hotel Kyoto Shijo Karasuma", cost: 1258, nights: "20–23 במאי" },
  { city: "טקאיאמה", name: "Tokyu Stay Hida Takayama Musubinoyu", cost: 972, nights: "23–25 במאי" },
  { city: "טוקיו", name: "Shinjuku Granbell Hotel", cost: 2902.38, nights: "25–31 במאי" },
];

const itinerary = [
  {
    date: "2026-05-14",
    label: "14 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "שינג'וקו והגעה ליפן",
    image: "/locations/tokyo-shinjuku.png",
    imageTitle: "Tokyo · Shinjuku vibes",
    vibe: "נחיתה לתוך טוקיו צבעונית, ניאון, מקדשים קטנים ורחובות מלאי חיים.",
    stores: ["Don Quijote Shinjuku", "SURUGA-YA Shinjuku", "Kabukicho arcades"],
    items: [
      { time: "08:50", title: "נחיתה בנריטה", notes: "כניסה ליפן והתחלת הטיול.", mapQuery: "Narita International Airport" },
      { time: "בוקר–צהריים", title: "Gōtokuji Temple, Hanazono Shrine, SURUGA-YA Shinjuku", transport: "הליכה", mapQuery: "Gotokuji Temple Tokyo" },
      { time: "אחר הצהריים", title: "Exploring Shinjuku", notes: "Omoide Yokocho, Kabukicho, Don Quijote, Samurai Museum וארקיידים.", extras: ["Meiji Shrine"], mapQuery: "Shinjuku Tokyo" },
      { time: "ערב", title: "חזרה לשינג'וקו לארוחת ערב וקריוקי", mapQuery: "Shinjuku Tokyo" },
    ],
  },
  {
    date: "2026-05-15",
    label: "15 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "טיול יום לקמקורה",
    image: "/locations/kamakura.png",
    imageTitle: "Kamakura · temples & coast",
    vibe: "מקדשים, בודהה גדול, אוויר ים ויום רגוע מחוץ לטוקיו.",
    stores: ["Komachi-dori street shops"],
    items: [
      { time: "בוקר–אחר הצהריים", title: "Kamakura day trip", notes: "Enoshima Island, Kotoku-in, Hasedera, Houkokuji, Tsurugaoka Hachimangu ו-Komachi-dori.", mapQuery: "Kamakura Japan" },
      { time: "ערב", title: "Tokyo Night & Light", notes: "מופע אורות כל 30 דקות בין 18:00–21:30.", mapQuery: "Tokyo Metropolitan Government Building" },
    ],
  },
  {
    date: "2026-05-16",
    label: "16 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "הארי פוטר ואיקבוקורו",
    image: "/locations/tokyo-shinjuku.png",
    imageTitle: "Tokyo · anime & city energy",
    vibe: "יום עם סטודיו הארי פוטר ואחר כך עולם האנימה של איקבוקורו.",
    stores: ["Animate Ikebukuro Main Store", "Sunshine City", "Round 1 Ikebukuro"],
    items: [
      { time: "בוקר", title: "Warner Bros. Harry Potter Studio Tokyo", mapQuery: "Warner Bros. Studio Tour Tokyo" },
      { time: "אחר הצהריים", title: "Ikebukuro anime run", notes: "Animate Ikebukuro Main Store, Anime Tokyo Station ו-Sunshine City.", mapQuery: "Ikebukuro Tokyo" },
      { time: "גמיש", title: "Round 1 Ikebukuro", mapQuery: "Round1 Ikebukuro" },
    ],
  },
  {
    date: "2026-05-17",
    label: "17 במאי",
    city: "איזו → אוסקה",
    group: "ימי מעבר",
    area: "טיול יום ומעבר עיר",
    image: "/locations/izu.png",
    imageTitle: "Izu · coastal road trip",
    vibe: "היום שמשלב טבע מרהיב, כבישי חוף ורכבת מהירה לאוסקה.",
    stores: ["Pokemon Center Osaka", "Mugiwara Store Osaka", "Round 1 Osaka"],
    items: [
      { time: "כל היום", title: "Day trip to Izu", mapQuery: "Izu Peninsula" },
      { time: "בבוקר", title: "רכבת ל-Odawara והשכרת רכב", mapQuery: "Odawara Station" },
      { time: "במהלך היום", title: "מסלול באיזו", notes: "Mt. Omuro, Jogasaki Coast, Shuzenji Temple, Bamboo Forest Path ו-Mishima Sky Walk.", mapQuery: "Mount Omuro" },
      { time: "בהמשך", title: "החזרת הרכב ב-Mishima Station", mapQuery: "Mishima Station" },
      { time: "ערב", title: "שינקנסן מ-Mishima לאוסקה", mapQuery: "Shin-Osaka Station" },
      { time: "לילה", title: "הגעה לאוסקה", extras: ["Osaka Umeda Station", "Pokemon Center", "Mugiwara Store", "Round 1 Osaka"], mapQuery: "Umeda Osaka" },
    ],
  },
  {
    date: "2026-05-18",
    label: "18 במאי",
    city: "אוסקה",
    group: "אוסקה",
    area: "מרכז אוסקה",
    image: "/locations/osaka.png",
    imageTitle: "Osaka · neon canal nights",
    vibe: "אוכל, צבע, דוטונבורי וטמפו מהיר של עיר תוססת.",
    stores: ["Dotonbori shops"],
    items: [
      { time: "בוקר–צהריים", title: "Osaka Castle + Dotonbori", transport: "הליכה", mapQuery: "Osaka Castle" },
    ],
  },
  {
    date: "2026-05-19",
    label: "19 במאי",
    city: "אוסקה",
    group: "אוסקה",
    area: "חנויות ואולפנים",
    image: "/locations/osaka.png",
    imageTitle: "Osaka · fun & shopping",
    vibe: "יום של פארק, חנויות גיקים ושיטוטי ערב בעיר.",
    stores: ["Pokemon Center Osaka", "Mugiwara Store Osaka", "Den Den Town"],
    items: [
      { time: "יום מלא", title: "Universal Studios Japan", mapQuery: "Universal Studios Japan" },
      { time: "אחר הצהריים", title: "Umeda shopping stop", notes: "Pokemon Center ו-Mugiwara Store.", mapQuery: "HEP Five Umeda Osaka" },
      { time: "ערב", title: "Namba Shrine + Den Den Town", mapQuery: "Den Den Town Osaka" },
    ],
  },
  {
    date: "2026-05-20",
    label: "20 במאי",
    city: "אוסקה → קיוטו",
    group: "ימי מעבר",
    area: "נארה ומעבר",
    image: "/locations/kyoto.png",
    imageTitle: "Nara to Kyoto · calm temples",
    vibe: "מעבר מהאור העירוני לשקט המסורתי של קיוטו וסביבתה.",
    stores: ["Nishiki Market food stalls"],
    items: [
      { time: "בוקר", title: "Nara day trip", extras: ["Namba Shrine"], mapQuery: "Nara Park" },
      { time: "אחר הצהריים", title: "נסיעה לקיוטו", mapQuery: "Kyoto Station" },
      { time: "אחר הצהריים", title: "Nishiki Market + היכרות עם קיוטו", mapQuery: "Nishiki Market Kyoto" },
      { time: "ערב", title: "Visit To-ji Temple", mapQuery: "To-ji Temple Kyoto" },
    ],
  },
  {
    date: "2026-05-21",
    label: "21 במאי",
    city: "קיוטו",
    group: "קיוטו",
    area: "ארשיאמה וטימלאב",
    image: "/locations/kyoto.png",
    imageTitle: "Kyoto · bamboo & shrines",
    vibe: "במבוקים, גנים, מקדשים ורוח קיוטו קלאסית.",
    stores: ["Pokemon Center Kyoto", "Nishiki Market"],
    items: [
      { time: "בוקר", title: "מסלול ארשיאמה", notes: "Adashino Nenbutsuji, Tenryu-ji Gardens ו-Monkey Park Iwatayama.", mapQuery: "Arashiyama Kyoto" },
      { time: "גמיש", title: "TeamLab Kyoto", extras: ["Nishiki Market", "Pokemon Center"], mapQuery: "teamLab Kyoto" },
      { time: "ערב", title: "Shavuot in Chabad", mapQuery: "Chabad Kyoto" },
    ],
  },
  {
    date: "2026-05-22",
    label: "22 במאי",
    city: "קיוטו",
    group: "קיוטו",
    area: "מוזיאונים ומקדשים",
    image: "/locations/kyoto.png",
    imageTitle: "Kyoto · culture day",
    vibe: "שילוב של נינטנדו, שערים אדומים, מוזיאונים וסמטאות עתיקות.",
    stores: ["Nintendo Museum shop", "Kyoto International Manga Museum gift shop"],
    items: [
      { time: "בוקר", title: "Nintendo Museum", extras: ["Kinkaku-ji (Golden Temple)"], mapQuery: "Nintendo Museum Uji" },
      { time: "גמיש", title: "Byōdō-in Temple", mapQuery: "Byodo-in Temple Uji" },
      { time: "צהריים", title: "Fushimi Inari Shrine", mapQuery: "Fushimi Inari Taisha" },
      { time: "אחר הצהריים", title: "Kyoto International Manga Museum", extras: ["Sannenzaka", "Hōkan-ji", "Kiyomizu-dera"], mapQuery: "Kyoto International Manga Museum" },
    ],
  },
  {
    date: "2026-05-23",
    label: "23 במאי",
    city: "קיוטו → טקאיאמה",
    group: "ימי מעבר",
    area: "נסיעה צפונה",
    image: "/locations/takayama.png",
    imageTitle: "Takayama · old town charm",
    vibe: "נסיעה צפונה לאווירה הררית, שקטה ומסורתית יותר.",
    stores: ["Sanmachi Suji shops"],
    items: [
      { time: "בוקר", title: "נסיעה לטקאיאמה", notes: "Kyoto → Nagoya בשינקנסן, ואז Limited Express Hida עם נוף יפה.", mapQuery: "Takayama Station" },
      { time: "יום מלא", title: "Takayama Jinya, Sanmachi Suji, Higashiyama Teramachi", mapQuery: "Takayama Jinya" },
    ],
  },
  {
    date: "2026-05-24",
    label: "24 במאי",
    city: "טקאיאמה",
    group: "טקאיאמה",
    area: "יום רגוע בעיר",
    image: "/locations/takayama.png",
    imageTitle: "Takayama · mountain calm",
    vibe: "עיר שוק קטנה עם בוקר רגוע, שוק מקומי ובשר הידה בערב.",
    stores: ["Morning Market stalls", "Hida craft shops"],
    items: [
      { time: "בוקר–אחר הצהריים", title: "Soeur Cafe + morning market", notes: "Miyagawa Market, Hida Kokubun-ji ו-Hida no Sato.", mapQuery: "Miyagawa Morning Market Takayama" },
      { time: "ערב", title: "Hidagyu Maruaki restaurant", mapQuery: "Hidagyu Maruaki Takayama" },
    ],
  },
  {
    date: "2026-05-25",
    label: "25 במאי",
    city: "טקאיאמה → מטסומוטו → טוקיו",
    group: "ימי מעבר",
    area: "מעבר דרך האלפים היפניים",
    image: "/locations/matsumoto.png",
    imageTitle: "Matsumoto · castle & Alps",
    vibe: "נסיעת נוף יפהפייה דרך ההרים עם עצירה בעיר היסטורית.",
    stores: ["Nawate Street", "Chikiriya Craft Shop"],
    items: [
      { time: "בוקר–צהריים", title: "נסיעה למטסומוטו", notes: "Nohi Bus, כ-2.5 שעות, מומלץ להזמין מראש.", mapQuery: "Matsumoto Station" },
      { time: "בהגעה", title: "Matsumoto highlights", notes: "Yohashira Shrine ו-Matsumoto Castle.", extras: ["Nawate Street", "Nakamachi Street", "Chikiriya Craft Shop"], mapQuery: "Matsumoto Castle" },
      { time: "ערב", title: "נסיעה לשינג'וקו", notes: "Limited Express Azusa ישיר ל-Shinjuku.", mapQuery: "Shinjuku Station" },
    ],
  },
  {
    date: "2026-05-26",
    label: "26 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "ניקו, שיבויה ואקיהברה",
    image: "/locations/tokyo-shinjuku.png",
    imageTitle: "Tokyo · back to city lights",
    vibe: "חזרה לטוקיו לקצב מהיר, שופינג ואווירה מודרנית.",
    stores: ["Nintendo Tokyo", "Pokémon Center Shibuya", "Akihabara shops"],
    items: [
      { time: "בוקר", title: "Day trip to Nikko", mapQuery: "Nikko Toshogu" },
      { time: "אחר הצהריים", title: "Akihabara", mapQuery: "Akihabara Tokyo" },
      { time: "גמיש", title: "Explore Shibuya", notes: "Nintendo Store ו-Pokémon Center.", mapQuery: "Shibuya PARCO" },
    ],
  },
  {
    date: "2026-05-27",
    label: "27 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "TeamLab ואודאיבה",
    image: "/locations/tokyo-shinjuku.png",
    imageTitle: "Tokyo · future meets fun",
    vibe: "יום של חוויה עתידנית עם TeamLab ואודאיבה ליד המים.",
    stores: ["DiverCity shops", "Sega Joypolis"],
    items: [
      { time: "בוקר", title: "Visit TeamLab Planets (Toyosu)", mapQuery: "teamLab Planets TOKYO" },
      { time: "14:30", title: "כניסה מתוזמנת ל-TeamLab Planets", mapQuery: "teamLab Planets TOKYO" },
      { time: "ערב", title: "Odaiba", notes: "DiverCity ו-Sega Joypolis.", mapQuery: "Odaiba Tokyo" },
    ],
  },
  {
    date: "2026-05-28",
    label: "28 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "יומיאורי לנד, שיבויה וגינזה",
    image: "/locations/tokyo-shinjuku.png",
    imageTitle: "Tokyo · shopping pulse",
    vibe: "רכבת הרים רכה של קניות, צבעוניות וטוקיו עדכנית.",
    stores: ["Nakano Broadway", "SEGA STORE TOKYO", "Shibuya shopping", "Ginza shopping"],
    items: [
      { time: "בוקר", title: "Pokemon park - Yomiuriland", mapQuery: "Yomiuriland Tokyo" },
      { time: "אחר הצהריים", title: "Shopping in Shibuya + Ginza", notes: "כולל SEGA STORE TOKYO וקניות מרכזיות.", extras: ["Nakano Broadway (Anime Shopping)"], mapQuery: "Shibuya Tokyo" },
      { time: "ערב", title: "Shopping in Shibuya + Ginza", mapQuery: "Ginza Tokyo" },
    ],
  },
  {
    date: "2026-05-29",
    label: "29 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "אסאקוסה, סקייטרי וטוקיו סטיישן",
    image: "/locations/tokyo-asakusa.png",
    imageTitle: "Tokyo · Asakusa & Skytree",
    vibe: "חיבור יפה בין יפן מסורתית לטוקיו מודרנית עם פנסים, מקדשים וסקייטרי.",
    stores: ["Asakusa hobby center", "Tokyo Skytree shops", "Tokyo Station Character Street"],
    items: [
      { time: "בוקר", title: "Visit Asakusa", notes: "Senso-ji Temple, Nakamise Street, Samurai Museum ו-Tokyo Skytree.", mapQuery: "Senso-ji Tokyo" },
      { time: "אחר הצהריים", title: "Asakusa Sumo Club", extras: ["Asakusa hobby center"], mapQuery: "Asakusa Sumo Club" },
      { time: "ערב", title: "Dragon Ball and Lego shop in Tokyo Station", mapQuery: "Tokyo Character Street" },
    ],
  },
  {
    date: "2026-05-30",
    label: "30 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "שופינג וחזרה לאהובים",
    image: "/locations/tokyo-shinjuku.png",
    imageTitle: "Tokyo · one more shopping day",
    vibe: "יום גמיש לסגור פינות, לקנות מה שחסר וליהנות שוב מהפייבוריטים.",
    stores: ["Akihabara", "Ikebukuro", "Shibuya", "Ginza", "SEGA STORE TOKYO"],
    items: [
      { time: "בוקר", title: "Revisit Akihabara / Ikebukuro", mapQuery: "Akihabara Tokyo" },
      { time: "אחר הצהריים", title: "Shopping in Shibuya + Ginza", extras: ["SEGA STORE TOKYO"], mapQuery: "Ginza Tokyo" },
      { time: "ערב", title: "Free evening / last shopping", mapQuery: "Shinjuku Tokyo" },
    ],
  },
  {
    date: "2026-05-31",
    label: "31 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "יום חזרה הביתה",
    image: "/locations/tokyo-asakusa.png",
    imageTitle: "Tokyo · farewell day",
    vibe: "שעות אחרונות של יפן לפני הדרך לשדה התעופה והטיסה חזרה.",
    stores: ["Shinjuku last-minute shopping"],
    items: [
      { time: "בוקר", title: "Free time in Shinjuku", mapQuery: "Shinjuku Tokyo" },
      { time: "אחר הצהריים", title: "Travel to Airport", mapQuery: "Narita International Airport" },
      { time: "ערב", title: "Flight Departure", mapQuery: "Narita International Airport" },
    ],
  },
];

const routeStops = ["טוקיו", "קמקורה", "איזו", "אוסקה", "נארה", "קיוטו", "טקאיאמה", "מטסומוטו", "טוקיו"];
const sections = ["הכל", "טוקיו", "אוסקה", "קיוטו", "טקאיאמה", "ימי מעבר"];

const themes = {
  "טוקיו": {
    shell: "from-fuchsia-100 via-rose-50 to-indigo-100",
    glow: "shadow-fuchsia-200/40",
    ring: "ring-fuchsia-200",
    accent: "from-fuchsia-500 to-rose-500",
    soft: "bg-fuchsia-100/80 text-fuchsia-800 border-fuchsia-200",
    ink: "text-fuchsia-700",
  },
  "אוסקה": {
    shell: "from-orange-100 via-amber-50 to-rose-100",
    glow: "shadow-orange-200/40",
    ring: "ring-orange-200",
    accent: "from-orange-500 to-rose-500",
    soft: "bg-orange-100/80 text-orange-800 border-orange-200",
    ink: "text-orange-700",
  },
  "קיוטו": {
    shell: "from-emerald-100 via-lime-50 to-teal-100",
    glow: "shadow-emerald-200/40",
    ring: "ring-emerald-200",
    accent: "from-emerald-500 to-lime-500",
    soft: "bg-emerald-100/80 text-emerald-800 border-emerald-200",
    ink: "text-emerald-700",
  },
  "טקאיאמה": {
    shell: "from-sky-100 via-cyan-50 to-blue-100",
    glow: "shadow-sky-200/40",
    ring: "ring-sky-200",
    accent: "from-sky-500 to-cyan-500",
    soft: "bg-sky-100/80 text-sky-800 border-sky-200",
    ink: "text-sky-700",
  },
  "ימי מעבר": {
    shell: "from-amber-100 via-stone-50 to-yellow-100",
    glow: "shadow-amber-200/40",
    ring: "ring-amber-200",
    accent: "from-amber-500 to-yellow-500",
    soft: "bg-amber-100/80 text-amber-800 border-amber-200",
    ink: "text-amber-700",
  },
};

const formatMoney = (value) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);

const mapUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

function getHotelForDate(date) {
  const day = Number(date.split("-").at(-1));
  if (day <= 16) return hotels[0];
  if (day <= 19) return hotels[1];
  if (day <= 22) return hotels[2];
  if (day <= 24) return hotels[3];
  return hotels[4];
}

function getSearchBlob(day) {
  return [
    day.label,
    day.city,
    day.group,
    day.area,
    day.vibe,
    ...(day.stores || []),
    ...day.items.flatMap((item) => [item.title, item.notes || "", item.transport || "", ...(item.extras || [])]),
  ]
    .join(" ")
    .toLowerCase();
}

export default function JapanWithTheShmoops() {
  const [selectedGroup, setSelectedGroup] = useState("הכל");
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(itinerary[0].date);
  const [menuOpen, setMenuOpen] = useState(false);
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("japan-trip-done") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("japan-trip-done", JSON.stringify(done));
  }, [done]);

  const visibleDays = useMemo(() => {
    return itinerary.filter((day) => {
      const matchesGroup = selectedGroup === "הכל" || day.group === selectedGroup;
      const matchesQuery = !query || getSearchBlob(day).includes(query.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [selectedGroup, query]);

  useEffect(() => {
    if (!visibleDays.some((day) => day.date === selectedDate)) {
      setSelectedDate(visibleDays[0]?.date || itinerary[0].date);
    }
  }, [visibleDays, selectedDate]);

  const day = visibleDays.find((entry) => entry.date === selectedDate) || visibleDays[0] || itinerary[0];
  const theme = themes[day.group] || themes["טוקיו"];
  const totalActivities = itinerary.reduce((sum, entry) => sum + entry.items.length, 0);
  const progressCount = day.items.filter((_, index) => done[`${day.date}-${index}`]).length;
  const hotel = getHotelForDate(day.date);
  const activeIndex = itinerary.findIndex((entry) => entry.date === day.date);

  const scrollSelectedIntoView = () => {
    const target = document.getElementById("day-detail");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectDay = (date) => {
    setSelectedDate(date);
    setMenuOpen(false);
    setTimeout(scrollSelectedIntoView, 10);
  };

  const toggleDone = (index) => {
    const key = `${day.date}-${index}`;
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const moveDay = (direction) => {
    const idx = visibleDays.findIndex((entry) => entry.date === day.date);
    const next = visibleDays[idx + direction];
    if (next) {
      selectDay(next.date);
    }
  };

  return (
    <div dir="rtl" className={`min-h-screen bg-gradient-to-b ${theme.shell} text-slate-900 transition-colors duration-500`}>
      <div className="japan-bg" />
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className={`hero-card relative overflow-hidden border-0 ${theme.glow}`}>
            <div className="hero-orb hero-orb-a" />
            <div className="hero-orb hero-orb-b" />
            <CardContent className="relative z-10 p-6 md:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${theme.soft}`}>יפן עם השמופים</Badge>
                    <Badge className="rounded-full border border-white/70 bg-white/80 px-4 py-1.5 text-sm text-slate-700 backdrop-blur">14–31 במאי 2026</Badge>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">יפן עם השמופים</h1>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <QuickPill icon={CalendarDays} text={`${itinerary.length} ימי טיול`} />
                    <QuickPill icon={Mountain} text={`${routeStops.length} תחנות במסלול`} />
                    <QuickPill icon={BedDouble} text={`${hotels.length} לינות`} />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <StatCard title="יום נבחר" value={day.label} sub={day.area} accent={theme.accent} />
                  <StatCard title="פעילויות" value={`${day.items.length}`} sub={`${progressCount} סומנו`} accent={theme.accent} />
                  <StatCard title="עלות לינות" value={formatMoney(hotels.reduce((sum, entry) => sum + entry.cost, 0))} sub="סה״כ הזמנות" accent={theme.accent} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <div className="sticky top-3 z-30 mt-5">
          <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/70 bg-white/80 px-3 py-2 shadow-lg backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-l text-white shadow-lg ${theme.accent}`}
              aria-label="פתח תפריט"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-500">יום נבחר</div>
              <div className="truncate text-sm font-bold text-slate-900 md:text-base">{day.label} · {day.area}</div>
            </div>
            <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 md:block">{visibleDays.length} ימים</div>
          </div>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
              onClick={() => setMenuOpen(false)}
              aria-label="סגור תפריט"
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-white/60 bg-[#fffaf6]/95 shadow-2xl backdrop-blur-2xl">
              <div className="sticky top-0 z-10 border-b border-slate-200 bg-[#fffaf6]/95 px-5 py-4 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-black text-slate-900">בחירת יום וסינון</div>
                    <div className="mt-1 text-sm text-slate-500">תפריט קומפקטי שלא מסתיר את המסך בזמן גלילה.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
                    aria-label="סגור"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="relative">
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="h-12 rounded-2xl border-slate-200 bg-white pr-11 shadow-inner"
                    placeholder="חיפוש עיר, חנות, מקדש או פעילות"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div>
                  <div className="mb-3 text-sm font-bold text-slate-800">סינון לפי אזור</div>
                  <div className="flex flex-wrap gap-2">
                    {sections.map((section) => {
                      const isActive = selectedGroup === section;
                      return (
                        <button
                          key={section}
                          type="button"
                          onClick={() => setSelectedGroup(section)}
                          className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                            isActive
                              ? `bg-gradient-to-l ${theme.accent} text-white border-transparent shadow-lg`
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {section}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSelectedGroup("הכל");
                    }}
                    className="mt-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300"
                  >
                    איפוס סינון
                  </button>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-800">בחירת יום</div>
                      <div className="text-sm text-slate-500">כל הימים במקום אחד, בלי פס סטיקי גדול.</div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{visibleDays.length} ימים</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {visibleDays.map((entry) => {
                      const active = entry.date === day.date;
                      return (
                        <button
                          key={entry.date}
                          type="button"
                          onClick={() => selectDay(entry.date)}
                          className={`day-tile w-full ${active ? `day-tile-active ${theme.ring}` : "day-tile-idle"}`}
                        >
                          <div className="text-sm font-bold">{entry.label}</div>
                          <div className="mt-1 text-xs opacity-80">{entry.city}</div>
                          <div className="mt-2 line-clamp-2 text-xs leading-5 opacity-80">{entry.area}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6" id="day-detail">
            <motion.div key={day.date} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
              <Card className={`detail-card overflow-hidden border-0 ${theme.glow}`}>
                <div className="relative h-[260px] md:h-[340px]">
                  <img src={day.image} alt={day.area} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-sm font-medium ${theme.soft}`}>{day.group}</span>
                      <span className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">{day.label}</span>
                    </div>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">{day.area}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-white/90 md:text-base">{day.vibe}</p>
                  </div>
                </div>

                <CardContent className="p-5 md:p-7">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                      <div className="text-sm font-semibold text-slate-900">{day.imageTitle}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <button
                        type="button"
                        onClick={() => moveDay(-1)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300"
                      >
                        <ChevronRight className="h-4 w-4" /> קודם
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDay(1)}
                        className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-l px-3 py-2 text-sm font-medium text-white shadow-lg ${theme.accent}`}
                      >
                        הבא <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {day.items.map((item, index) => {
                      const isDone = !!done[`${day.date}-${index}`];
                      return (
                        <section key={`${item.title}-${index}`} className={`activity-card ${isDone ? "activity-card-done" : ""}`}>
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex gap-4">
                              <div className={`activity-index ${isDone ? "activity-index-done" : `bg-gradient-to-br ${theme.accent} text-white`}`}>{index + 1}</div>
                              <div className="min-w-0 space-y-3">
                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                  <MetaChip icon={Clock3} text={item.time || "ללא שעה"} />
                                  {item.transport ? <MetaChip icon={Train} text={item.transport} /> : null}
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{item.title}</h3>
                                {item.notes ? <p className="max-w-3xl text-[15px] leading-8 text-slate-600">{item.notes}</p> : null}
                                {item.extras?.length ? (
                                  <div>
                                    <div className="mb-2 text-sm font-semibold text-slate-700">אפשר לשלב גם</div>
                                    <div className="flex flex-wrap gap-2">
                                      {item.extras.map((extra) => (
                                        <span key={extra} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">{extra}</span>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="flex shrink-0 flex-wrap gap-2 lg:w-[220px] lg:justify-end">
                              <Button
                                variant={isDone ? "default" : "outline"}
                                size="sm"
                                className={`rounded-full ${isDone ? "bg-emerald-600 hover:bg-emerald-600 text-white" : "bg-white"}`}
                                onClick={() => toggleDone(index)}
                              >
                                {isDone ? <CheckCircle2 className="ml-1 h-4 w-4" /> : <Circle className="ml-1 h-4 w-4" />}
                                {isDone ? "בוצע" : "סמן"}
                              </Button>
                              {item.mapQuery ? (
                                <a
                                  href={mapUrl(item.mapQuery)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300"
                                >
                                  <MapPin className="ml-1 h-4 w-4" /> מפה
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>

          <aside className="space-y-5">
            <Card className="side-card overflow-hidden border-0">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-500">סיכום ליום הנבחר</div>
                    <div className="mt-1 text-2xl font-black text-slate-900">{day.city}</div>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-sm font-medium ${theme.soft}`}>יום {activeIndex + 1}</span>
                </div>
                <div className="mt-4 grid gap-3">
                  <SummaryRow label="תאריך" value={day.label} />
                  <SummaryRow label="אזור" value={day.area} />
                  <SummaryRow label="משימות" value={`${day.items.length}`} />
                  <SummaryRow label="חנויות" value={`${day.stores.length}`} />
                  <SummaryRow label="התקדמות" value={`${progressCount}/${day.items.length}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="side-card overflow-hidden border-0">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-lg font-bold">לינה מתאימה ליום הזה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5 pt-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.accent} text-white shadow-lg`}>
                      <BedDouble className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">{hotel.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{hotel.city} · {hotel.nights}</div>
                      <div className={`mt-2 text-sm font-semibold ${theme.ink}`}>{formatMoney(hotel.cost)}</div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  {hotels.map((entry, index) => (
                    <div key={`${entry.name}-${index}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                      <div className="font-semibold text-slate-800">{entry.city}</div>
                      <div className="mt-1 text-slate-500">{entry.nights}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="side-card overflow-hidden border-0">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-lg font-bold">חנויות ונקודות עניין</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 p-5 pt-2">
                {day.stores.map((store) => (
                  <a
                    key={store}
                    href={mapUrl(store)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-slate-400" />{store}</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                ))}
              </CardContent>
            </Card>

            <Card className="side-card overflow-hidden border-0">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-lg font-bold">ציר המסלול</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="flex flex-wrap gap-2">
                  {routeStops.map((stop, index) => (
                    <span
                      key={`${stop}-${index}`}
                      className={`rounded-full border px-3 py-1.5 text-sm ${index === routeStops.length - 1 ? `bg-gradient-to-l ${theme.accent} text-white border-transparent` : "border-slate-200 bg-white text-slate-600"}`}
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function QuickPill({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}

function StatCard({ title, value, sub, accent }) {
  return (
    <div className="rounded-[1.7rem] border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">{value}</div>
      <div className={`mt-2 inline-flex rounded-full bg-gradient-to-l px-3 py-1 text-xs font-semibold text-white ${accent}`}>{sub}</div>
    </div>
  );
}

function MetaChip({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
      <Icon className="h-4 w-4" />
      {text}
    </span>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
