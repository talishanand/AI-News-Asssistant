import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ── API KEY CONTEXT ───────────────────────────────────────────────────────────
const ApiKeyContext = createContext("");
function useApiKey() { return useContext(ApiKeyContext); }

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap";

// ── DATA ──────────────────────────────────────────────────────────────────────
const SIDEBAR_CATEGORIES = [
  { section:"FINANCIAL CRIME", items:[{label:"Financial Crime",count:3},{label:"Money Laundering",count:1},{label:"Fraud & Scams",count:2},{label:"Insider Trading",count:1}]},
  { section:"SECURITY & TERROR", items:[{label:"Terrorism",count:1},{label:"Cybercrime",count:2},{label:"Drug Trafficking",count:1}]},
  { section:"REGULATION & LAW", items:[{label:"Sanctions",count:1},{label:"Regulatory & Compliance",count:1},{label:"FINRA & SEC",count:1},{label:"Corruption",count:1}]},
  { section:"HUMAN RIGHTS & JUSTICE", items:[{label:"Human Rights",count:2},{label:"War Crimes",count:2},{label:"Crime, Law & Justice",count:2}]},
  { section:"ECONOMY & BUSINESS", items:[{label:"Economy & Markets",count:2},{label:"Geopolitics",count:1},{label:"Science",count:1},{label:"Climate",count:1}]},
];

// Map sidebar labels → exact article category strings
const CATEGORY_MAP = {
  "Financial Crime":        ["Financial Crime"],
  "Money Laundering":       ["Money Laundering"],
  "Fraud & Scams":          ["Fraud & Scams"],
  "Insider Trading":        ["Insider Trading"],
  "Terrorism":              ["Terrorism"],
  "Cybercrime":             ["Cybercrime"],
  "Drug Trafficking":       ["Drug Trafficking"],
  "Sanctions":              ["Sanctions"],
  "Regulatory & Compliance":["Regulatory & Compliance"],
  "FINRA & SEC":            ["FINRA & SEC"],
  "Corruption":             ["Corruption"],
  "Human Rights":           ["Human Rights"],
  "War Crimes":             ["War Crimes"],
  "Crime, Law & Justice":   ["Crime, Law & Justice"],
  "Economy & Markets":      ["Economy & Markets"],
  "Geopolitics":            ["Geopolitics"],
  "Science":                ["Science"],
  "Climate":                ["Climate"],
};
const FILTER_CHIPS = ["Adverse Only","High Polarization","Financial","Crime","Sanctions","Human Rights","Terrorism","Regulation","Geopolitics","AI Ethics","Economy","Cybercrime"];
const COUNTRIES = [{code:"US",flag:"🇺🇸",label:"US"},{code:"UK",flag:"🇬🇧",label:"UK"},{code:"IN",flag:"🇮🇳",label:"IN"},{code:"FR",flag:"🇫🇷",label:"FR"},{code:"DE",flag:"🇩🇪",label:"DE"},{code:"JP",flag:"🇯🇵",label:"JP"},{code:"WORLD",flag:"🌐",label:"WORLD"}];

const ARTICLES = [
  // ── ECONOMY & MARKETS ──
  {id:1,category:"Economy & Markets",headline:"Budget 2025: Centre Raises Capital Expenditure by ₹1.2 Lakh Crore, Targets Infrastructure Push",summary:"The Union Budget proposes a sharp rise in infrastructure spending, targeting roads, railways, and affordable housing. Economists are divided on whether this will crowd out private investment or stimulate broader growth across India's lagging regions.",bias:14,sources:["The Hindu","Business Standard","Mint","Economic Times"],time:"2h ago",img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",breaking:true,polarized:false,sentiment:62,marketTicker:"SENSEX",marketMove:"+1.2%"},
  {id:2,category:"Economy & Markets",headline:"UPI Crosses 18 Billion Transactions in May 2025 — Tier-3 Cities Now 31% of Volume",summary:"India's UPI processed 18.07 billion transactions worth ₹20.44 lakh crore in May 2025, a 42% year-on-year rise. Tier-3 cities now account for 31% of transaction volume, up from just 19% two years ago.",bias:4,sources:["NPCI","Mint","Reuters"],time:"14h ago",img:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",breaking:false,polarized:false,sentiment:82,marketTicker:"PAYTM",marketMove:"+3.1%"},

  // ── FINANCIAL CRIME ──
  {id:3,category:"Financial Crime",headline:"ED Arrests Bengaluru Fintech CEO in ₹840 Crore Money Laundering Case Linked to Offshore Shell Firms",summary:"The Enforcement Directorate arrested the founder of a Bengaluru-based payments startup after tracing ₹840 crore in suspicious transfers through a network of Mauritius and UAE shell companies. The accused allegedly routed merchant settlement funds into personal accounts.",bias:11,sources:["The Hindu","NDTV","Indian Express","Economic Times"],time:"1h ago",img:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",breaking:true,polarized:false,sentiment:22,marketTicker:"N/A",marketMove:"—"},
  {id:4,category:"Financial Crime",headline:"SEBI Uncovers Coordinated Pump-and-Dump Scheme Involving 47 Listed SME Stocks",summary:"The Securities and Exchange Board of India has identified a coordinated network of traders who artificially inflated prices of 47 small-cap stocks using social media groups, chat channels, and layered broker accounts before dumping shares on retail investors.",bias:6,sources:["Business Standard","Mint","ET Markets"],time:"4h ago",img:"https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80",breaking:false,polarized:false,sentiment:18,marketTicker:"BSE SME",marketMove:"-2.3%"},
  {id:5,category:"Financial Crime",headline:"Punjab National Bank Reports ₹1,200 Crore Fraud by Diamond Exporter Using Fake LC Documents",summary:"Punjab National Bank has flagged a ₹1,200 crore fraud involving a Surat-based diamond exporting firm that allegedly used forged letters of credit and inflated export invoices to obtain working capital loans from multiple public sector banks.",bias:9,sources:["Reuters","Business Standard","The Hindu"],time:"6h ago",img:"https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80",breaking:false,polarized:false,sentiment:15,marketTicker:"PNB",marketMove:"-1.8%"},

  // ── MONEY LAUNDERING ──
  {id:6,category:"Money Laundering",headline:"Hawala Network Busted in Delhi: ₹320 Crore in Illegal Remittances Traced to 12 Countries",summary:"Delhi Police's Economic Offences Wing dismantled a hawala network operating across 12 countries, tracing ₹320 crore in illegal cross-border remittances. The network used cryptocurrency exchanges and fake import invoices to layer the proceeds.",bias:8,sources:["Times of India","NDTV","Indian Express"],time:"3h ago",img:"https://images.unsplash.com/photo-1618044733300-9472054094ee?w=800&q=80",breaking:false,polarized:false,sentiment:20,marketTicker:"N/A",marketMove:"—"},

  // ── FRAUD & SCAMS ──
  {id:7,category:"Fraud & Scams",headline:"Pig Butchering Scam Victims in India Lose ₹1,750 Crore to Chinese Cyber Syndicates in 2024",summary:"A CBI report reveals Indian citizens lost over ₹1,750 crore to sophisticated 'pig butchering' investment scams in 2024, predominantly operated by cybercrime syndicates based in Myanmar, Cambodia, and China using fake crypto trading platforms.",bias:7,sources:["Times of India","Hindustan Times","CBI Press Release"],time:"5h ago",img:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",breaking:false,polarized:false,sentiment:12,marketTicker:"N/A",marketMove:"—"},
  {id:8,category:"Fraud & Scams",headline:"Fake TRAI Officer Scam: Mumbai Residents Lose ₹45 Crore in 'Digital Arrest' Calls",summary:"Mumbai Cyber Police has registered 340 cases involving callers posing as TRAI and CBI officers who threaten victims with 'digital arrest' warrants unless they transfer funds to 'safe' government accounts. Senior citizens account for 68% of victims.",bias:5,sources:["Mumbai Mirror","NDTV","Hindustan Times"],time:"8h ago",img:"https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",breaking:false,polarized:false,sentiment:10,marketTicker:"N/A",marketMove:"—"},

  // ── INSIDER TRADING ──
  {id:9,category:"Insider Trading",headline:"SEBI Bars Former Infosys CFO's Associate from Markets for 2 Years Over Unpublished Price Data Leak",summary:"SEBI has barred a close associate of a former Infosys CFO from securities markets for two years after evidence emerged of share trades made using unpublished quarterly earnings data, with profits of ₹4.2 crore identified and ordered to be disgorged.",bias:6,sources:["ET Markets","Business Standard","Mint"],time:"9h ago",img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",breaking:false,polarized:false,sentiment:25,marketTicker:"INFY",marketMove:"-0.9%"},

  // ── TERRORISM ──
  {id:10,category:"Terrorism",headline:"NIA Arrests 6 ISIS Module Suspects in Hyderabad with Encrypted Messaging Intercepts as Evidence",summary:"The National Investigation Agency arrested six suspected members of an ISIS-linked module in Hyderabad following months of surveillance. Investigators recovered encrypted communications, digital wallets used for terror financing, and IED component procurement records.",bias:13,sources:["The Hindu","NDTV","Indian Express","Times of India"],time:"2h ago",img:"https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80",breaking:true,polarized:false,sentiment:15,marketTicker:"N/A",marketMove:"—"},

  // ── CYBERCRIME ──
  {id:11,category:"Cybercrime",headline:"AIIMS Delhi Cyberattack: Patient Data of 40 Lakh Records Offered for Sale on Dark Web Forum",summary:"A threat actor has listed the personal and medical records of approximately 40 lakh AIIMS Delhi patients on a dark web forum following a ransomware intrusion. CERT-In has issued an emergency advisory while the hospital's backup restoration continues.",bias:10,sources:["The Hindu","NDTV Tech","Indian Express","Economic Times"],time:"1h ago",img:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",breaking:true,polarized:false,sentiment:8,marketTicker:"N/A",marketMove:"—"},
  {id:12,category:"Cybercrime",headline:"Meta's AI Glasses Now Translate 12 Languages in Real Time — India Among First Markets, Raising Privacy Fears",summary:"Meta's Ray-Ban smart glasses received a major update enabling real-time translation for 12 languages, including Hindi and Tamil. Privacy advocates warn the always-on microphone could enable covert audio surveillance in public spaces.",bias:7,sources:["TechCrunch","The Verge","NDTV Tech"],time:"3h ago",img:"https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&q=80",breaking:false,polarized:false,sentiment:55,marketTicker:"META",marketMove:"+2.4%"},

  // ── DRUG TRAFFICKING ──
  {id:13,category:"Drug Trafficking",headline:"NCB Seizes 3,200 kg of Methamphetamine in Mumbai Port — Largest Single Drug Haul in India's History",summary:"The Narcotics Control Bureau seized 3,200 kilograms of methamphetamine hidden in industrial machinery containers at Nhava Sheva port, Mumbai — the largest single drug haul in India's recorded history, with an estimated street value of ₹3,200 crore.",bias:5,sources:["Times of India","NDTV","Indian Express"],time:"4h ago",img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",breaking:false,polarized:false,sentiment:20,marketTicker:"N/A",marketMove:"—"},

  // ── SANCTIONS ──
  {id:14,category:"Sanctions",headline:"US Treasury Sanctions Three Indian Firms for Allegedly Supplying Dual-Use Components to Russian Defence",summary:"The US Treasury Department's OFAC has designated three Indian manufacturing firms under Russia-related sanctions, alleging they supplied electronic components used in Russian military hardware. New Delhi has formally protested the designations.",bias:22,sources:["Reuters","Financial Times","Bloomberg","The Hindu"],time:"6h ago",img:"https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",breaking:false,polarized:true,sentiment:28,marketTicker:"USD/INR",marketMove:"+0.4%"},

  // ── REGULATORY & COMPLIANCE ──
  {id:15,category:"Regulatory & Compliance",headline:"RBI Mandates Real-Time Fraud Monitoring for All Banks Processing Over ₹1 Crore Daily — Deadline: December 2025",summary:"The Reserve Bank of India has issued a circular requiring all scheduled commercial banks processing transactions exceeding ₹1 crore daily to implement AI-powered real-time fraud detection systems by December 31, 2025, with non-compliance penalties of up to ₹5 crore per day.",bias:4,sources:["Business Standard","Mint","RBI Circular"],time:"7h ago",img:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",breaking:false,polarized:false,sentiment:55,marketTicker:"BANKNIFTY",marketMove:"+0.6%"},

  // ── FINRA & SEC ──
  {id:16,category:"FINRA & SEC",headline:"SEC Charges Indian-American Hedge Fund Manager with $180M Insider Trading Scheme Using Corporate Moles",summary:"The US Securities and Exchange Commission has charged a New Jersey-based hedge fund manager of Indian origin with orchestrating a $180 million insider trading scheme spanning six years, allegedly using paid informants inside six S&P 500 corporations.",bias:8,sources:["Reuters","WSJ","Bloomberg","Financial Times"],time:"10h ago",img:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",breaking:false,polarized:false,sentiment:18,marketTicker:"N/A",marketMove:"—"},

  // ── CORRUPTION ──
  {id:17,category:"Corruption",headline:"CBI Files Chargesheet Against 14 Officers in ₹2,400 Crore Coal Block Allocation Scam",summary:"The Central Bureau of Investigation has filed a 2,800-page chargesheet against 14 senior government officials and private sector executives in connection with alleged irregularities in coal block allocations worth ₹2,400 crore between 2006 and 2012.",bias:16,sources:["The Hindu","Indian Express","Times of India","NDTV"],time:"11h ago",img:"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",breaking:false,polarized:true,sentiment:20,marketTicker:"N/A",marketMove:"—"},

  // ── HUMAN RIGHTS ──
  {id:18,category:"Human Rights",headline:"UN Special Rapporteur Flags Conditions in Manipur Relief Camps — 62,000 Displaced After 18 Months",summary:"A UN Special Rapporteur on internal displacement has raised concerns about the humanitarian conditions facing over 62,000 internally displaced persons in Manipur relief camps, citing inadequate sanitation, food insecurity, and restricted freedom of movement after 18 months of ethnic conflict.",bias:21,sources:["Reuters","The Hindu","Al Jazeera","Indian Express"],time:"5h ago",img:"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",breaking:false,polarized:true,sentiment:22,marketTicker:"N/A",marketMove:"—"},
  {id:19,category:"Human Rights",headline:"Supreme Court Orders Release of All Undertrial Prisoners Held Over 3 Years Without Conviction",summary:"The Supreme Court of India issued a landmark order directing all state governments to release undertrial prisoners who have spent more than three years in custody without conviction, estimating approximately 1.2 lakh people could be affected nationwide.",bias:9,sources:["The Hindu","Indian Express","Bar & Bench","NDTV"],time:"8h ago",img:"https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&q=80",breaking:false,polarized:false,sentiment:68,marketTicker:"N/A",marketMove:"—"},

  // ── WAR CRIMES ──
  {id:20,category:"War Crimes",headline:"ICC Issues Arrest Warrant for Myanmar Junta Chief Over Rohingya Genocide Charges",summary:"The International Criminal Court has issued an arrest warrant for Myanmar's Senior General Min Aung Hlaing on charges of crimes against humanity and war crimes related to the 2017 Rohingya genocide, in which over 700,000 people were forcibly displaced.",bias:14,sources:["Reuters","BBC","Al Jazeera","The Guardian"],time:"3h ago",img:"https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=800&q=80",breaking:true,polarized:false,sentiment:15,marketTicker:"N/A",marketMove:"—"},
  {id:21,category:"War Crimes",headline:"Gaza Death Toll Crosses 47,000 — ICJ Urged to Enforce Interim Measures as Aid Blockade Continues",summary:"The Palestinian death toll in Gaza has surpassed 47,000 according to the Gaza Health Ministry, as international pressure mounts on the International Court of Justice to enforce its interim order on humanitarian access. UNRWA reports complete blockade of northern Gaza.",bias:28,sources:["Al Jazeera","Reuters","BBC","The Guardian"],time:"1h ago",img:"https://images.unsplash.com/photo-1603718467088-c45d903b66ea?w=800&q=80",breaking:true,polarized:true,sentiment:5,marketTicker:"N/A",marketMove:"—"},

  // ── CRIME, LAW & JUSTICE ──
  {id:22,category:"Crime, Law & Justice",headline:"Delhi High Court Acquits Man After 14 Years — Forensic Evidence Proves Police Planted Weapon",summary:"The Delhi High Court acquitted a man convicted of murder after 14 years of imprisonment, following re-examination of forensic evidence that conclusively demonstrated the firearm presented as evidence had been planted by police investigators. The court ordered ₹25 lakh compensation.",bias:10,sources:["The Hindu","Bar & Bench","Indian Express","NDTV"],time:"6h ago",img:"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",breaking:false,polarized:false,sentiment:48,marketTicker:"N/A",marketMove:"—"},
  {id:23,category:"Crime, Law & Justice",headline:"Pune Porsche Case: Juvenile Court Orders Minor's Remand to Observation Home After Bail Revoked",summary:"A Pune juvenile court revoked bail and ordered the remand of the 17-year-old accused in the fatal Porsche accident case to a government observation home, following public outrage over the initial 300-word essay punishment and allegations of evidence tampering.",bias:17,sources:["Times of India","Hindustan Times","Indian Express","NDTV"],time:"9h ago",img:"https://images.unsplash.com/photo-1502570149819-b2260483d302?w=800&q=80",breaking:false,polarized:true,sentiment:30,marketTicker:"N/A",marketMove:"—"},

  // ── GEOPOLITICS ──
  {id:24,category:"Geopolitics",headline:"G7 Agrees on Framework to Tax AI-Generated Income — Implementation Mechanism Disputed",summary:"G7 finance ministers reached a preliminary agreement to tax revenues generated by autonomous AI systems. The mechanism for attribution remains deeply unresolved, with US and UK opposing mandatory implementation.",bias:19,sources:["Reuters","Financial Times","Bloomberg"],time:"8h ago",img:"https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",breaking:false,polarized:true,sentiment:42,marketTicker:"NASDAQ",marketMove:"-0.6%"},

  // ── SCIENCE ──
  {id:25,category:"Science",headline:"IISc Develops ₹200 Water Purifier Using Coconut Shell Biochar — 99.3% Arsenic Removal",summary:"A team at the Indian Institute of Science has developed a water purification device using activated biochar from coconut shells. At under ₹200 per unit it could be transformative for the 15 crore Indians still lacking clean drinking water.",bias:3,sources:["Nature Water","The Hindu","Science Daily"],time:"11h ago",img:"https://images.unsplash.com/photo-1527430253228-e93688616381?w=800&q=80",breaking:false,polarized:false,sentiment:88,marketTicker:"N/A",marketMove:"—"},

  // ── CLIMATE ──
  {id:26,category:"Climate",headline:"IMD Forecasts Above-Normal Monsoon 2025 at 106% LPA — Kharif Projections Revised Upward",summary:"India's Meteorological Department forecasts 106% of long-period average rainfall, potentially breaking a two-year deficiency streak. Kharif crop projections have been revised upward, though flood risks in low-lying states remain elevated.",bias:5,sources:["Times of India","Down to Earth","Indian Express"],time:"5h ago",img:"https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800&q=80",breaking:false,polarized:false,sentiment:58,marketTicker:"NIFTY AGRI",marketMove:"+0.8%"},
];

// Sparkline data: 7 days coverage counts per topic
const SPARKLINE_DATA = [
  {topic:"Economy",color:"#16a34a",data:[4,6,5,8,7,9,8]},
  {topic:"Tech",color:"#3b82f6",data:[3,3,5,6,8,7,9]},
  {topic:"Climate",color:"#06b6d4",data:[2,4,3,5,4,6,5]},
  {topic:"Politics",color:"#ef4444",data:[6,8,7,9,6,8,7]},
  {topic:"Science",color:"#8b5cf6",data:[1,2,3,2,4,3,5]},
  {topic:"Geopolitics",color:"#f59e0b",data:[5,4,6,5,7,6,8]},
];

// Word cloud words extracted from headlines
const WORD_CLOUD_WORDS = [
  {word:"India",size:32,sentiment:"positive"},{word:"Budget",size:28,sentiment:"neutral"},{word:"AI",size:30,sentiment:"positive"},
  {word:"Economy",size:26,sentiment:"neutral"},{word:"Infrastructure",size:22,sentiment:"positive"},{word:"Climate",size:24,sentiment:"mixed"},
  {word:"UPI",size:28,sentiment:"positive"},{word:"Monsoon",size:20,sentiment:"mixed"},{word:"Tax",size:22,sentiment:"negative"},
  {word:"Technology",size:20,sentiment:"positive"},{word:"Market",size:24,sentiment:"neutral"},{word:"Growth",size:22,sentiment:"positive"},
  {word:"Crisis",size:16,sentiment:"negative"},{word:"Reform",size:18,sentiment:"positive"},{word:"G7",size:18,sentiment:"neutral"},
  {word:"Investment",size:20,sentiment:"positive"},{word:"Data",size:16,sentiment:"neutral"},{word:"Science",size:18,sentiment:"positive"},
  {word:"Policy",size:20,sentiment:"neutral"},{word:"Water",size:16,sentiment:"positive"},{word:"Digital",size:18,sentiment:"positive"},
  {word:"Global",size:16,sentiment:"neutral"},{word:"Dispute",size:14,sentiment:"negative"},{word:"Record",size:18,sentiment:"positive"},
];

// ── CLAUDE API ────────────────────────────────────────────────────────────────
// Works in both Claude.ai (no key needed) AND CodeSandbox/Vercel (key required)
async function callClaude(system, user, apiKey) {
  const key = apiKey || window.__NEWSDARPAN_API_KEY__ || "";
  try {
    // If we have an API key, call Anthropic via a CORS-friendly proxy
    if (key) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 900,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return `API Error ${res.status}: ${err?.error?.message || res.statusText}. Check your API key.`;
      }
      const d = await res.json();
      return d.content?.[0]?.text ?? "";
    }
    // No key — try Claude.ai's built-in proxy (works inside claude.ai artifacts only)
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 900,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const d = await res.json();
    return d.content?.[0]?.text ?? "";
  } catch (e) {
    if (!key) return "⚠️ API key required. Enter your Anthropic API key in the banner above to enable AI features.";
    return `Error: ${e.message}. Make sure your API key is correct.`;
  }
}

// ── API KEY BANNER ────────────────────────────────────────────────────────────
function ApiKeyBanner({ apiKey, setApiKey }) {
  const [input, setInput] = useState(apiKey);
  const [show, setShow] = useState(!apiKey);
  const [saved, setSaved] = useState(false);

  function save() {
    window.__NEWSDARPAN_API_KEY__ = input.trim();
    setApiKey(input.trim());
    setSaved(true);
    setShow(false);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!show && apiKey) {
    return (
      <div style={{
        background: "#f0fdf4", borderBottom: "1px solid #bbf7d0",
        padding: "6px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 10,
      }}>
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "#15803d", display: "flex", alignItems: "center", gap: 6 }}>
          ✅ API key set — all AI features enabled
          {saved && <span style={{ color: "#16a34a", fontWeight: 700 }}>Saved!</span>}
        </span>
        <button onClick={() => { setInput(apiKey); setShow(true); }} style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "#6b7280", background: "none", border: "1px solid #d1d5db", borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>Change key</button>
      </div>
    );
  }

  return (
    <div style={{
      background: "#fffbeb", borderBottom: "1px solid #fde68a",
      padding: "10px 20px", display: "flex", alignItems: "center",
      gap: 10, flexWrap: "wrap",
    }}>
      <span style={{ fontSize: 16 }}>🔑</span>
      <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "#92400e", fontWeight: 600 }}>
        Enter your Anthropic API key to enable all AI features:
      </span>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && save()}
        placeholder="sk-ant-api03-..."
        type="password"
        style={{
          flex: 1, minWidth: 260, fontFamily: "Inter,sans-serif", fontSize: 12,
          padding: "6px 10px", border: "1px solid #fcd34d", borderRadius: 6,
          outline: "none", background: "#fff", color: "#111827",
        }}
      />
      <button onClick={save} disabled={!input.trim()} style={{
        fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: 12, padding: "6px 16px",
        borderRadius: 6, border: "none", background: input.trim() ? "#f59e0b" : "#d1d5db",
        color: "#111827", cursor: input.trim() ? "pointer" : "not-allowed",
      }}>Save & Enable</button>
      <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
        style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "#92400e", textDecoration: "underline" }}>
        Get a free key →
      </a>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function Spinner({color="#374151",size=16}) {
  return <div style={{width:size,height:size,border:`2px solid #e5e7eb`,borderTop:`2px solid ${color}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>;
}
function BiasScore({score}) {
  const color=score<10?"#16a34a":score<25?"#d97706":"#dc2626";
  const label=score<10?"Low":score<25?"Moderate":"High";
  return <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:80,height:4,background:"#e5e7eb",borderRadius:2,overflow:"hidden"}}><div style={{width:`${score}%`,height:"100%",background:color,borderRadius:2}}/></div><span style={{fontSize:11,color,fontWeight:600,fontFamily:"Inter,sans-serif"}}>{label} bias</span></div>;
}
function SentimentRing({value}) {
  const color=value>=70?"#16a34a":value>=45?"#d97706":"#dc2626";
  const label=value>=70?"Positive":value>=45?"Mixed":"Negative";
  const r=16,circ=2*Math.PI*r,dash=(value/100)*circ;
  return <div style={{display:"flex",alignItems:"center",gap:5}}><svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3.5"/><circle cx="19" cy="19" r={r} fill="none" stroke={color} strokeWidth="3.5" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 19 19)"/><text x="19" y="23" textAnchor="middle" fontSize="9" fontWeight="700" fill={color} fontFamily="Inter,sans-serif">{value}</text></svg><span style={{fontSize:11,color,fontWeight:600,fontFamily:"Inter,sans-serif"}}>{label}</span></div>;
}

// ── 1. TOPIC TREND SPARKLINES ─────────────────────────────────────────────────
function Sparkline({data,color,width=80,height=28}) {
  const max=Math.max(...data), min=Math.min(...data);
  const pts=data.map((v,i)=>{
    const x=(i/(data.length-1))*width;
    const y=height-((v-min)/(max-min||1))*(height-4)-2;
    return `${x},${y}`;
  }).join(" ");
  const last=data[data.length-1], prev=data[data.length-2];
  const trend=last>prev?"↑":last<prev?"↓":"→";
  const trendColor=last>prev?"#16a34a":last<prev?"#ef4444":"#6b7280";
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <svg width={width} height={height} style={{overflow:"visible"}}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx={parseFloat(pts.split(" ").pop().split(",")[0])} cy={parseFloat(pts.split(" ").pop().split(",")[1])} r="2.5" fill={color}/>
      </svg>
      <span style={{fontSize:12,fontWeight:700,color:trendColor,fontFamily:"Inter,sans-serif"}}>{trend}</span>
    </div>
  );
}
function TopicTrendSparklines() {
  const days=["M","T","W","T","F","S","S"];
  return (
    <div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:16,marginBottom:16}}>
      <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:17,color:"#111827",margin:"0 0 3px"}}>📈 Topic Trends</h3>
      <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",margin:"0 0 12px"}}>Coverage volume — past 7 days</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {SPARKLINE_DATA.map(({topic,color,data})=>(
          <div key={topic} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#374151",fontWeight:500,width:70}}>{topic}</span>
            <Sparkline data={data} color={color}/>
            <span style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",fontWeight:600}}>{data[data.length-1]} stories</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 2. WORD CLOUD ─────────────────────────────────────────────────────────────
function WordCloud() {
  const [show,setShow]=useState(false);
  const sentColor={positive:"#16a34a",negative:"#dc2626",neutral:"#374151",mixed:"#d97706"};
  return (
    <div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:16,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div>
          <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:17,color:"#111827",margin:"0 0 2px"}}>☁ Word Cloud</h3>
          <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",margin:0}}>Most-used words today · coloured by sentiment</p>
        </div>
        <button onClick={()=>setShow(s=>!s)} style={{fontSize:11,fontFamily:"Inter,sans-serif",padding:"4px 10px",border:"1px solid #d1d5db",borderRadius:5,background:"#fff",cursor:"pointer",color:"#374151"}}>{show?"Hide":"Show"}</button>
      </div>
      {show && (
        <div style={{background:"#f9fafb",borderRadius:8,padding:"14px 12px",display:"flex",flexWrap:"wrap",gap:6,alignItems:"baseline",justifyContent:"center",lineHeight:1.8}}>
          {WORD_CLOUD_WORDS.map(({word,size,sentiment})=>(
            <span key={word} style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:Math.max(10,size*0.55),color:sentColor[sentiment],cursor:"default",transition:"transform 0.15s",display:"inline-block"}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              title={`Sentiment: ${sentiment}`}
            >{word}</span>
          ))}
          <div style={{width:"100%",marginTop:8,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            {[["#16a34a","Positive"],["#dc2626","Negative"],["#d97706","Mixed"],["#374151","Neutral"]].map(([c,l])=>(
              <span key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,fontFamily:"Inter,sans-serif",color:"#6b7280"}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>{l}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 3. LIVE DEBATE MODE ───────────────────────────────────────────────────────
function LiveDebate({art}) {
  const apiKey=useApiKey();
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [started,setStarted]=useState(false);
  const [round,setRound]=useState(0);
  const bottomRef=useRef(null);

  async function startDebate() {
    setStarted(true); setMessages([]); setRound(0);
    await addTurn("Liberal",0,[]);
  }

  async function addTurn(persona,roundNum,prevMsgs) {
    setLoading(true);
    const isLiberal=persona==="Liberal";
    const opposite=isLiberal?"Conservative":"Liberal";
    const prevText=prevMsgs.length>0?`\n\nPrevious ${opposite} argument: "${prevMsgs[prevMsgs.length-1].text}"`:"";
    const sys=`You are a ${persona} political commentator debating a news story. Make ONE sharp, factual argument from your perspective. 2-3 sentences max. Be direct. End with a pointed question to the other side. No fluff.`;
    const usr=`News: "${art.headline}". ${prevText}\n\nMake your ${roundNum===0?"opening":"counter"} argument.`;
    const txt=await callClaude(sys,usr,apiKey);
    const newMsg={persona,text:txt,color:isLiberal?"#3b82f6":"#ef4444",icon:isLiberal?"🔵":"🔴"};
    const updated=[...prevMsgs,newMsg];
    setMessages(updated);
    setRound(roundNum+1);
    setLoading(false);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),100);
    return updated;
  }

  async function continueDebate() {
    if(loading) return;
    const nextPersona=messages.length%2===0?"Liberal":"Conservative";
    await addTurn(nextPersona,round,messages);
  }

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div>
          <h4 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:16,color:"#111827",margin:"0 0 2px"}}>⚔️ Live Debate</h4>
          <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#6b7280",margin:0}}>Liberal vs Conservative — real-time AI debate</p>
        </div>
        <button onClick={startDebate} disabled={loading} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"6px 12px",borderRadius:6,border:"none",background:"#111827",color:"#fff",cursor:"pointer"}}>
          {started?"🔄 Restart":"▶ Start Debate"}
        </button>
      </div>
      {messages.length===0 && !loading && (
        <div style={{background:"#f9fafb",border:"1px dashed #d1d5db",borderRadius:8,padding:"20px",textAlign:"center"}}>
          <p style={{fontFamily:"Inter,sans-serif",fontSize:13,color:"#9ca3af",margin:0}}>Click "Start Debate" to watch Liberal 🔵 vs Conservative 🔴 argue this story live.</p>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:320,overflowY:"auto",paddingRight:4}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",flexDirection:m.persona==="Liberal"?"row":"row-reverse"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:m.color+"15",border:`2px solid ${m.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{m.icon}</div>
            <div style={{maxWidth:"80%",background:m.persona==="Liberal"?"#eff6ff":"#fef2f2",border:`1px solid ${m.color}30`,borderRadius:m.persona==="Liberal"?"4px 12px 12px 12px":"12px 4px 12px 12px",padding:"9px 12px"}}>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:10,fontWeight:700,color:m.color,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.06em"}}>{m.persona}</p>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:13,color:"#374151",margin:0,lineHeight:1.6}}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0"}}>
            <Spinner/><span style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#9ca3af"}}>
              {messages.length%2===0?"Liberal":"Conservative"} is responding…
            </span>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      {started && messages.length>0 && !loading && messages.length<8 && (
        <button onClick={continueDebate} style={{marginTop:10,width:"100%",fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"8px",borderRadius:6,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer",color:"#374151"}}>
          Continue Debate →
        </button>
      )}
      {messages.length>=8 && <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",textAlign:"center",marginTop:8}}>Debate concluded after 8 rounds.</p>}
    </div>
  );
}

// ── 4. NEWS DNA RADAR ─────────────────────────────────────────────────────────
function NewsDNA({art}) {
  const apiKey=useApiKey();
  const [dna,setDna]=useState(null); const [loading,setLoading]=useState(false);
  async function analyze() {
    setLoading(true); setDna(null);
    const sys=`You are NewsDarpan's News DNA analyzer. Score this story on 6 dimensions, 0-100. Return ONLY valid JSON:
{"emotional_tone":72,"political_lean":45,"credibility":88,"urgency":65,"complexity":58,"global_relevance":70}`;
    const raw=await callClaude(sys,`Story: "${art.headline}"\n${art.summary}`,apiKey);
    try { setDna(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch { setDna({emotional_tone:65,political_lean:50,credibility:85,urgency:60,complexity:55,global_relevance:70}); }
    setLoading(false);
  }
  useEffect(()=>{ analyze(); },[art]);

  const dims=[
    {key:"emotional_tone",label:"Emotion",color:"#ec4899"},
    {key:"political_lean",label:"Political",color:"#3b82f6"},
    {key:"credibility",label:"Credibility",color:"#16a34a"},
    {key:"urgency",label:"Urgency",color:"#ef4444"},
    {key:"complexity",label:"Complexity",color:"#8b5cf6"},
    {key:"global_relevance",label:"Global",color:"#f59e0b"},
  ];

  function radarPoints(data,cx,cy,r) {
    return dims.map(({key},i)=>{
      const angle=(i/dims.length)*2*Math.PI-Math.PI/2;
      const val=(data[key]||0)/100;
      return [cx+r*val*Math.cos(angle), cy+r*val*Math.sin(angle)];
    });
  }

  const cx=100,cy=90,r=70;
  const gridLevels=[0.25,0.5,0.75,1];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div>
          <h4 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:16,color:"#111827",margin:"0 0 2px"}}>🧬 News DNA</h4>
          <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#6b7280",margin:0}}>Story fingerprint across 6 dimensions</p>
        </div>
        <button onClick={analyze} disabled={loading} style={{fontSize:11,fontFamily:"Inter,sans-serif",padding:"4px 10px",border:"1px solid #d1d5db",borderRadius:5,background:"#fff",cursor:"pointer",color:"#374151"}}>↺</button>
      </div>
      {loading ? (
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"16px 0"}}><Spinner/><span style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#9ca3af"}}>Analyzing story DNA…</span></div>
      ) : dna ? (
        <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
          <svg width="200" height="180" viewBox="0 0 200 180">
            {/* Grid */}
            {gridLevels.map(level=>(
              <polygon key={level} points={dims.map((_,i)=>{
                const angle=(i/dims.length)*2*Math.PI-Math.PI/2;
                return `${cx+r*level*Math.cos(angle)},${cy+r*level*Math.sin(angle)}`;
              }).join(" ")} fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            ))}
            {/* Axes */}
            {dims.map((_,i)=>{
              const angle=(i/dims.length)*2*Math.PI-Math.PI/2;
              return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(angle)} y2={cy+r*Math.sin(angle)} stroke="#e5e7eb" strokeWidth="1"/>;
            })}
            {/* Data polygon */}
            <polygon points={radarPoints(dna,cx,cy,r).map(p=>p.join(",")).join(" ")} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2"/>
            {/* Labels */}
            {dims.map(({label,color},i)=>{
              const angle=(i/dims.length)*2*Math.PI-Math.PI/2;
              const lx=cx+(r+16)*Math.cos(angle), ly=cy+(r+16)*Math.sin(angle);
              return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={color} fontWeight="700" fontFamily="Inter,sans-serif">{label}</text>;
            })}
          </svg>
          <div style={{display:"flex",flexDirection:"column",gap:5,flex:1}}>
            {dims.map(({key,label,color})=>(
              <div key={key}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <span style={{fontSize:10,fontFamily:"Inter,sans-serif",color:"#374151",fontWeight:500}}>{label}</span>
                  <span style={{fontSize:10,fontFamily:"Inter,sans-serif",color,fontWeight:700}}>{dna[key]}</span>
                </div>
                <div style={{height:3,background:"#e5e7eb",borderRadius:2}}><div style={{width:`${dna[key]}%`,height:"100%",background:color,borderRadius:2}}/></div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── 5. FAKE NEWS DETECTOR ─────────────────────────────────────────────────────
function FakeNewsDetector() {
  const apiKey=useApiKey();
  const [input,setInput]=useState(""); const [result,setResult]=useState(null); const [loading,setLoading]=useState(false);
  async function check() {
    if(!input.trim()) return;
    setLoading(true); setResult(null);
    const sys=`You are NewsDarpan's Fake News Detector. Analyze the given headline or claim. Return ONLY valid JSON:
{"verdict":"True","confidence":92,"label":"Verified Fact","reasoning":"Short 2-sentence reasoning why.","red_flags":["flag1"],"sources_to_check":["Reuters","BBC"]}
Verdict must be one of: True, Mostly True, Misleading, False, Unverified, Satire`;
    const raw=await callClaude(sys,`Analyze: "${input}"`,apiKey);
    try { setResult(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch { setResult({verdict:"Unverified",confidence:50,label:"Could not analyze",reasoning:raw,red_flags:[],sources_to_check:[]}); }
    setLoading(false);
  }
  const verdictStyle={
    "True":{bg:"#dcfce7",border:"#86efac",text:"#15803d",icon:"✅"},
    "Mostly True":{bg:"#d1fae5",border:"#6ee7b7",text:"#065f46",icon:"✔"},
    "Misleading":{bg:"#fef9c3",border:"#fde047",text:"#854d0e",icon:"⚠️"},
    "False":{bg:"#fee2e2",border:"#fca5a5",text:"#991b1b",icon:"❌"},
    "Unverified":{bg:"#f3f4f6",border:"#d1d5db",text:"#374151",icon:"❓"},
    "Satire":{bg:"#ede9fe",border:"#c4b5fd",text:"#5b21b6",icon:"🎭"},
  };
  return (
    <div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:18,marginBottom:18}}>
      <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:17,color:"#111827",margin:"0 0 3px"}}>🔍 Fake News Detector</h3>
      <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",margin:"0 0 10px"}}>Paste any headline or claim — get instant verdict</p>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste a headline or claim to fact-check…" rows={2}
        style={{width:"100%",fontFamily:"Inter,sans-serif",fontSize:12,padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:6,color:"#374151",outline:"none",resize:"none",boxSizing:"border-box",marginBottom:7}}/>
      <button onClick={check} disabled={loading||!input.trim()} style={{width:"100%",fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"8px",borderRadius:6,border:"none",background:loading||!input.trim()?"#d1d5db":"#111827",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        {loading?<><Spinner color="#fff" size={13}/>Checking…</>:"Check Now"}
      </button>
      {result && (()=>{
        const s=verdictStyle[result.verdict]||verdictStyle["Unverified"];
        const confColor=result.confidence>75?"#16a34a":result.confidence>50?"#d97706":"#dc2626";
        return (
          <div style={{marginTop:10}}>
            <div style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:8,padding:"12px 14px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontFamily:"Playfair Display,serif",fontWeight:900,fontSize:18,color:s.text}}>{s.icon} {result.verdict}</span>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"Inter,sans-serif",fontSize:10,color:"#6b7280",marginBottom:2}}>Confidence</div>
                  <div style={{fontFamily:"Playfair Display,serif",fontWeight:900,fontSize:20,color:confColor}}>{result.confidence}%</div>
                </div>
              </div>
              {/* Confidence bar */}
              <div style={{height:4,background:"#e5e7eb",borderRadius:2,marginBottom:8}}>
                <div style={{width:`${result.confidence}%`,height:"100%",background:confColor,borderRadius:2}}/>
              </div>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:12,color:s.text,margin:0,lineHeight:1.6}}>{result.reasoning}</p>
            </div>
            {result.red_flags?.length>0 && (
              <div style={{marginBottom:6}}>
                <p style={{fontFamily:"Inter,sans-serif",fontSize:10,fontWeight:700,color:"#dc2626",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.07em"}}>🚩 Red Flags</p>
                {result.red_flags.map((f,i)=><p key={i} style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#374151",margin:"0 0 2px"}}>• {f}</p>)}
              </div>
            )}
            {result.sources_to_check?.length>0 && (
              <div>
                <p style={{fontFamily:"Inter,sans-serif",fontSize:10,fontWeight:700,color:"#374151",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.07em"}}>✅ Verify At</p>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{result.sources_to_check.map(s=><span key={s} style={{fontSize:10,fontFamily:"Inter,sans-serif",background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:4,padding:"2px 7px",color:"#374151"}}>{s}</span>)}</div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ── 6. STORY IMPACT CALCULATOR ────────────────────────────────────────────────
function StoryImpactCalc({art}) {
  const apiKey=useApiKey();
  const [persona,setPersona]=useState(null); const [result,setResult]=useState(""); const [loading,setLoading]=useState(false);
  const personas=[
    {id:"student",icon:"🎓",label:"Student"},
    {id:"farmer",icon:"🌾",label:"Farmer"},
    {id:"developer",icon:"💻",label:"Developer"},
    {id:"investor",icon:"📈",label:"Investor"},
    {id:"government",icon:"🏛️",label:"Govt Official"},
  ];
  async function calculate(p) {
    setPersona(p); setLoading(true); setResult("");
    const sys=`You are NewsDarpan's Impact Calculator. Given a news story and a persona, give: 1) Impact Score (1-10), 2) Why it matters to them, 3) Three specific action items they should take right now. Under 180 words total. No bullets — flowing prose per section.`;
    const t=await callClaude(sys,`Story: "${art.headline}"\nPersona: ${p}\n\nCalculate impact.`,apiKey);
    setResult(t); setLoading(false);
  }
  return (
    <div>
      <div style={{marginBottom:10}}>
        <h4 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:16,color:"#111827",margin:"0 0 2px"}}>🎯 Impact Calculator</h4>
        <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#6b7280",margin:0}}>Who are you? See your personalised impact.</p>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
        {personas.map(p=>(
          <button key={p.id} onClick={()=>calculate(p.id)} style={{fontFamily:"Inter,sans-serif",fontSize:11,fontWeight:persona===p.id?600:400,padding:"5px 10px",borderRadius:6,border:`1.5px solid ${persona===p.id?"#111827":"#e5e7eb"}`,background:persona===p.id?"#111827":"#fff",color:persona===p.id?"#fff":"#374151",cursor:"pointer"}}>
            {p.icon} {p.label}
          </button>
        ))}
      </div>
      {loading ? <div style={{display:"flex",alignItems:"center",gap:8}}><Spinner/><span style={{fontSize:12,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>Calculating impact…</span></div>
        : result ? <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"12px 14px"}}><p style={{fontFamily:"Inter,sans-serif",fontSize:13,color:"#374151",lineHeight:1.7,margin:0,whiteSpace:"pre-wrap"}}>{result}</p></div>
        : <div style={{background:"#f9fafb",border:"1px dashed #d1d5db",borderRadius:8,padding:"14px",textAlign:"center"}}><p style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#9ca3af",margin:0}}>Select your persona above to see how this story affects you specifically.</p></div>
      }
    </div>
  );
}

// ── 7. NEWS TIME MACHINE ──────────────────────────────────────────────────────
function NewsTimeMachine() {
  const apiKey=useApiKey();
  const [topic,setTopic]=useState(""); const [result,setResult]=useState(null); const [loading,setLoading]=useState(false);
  const suggestions=["India economy","AI regulation","Climate change","Cryptocurrency","India-China relations"];
  async function run(t) {
    const q=t||topic; if(!q.trim()) return;
    setTopic(q); setLoading(true); setResult(null);
    const sys=`You are NewsDarpan's Time Machine. Show how headlines about a topic looked at different points in time. Return ONLY valid JSON:
{
  "topic": "topic name",
  "past_1yr": {"year":"2024","headline":"Realistic headline from that time","narrative_shift":"How coverage differed"},
  "past_5yr": {"year":"2020","headline":"Realistic headline from that time","narrative_shift":"How coverage differed"},
  "past_10yr": {"year":"2015","headline":"Realistic headline from that time","narrative_shift":"How coverage differed"},
  "narrative_evolution": "2-sentence summary of how the narrative has shifted overall"
}`;
    const raw=await callClaude(sys,`Topic: "${q}"`,apiKey);
    try { setResult(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch { setResult(null); }
    setLoading(false);
  }
  return (
    <div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:18,marginBottom:18}}>
      <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:17,color:"#111827",margin:"0 0 3px"}}>⏳ News Time Machine</h3>
      <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",margin:"0 0 10px"}}>See how headlines on any topic looked 1, 5, 10 years ago</p>
      <div style={{display:"flex",gap:6,marginBottom:7}}>
        <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&run()} placeholder="e.g. India economy…" style={{flex:1,fontFamily:"Inter,sans-serif",fontSize:12,padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:6,outline:"none"}}/>
        <button onClick={()=>run()} disabled={loading||!topic.trim()} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"8px 12px",borderRadius:6,border:"none",background:loading?"#d1d5db":"#111827",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
          {loading?<Spinner color="#fff" size={12}/>:"Go"}
        </button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
        {suggestions.map(s=>(<button key={s} onClick={()=>run(s)} style={{fontSize:10,fontFamily:"Inter,sans-serif",padding:"3px 8px",border:"1px solid #e5e7eb",borderRadius:20,background:"#f9fafb",color:"#374151",cursor:"pointer"}}>{s}</button>))}
      </div>
      {result && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {data:result.past_1yr,color:"#3b82f6",label:"1 Year Ago"},
            {data:result.past_5yr,color:"#8b5cf6",label:"5 Years Ago"},
            {data:result.past_10yr,color:"#ec4899",label:"10 Years Ago"},
          ].map(({data,color,label})=>data&&(
            <div key={label} style={{background:"#f9fafb",borderLeft:`3px solid ${color}`,borderRadius:"0 7px 7px 0",padding:"10px 12px"}}>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:9,fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 3px"}}>{data.year} · {label}</p>
              <p style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:13,color:"#111827",margin:"0 0 4px",lineHeight:1.35}}>"{data.headline}"</p>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#6b7280",margin:0,lineHeight:1.5}}>{data.narrative_shift}</p>
            </div>
          ))}
          {result.narrative_evolution && (
            <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:7,padding:"9px 12px"}}>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:10,fontWeight:700,color:"#92400e",margin:"0 0 3px",textTransform:"uppercase",letterSpacing:"0.07em"}}>📜 Narrative Evolution</p>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#374151",margin:0,lineHeight:1.6}}>{result.narrative_evolution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 8. COMMUNITY POLL ─────────────────────────────────────────────────────────
function CommunityPoll({art}) {
  const storageKey=`poll_${art.id}`;
  const initVotes={Believable:142,Suspicious:38,Important:89,Irrelevant:21};
  const [votes,setVotes]=useState(()=>{try{const s=localStorage.getItem(storageKey);return s?JSON.parse(s):initVotes;}catch{return initVotes;}});
  const [userVote,setUserVote]=useState(()=>{try{return localStorage.getItem(`uv_${art.id}`)||null;}catch{return null;}});
  function vote(opt) {
    if(userVote) return;
    const nv={...votes,[opt]:votes[opt]+1};
    setVotes(nv); setUserVote(opt);
    try{localStorage.setItem(storageKey,JSON.stringify(nv));localStorage.setItem(`uv_${art.id}`,opt);}catch{}
  }
  const total=Object.values(votes).reduce((a,b)=>a+b,0);
  const opts=[{label:"Believable",icon:"✅",color:"#16a34a"},{label:"Suspicious",icon:"🤔",color:"#d97706"},{label:"Important",icon:"⚡",color:"#3b82f6"},{label:"Irrelevant",icon:"😶",color:"#9ca3af"}];
  return (
    <div>
      <h4 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:16,color:"#111827",margin:"0 0 2px"}}>🗳️ Community Poll</h4>
      <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#6b7280",margin:"0 0 12px"}}>{total} readers voted · {userVote?"You voted: "+userVote:"What do you think of this story?"}</p>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {opts.map(({label,icon,color})=>{
          const pct=Math.round((votes[label]/total)*100);
          const isChosen=userVote===label;
          return (
            <div key={label} onClick={()=>vote(label)} style={{cursor:userVote?"default":"pointer",borderRadius:7,overflow:"hidden",border:`1.5px solid ${isChosen?color:"#e5e7eb"}`,transition:"border-color 0.15s"}}>
              <div style={{padding:"7px 11px",display:"flex",justifyContent:"space-between",alignItems:"center",background:isChosen?`${color}10`:"#fff"}}>
                <span style={{fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:isChosen?700:400,color:isChosen?color:"#374151"}}>{icon} {label}{isChosen?" ✓":""}</span>
                <span style={{fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:700,color}}>{pct}%</span>
              </div>
              <div style={{height:3,background:"#e5e7eb"}}>
                <div style={{width:`${pct}%`,height:"100%",background:color,transition:"width 0.4s ease"}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 9. STORY CONNECTIONS ──────────────────────────────────────────────────────
function StoryConnections({art}) {
  const apiKey=useApiKey();
  const [graph,setGraph]=useState(null); const [loading,setLoading]=useState(false);
  async function build() {
    setLoading(true); setGraph(null);
    const sys=`You are NewsDarpan's Story Connection engine. Given a central news story, generate a causal connection graph showing 3-4 related news stories and how they're connected. Return ONLY valid JSON:
{
  "connections": [
    {"headline":"Short related headline","relation":"How it connects causally","direction":"→","category":"Economy"},
    {"headline":"Another related headline","relation":"Cause/effect relationship","direction":"←","category":"Politics"},
    {"headline":"Third related story","relation":"Background context","direction":"↔","category":"Tech"},
    {"headline":"Fourth related story","relation":"Future consequence","direction":"→","category":"Climate"}
  ],
  "central_theme": "One sentence unifying theme"
}`;
    const raw=await callClaude(sys,`Central story: "${art.headline}"\n${art.summary}`,apiKey);
    try { setGraph(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch { setGraph(null); }
    setLoading(false);
  }
  useEffect(()=>{ build(); },[art]);
  const catColor={"Economy":"#16a34a","Politics":"#ef4444","Tech":"#3b82f6","Climate":"#06b6d4","Science":"#8b5cf6","Geopolitics":"#f59e0b"};
  const dirLabel={"→":"Causes","←":"Caused by","↔":"Related to"};
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div>
          <h4 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:16,color:"#111827",margin:"0 0 2px"}}>🕸️ Story Connections</h4>
          <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#6b7280",margin:0}}>How this story links to other events</p>
        </div>
        <button onClick={build} disabled={loading} style={{fontSize:11,fontFamily:"Inter,sans-serif",padding:"4px 10px",border:"1px solid #d1d5db",borderRadius:5,background:"#fff",cursor:"pointer",color:"#374151"}}>↺</button>
      </div>
      {loading ? <div style={{display:"flex",alignItems:"center",gap:8}}><Spinner/><span style={{fontSize:12,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>Building connection graph…</span></div>
      : graph ? (
        <div>
          {/* Central node */}
          <div style={{background:"#111827",borderRadius:8,padding:"10px 13px",marginBottom:10,textAlign:"center"}}>
            <p style={{fontFamily:"Inter,sans-serif",fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 4px"}}>CENTRAL STORY</p>
            <p style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:12,color:"#fff",margin:0,lineHeight:1.3}}>{art.headline.slice(0,70)}…</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {graph.connections?.map((c,i)=>{
              const cc=catColor[c.category]||"#374151";
              return (
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:40}}>
                    <span style={{fontSize:14,lineHeight:1}}>{c.direction}</span>
                    <span style={{fontSize:8,fontFamily:"Inter,sans-serif",color:"#9ca3af",textAlign:"center",lineHeight:1.2}}>{dirLabel[c.direction]}</span>
                  </div>
                  <div style={{flex:1,background:"#f9fafb",border:`1px solid ${cc}30`,borderLeft:`2px solid ${cc}`,borderRadius:"0 7px 7px 0",padding:"7px 10px"}}>
                    <p style={{fontFamily:"Inter,sans-serif",fontSize:9,fontWeight:700,color:cc,textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 3px"}}>{c.category}</p>
                    <p style={{fontFamily:"Playfair Display,serif",fontSize:12,fontWeight:700,color:"#111827",margin:"0 0 3px",lineHeight:1.3}}>{c.headline}</p>
                    <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#6b7280",margin:0,lineHeight:1.4}}>{c.relation}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {graph.central_theme && <div style={{marginTop:10,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:7,padding:"8px 11px"}}><p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#92400e",margin:0,lineHeight:1.5}}>🔗 <strong>Unifying theme:</strong> {graph.central_theme}</p></div>}
        </div>
      ) : null}
    </div>
  );
}

// ── 10. PERSONALISED NEWS SCORE ───────────────────────────────────────────────
function PersonalisedNewsScore({readHistory}) {
  const apiKey=useApiKey();
  const [score,setScore]=useState(null); const [loading,setLoading]=useState(false);
  async function evaluate() {
    if(readHistory.length===0) return;
    setLoading(true); setScore(null);
    const sys=`You are NewsDarpan's Reading Balance Analyzer. Given a user's reading history, evaluate: 1) Balance score (0-100), 2) Bias bubble warning, 3) Topics missed, 4) Viewpoint diversity. Return ONLY valid JSON:
{"balance_score":72,"grade":"B+","bubble_warning":"Mild","dominant_topic":"Economy","missing_topics":["Climate","Science"],"viewpoint_note":"You read mostly positive sentiment stories","recommendation":"Read one story from a different political perspective today"}`;
    const history=readHistory.map(a=>`"${a.headline}" (bias:${a.bias}, sentiment:${a.sentiment})`).join("\n");
    const raw=await callClaude(sys,`User read:\n${history}`,apiKey);
    try { setScore(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch { setScore(null); }
    setLoading(false);
  }
  const gradeColor={"A+":"#16a34a","A":"#16a34a","B+":"#4ade80","B":"#86efac","C+":"#d97706","C":"#f59e0b","D":"#ef4444"};
  return (
    <div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:18,marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div>
          <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:17,color:"#111827",margin:"0 0 2px"}}>🎓 Your News Score</h3>
          <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",margin:0}}>How balanced is your reading? ({readHistory.length} articles read)</p>
        </div>
        <button onClick={evaluate} disabled={loading||readHistory.length===0} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:11,padding:"5px 11px",borderRadius:6,border:"none",background:readHistory.length===0?"#d1d5db":"#111827",color:"#fff",cursor:readHistory.length===0?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:5}}>
          {loading?<><Spinner color="#fff" size={12}/>Scoring…</>:"Score Me"}
        </button>
      </div>
      {readHistory.length===0 && <p style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#9ca3af"}}>Read at least one article to get your balance score.</p>}
      {score && (
        <div>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
            <div style={{width:56,height:56,borderRadius:"50%",border:`3px solid ${gradeColor[score.grade]||"#374151"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:"Playfair Display,serif",fontWeight:900,fontSize:18,color:gradeColor[score.grade]||"#374151"}}>{score.grade}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#374151",fontWeight:600}}>Balance Score</span>
                <span style={{fontFamily:"Inter,sans-serif",fontSize:11,fontWeight:700,color:gradeColor[score.grade]||"#374151"}}>{score.balance_score}/100</span>
              </div>
              <div style={{height:5,background:"#e5e7eb",borderRadius:3}}><div style={{width:`${score.balance_score}%`,height:"100%",background:gradeColor[score.grade]||"#374151",borderRadius:3}}/></div>
            </div>
          </div>
          {[
            {label:"⚠️ Bubble Warning",val:score.bubble_warning,color:"#d97706"},
            {label:"📌 Dominant Topic",val:score.dominant_topic,color:"#374151"},
            {label:"👁 Viewpoint Note",val:score.viewpoint_note,color:"#374151"},
          ].map(({label,val,color})=>(
            <div key={label} style={{display:"flex",gap:8,marginBottom:5}}>
              <span style={{fontFamily:"Inter,sans-serif",fontSize:11,fontWeight:700,color:"#6b7280",minWidth:110}}>{label}</span>
              <span style={{fontFamily:"Inter,sans-serif",fontSize:11,color}}>{val}</span>
            </div>
          ))}
          {score.missing_topics?.length>0 && (
            <div style={{marginTop:7}}>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 4px"}}>Topics You Missed</p>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{score.missing_topics.map(t=><span key={t} style={{fontSize:10,fontFamily:"Inter,sans-serif",background:"#fef3c7",border:"1px solid #fde68a",borderRadius:4,padding:"2px 7px",color:"#92400e"}}>{t}</span>)}</div>
            </div>
          )}
          {score.recommendation && <div style={{marginTop:8,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:7,padding:"8px 11px"}}><p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#1e40af",margin:0}}>💡 {score.recommendation}</p></div>}
        </div>
      )}
    </div>
  );
}

// ── FUTURE PREDICTOR (right panel) ────────────────────────────────────────────
function GlobalFutureWidget() {
  const apiKey=useApiKey();
  const [topic,setTopic]=useState(""); const [result,setResult]=useState(null); const [loading,setLoading]=useState(false);
  const suggestions=["India GDP 2026","AI regulation","Monsoon food prices","UPI global","Rupee vs Dollar"];
  async function predict(t) {
    const q=t||topic; if(!q.trim()) return;
    setLoading(true); setResult(null);
    const sys=`You are NewsDarpan's Future Intelligence Engine. Return ONLY valid JSON:
{"summary":"2-sentence overview","short_term":"1-3 months prediction","long_term":"6-12 months prediction","optimistic":"Best case","pessimistic":"Worst case","india_angle":"India-specific angle","confidence":"High/Medium/Low"}`;
    const raw=await callClaude(sys,`Predict future of: "${q}"`,apiKey);
    try { setResult(JSON.parse(raw.replace(/```json|```/g,"").trim())); }
    catch { setResult({summary:raw}); }
    setLoading(false);
  }
  return (
    <div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:16,marginBottom:16}}>
      <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:17,color:"#7c3aed",margin:"0 0 3px"}}>🔮 Future Predictor</h3>
      <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",margin:"0 0 9px"}}>Any topic — AI-predicted future headlines</p>
      <div style={{display:"flex",gap:5,marginBottom:6}}>
        <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&predict()} placeholder="e.g. India economy 2026…" style={{flex:1,fontFamily:"Inter,sans-serif",fontSize:12,padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:6,outline:"none"}}/>
        <button onClick={()=>predict()} disabled={loading||!topic.trim()} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"7px 11px",borderRadius:6,border:"none",background:loading?"#d1d5db":"#7c3aed",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
          {loading?<Spinner color="#fff" size={12}/>:"🔮"}
        </button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:7}}>
        {suggestions.map(s=>(<button key={s} onClick={()=>{setTopic(s);predict(s);}} style={{fontSize:10,fontFamily:"Inter,sans-serif",padding:"3px 7px",border:"1px solid #e9d5ff",borderRadius:20,background:"#faf5ff",color:"#7c3aed",cursor:"pointer"}}>{s}</button>))}
      </div>
      {loading && <div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 0"}}><Spinner color="#7c3aed"/><span style={{fontSize:11,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>Predicting…</span></div>}
      {result?.summary && (
        <div style={{background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:7,padding:"11px 12px"}}>
          <p style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#374151",lineHeight:1.6,margin:"0 0 7px"}}>{result.summary}</p>
          {result.short_term && <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {[{k:"short_term",l:"📅 1–3 Months",c:"#3b82f6"},{k:"long_term",l:"📆 6–12 Months",c:"#7c3aed"},{k:"optimistic",l:"✅ Best Case",c:"#16a34a"},{k:"pessimistic",l:"⚠️ Worst Case",c:"#dc2626"},{k:"india_angle",l:"🇮🇳 India Angle",c:"#d97706"}].map(({k,l,c})=>
              result[k]&&<div key={k} style={{borderLeft:`2px solid ${c}`,paddingLeft:7}}><span style={{fontSize:9,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:"Inter,sans-serif"}}>{l}</span><p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#374151",margin:"2px 0 0",lineHeight:1.5}}>{result[k]}</p></div>
            )}
          </div>}
        </div>
      )}
    </div>
  );
}

// ── ARTICLE ANALYZER ──────────────────────────────────────────────────────────
function ArticleAnalyzer() {
  const apiKey=useApiKey();
  const [mode,setMode]=useState("url"); const [input,setInput]=useState(""); const [result,setResult]=useState(""); const [loading,setLoading]=useState(false);
  async function analyze() {
    if(!input.trim()) return; setLoading(true); setResult("");
    const t=await callClaude("You are NewsDarpan Article Analyzer. Analyze for: 1) Credibility /100, 2) Bias level, 3) Fake news risk (Low/Medium/High), 4) Adverse classification. Under 180 words.",mode==="url"?`URL: ${input}`:`Text: ${input}`,apiKey);
    setResult(t); setLoading(false);
  }
  return (
    <div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:16,marginBottom:16}}>
      <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:17,color:"#111827",margin:"0 0 3px"}}>Article Analyzer</h3>
      <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",margin:"0 0 9px"}}>Check any article for credibility & bias</p>
      <div style={{display:"flex",gap:5,marginBottom:7}}>
        <button onClick={()=>setMode("url")} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:11,padding:"4px 10px",borderRadius:5,border:`1.5px solid ${mode==="url"?"#111827":"#e5e7eb"}`,background:mode==="url"?"#111827":"#fff",color:mode==="url"?"#fff":"#374151",cursor:"pointer"}}>🔗 URL</button>
        <button onClick={()=>setMode("text")} style={{fontFamily:"Inter,sans-serif",fontWeight:500,fontSize:11,padding:"4px 10px",borderRadius:5,border:`1.5px solid ${mode==="text"?"#111827":"#e5e7eb"}`,background:mode==="text"?"#111827":"#fff",color:mode==="text"?"#fff":"#374151",cursor:"pointer"}}>📄 Text</button>
      </div>
      {mode==="url" ? <input value={input} onChange={e=>setInput(e.target.value)} placeholder="https://example.com/article..." style={{width:"100%",fontFamily:"Inter,sans-serif",fontSize:11,padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:6,color:"#374151",outline:"none",boxSizing:"border-box",marginBottom:6}}/>
        : <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste article text…" rows={2} style={{width:"100%",fontFamily:"Inter,sans-serif",fontSize:11,padding:"7px 10px",border:"1px solid #d1d5db",borderRadius:6,color:"#374151",outline:"none",boxSizing:"border-box",resize:"none",marginBottom:6}}/>}
      <button onClick={analyze} disabled={loading||!input.trim()} style={{width:"100%",fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"7px",borderRadius:6,border:"none",background:loading||!input.trim()?"#d1d5db":"#374151",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
        {loading?<><Spinner color="#fff" size={13}/>Analyzing…</>:"Analyze Article"}
      </button>
      {result && <div style={{marginTop:7,background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:6,padding:"8px 10px"}}><p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#374151",lineHeight:1.65,margin:0,whiteSpace:"pre-wrap"}}>{result}</p></div>}
    </div>
  );
}

// ── FULL ARTICLE MODAL ────────────────────────────────────────────────────────
function ArticleModal({art, onClose}) {
  const apiKey=useApiKey();
  const [tab,setTab]=useState("summary");
  const [ai,setAi]=useState(""); const [loading,setLoading]=useState(false);
  const [q,setQ]=useState(""); const [ans,setAns]=useState(""); const [askLoad,setAskLoad]=useState(false);

  const TABS=[
    {id:"summary",label:"📰 Summary"},{id:"progressive",label:"🔵 Progressive"},
    {id:"conservative",label:"🔴 Conservative"},{id:"neutral",label:"⚪ Neutral"},
    {id:"debate",label:"⚔️ Debate"},{id:"dna",label:"🧬 DNA"},
    {id:"impact",label:"🎯 Impact"},{id:"connections",label:"🕸️ Links"},
    {id:"poll",label:"🗳️ Poll"},{id:"ask",label:"💬 Ask AI"},
  ];
  useEffect(()=>{
    if(tab==="progressive"||tab==="conservative"||tab==="neutral") fetchView(tab);
    else setAi("");
  },[tab,art]);
  async function fetchView(t) {
    setLoading(true); setAi("");
    const vpMap={progressive:"progressive/left-leaning",conservative:"conservative/right-leaning",neutral:"strictly neutral"};
    const txt=await callClaude(`You are NewsDarpan AI. Write a ${vpMap[t]} analysis. Under 200 words. Short paragraphs. No bullets.`,`Story: "${art.headline}"\n${art.summary}`,apiKey);
    setAi(txt); setLoading(false);
  }
  async function handleAsk() {
    if(!q.trim()) return; setAskLoad(true); setAns("");
    const t=await callClaude("You are NewsDarpan AI. Answer factually. Under 150 words.",`Story: "${art.headline}"\n${art.summary}\nQuestion: ${q}`,apiKey);
    setAns(t); setAskLoad(false);
  }
  const vpColor={progressive:"#3b82f6",conservative:"#ef4444",neutral:"#6b7280"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"16px",overflowY:"auto"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:10,maxWidth:740,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)",overflow:"hidden",marginTop:8}} onClick={e=>e.stopPropagation()}>
        <img src={art.img} alt="" style={{width:"100%",height:160,objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>
        <div style={{padding:"16px 20px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:7}}>
            <span style={{fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif",color:"#16a34a",textTransform:"uppercase",letterSpacing:"0.07em"}}>{art.category}</span>
            <button onClick={onClose} style={{background:"#f3f4f6",border:"none",width:27,height:27,borderRadius:5,cursor:"pointer",fontSize:13,color:"#6b7280",flexShrink:0}}>✕</button>
          </div>
          <h2 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:19,color:"#111827",margin:"0 0 9px",lineHeight:1.35}}>{art.headline}</h2>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
            <BiasScore score={art.bias}/> <SentimentRing value={art.sentiment}/>
            <span style={{fontSize:11,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>{art.time}</span>
            {art.sources.map(s=>(<span key={s} style={{fontSize:10,fontFamily:"Inter,sans-serif",color:"#6b7280",background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:4,padding:"2px 6px"}}>{s}</span>))}
          </div>
          <div style={{display:"flex",gap:0,borderBottom:"1px solid #e5e7eb",overflowX:"auto"}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{fontFamily:"Inter,sans-serif",fontWeight:tab===t.id?600:400,fontSize:11,padding:"7px 10px",border:"none",background:"transparent",color:tab===t.id?"#111827":"#6b7280",cursor:"pointer",whiteSpace:"nowrap",borderBottom:tab===t.id?"2px solid #111827":"2px solid transparent"}}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={{padding:"16px 20px 22px"}}>
          {tab==="summary" && <p style={{fontFamily:"Inter,sans-serif",fontSize:14,color:"#374151",lineHeight:1.7,margin:0}}>{art.summary}</p>}
          {(tab==="progressive"||tab==="conservative"||tab==="neutral") && (
            <div style={{borderLeft:`3px solid ${vpColor[tab]}`,paddingLeft:13,minHeight:60}}>
              {loading?<div style={{display:"flex",alignItems:"center",gap:8}}><Spinner color={vpColor[tab]}/><span style={{fontSize:13,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>Generating {tab} analysis…</span></div>
              :<p style={{fontFamily:"Inter,sans-serif",fontSize:14,color:"#374151",lineHeight:1.7,margin:0,whiteSpace:"pre-wrap"}}>{ai}</p>}
            </div>
          )}
          {tab==="debate" && <LiveDebate art={art}/>}
          {tab==="dna" && <NewsDNA art={art}/>}
          {tab==="impact" && <StoryImpactCalc art={art}/>}
          {tab==="connections" && <StoryConnections art={art}/>}
          {tab==="poll" && <CommunityPoll art={art}/>}
          {tab==="ask" && (
            <div>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:13,color:"#6b7280",margin:"0 0 10px"}}>Ask anything in English, Hindi, or Hinglish.</p>
              <div style={{display:"flex",gap:7,marginBottom:7}}>
                <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAsk()} placeholder="e.g. India pe kya asar padega?" style={{flex:1,fontFamily:"Inter,sans-serif",fontSize:13,padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,color:"#111827",outline:"none"}}/>
                <button onClick={handleAsk} disabled={askLoad||!q.trim()} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:13,padding:"8px 14px",borderRadius:6,border:"none",background:askLoad?"#d1d5db":"#111827",color:"#fff",cursor:"pointer"}}>{askLoad?"…":"Ask"}</button>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                {["India pe kya asar?","Explain simply","Is this fake?","What next?","Market impact?"].map(sq=><button key={sq} onClick={()=>setQ(sq)} style={{fontSize:11,fontFamily:"Inter,sans-serif",padding:"3px 9px",border:"1px solid #e5e7eb",borderRadius:20,background:"#f9fafb",color:"#4b5563",cursor:"pointer"}}>{sq}</button>)}
              </div>
              {ans && <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:6,padding:"11px 13px"}}><p style={{fontFamily:"Inter,sans-serif",fontSize:13,color:"#374151",lineHeight:1.7,margin:0,whiteSpace:"pre-wrap"}}>{ans}</p></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── BRIEFING MODAL ────────────────────────────────────────────────────────────
function BriefingModal({open,onClose}) {
  const apiKey=useApiKey();
  const [text,setText]=useState(""); const [loading,setLoading]=useState(false);
  useEffect(()=>{ if(open&&!text) generate(); },[open]);
  async function generate() {
    setLoading(true); setText("");
    const hl=ARTICLES.map((a,i)=>`${i+1}. ${a.headline}`).join("\n");
    const t=await callClaude("You are NewsDarpan's morning briefing anchor. Write a crisp, objective daily briefing. Short paragraphs. No bullets. Under 280 words.",`Today's stories:\n${hl}\n\nWrite the briefing.`,apiKey);
    setText(t); setLoading(false);
  }
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:10,maxWidth:540,width:"100%",maxHeight:"85vh",overflowY:"auto",padding:"22px",position:"relative"}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:13,right:13,background:"#f3f4f6",border:"none",width:27,height:27,borderRadius:5,cursor:"pointer",fontSize:13}}>✕</button>
        <p style={{fontFamily:"Inter,sans-serif",fontSize:11,fontWeight:700,color:"#16a34a",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 3px"}}>📻 NewsDarpan · Daily Briefing</p>
        <h2 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:19,color:"#111827",margin:"0 0 14px"}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</h2>
        {loading ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:9,padding:"24px 0"}}><Spinner size={24}/><span style={{fontFamily:"Inter,sans-serif",fontSize:13,color:"#9ca3af"}}>Composing briefing…</span></div>
          : <><p style={{fontFamily:"Inter,sans-serif",fontSize:14,color:"#374151",lineHeight:1.75,margin:"0 0 14px",whiteSpace:"pre-wrap"}}>{text}</p><button onClick={generate} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"5px 12px",border:"1px solid #d1d5db",borderRadius:6,background:"#fff",cursor:"pointer",color:"#374151"}}>↺ Regenerate</button></>}
      </div>
    </div>
  );
}

// ── ARTICLE CARD ──────────────────────────────────────────────────────────────
function ArticleCard({art,onSelect}) {
  return (
    <div onClick={()=>onSelect(art)} style={{border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden",cursor:"pointer",background:"#fff",marginBottom:14,transition:"box-shadow 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.1)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{position:"relative"}}>
        <img src={art.img} alt="" style={{width:"100%",height:190,objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>
        <span style={{position:"absolute",top:9,left:9,background:"rgba(0,0,0,0.65)",color:"#fff",fontSize:10,fontFamily:"Inter,sans-serif",fontWeight:600,padding:"3px 9px",borderRadius:4}}>{art.category}</span>
        {art.breaking && <span style={{position:"absolute",top:9,right:9,background:"#dc2626",color:"#fff",fontSize:9,fontFamily:"Inter,sans-serif",fontWeight:700,padding:"3px 7px",borderRadius:4,letterSpacing:"0.05em"}}>BREAKING</span>}
        {art.marketTicker!=="N/A" && <span style={{position:"absolute",bottom:9,right:9,background:"rgba(0,0,0,0.75)",color:art.marketMove.startsWith("+")?"#4ade80":"#f87171",fontSize:10,fontFamily:"Inter,sans-serif",fontWeight:700,padding:"3px 8px",borderRadius:4}}>{art.marketTicker} {art.marketMove}</span>}
      </div>
      <div style={{padding:"13px 15px"}}>
        <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:16,color:"#111827",margin:"0 0 6px",lineHeight:1.4}}>{art.headline}</h3>
        <p style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#4b5563",margin:"0 0 10px",lineHeight:1.6}}>{art.summary}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
          <BiasScore score={art.bias}/> <SentimentRing value={art.sentiment}/>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{art.sources.map(s=>(<span key={s} style={{fontSize:10,fontFamily:"Inter,sans-serif",color:"#6b7280",background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:4,padding:"2px 6px"}}>{s}</span>))}</div>
          <span style={{fontSize:10,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>{art.time}</span>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function NewsDarpanApp() {
  const [activeCategory,setActiveCategory]=useState("All Stories");
  const [activeCountry,setActiveCountry]=useState("IN");
  const [activeChips,setActiveChips]=useState([]);
  const [search,setSearch]=useState("");
  const [selectedArt,setSelectedArt]=useState(null);
  const [briefingOpen,setBriefingOpen]=useState(false);
  const [filterAdverse,setFilterAdverse]=useState(false);
  const [page,setPage]=useState(1);
  const [readHistory,setReadHistory]=useState([]);
  const PER_PAGE=4;

  useEffect(()=>{
    const link=document.createElement("link"); link.rel="stylesheet"; link.href=FONT_URL; document.head.appendChild(link);
    const style=document.createElement("style");
    style.textContent=`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box} body{margin:0} ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#f9fafb} ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px} input:focus,textarea:focus{border-color:#374151!important;outline:none;}`;
    document.head.appendChild(style);
  },[]);

  function openArticle(art) {
    setSelectedArt(art);
    setReadHistory(prev=>prev.find(a=>a.id===art.id)?prev:[...prev,art]);
  }

  function toggleChip(c){ setActiveChips(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]); }

  const filtered=ARTICLES.filter(a=>{
    if(activeCategory!=="All Stories"){
      const allowed = CATEGORY_MAP[activeCategory] || [activeCategory];
      if(!allowed.includes(a.category)) return false;
    }
    if(search&&!a.headline.toLowerCase().includes(search.toLowerCase())&&!a.summary.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalPages=Math.ceil(filtered.length/PER_PAGE);
  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const polarizedStory=ARTICLES.find(a=>a.polarized)||ARTICLES[0];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#fff",fontFamily:"Inter,sans-serif"}}>

      {/* LEFT SIDEBAR */}
      <aside style={{width:208,flexShrink:0,borderRight:"1px solid #e5e7eb",overflowY:"auto",position:"sticky",top:0,height:"100vh",background:"#fff"}}>
        <div style={{padding:"14px 15px 10px",borderBottom:"1px solid #e5e7eb"}}>
          <div style={{fontFamily:"Playfair Display,serif",fontWeight:900,fontSize:18,color:"#111827",letterSpacing:"-0.01em",lineHeight:1}}>NewsDarpan</div>
          <div style={{fontSize:8,fontFamily:"Inter,sans-serif",fontWeight:600,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.12em",marginTop:2}}>AI NEWS INTELLIGENCE</div>
        </div>
        <div style={{padding:"7px 13px 3px"}}>
          <button onClick={()=>setActiveCategory("All Stories")} style={{display:"flex",alignItems:"center",gap:5,width:"100%",fontFamily:"Inter,sans-serif",fontWeight:activeCategory==="All Stories"?600:400,fontSize:12,color:activeCategory==="All Stories"?"#111827":"#374151",background:"transparent",border:"none",cursor:"pointer",padding:"5px 3px",textAlign:"left"}}>
            <span style={{fontSize:10,color:"#9ca3af"}}>›</span> All Stories
          </button>
        </div>
        {SIDEBAR_CATEGORIES.map(group=>(
          <div key={group.section} style={{padding:"3px 13px"}}>
            <p style={{fontSize:8,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.1em",margin:"7px 0 3px",fontFamily:"Inter,sans-serif"}}>{group.section}</p>
            {group.items.map(item=>(
              <button key={item.label} onClick={()=>setActiveCategory(item.label)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",fontFamily:"Inter,sans-serif",fontSize:11,color:activeCategory===item.label?"#111827":"#4b5563",fontWeight:activeCategory===item.label?600:400,background:activeCategory===item.label?"#f3f4f6":"transparent",border:"none",cursor:"pointer",padding:"4px 5px",borderRadius:4,textAlign:"left"}}>
                <span>{item.label}</span>
                <span style={{fontSize:9,color:"#9ca3af",fontWeight:600,background:"#f3f4f6",borderRadius:8,padding:"1px 5px"}}>{item.count}</span>
              </button>
            ))}
          </div>
        ))}
        <div style={{padding:"8px 15px",borderTop:"1px solid #e5e7eb",marginTop:8}}>
          <button onClick={()=>setFilterAdverse(f=>!f)} style={{display:"flex",alignItems:"center",gap:5,fontFamily:"Inter,sans-serif",fontSize:11,color:"#4b5563",background:"transparent",border:"none",cursor:"pointer",padding:"3px 0",width:"100%"}}>
            <span style={{width:12,height:12,borderRadius:"50%",border:"1.5px solid #9ca3af",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {filterAdverse&&<span style={{width:5,height:5,borderRadius:"50%",background:"#374151",display:"block"}}/>}
            </span>
            Filter Adverse News
            <span style={{marginLeft:"auto",fontSize:9,color:"#9ca3af",background:"#f3f4f6",borderRadius:8,padding:"1px 5px"}}>0</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
        {/* Top bar */}
        <div style={{borderBottom:"1px solid #e5e7eb",padding:"8px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",position:"sticky",top:0,zIndex:40}}>
          <span style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#374151",fontWeight:500}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</span>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:14,color:"#6b7280"}}>🌐</span>
            {COUNTRIES.map(c=>(<button key={c.code} onClick={()=>setActiveCountry(c.code)} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:10,padding:"3px 7px",borderRadius:4,cursor:"pointer",border:`1px solid ${activeCountry===c.code?"#374151":"#e5e7eb"}`,background:activeCountry===c.code?"#111827":"#fff",color:activeCountry===c.code?"#fff":"#374151",display:"flex",alignItems:"center",gap:3}}><span>{c.flag}</span>{c.label}</button>))}
          </div>
        </div>

        {/* Hero */}
        <div style={{textAlign:"center",padding:"24px 20px 16px",borderBottom:"1px solid #e5e7eb"}}>
          <h1 style={{fontFamily:"Playfair Display,serif",fontWeight:900,fontSize:46,color:"#111827",margin:"0 0 5px",letterSpacing:"-0.02em",lineHeight:1}}>NewsDarpan AI</h1>
          <p style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:10,color:"#9ca3af",letterSpacing:"0.18em",textTransform:"uppercase",margin:"0 0 16px"}}>STRUCTURED · OBJECTIVE · MULTI-PERSPECTIVE · FUTURE-INTELLIGENCE</p>
          <div style={{display:"flex",gap:6,maxWidth:600,margin:"0 auto 11px",alignItems:"center"}}>
            <div style={{flex:1,position:"relative"}}>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af",fontSize:12}}>🔍</span>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search articles — type to filter instantly..." style={{width:"100%",fontFamily:"Inter,sans-serif",fontSize:12,padding:"9px 12px 9px 32px",border:"1px solid #d1d5db",borderRadius:7,color:"#111827",background:"#fff"}}/>
            </div>
            <button style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"9px 16px",borderRadius:7,border:"none",background:"#111827",color:"#fff",cursor:"pointer"}}>Search</button>
            <button style={{fontFamily:"Inter,sans-serif",fontSize:15,padding:"8px 9px",borderRadius:7,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>↺</button>
            <button onClick={()=>setBriefingOpen(true)} style={{fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:12,padding:"9px 13px",borderRadius:7,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><span>📻</span>Briefing</button>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:4,maxWidth:680,margin:"0 auto"}}>
            {FILTER_CHIPS.map(c=>(<button key={c} onClick={()=>toggleChip(c)} style={{fontFamily:"Inter,sans-serif",fontSize:11,fontWeight:activeChips.includes(c)?600:400,padding:"4px 11px",borderRadius:20,cursor:"pointer",border:`1px solid ${activeChips.includes(c)?"#111827":"#d1d5db"}`,background:activeChips.includes(c)?"#111827":"#fff",color:activeChips.includes(c)?"#fff":"#374151"}}>{c}</button>))}
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,display:"flex"}}>
          {/* Articles */}
          <div style={{flex:1,minWidth:0,padding:"16px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
              <span style={{fontSize:12,display:"flex",alignItems:"center",gap:4,fontFamily:"Inter,sans-serif",fontWeight:600,color:"#16a34a"}}>⚡ Instant</span>
              <span style={{fontSize:11,color:"#9ca3af",fontFamily:"Inter,sans-serif"}}>Served from cache · fetching fresh stories in background</span>
              {readHistory.length>0 && <span style={{marginLeft:"auto",fontSize:10,fontFamily:"Inter,sans-serif",color:"#6b7280",background:"#f3f4f6",border:"1px solid #e5e7eb",borderRadius:10,padding:"2px 8px"}}>{readHistory.length} read today</span>}
            </div>

            {/* Most polarized */}
            <div style={{background:"#111827",borderRadius:8,padding:"12px 15px",display:"flex",alignItems:"center",gap:12,marginBottom:16,cursor:"pointer"}} onClick={()=>openArticle(polarizedStory)}>
              <div style={{width:34,height:34,borderRadius:7,background:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16}}>🔥</span></div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontFamily:"Inter,sans-serif",fontSize:9,fontWeight:700,color:"#ef4444",textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 3px"}}>🔴 MOST POLARIZED STORY TODAY</p>
                <p style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:13,color:"#fff",margin:0,lineHeight:1.3}}>{polarizedStory.headline}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontFamily:"Playfair Display,serif",fontWeight:900,fontSize:22,color:"#fff",lineHeight:1}}>{polarizedStory.bias}</div>
                <div style={{fontFamily:"Inter,sans-serif",fontSize:9,color:"#9ca3af"}}>/100</div>
              </div>
            </div>

            {/* Count + pagination */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontFamily:"Inter,sans-serif",fontSize:12,color:"#4b5563"}}>Showing <strong>{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)}</strong> of <strong>{filtered.length}</strong> stories</span>
              <div style={{display:"flex",gap:3}}>
                {[1,2,3].map(n=>(<button key={n} onClick={()=>setPage(n)} style={{width:26,height:26,borderRadius:5,fontFamily:"Inter,sans-serif",fontSize:11,fontWeight:600,border:"1px solid #d1d5db",background:page===n?"#111827":"#fff",color:page===n?"#fff":"#374151",cursor:"pointer"}}>{n}</button>))}
                <button onClick={()=>setPage(p=>Math.min(p+1,totalPages))} style={{width:26,height:26,borderRadius:5,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",fontSize:13}}>›</button>
              </div>
            </div>

            {paged.map(art=>(<ArticleCard key={art.id} art={art} onSelect={openArticle}/>))}
          </div>

          {/* RIGHT PANEL */}
          <aside style={{width:292,flexShrink:0,borderLeft:"1px solid #e5e7eb",padding:"16px 16px",overflowY:"auto",position:"sticky",top:48,height:"calc(100vh - 48px)",background:"#fff"}}>
            <PersonalisedNewsScore readHistory={readHistory}/>
            <GlobalFutureWidget/>
            <TopicTrendSparklines/>
            <WordCloud/>
            <NewsTimeMachine/>
            <FakeNewsDetector/>
            <ArticleAnalyzer/>
            {/* Opinion & Perspectives */}
            <div>
              <h3 style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:17,color:"#111827",margin:"0 0 3px"}}>Opinion & Perspectives</h3>
              <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#9ca3af",margin:"0 0 12px"}}>How different framings cover the same stories</p>
              {[
                {label:"PROGRESSIVE FRAMING",color:"#3b82f6",art:ARTICLES.find(a=>a.category==="Human Rights")||ARTICLES[0]},
                {label:"CONSERVATIVE FRAMING",color:"#ef4444",art:ARTICLES.find(a=>a.category==="Sanctions")||ARTICLES[1]},
                {label:"NEUTRAL ANALYSIS",color:"#6b7280",art:ARTICLES.find(a=>a.category==="Science")||ARTICLES[2]},
              ].map(({label,color,art})=>(
                <div key={label} style={{marginBottom:12,cursor:"pointer"}} onClick={()=>openArticle(art)}>
                  <p style={{fontFamily:"Inter,sans-serif",fontSize:9,fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.1em",margin:"0 0 3px"}}>{label}</p>
                  <p style={{fontFamily:"Playfair Display,serif",fontWeight:700,fontSize:12,color:"#111827",margin:"0 0 3px",lineHeight:1.3}}>{art.headline.slice(0,58)}…</p>
                  <p style={{fontFamily:"Inter,sans-serif",fontSize:11,color:"#6b7280",margin:0,lineHeight:1.4}}>{art.summary.slice(0,80)}…</p>
                  <div style={{height:1,background:"#e5e7eb",marginTop:9}}/>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {selectedArt && <ArticleModal art={selectedArt} onClose={()=>setSelectedArt(null)}/>}
      <BriefingModal open={briefingOpen} onClose={()=>setBriefingOpen(false)}/>
    </div>
  );
}

// ── ROOT EXPORT — wraps everything with ApiKeyContext ─────────────────────────
export default function NewsDarpan() {
  const [apiKey, setApiKey] = useState(() => {
    // Try to restore saved key from sessionStorage
    try { return sessionStorage.getItem("nd_api_key") || ""; } catch { return ""; }
  });

  function handleSetApiKey(key) {
    setApiKey(key);
    try { sessionStorage.setItem("nd_api_key", key); } catch {}
    window.__NEWSDARPAN_API_KEY__ = key;
  }

  return (
    <ApiKeyContext.Provider value={apiKey}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <ApiKeyBanner apiKey={apiKey} setApiKey={handleSetApiKey} />
        <NewsDarpanApp />
      </div>
    </ApiKeyContext.Provider>
  );
}
