export type Product = {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  image: string;
  category: string;
  condition?: "New" | "Used" | "Refurbished";
  seller: { id: string; name: string; verified: boolean; rating: number };
  postedAt: string;
  boosted?: boolean;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  postedAt: string;
  tags: string[];
};

const img = (seed: string, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

export const categories = [
  { id: "phones", name: "Phones", icon: "📱", color: "oklch(0.92 0.06 220)" },
  { id: "fashion", name: "Fashion", icon: "👗", color: "oklch(0.92 0.06 20)" },
  { id: "home", name: "Home", icon: "🛋️", color: "oklch(0.92 0.06 80)" },
  { id: "vehicles", name: "Vehicles", icon: "🚗", color: "oklch(0.92 0.06 155)" },
  { id: "electronics", name: "Electronics", icon: "💻", color: "oklch(0.92 0.06 280)" },
  { id: "beauty", name: "Beauty", icon: "💄", color: "oklch(0.92 0.06 350)" },
  { id: "jobs", name: "Jobs", icon: "💼", color: "oklch(0.92 0.06 50)" },
  { id: "services", name: "Services", icon: "🛠️", color: "oklch(0.92 0.06 180)" },
];

export const products: Product[] = [
  {
    id: "p1",
    title: "iPhone 14 Pro Max — 256GB, Deep Purple",
    price: 850000,
    currency: "KSh",
    location: "Nairobi, Westlands",
    image: img("1592750475338-74b7b21085ab"),
    category: "phones",
    condition: "Used",
    seller: { id: "s1", name: "Amani Stores", verified: true, rating: 4.9 },
    postedAt: "2h ago",
    boosted: true,
  },
  {
    id: "p2",
    title: "Ankara Print Maxi Dress — Handmade",
    price: 4500,
    currency: "KSh",
    location: "Lagos, Lekki",
    image: img("1583391733956-3750e0ff4e8b"),
    category: "fashion",
    condition: "New",
    seller: { id: "s2", name: "Zola Couture", verified: true, rating: 4.8 },
    postedAt: "5h ago",
  },
  {
    id: "p3",
    title: "Toyota Axio 2015 — Clean, First Owner",
    price: 1450000,
    currency: "KSh",
    location: "Mombasa",
    image: img("1494976388531-d1058494cdd8"),
    category: "vehicles",
    condition: "Used",
    seller: { id: "s3", name: "Coast Auto Hub", verified: true, rating: 4.7 },
    postedAt: "1d ago",
  },
  {
    id: "p4",
    title: "Macbook Air M2 — Midnight, Sealed",
    price: 165000,
    currency: "KSh",
    location: "Kampala",
    image: img("1517336714731-489689fd1ca8"),
    category: "electronics",
    condition: "New",
    seller: { id: "s4", name: "Pearl Tech", verified: true, rating: 5.0 },
    postedAt: "3h ago",
    boosted: true,
  },
  {
    id: "p5",
    title: "Modern 3-seater sofa — beige fabric",
    price: 38000,
    currency: "KSh",
    location: "Nairobi, Karen",
    image: img("1555041469-a586c61ea9bc"),
    category: "home",
    condition: "New",
    seller: { id: "s5", name: "Habitat Living", verified: false, rating: 4.5 },
    postedAt: "6h ago",
  },
  {
    id: "p6",
    title: "Shea Butter Glow Skincare Set",
    price: 2800,
    currency: "KSh",
    location: "Accra",
    image: img("1556228720-195a672e8a03"),
    category: "beauty",
    condition: "New",
    seller: { id: "s6", name: "Naya Beauty", verified: true, rating: 4.9 },
    postedAt: "12h ago",
  },
];

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Senior Product Designer",
    company: "Flutterwave",
    logo: "https://avatars.githubusercontent.com/u/29562895?s=200",
    location: "Lagos, Nigeria · Hybrid",
    type: "Full-time",
    salary: "$3,500 – $5,200 / mo",
    postedAt: "2d ago",
    tags: ["Figma", "Mobile", "Fintech"],
  },
  {
    id: "j2",
    title: "React Native Engineer",
    company: "Twiga Foods",
    logo: "https://avatars.githubusercontent.com/u/45158585?s=200",
    location: "Nairobi, Kenya · Remote",
    type: "Remote",
    salary: "KSh 280k – 380k / mo",
    postedAt: "1d ago",
    tags: ["React Native", "TypeScript", "Node"],
  },
  {
    id: "j3",
    title: "Customer Support Lead",
    company: "M-KOPA",
    logo: "https://avatars.githubusercontent.com/u/15578615?s=200",
    location: "Kampala, Uganda",
    type: "Full-time",
    salary: "Competitive",
    postedAt: "4h ago",
    tags: ["CX", "Team lead"],
  },
];

export const messages = [
  { id: "m1", name: "Amani Stores", last: "Yes, still available. Can deliver tomorrow ✅", time: "2m", unread: 2, avatar: "https://i.pravatar.cc/100?img=12", online: true },
  { id: "m2", name: "Zola Couture", last: "Thanks for your order 💚", time: "1h", unread: 0, avatar: "https://i.pravatar.cc/100?img=32", online: false },
  { id: "m3", name: "Pearl Tech", last: "We accept M-Pesa & MoMo", time: "3h", unread: 1, avatar: "https://i.pravatar.cc/100?img=15", online: true },
  { id: "m4", name: "Coast Auto Hub", last: "Sure, come for a test drive", time: "1d", unread: 0, avatar: "https://i.pravatar.cc/100?img=52", online: false },
];

export const notifications = [
  { id: "n1", type: "offer", title: "New offer on iPhone 14 Pro Max", body: "John offered KSh 800,000", time: "5m" },
  { id: "n2", type: "message", title: "Amani Stores sent a message", body: "Yes, still available…", time: "12m" },
  { id: "n3", type: "system", title: "Verification approved", body: "Your seller account is now verified ✅", time: "2h" },
  { id: "n4", type: "promo", title: "Boost your ad for 3x reach", body: "Try Soko Boost free for 24h", time: "1d" },
];

export const formatPrice = (p: number, c = "KSh") =>
  `${c} ${p.toLocaleString("en-US")}`;
