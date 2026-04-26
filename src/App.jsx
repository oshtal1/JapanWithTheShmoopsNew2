
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  ExternalLink,
  MapPin,
  Mountain,
  Download,
  Home,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  X,
  Train,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const defaultPackingItems = [
  { id: "passport", text: "דרכונים", packed: false },
  { id: "flight-docs", text: "כרטיסי טיסה ומסמכי הזמנות", packed: false },
  { id: "yen-cash", text: "יין יפני / מזומן ראשוני", packed: false },
  { id: "credit-cards", text: "כרטיסי אשראי", packed: false },
  { id: "travel-insurance", text: "ביטוח נסיעות", packed: false },
  { id: "sim-esim", text: "eSIM / סים / אינטרנט", packed: false },
  { id: "chargers", text: "מטענים וכבלים", packed: false },
  { id: "adapter", text: "מתאם חשמל ליפן", packed: false },
  { id: "power-bank", text: "סוללת גיבוי", packed: false },
  { id: "meds", text: "תרופות קבועות ועזרה ראשונה", packed: false },
  { id: "walking-shoes", text: "נעלי הליכה נוחות", packed: false },
  { id: "rain-jacket", text: "מעיל גשם / מטרייה מתקפלת", packed: false },
  { id: "toiletries", text: "תיק רחצה", packed: false },
  { id: "laundry", text: "שק כביסה", packed: false },
];

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
    stores: ["Don Quijote Shinjuku", "SURUGA-YA Shinjuku", "One Piece Mugiwara Store Shinjuku", "Alpen Tokyo Shinjuku", "SEGA Flag Shop Shinjuku", "Kinokuniya Shinjuku Main Store"],
    items: [
      { time: "08:50", title: "נחיתה בנריטה", notes: "כניסה ליפן והתחלת הטיול.", mapQuery: "Narita International Airport" },
      { time: "בוקר–צהריים", title: "Gōtokuji Temple, Hanazono Shrine, SURUGA-YA Shinjuku", transport: "הליכה", mapQuery: "Gotokuji Temple Tokyo" },
      { time: "אחר הצהריים", title: "Exploring Shinjuku", notes: "Omoide Yokocho, Kabukicho, Don Quijote, Samurai Museum וארקיידים.", extras: ["Meiji Shrine", "Mugiwara Store Shinjuku", "Alpen Tokyo Shinjuku"], mapQuery: "Shinjuku Tokyo" },
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
    city: "איזו / Fuji-Q / אוסקה",
    group: "ימי מעבר",
    area: "17.5 · שני מסלולים לשתי קבוצות",
    image: "/locations/izu.png",
    imageTitle: "17.5 · Izu & Fuji-Q split day",
    vibe: "ביום הזה הקבוצה מתפצלת לשני מסלולים: ספיר ואביב יוצאים למסלול איזו, והשמופים מבלים ב-Fuji-Q ואז ממשיכים לכיוון אוסקה.",
    stores: ["Jogasaki Coast", "Mt. Omuro", "Shuzenji", "Fuji-Q Highland", "Pokemon Center Osaka"],
    items: [],
    parts: [
      {
        key: "sapir-aviv",
        title: "חלק 1 · ספיר ואביב",
        subtitle: "מסלול איזו",
        badge: "איזו",
        items: [
          { time: "07:20", title: "יציאה משינג'וקו ברכבת Romancecar", notes: "רצוי מושבים בצד ימין לכיוון הנסיעה; אפשר לשקול קרון תצפית פנורמי.", mapQuery: "Shinjuku Station" },
          { time: "08:31", title: "איסוף רכב באודווארה", notes: "Toyota Rent-A-Car Odawara Station Shinkansen Exit.", mapQuery: "Odawara Station" },
          { time: "10:15", title: "Jogasaki Coast", notes: "טיול קצר על המצוקים הוולקניים והגשר התלוי מעל הים.", mapQuery: "Jogasaki Coast" },
          { time: "11:15", title: "Mt. Omuro", notes: "עלייה ברכבל לתצפית פנורמית מרהיבה.", mapQuery: "Mount Omuro" },
          { time: "13:15", title: "Shuzenji + ארוחת צהריים", notes: "מקדש שוזנג'י, שביל יער הבמבוק והמלצה על סובה מסורתית.", extras: ["Bamboo Forest Path"], mapQuery: "Shuzenji Temple" },
          { time: "15:45", title: "Mishima Skywalk", notes: "הליכה על הגשר התלוי הארוך ביפן עם נוף להר פוג'י ביום בהיר.", mapQuery: "Mishima Skywalk" },
          { time: "17:00", title: "החזרת הרכב במישימה", mapQuery: "Mishima Station" },
          { time: "17:30–18:00", title: "שינקנסן לאוסקה", notes: "Mishima Station → Shin-Osaka.", mapQuery: "Shin-Osaka Station" },
          { time: "לילה", title: "הגעה לאוסקה", extras: ["Osaka Umeda Station", "Pokemon Center Osaka", "Mugiwara Store Osaka", "Round 1 Osaka"], mapQuery: "Umeda Osaka" },
        ],
      },
      {
        key: "shmoops",
        title: "חלק 2 · השמופים",
        subtitle: "Fuji-Q Highland",
        badge: "Fuji-Q",
        items: [
          { time: "06:55", title: "אוטובוס מ-Busta Shinjuku ל-Fuji-Q", notes: "אוטובוס ישיר לפארק.", mapQuery: "Busta Shinjuku" },
          { time: "08:25", title: "הגעה לפארק Fuji-Q", notes: "יום פארק של השמופים.", mapQuery: "Fuji-Q Highland" },
          { time: "15:10", title: "יציאה מ-Fuji-Q למישימה", notes: "Mishima-Kawaguchiko Liner.", mapQuery: "Fuji-Q Highland" },
          { time: "16:30", title: "הגעה למישימה", mapQuery: "Mishima Station" },
          { time: "17:30–18:00", title: "שינקנסן לאוסקה", notes: "Mishima Station → Shin-Osaka.", mapQuery: "Shin-Osaka Station" },
          { time: "לילה", title: "הגעה לאוסקה", extras: ["Osaka Umeda Station", "Pokemon Center Osaka", "Mugiwara Store Osaka"], mapQuery: "Umeda Osaka" },
        ],
      },
    ],
  },
  {
    date: "2026-05-18",
    label: "18 במאי",
    city: "אוסקה",
    group: "אוסקה",
    area: "מרכז אוסקה ואומדה",
    image: "/locations/osaka.png",
    imageTitle: "Osaka · neon canal nights",
    vibe: "אוכל, צבע, דוטונבורי וטמפו מהיר של עיר תוססת.",
    stores: ["Dotonbori shops", "Pokemon Center Umeda", "Mugiwara Store Osaka", "Den Den Town"],
    items: [
      { time: "בוקר–צהריים", title: "Osaka Castle + Dotonbori", transport: "הליכה", mapQuery: "Osaka Castle" },
      { time: "אחר הצהריים", title: "Umeda shopping stop", notes: "Pokemon Center Umeda, Mugiwara Store ועוד שיטוט באזור.", extras: ["Namba Shrine", "Den Den Town"], mapQuery: "Umeda Osaka" },
      { time: "ערב", title: "Namba Shrine + Den Den Town", mapQuery: "Den Den Town Osaka" },
    ],
  },
  {
    date: "2026-05-19",
    label: "19 במאי",
    city: "אוסקה",
    group: "אוסקה",
    area: "Universal Studios Japan",
    image: "/locations/osaka.png",
    imageTitle: "Osaka · theme park day",
    vibe: "יום מלא באולפנים ואנרגיה גבוהה.",
    stores: ["Universal Studios Japan"],
    items: [
      { time: "יום מלא", title: "Universal Studios Japan", mapQuery: "Universal Studios Japan" },
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
      { time: "ערב", title: "Visit To-ji Temple", extras: ["Tōfuku-ji Temple"], mapQuery: "To-ji Temple Kyoto" },
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
      { time: "בוקר", title: "מסלול ארשיאמה", notes: "Adashino Nenbutsuji, Tenryu-ji Gardens ו-Monkey Park Iwatayama.", extras: ["Fushimi Momoyama Castle Park"], mapQuery: "Arashiyama Kyoto" },
      { time: "גמיש", title: "TeamLab Kyoto", extras: ["Nishiki Market", "Pokemon Center", "Nanzen-ji Temple"], mapQuery: "teamLab Kyoto" },
      { time: "ערב", title: "Shavuot in Chabad", extras: ["Samurai or Ninja Experience"], mapQuery: "Chabad Kyoto" },
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
      { time: "בוקר", title: "נסיעה לטקאיאמה", notes: "Kyoto → Nagoya בשינקנסן Hikari/Nozomi, ואז Limited Express Hida עם נוף יפה. מומלץ לשבת בצד ימין.", mapQuery: "Takayama Station" },
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
    stores: ["Nawate Street", "Nakamachi Street", "Chikiriya Craft Shop"],
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
      { time: "בוקר", title: "Day trip to Nikko", extras: ["Explore Shibuya (Nintendo Store, Pokémon Center)"], mapQuery: "Nikko Toshogu" },
      { time: "אחר הצהריים", title: "Akihabara", mapQuery: "Akihabara Tokyo" },
      { time: "גמיש", title: "Explore Shibuya", notes: "Nintendo Store ו-Pokémon Center.", mapQuery: "Shibuya PARCO" },
    ],
  },
  {
    date: "2026-05-27",
    label: "27 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "Tokyo DisneySea, שיבויה וגינזה",
    image: "/locations/tokyo-shinjuku.png",
    imageTitle: "Tokyo · theme park to city lights",
    vibe: "בוקר של דיסני סי ואז שיטוטי ערב בין שיבויה, גינזה וקניות יפניות קלאסיות.",
    stores: ["Nakano Broadway", "SEGA STORE TOKYO", "Shibuya shopping", "Ginza shopping"],
    items: [
      { time: "בוקר", title: "Tokyo DisneySea", mapQuery: "Tokyo DisneySea" },
      { time: "אחר הצהריים", title: "Shopping in Shibuya + Ginza", extras: ["SEGA STORE TOKYO", "Nakano Broadway (Anime Shopping)"], mapQuery: "Shibuya Tokyo" },
      { time: "ערב", title: "Shopping in Shibuya + Ginza", mapQuery: "Ginza Tokyo" },
    ],
  },
  {
    date: "2026-05-28",
    label: "28 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "TeamLab, אודאיבה ואסאקוסה",
    image: "/locations/tokyo-asakusa.png",
    imageTitle: "Tokyo · art, bay and old streets",
    vibe: "יום שמחבר בין חוויה דיגיטלית, מפרץ טוקיו ואסאקוסה המסורתית.",
    stores: ["DiverCity shops", "Sega Joypolis", "Tokyo Skytree shops"],
    items: [
      { time: "בוקר", title: "Visit TeamLab Planets (Toyosu)", mapQuery: "teamLab Planets TOKYO" },
      { time: "אחר הצהריים", title: "Odaiba (DiverCity, Sega Joypolis)", mapQuery: "Odaiba Tokyo" },
      { time: "ערב", title: "Visit Asakusa + Tokyo Skytree", notes: "הגעה בקו Tokyo Metro Ginza Line לאסאקוסה.", mapQuery: "Senso-ji Tokyo" },
    ],
  },
  {
    date: "2026-05-29",
    label: "29 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "אסאקוסה, סקייטרי וטוקיו סטיישן",
    image: "/locations/tokyo-asakusa.png",
    imageTitle: "Tokyo · Asakusa & station icons",
    vibe: "בין פנסים אדומים, מופע סומו וחוויות קניות בטוקיו סטיישן.",
    stores: ["Asakusa hobby center", "Tokyo Skytree", "Dragon Ball Tokyo Station"],
    items: [
      { time: "בוקר", title: "Visit Asakusa", notes: "Senso-ji Temple, Nakamise Street, Samurai Museum.", extras: ["Tokyo Skytree"], mapQuery: "Senso-ji Tokyo" },
      { time: "אחר הצהריים", title: "Asakusa Sumo Club", extras: ["Asakusa hobby center"], mapQuery: "Asakusa Sumo Club" },
      { time: "ערב", title: "Dragon Ball and Lego shop in Tokyo Station", mapQuery: "Tokyo Character Street" },
    ],
  },
  {
    date: "2026-05-30",
    label: "30 במאי",
    city: "טוקיו",
    group: "טוקיו",
    area: "יום שופינג גמיש בטוקיו",
    image: "/locations/tokyo-shinjuku.png",
    imageTitle: "Tokyo · last shopping loop",
    vibe: "יום פתוח לסגור פינות, לחזור לחנויות אהובות ולעשות קניות אחרונות.",
    stores: ["Revisit Akihabara/Ikebukuro", "Shibuya shopping", "Ginza shopping", "SEGA STORE TOKYO"],
    items: [
      { time: "בוקר", title: "Revisit Akihabara / Ikebukuro", mapQuery: "Akihabara Tokyo" },
      { time: "אחר הצהריים", title: "Shopping in Shibuya + Ginza", extras: ["SEGA STORE TOKYO"], mapQuery: "Ginza Tokyo" },
      { time: "גמיש", title: "השלמות וקניות אחרונות", mapQuery: "Shinjuku Tokyo" },
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

function getFlatItems(day) {
  if (day.parts?.length) {
    return day.parts.flatMap((part) => part.items || []);
  }
  return day.items || [];
}

function getItemStorageKey(day, index, partKey = null) {
  return partKey ? `${day.date}-${partKey}-${index}` : `${day.date}-${index}`;
}

function getSearchBlob(day) {
  return [
    day.label,
    day.city,
    day.group,
    day.area,
    day.vibe,
    ...(day.stores || []),
    ...(day.parts?.flatMap((part) => [part.title, part.subtitle || "", part.badge || ""]) || []),
    ...getFlatItems(day).flatMap((item) => [item.title, item.notes || "", item.transport || "", ...(item.extras || [])]),
  ]
    .join(" ")
    .toLowerCase();
}

export default function JapanWithTheShmoops() {
  const [selectedGroup, setSelectedGroup] = useState("הכל");
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(itinerary[0].date);
  const [selectedPartKey, setSelectedPartKey] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [installHelpOpen, setInstallHelpOpen] = useState(false);
  const [packingOpen, setPackingOpen] = useState(false);
  const [newPackingText, setNewPackingText] = useState("");
  const [packingItems, setPackingItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("japan-trip-packing-list") || "null");
      return Array.isArray(saved) && saved.length ? saved : defaultPackingItems;
    } catch {
      return defaultPackingItems;
    }
  });
  const [isStandalone, setIsStandalone] = useState(false);
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

  useEffect(() => {
    localStorage.setItem("japan-trip-packing-list", JSON.stringify(packingItems));
  }, [packingItems]);

  useEffect(() => {
    const checkStandalone = () => {
      const standaloneMode = window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
      setIsStandalone(Boolean(standaloneMode));
    };

    checkStandalone();
    const mediaQuery = window.matchMedia?.("(display-mode: standalone)");
    const handleStandaloneChange = () => checkStandalone();
    mediaQuery?.addEventListener?.("change", handleStandaloneChange);

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setInstallHelpOpen(false);
      checkStandalone();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      mediaQuery?.removeEventListener?.("change", handleStandaloneChange);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

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
  useEffect(() => {
    if (day.parts?.length) {
      const hasCurrentPart = day.parts.some((part) => part.key === selectedPartKey);
      if (!hasCurrentPart) {
        setSelectedPartKey(day.parts[0].key);
      }
    } else if (selectedPartKey !== null) {
      setSelectedPartKey(null);
    }
  }, [day, selectedPartKey]);

  const theme = themes[day.group] || themes["טוקיו"];
  const activePart = day.parts?.find((part) => part.key === selectedPartKey) || day.parts?.[0] || null;
  const currentItems = activePart ? activePart.items : day.items;
  const totalActivities = itinerary.reduce((sum, entry) => sum + getFlatItems(entry).length, 0);
  const progressCount = activePart
    ? activePart.items.filter((_, index) => done[getItemStorageKey(day, index, activePart.key)]).length
    : day.items.filter((_, index) => done[getItemStorageKey(day, index)]).length;
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

  const toggleDone = (index, partKey = null) => {
    const key = getItemStorageKey(day, index, partKey);
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePackingItem = (id) => {
    setPackingItems((prev) => prev.map((item) => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const addPackingItem = () => {
    const text = newPackingText.trim();
    if (!text) return;
    setPackingItems((prev) => [{ id: "packing-" + Date.now(), text, packed: false }, ...prev]);
    setNewPackingText("");
  };

  const deletePackingItem = (id) => {
    setPackingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveDay = (direction) => {
    const idx = visibleDays.findIndex((entry) => entry.date === day.date);
    const next = visibleDays[idx + direction];
    if (next) {
      selectDay(next.date);
    }
  };

  const handleAddToHomeScreen = async () => {
    if (isStandalone) {
      setInstallHelpOpen(true);
      return;
    }

    if (installPromptEvent) {
      installPromptEvent.prompt();
      try {
        await installPromptEvent.userChoice;
      } catch {
        // ignore
      }
      setInstallPromptEvent(null);
      return;
    }

    setInstallHelpOpen(true);
  };

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
  const installHelpText = isStandalone
    ? "האתר כבר נוסף למסך הבית במכשיר הזה."
    : isIOS
      ? "ב-iPhone או iPad פתחו את תפריט השיתוף בדפדפן, ואז בחרו 'Add to Home Screen'."
      : "במכשירי Android או בדפדפנים תומכים, לחצו על הכפתור כאן או פתחו את תפריט הדפדפן ובחרו 'Install app' / 'Add to Home Screen'.";

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

                <button
                  type="button"
                  onClick={() => {
                    setPackingOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/90 px-4 py-4 text-right shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100/80"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                      <ClipboardList className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-black text-slate-900">צ׳ק ליסט אריזות לטיול</span>
                      <span className="mt-1 block text-sm text-slate-500">הוספה, מחיקה וסימון פריטים. נשמר אוטומטית.</span>
                    </span>
                  </span>
                  <ChevronLeft className="h-5 w-5 text-emerald-700" />
                </button>

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

                <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <img
                      src="/icons/icon-192.png"
                      alt="אייקון הוספה למסך הבית"
                      className="h-14 w-14 rounded-2xl border border-slate-200 object-cover shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Download className="h-4 w-4" />
                        הוספה למסך הבית
                      </div>
                      <div className="text-sm leading-6 text-slate-500">
                        הוספת קיצור דרך למסלול ישירות למסך הבית, לגישה מהירה ונוחה בזמן הטיול.
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleAddToHomeScreen}
                      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-l px-4 py-2 text-sm font-medium text-white shadow-lg ${theme.accent}`}
                    >
                      {isStandalone ? "כבר נוסף" : "הוספה למסך הבית"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstallHelpOpen(true)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300"
                    >
                      הוראות
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {packingOpen && (
          <PackingChecklistModal
            items={packingItems}
            newItemText={newPackingText}
            setNewItemText={setNewPackingText}
            onAdd={addPackingItem}
            onToggle={togglePackingItem}
            onDelete={deletePackingItem}
            onClose={() => setPackingOpen(false)}
            onBackToMenu={() => {
              setPackingOpen(false);
              setMenuOpen(true);
            }}
            accentClass={theme.accent}
          />
        )}

        {installHelpOpen && (
          <div className="fixed inset-0 z-[60]">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
              onClick={() => setInstallHelpOpen(false)}
              aria-label="סגור חלון הוספה למסך הבית"
            />
            <div className="absolute inset-x-4 top-1/2 mx-auto w-full max-w-md -translate-y-1/2 rounded-[1.75rem] border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-black text-slate-900">הוספה למסך הבית</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{installHelpText}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setInstallHelpOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
                  aria-label="סגור"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!isStandalone && !installPromptEvent ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  טיפ: אם לא מופיע חלון התקנה אוטומטי, אפשר להשתמש בתפריט הדפדפן או בתפריט השיתוף של המכשיר.
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                {!isStandalone ? (
                  <button
                    type="button"
                    onClick={handleAddToHomeScreen}
                    className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-l px-4 py-2 text-sm font-medium text-white shadow-lg ${theme.accent}`}
                  >
                    <Home className="h-4 w-4" />
                    {installPromptEvent ? "התקן עכשיו" : "נסה להוסיף"}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setInstallHelpOpen(false)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
                >
                  סגור
                </button>
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
                      <div className="text-sm font-semibold text-slate-900">{activePart ? `${day.imageTitle} · ${activePart.badge}` : day.imageTitle}</div>
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

                  {day.parts?.length ? (
                    <div className="mt-6 space-y-4">
                      <div className="rounded-[1.4rem] border border-slate-200/90 bg-white/80 p-3 shadow-sm">
                        <div className="mb-3 text-sm font-semibold text-slate-700">בחירת מסלול ליום הזה</div>
                        <div className="flex flex-wrap gap-2">
                          {day.parts.map((part) => {
                            const isActive = activePart?.key === part.key;
                            return (
                              <button
                                key={part.key}
                                type="button"
                                onClick={() => setSelectedPartKey(part.key)}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                  isActive
                                    ? "border-slate-900 bg-slate-900 text-white shadow-md"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                {part.badge}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {activePart ? (
                        <div className="rounded-[1.7rem] border border-slate-200/90 bg-white/75 p-4 shadow-sm">
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="text-lg font-bold text-slate-900">{activePart.title}</div>
                              <div className="mt-1 text-sm text-slate-500">{activePart.subtitle}</div>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-sm font-medium ${
                              activePart.key === "sapir-aviv"
                                ? "border-sky-200 bg-sky-50 text-sky-700"
                                : "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
                            }`}>
                              {activePart.badge}
                            </span>
                          </div>
                          <ActivityList
                            items={activePart.items}
                            day={day}
                            partKey={activePart.key}
                            done={done}
                            toggleDone={toggleDone}
                            accentClass={theme.accent}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <ActivityList
                        items={day.items}
                        day={day}
                        done={done}
                        toggleDone={toggleDone}
                        accentClass={theme.accent}
                      />
                    </div>
                  )}
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
                  <SummaryRow label="אזור" value={activePart?.subtitle || day.area} />
                  <SummaryRow label="משימות" value={`${currentItems.length}`} />
                  <SummaryRow label="חנויות" value={`${day.stores.length}`} />
                  <SummaryRow label="התקדמות" value={`${progressCount}/${currentItems.length}`} />
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

function ActivityList({ items, day, done, toggleDone, accentClass, partKey = null }) {
  return items.map((item, index) => {
    const storageKey = getItemStorageKey(day, index, partKey);
    const isDone = !!done[storageKey];
    return (
      <section key={`${partKey || "main"}-${item.title}-${index}`} className={`activity-card ${isDone ? "activity-card-done" : ""}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className={`activity-index ${isDone ? "activity-index-done" : `bg-gradient-to-br ${accentClass} text-white`}`}>{index + 1}</div>
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
              onClick={() => toggleDone(index, partKey)}
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
  });
}

function PackingChecklistModal({ items, newItemText, setNewItemText, onAdd, onToggle, onDelete, onClose, onBackToMenu, accentClass }) {
  const packedCount = items.filter((item) => item.packed).length;
  const totalCount = items.length;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="סגור צ׳ק ליסט אריזות"
      />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/60 bg-[#fffaf6]/95 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-slate-200 bg-[#fffaf6]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-lg font-black text-slate-900">
                <ClipboardList className="h-5 w-5 text-emerald-700" />
                צ׳ק ליסט אריזות לטיול
              </div>
              <div className="mt-1 text-sm leading-6 text-slate-500">הפריטים, הסימונים והשינויים נשמרים אוטומטית במכשיר.</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
              aria-label="סגור"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 rounded-[1.4rem] border border-emerald-100 bg-emerald-50 px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-sm font-bold text-emerald-900">
              <span>התקדמות אריזה</span>
              <span>{packedCount}/{totalCount}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className={`h-full rounded-full bg-gradient-to-l ${accentClass}`} style={{ width: totalCount ? `${(packedCount / totalCount) * 100}%` : "0%" }} />
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-white/60 px-5 py-3">
          <button
            type="button"
            onClick={onBackToMenu}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
            חזרה לתפריט הראשי
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <form
            className="mb-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              onAdd();
            }}
          >
            <Input
              className="h-12 rounded-2xl border-slate-200 bg-white shadow-inner"
              placeholder="הוספת פריט חדש לרשימה"
              value={newItemText}
              onChange={(event) => setNewItemText(event.target.value)}
            />
            <Button type="submit" className={`h-12 rounded-2xl bg-gradient-to-l px-4 text-white shadow-lg ${accentClass}`}>
              <Plus className="h-4 w-4" />
              הוסף
            </Button>
          </form>

          <div className="space-y-2">
            {items.length ? items.map((item) => (
              <div key={item.id} className={`flex items-center gap-3 rounded-2xl border px-3 py-3 shadow-sm transition ${item.packed ? "border-emerald-100 bg-emerald-50/80" : "border-slate-200 bg-white"}`}>
                <button
                  type="button"
                  onClick={() => onToggle(item.id)}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${item.packed ? "border-emerald-200 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-500"}`}
                  aria-label={item.packed ? "סמן כלא נארז" : "סמן כנארז"}
                >
                  {item.packed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(item.id)}
                  className={`min-w-0 flex-1 text-right text-sm font-semibold leading-6 ${item.packed ? "text-emerald-900 line-through decoration-emerald-700/60" : "text-slate-800"}`}
                >
                  {item.text}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                  aria-label="מחק פריט"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )) : (
              <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-sm leading-6 text-slate-500">
                הרשימה ריקה. הוסיפו פריטים חדשים כדי לבנות צ׳ק ליסט אישי.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
