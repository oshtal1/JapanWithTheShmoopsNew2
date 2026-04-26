
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
  Star,
  Navigation,
  Copy,
  Route,
  Tag,
  Users,
  Plane,
  ListChecks,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const packingCategories = [
  { key: "documents", title: "מסמכים וכסף", icon: "🧾", hint: "כל מה שחייב להיות בשליפה בשדה ובמלון" },
  { key: "electronics", title: "אלקטרוניקה", icon: "🔌", hint: "טעינה, אינטרנט וגיבויים לימים ארוכים" },
  { key: "clothing", title: "בגדים ונעליים", icon: "👟", hint: "שכבות קלות, הליכה וגשם אביבי" },
  { key: "health", title: "בריאות וטואלטיקה", icon: "🧴", hint: "תרופות, עזרה ראשונה ותיק רחצה" },
  { key: "day-bag", title: "תיק יום לטיול", icon: "🎒", hint: "מה שיוצא איתכם בכל בוקר" },
  { key: "pre-flight", title: "לפני הטיסה", icon: "✈️", hint: "משימות שסוגרים לפני שמגיעים לנתב״ג" },
  { key: "personal", title: "אישי ותוספות", icon: "✨", hint: "כל דבר מיוחד שלכם" },
];

const defaultPackingItems = [
  { id: "passport", text: "דרכונים", category: "documents", required: true, owner: "כולם", packed: false },
  { id: "flight-docs", text: "כרטיסי טיסה ומסמכי הזמנות", category: "documents", required: true, owner: "כולם", packed: false },
  { id: "hotel-docs", text: "אישורי מלונות ורכב להשכרה", category: "documents", required: true, owner: "כולם", packed: false },
  { id: "yen-cash", text: "יין יפני / מזומן ראשוני", category: "documents", required: true, owner: "כולם", packed: false },
  { id: "credit-cards", text: "כרטיסי אשראי + קוד סודי", category: "documents", required: true, owner: "כולם", packed: false },
  { id: "travel-insurance", text: "ביטוח נסיעות מודפס/שמורה בטלפון", category: "documents", required: true, owner: "כולם", packed: false },
  { id: "sim-esim", text: "eSIM / סים / אינטרנט", category: "electronics", required: true, owner: "כולם", packed: false },
  { id: "chargers", text: "מטענים וכבלים", category: "electronics", required: true, owner: "כולם", packed: false },
  { id: "adapter", text: "מתאם חשמל ליפן", category: "electronics", required: true, owner: "כולם", packed: false },
  { id: "power-bank", text: "סוללת גיבוי", category: "electronics", required: true, owner: "כולם", packed: false },
  { id: "headphones", text: "אוזניות לטיסות ולרכבות", category: "electronics", required: false, owner: "אישי", packed: false },
  { id: "walking-shoes", text: "נעלי הליכה נוחות", category: "clothing", required: true, owner: "אישי", packed: false },
  { id: "rain-jacket", text: "מעיל גשם / מטרייה מתקפלת", category: "clothing", required: false, owner: "אישי", packed: false },
  { id: "layers", text: "שכבות קלות לערב קריר", category: "clothing", required: false, owner: "אישי", packed: false },
  { id: "laundry", text: "שק כביסה", category: "clothing", required: false, owner: "כולם", packed: false },
  { id: "meds", text: "תרופות קבועות ועזרה ראשונה", category: "health", required: true, owner: "אישי", packed: false },
  { id: "toiletries", text: "תיק רחצה", category: "health", required: true, owner: "אישי", packed: false },
  { id: "plasters", text: "פלסטרים / קומפיד לנעלי הליכה", category: "health", required: false, owner: "כולם", packed: false },
  { id: "day-passport", text: "דרכון/צילום דרכון בתיק יום", category: "day-bag", required: true, owner: "כולם", packed: false },
  { id: "day-bottle", text: "בקבוק מים קטן", category: "day-bag", required: false, owner: "אישי", packed: false },
  { id: "day-umbrella", text: "מטרייה מתקפלת בתיק יום", category: "day-bag", required: false, owner: "כולם", packed: false },
  { id: "day-snacks", text: "נשנושים לנסיעות ארוכות", category: "day-bag", required: false, owner: "כולם", packed: false },
  { id: "visit-japan-web", text: "Visit Japan Web מוכן עם QR", category: "pre-flight", required: true, owner: "כולם", packed: false },
  { id: "tickets", text: "כרטיסים לאטרקציות שמורות בטלפון", category: "pre-flight", required: true, owner: "כולם", packed: false },
  { id: "offline-maps", text: "הורדת מפות ואזורים ב-Google Maps", category: "pre-flight", required: true, owner: "כולם", packed: false },
  { id: "train-bus", text: "בדיקת רכבות/אוטובוסים שצריך להזמין מראש", category: "pre-flight", required: true, owner: "כולם", packed: false },
  { id: "add-home-screen", text: "הוספת האתר למסך הבית", category: "pre-flight", required: false, owner: "כולם", packed: false },
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
const mapDirectionsUrl = (query, travelMode = "walking") =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=${travelMode}`;

const packingFilters = [
  { key: "all", label: "הכל" },
  { key: "missing", label: "חסר" },
  { key: "packed", label: "נארז" },
  { key: "required", label: "חובה" },
];

function getCategoryMeta(categoryKey) {
  return packingCategories.find((category) => category.key === categoryKey) || packingCategories.at(-1);
}

function inferPackingCategory(text = "") {
  const lower = text.toLowerCase();
  if (/דרכון|טיסה|ביטוח|אשראי|יין|מזומן|הזמנה/.test(lower)) return "documents";
  if (/מטען|כבל|סים|esim|סוללה|חשמל|אוזנ/.test(lower)) return "electronics";
  if (/נעל|בגד|מעיל|כביסה|גרב|חולצה|מטרייה/.test(lower)) return "clothing";
  if (/תרופ|רחצה|פלסטר|קרם|טואלטיקה/.test(lower)) return "health";
  if (/visit japan|מפות|כרטיסים|מסך הבית|רכבות|אוטובוסים/.test(lower)) return "pre-flight";
  return "personal";
}

function normalizePackingItems(items) {
  const savedItems = Array.isArray(items) && items.length ? items : [];
  const savedById = new Map(savedItems.map((item) => [item.id, item]));
  const defaultsById = new Map(defaultPackingItems.map((item) => [item.id, item]));
  const merged = savedItems.length
    ? [
        ...defaultPackingItems.map((defaults) => ({ ...defaults, ...(savedById.get(defaults.id) || {}) })),
        ...savedItems.filter((item) => !defaultsById.has(item.id)),
      ]
    : defaultPackingItems;

  return merged.map((item) => {
    const defaults = defaultsById.get(item.id) || {};
    return {
      id: item.id || `packing-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
      text: item.text || defaults.text || "פריט ללא שם",
      category: item.category || defaults.category || inferPackingCategory(item.text),
      required: typeof item.required === "boolean" ? item.required : Boolean(defaults.required),
      owner: item.owner || defaults.owner || "כולם",
      packed: Boolean(item.packed),
    };
  });
}

function parseTripDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getDaysBetween(fromDate, toDate) {
  const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.round((end - start) / 86400000);
}

function getTripStatus(now = new Date()) {
  const start = parseTripDate(itinerary[0].date);
  const end = parseTripDate(itinerary.at(-1).date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todayDay = itinerary.find((entry) => entry.date === todayIso);

  if (today < start) {
    const daysLeft = getDaysBetween(today, start);
    return {
      mode: "before",
      title: `נותרו ${daysLeft} ימים לטיול`,
      subtitle: "זה הזמן לסגור הכנות, כרטיסים ואריזה בלי לחץ.",
      actionLabel: "פתח הכנות ואריזה",
      todayDate: null,
      daysLeft,
    };
  }

  if (today > end) {
    return {
      mode: "after",
      title: "הטיול הסתיים — נשארו הזיכרונות",
      subtitle: "אפשר עדיין להשתמש באתר לסיכומים, תמונות וקניות שחוזרים אליהן.",
      actionLabel: "חזרה למסלול",
      todayDate: null,
      daysLeft: 0,
    };
  }

  return {
    mode: "during",
    title: todayDay ? `היום בטיול: ${todayDay.label}` : "היום בטיול",
    subtitle: todayDay ? `${todayDay.city} · ${todayDay.area}` : "פתחו את היום הנוכחי וקבלו גישה מהירה למפות וללינה.",
    actionLabel: "פתח את היום",
    todayDate: todayDay?.date || null,
    daysLeft: 0,
  };
}

function getActivityMeta(item) {
  const text = `${item.title || ""} ${item.notes || ""} ${item.time || ""} ${(item.extras || []).join(" ")}`.toLowerCase();
  const tags = [];
  if (/shopping|shop|store|קניות|don quijote|pokemon|mugiwara|animate|sega|round|ginza|shibuya|akihabara|ikebukuro|nishiki|market/.test(text)) tags.push("קניות");
  if (/נסיעה|שינקנסן|רכבת|אוטובוס|airport|שדה|station|תחנה|travel to|הגעה|יציאה/.test(text)) tags.push("נסיעה");
  if (/temple|shrine|castle|museum|מקדש|מוזיאון|טירה|senso|fushimi|byōdō|nintendo museum/.test(text)) tags.push("תרבות");
  if (/teamlab|disney|universal|fuji-q|harry potter|studio|joypolis|sumo|כרטיס/.test(text)) tags.push("כרטיסים");
  if (/cafe|restaurant|ארוחת|food|שוק|סובה|hidagyu/.test(text)) tags.push("אוכל");

  let priority = "מומלץ";
  if (/נחיתה|flight|departure|airport|שינקנסן|החזרת הרכב|איסוף רכב|לינה|travel to airport|יציאה|הגעה/.test(text)) {
    priority = "חובה";
  } else if (item.extras?.length || /גמיש|אפשר|free time|revisit|השלמות/.test(text)) {
    priority = "אם יש זמן";
  }

  return { priority, tags: [...new Set(tags)].slice(0, 4) };
}

function getDayDoneCount(entry, doneMap) {
  if (entry.parts?.length) {
    return entry.parts.reduce((sum, part) => sum + part.items.filter((_, index) => doneMap[getItemStorageKey(entry, index, part.key)]).length, 0);
  }
  return (entry.items || []).filter((_, index) => doneMap[getItemStorageKey(entry, index)]).length;
}


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
  const [newPackingCategory, setNewPackingCategory] = useState("personal");
  const [newPackingRequired, setNewPackingRequired] = useState(false);
  const [packingFilter, setPackingFilter] = useState("missing");
  const [expandedPackingCategories, setExpandedPackingCategories] = useState(() => new Set(["documents", "pre-flight", "electronics"]));
  const [packingItems, setPackingItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("japan-trip-packing-list") || "null");
      return normalizePackingItems(saved);
    } catch {
      return normalizePackingItems(defaultPackingItems);
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

  const tripStatus = useMemo(() => getTripStatus(), []);

  useEffect(() => {
    if (tripStatus.todayDate) {
      setSelectedDate(tripStatus.todayDate);
    }
  }, [tripStatus.todayDate]);

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
  const totalDayActivities = getFlatItems(day).length;
  const totalActivities = itinerary.reduce((sum, entry) => sum + getFlatItems(entry).length, 0);
  const progressCount = activePart
    ? activePart.items.filter((_, index) => done[getItemStorageKey(day, index, activePart.key)]).length
    : (day.items || []).filter((_, index) => done[getItemStorageKey(day, index)]).length;
  const dayProgressCount = getDayDoneCount(day, done);
  const packedCount = packingItems.filter((item) => item.packed).length;
  const requiredMissingCount = packingItems.filter((item) => item.required && !item.packed).length;
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

  const openToday = () => {
    if (tripStatus.todayDate) {
      selectDay(tripStatus.todayDate);
      return;
    }
    scrollSelectedIntoView();
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openCurrentMap = () => {
    const firstMapItem = currentItems.find((item) => item.mapQuery);
    if (firstMapItem?.mapQuery) {
      window.open(mapUrl(firstMapItem.mapQuery), "_blank", "noopener,noreferrer");
    }
  };

  const toggleDone = (index, partKey = null) => {
    const key = getItemStorageKey(day, index, partKey);
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePackingItem = (id) => {
    setPackingItems((prev) => prev.map((item) => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const togglePackingCategory = (categoryKey) => {
    setExpandedPackingCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) next.delete(categoryKey);
      else next.add(categoryKey);
      return next;
    });
  };

  const addPackingItem = () => {
    const text = newPackingText.trim();
    if (!text) return;
    setPackingItems((prev) => [{
      id: "packing-" + Date.now(),
      text,
      category: newPackingCategory,
      required: newPackingRequired,
      owner: "כולם",
      packed: false,
    }, ...prev]);
    setExpandedPackingCategories((prev) => new Set([...prev, newPackingCategory]));
    setNewPackingText("");
    setNewPackingRequired(false);
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
    <div dir="rtl" className={`min-h-screen bg-gradient-to-b ${theme.shell} pb-24 text-slate-900 transition-colors duration-500 md:pb-0`}>
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
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">מסלול צבעוני, נעים וברוח יפן</h1>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <QuickPill icon={CalendarDays} text={`${itinerary.length} ימי טיול`} />
                    <QuickPill icon={Mountain} text={`${routeStops.length} תחנות במסלול`} />
                    <QuickPill icon={ListChecks} text={`${totalActivities} פעילויות`} />
                    <QuickPill icon={BedDouble} text={`${hotels.length} לינות`} />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <StatCard title="יום נבחר" value={day.label} sub={day.area} accent={theme.accent} />
                  <StatCard title="פעילויות ביום" value={`${totalDayActivities}`} sub={`${dayProgressCount} סומנו`} accent={theme.accent} />
                  <StatCard title="אריזות" value={`${packedCount}/${packingItems.length}`} sub={requiredMissingCount ? `${requiredMissingCount} פריטי חובה חסרים` : "כל פריטי החובה נארזו"} accent={theme.accent} />
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

        <TodayFocusCard
          status={tripStatus}
          day={day}
          hotel={hotel}
          currentItems={currentItems}
          progressCount={progressCount}
          requiredMissingCount={requiredMissingCount}
          onPrimary={() => {
            if (tripStatus.mode === "before") setPackingOpen(true);
            else openToday();
          }}
          onPacking={() => setPackingOpen(true)}
          onMap={openCurrentMap}
          accentClass={theme.accent}
        />

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
                      <span className="mt-1 block text-sm text-slate-500">קטגוריות, חובה/חסר וסימון מהיר. נשמר אוטומטית.</span>
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
            filter={packingFilter}
            setFilter={setPackingFilter}
            expandedCategories={expandedPackingCategories}
            onToggleCategory={togglePackingCategory}
            newItemText={newPackingText}
            setNewItemText={setNewPackingText}
            newItemCategory={newPackingCategory}
            setNewItemCategory={setNewPackingCategory}
            newItemRequired={newPackingRequired}
            setNewItemRequired={setNewPackingRequired}
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

            <Card id="lodging-summary" className="side-card scroll-mt-24 overflow-hidden border-0">
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

            <Card id="route-summary" className="side-card scroll-mt-24 overflow-hidden border-0">
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

      <BottomNavigation
        onToday={openToday}
        onRoute={() => setMenuOpen(true)}
        onMap={openCurrentMap}
        onPacking={() => setPackingOpen(true)}
        onLodging={() => scrollToSection("lodging-summary")}
        accentClass={theme.accent}
      />
    </div>
  );
}

function TodayFocusCard({ status, day, hotel, currentItems, progressCount, requiredMissingCount, onPrimary, onPacking, onMap, accentClass }) {
  const nextItem = currentItems.find((item) => item.mapQuery) || currentItems[0];

  return (
    <Card className="mt-5 overflow-hidden rounded-[1.75rem] border-0 bg-white/85 shadow-lg backdrop-blur-xl">
      <CardContent className="p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="flex items-start gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentClass} text-white shadow-lg`}>
              {status.mode === "before" ? <Plane className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <div className="text-lg font-black text-slate-900">{status.title}</div>
              <div className="mt-1 text-sm leading-6 text-slate-500">{status.subtitle}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">לינה: {hotel.city}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">התקדמות היום: {progressCount}/{currentItems.length}</span>
                {nextItem ? <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">הבא: {nextItem.time || "גמיש"}</span> : null}
                {requiredMissingCount ? <span className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-rose-700">{requiredMissingCount} פריטי חובה חסרים</span> : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              onClick={onPrimary}
              className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-l px-4 py-2 text-sm font-bold text-white shadow-lg ${accentClass}`}
            >
              <CalendarDays className="h-4 w-4" />
              {status.actionLabel}
            </button>
            <button
              type="button"
              onClick={onMap}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
            >
              <MapPin className="h-4 w-4" />
              מפה מהירה
            </button>
            <button
              type="button"
              onClick={onPacking}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"
            >
              <ClipboardList className="h-4 w-4" />
              אריזות
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BottomNavigation({ onToday, onRoute, onMap, onPacking, onLodging, accentClass }) {
  const items = [
    { label: "היום", icon: CalendarDays, onClick: onToday, primary: true },
    { label: "מסלול", icon: Menu, onClick: onRoute },
    { label: "מפה", icon: MapPin, onClick: onMap },
    { label: "אריזות", icon: ClipboardList, onClick: onPacking },
    { label: "לינות", icon: BedDouble, onClick: onLodging },
  ];

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[1.6rem] border border-white/70 bg-white/90 p-2 shadow-2xl backdrop-blur-xl md:hidden" aria-label="ניווט מהיר">
      <div className="grid grid-cols-5 gap-1">
        {items.map(({ label, icon: Icon, onClick, primary }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-[1.1rem] px-2 text-xs font-black transition ${primary ? `bg-gradient-to-l ${accentClass} text-white shadow-lg` : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>
    </nav>
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
  const [copiedKey, setCopiedKey] = useState(null);

  const copyLocation = async (text, key) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1400);
    } catch {
      setCopiedKey(null);
    }
  };

  return items.map((item, index) => {
    const storageKey = getItemStorageKey(day, index, partKey);
    const isDone = !!done[storageKey];
    const meta = getActivityMeta(item);
    const isMust = meta.priority === "חובה";
    const isOptional = meta.priority === "אם יש זמן";
    const itemKey = `${partKey || "main"}-${index}`;
    const mapQuery = item.mapQuery || item.title;

    return (
      <section key={`${partKey || "main"}-${item.title}-${index}`} className={`activity-card ${isDone ? "activity-card-done" : ""}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className={`activity-index ${isDone ? "activity-index-done" : `bg-gradient-to-br ${accentClass} text-white`}`}>{index + 1}</div>
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <MetaChip icon={Clock3} text={item.time || "ללא שעה"} />
                {item.transport ? <MetaChip icon={Train} text={item.transport} /> : null}
                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-bold ${
                  isMust
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : isOptional
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}>
                  <Star className="h-4 w-4" />
                  {meta.priority}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{item.title}</h3>
              {meta.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {meta.tags.map((tag) => (
                    <span key={`${itemKey}-${tag}`} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                      <Tag className="h-3.5 w-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
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

          <div className="flex shrink-0 flex-wrap gap-2 lg:w-[270px] lg:justify-end">
            <Button
              variant={isDone ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${isDone ? "bg-emerald-600 hover:bg-emerald-600 text-white" : "bg-white"}`}
              onClick={() => toggleDone(index, partKey)}
            >
              {isDone ? <CheckCircle2 className="ml-1 h-4 w-4" /> : <Circle className="ml-1 h-4 w-4" />}
              {isDone ? "בוצע" : "סמן"}
            </Button>
            {mapQuery ? (
              <>
                <a
                  href={mapUrl(mapQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300"
                >
                  <MapPin className="ml-1 h-4 w-4" /> מקום
                </a>
                <a
                  href={mapDirectionsUrl(mapQuery, "walking")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300"
                >
                  <Navigation className="ml-1 h-4 w-4" /> נווט
                </a>
                <a
                  href={mapDirectionsUrl(mapQuery, "transit")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300"
                >
                  <Route className="ml-1 h-4 w-4" /> תחבורה
                </a>
                <button
                  type="button"
                  onClick={() => copyLocation(mapQuery, itemKey)}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300"
                >
                  <Copy className="ml-1 h-4 w-4" /> {copiedKey === itemKey ? "הועתק" : "העתק"}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>
    );
  });
}

function PackingChecklistModal({
  items,
  filter,
  setFilter,
  expandedCategories,
  onToggleCategory,
  newItemText,
  setNewItemText,
  newItemCategory,
  setNewItemCategory,
  newItemRequired,
  setNewItemRequired,
  onAdd,
  onToggle,
  onDelete,
  onClose,
  onBackToMenu,
  accentClass,
}) {
  const packedCount = items.filter((item) => item.packed).length;
  const totalCount = items.length;
  const requiredCount = items.filter((item) => item.required).length;
  const requiredPackedCount = items.filter((item) => item.required && item.packed).length;

  const filterItem = (item) => {
    if (filter === "missing") return !item.packed;
    if (filter === "packed") return item.packed;
    if (filter === "required") return item.required;
    return true;
  };

  const visibleItems = items.filter(filterItem);

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="סגור צ׳ק ליסט אריזות"
      />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-white/60 bg-[#fffaf6]/95 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-slate-200 bg-[#fffaf6]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-lg font-black text-slate-900">
                <ClipboardList className="h-5 w-5 text-emerald-700" />
                צ׳ק ליסט אריזות לטיול
              </div>
              <div className="mt-1 text-sm leading-6 text-slate-500">מחולק לפי קטגוריות, עם סינון מהיר למה שחסר ומה שחובה.</div>
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

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-emerald-100 bg-emerald-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm font-bold text-emerald-900">
                <span>התקדמות אריזה</span>
                <span>{packedCount}/{totalCount}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full bg-gradient-to-l ${accentClass}`} style={{ width: totalCount ? `${(packedCount / totalCount) * 100}%` : "0%" }} />
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-amber-100 bg-amber-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm font-bold text-amber-900">
                <span>פריטי חובה</span>
                <span>{requiredPackedCount}/{requiredCount}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: requiredCount ? `${(requiredPackedCount / requiredCount) * 100}%` : "0%" }} />
              </div>
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
          <div className="mb-4 rounded-[1.5rem] border border-slate-200 bg-white/90 p-3 shadow-sm">
            <div className="mb-3 flex flex-wrap gap-2">
              {packingFilters.map((option) => {
                const active = filter === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setFilter(option.key)}
                    className={`rounded-full border px-3.5 py-2 text-sm font-bold transition ${
                      active
                        ? `border-transparent bg-gradient-to-l ${accentClass} text-white shadow-md`
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <form
              className="grid gap-2"
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
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
                <select
                  value={newItemCategory}
                  onChange={(event) => setNewItemCategory(event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
                >
                  {packingCategories.map((category) => (
                    <option key={category.key} value={category.key}>{category.icon} {category.title}</option>
                  ))}
                </select>
                <label className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newItemRequired}
                    onChange={(event) => setNewItemRequired(event.target.checked)}
                    className="h-4 w-4"
                  />
                  חובה
                </label>
                <Button type="submit" className={`h-12 rounded-2xl bg-gradient-to-l px-4 text-white shadow-lg ${accentClass}`}>
                  <Plus className="h-4 w-4" />
                  הוסף
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            {packingCategories.map((category) => {
              const allCategoryItems = items.filter((item) => item.category === category.key);
              const categoryItems = visibleItems.filter((item) => item.category === category.key);
              if (!allCategoryItems.length) return null;
              const categoryPacked = allCategoryItems.filter((item) => item.packed).length;
              const isOpen = expandedCategories.has(category.key);
              const categoryRequiredMissing = allCategoryItems.filter((item) => item.required && !item.packed).length;

              return (
                <section key={category.key} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/95 shadow-sm">
                  <button
                    type="button"
                    onClick={() => onToggleCategory(category.key)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-right transition hover:bg-slate-50"
                  >
                    <span className="flex min-w-0 items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl">{category.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-base font-black text-slate-900">{category.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-slate-500">{category.hint}</span>
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">{categoryPacked}/{allCategoryItems.length}</span>
                      {categoryRequiredMissing ? <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{categoryRequiredMissing} חובה</span> : null}
                    </span>
                  </button>
                  <div className="h-1.5 bg-slate-100">
                    <div className={`h-full bg-gradient-to-l ${accentClass}`} style={{ width: allCategoryItems.length ? `${(categoryPacked / allCategoryItems.length) * 100}%` : "0%" }} />
                  </div>

                  {isOpen ? (
                    <div className="space-y-2 p-3">
                      {categoryItems.length ? categoryItems.map((item) => (
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
                            <span className="block">{item.text}</span>
                            <span className="mt-1 flex flex-wrap gap-1.5">
                              {item.required ? <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">חובה</span> : null}
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600"><Users className="h-3 w-3" />{item.owner}</span>
                            </span>
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
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-5 text-center text-sm leading-6 text-slate-500">
                          אין פריטים בקטגוריה הזו לפי הסינון הנוכחי.
                        </div>
                      )}
                    </div>
                  ) : null}
                </section>
              );
            })}

            {!visibleItems.length ? (
              <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-sm leading-6 text-slate-500">
                אין פריטים בסינון הנוכחי. נסו לעבור ל״הכל״ או להוסיף פריט חדש.
              </div>
            ) : null}
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
