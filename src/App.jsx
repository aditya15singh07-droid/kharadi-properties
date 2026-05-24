import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Home,
  IndianRupee,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { societyProfiles, societyStats } from "./data/societyProfiles.js";

const segmentFilters = [
  "All",
  ...Object.entries(
    societyProfiles.reduce((acc, society) => {
      if (society.segment) acc[society.segment] = (acc[society.segment] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([segment]) => segment),
];

function displayValue(value, fallback = "On request") {
  if (!value || value === "-" || value === "—") return fallback;
  return value;
}

function priceSummary(society) {
  return (
    [society.oneBhk, society.twoBhk, society.threeBhk, society.fourBhk]
      .map((value) => displayValue(value, ""))
      .filter(Boolean)[0] || "Price on request"
  );
}

function guideExcerpt(society) {
  const zone = society.zone || "Kharadi";
  const segment = society.segment || "residential";
  const rent = displayValue(society.monthlyRent, "rent details on request");
  return `${society.name} is a ${segment} society in ${zone}, Kharadi. This guide covers price, rent, amenities, location, buyer profile, investment view, and photo research for serious home seekers. Monthly rent estimate: ${rent}.`;
}

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || "#top");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#top");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
}

function App() {
  const route = useHashRoute();
  const selectedSlug = route.startsWith("#/society/")
    ? decodeURIComponent(route.replace("#/society/", ""))
    : "";
  const selectedSociety = societyProfiles.find((society) => society.slug === selectedSlug);

  useEffect(() => {
    document.title = selectedSociety
      ? `${selectedSociety.name} Kharadi | kharadi properties`
      : "kharadi properties";
  }, [selectedSociety]);

  if (selectedSociety) {
    return <SocietyGuide society={selectedSociety} />;
  }

  return <HomePage />;
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="kharadi properties home">
        <span className="brand-mark"><Building2 size={22} /></span>
        <span>kharadi properties</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#guides">Society Guides</a>
        <a href="#photo-research">Photos</a>
        <a href="#market">Market</a>
        <a className="nav-cta" href="#guides">Explore</a>
      </nav>
    </header>
  );
}

function HomePage() {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("All");

  const filteredSocieties = useMemo(() => {
    return societyProfiles.filter((society) => {
      const matchesSegment = segment === "All" || society.segment === segment;
      const haystack = [
        society.name,
        society.segment,
        society.zone,
        society.status,
        society.builder,
        society.address,
        society.remarks,
      ]
        .join(" ")
        .toLowerCase();
      return matchesSegment && haystack.includes(query.toLowerCase());
    });
  }, [query, segment]);

  const premiumSocieties = societyProfiles.slice(0, 6);

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">160 society guides for Kharadi and Upper Kharadi</p>
          <h1>kharadi properties</h1>
          <p className="hero-text">
            A private, no-index property intelligence site with detailed society blogs, price notes, rent ranges, amenities, location context, and photo research links.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#guides">
              Explore society guides <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="#photo-research">Open photo research</a>
          </div>
        </div>
        <div className="search-panel" aria-label="Society guide search">
          <div className="search-title">
            <Search size={20} />
            <span>Search Kharadi societies</span>
          </div>
          <label>
            Society, builder, zone, or landmark
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="E.g. Marvel Cerise, EON, riverfront"
            />
          </label>
          <div className="quick-filters" aria-label="Society segment filters">
            {segmentFilters.map((item) => (
              <button
                key={item}
                className={segment === item ? "active" : ""}
                onClick={() => setSegment(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-band" aria-label="Site highlights">
        {societyStats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="spotlight-section">
        <div className="section-heading compact">
          <p className="eyebrow">Start here</p>
          <h2>Premium society spotlights</h2>
          <p>
            Each guide reads like a focused property blog: overview, pricing, apartment mix, location, lifestyle, investment angle, buyer fit, and photo search.
          </p>
        </div>
        <div className="spotlight-grid">
          {premiumSocieties.map((society) => (
            <a className="spotlight-card" href={`#/society/${society.slug}`} key={society.slug}>
              <img src={society.heroImage} alt={`${society.name} Kharadi society visual`} />
              <span>{society.segment || "Society Guide"}</span>
              <h3>{society.name}</h3>
              <p>{society.zone || "Kharadi, Pune"}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section-grid" id="guides">
        <div className="section-heading">
          <p className="eyebrow">Society blog library</p>
          <h2>{filteredSocieties.length} detailed guides</h2>
          <p>
            Search any society from the spreadsheet and open its full guide. The pages are ready for richer photos, service CTAs, lead forms, and Supabase publishing.
          </p>
        </div>
        <div className="blog-list">
          {filteredSocieties.map((society) => (
            <article className="post-card society-guide-card" key={society.slug}>
              <div className="post-meta">
                <span>{society.segment || "Society Guide"}</span>
                <span><Star size={14} /> {displayValue(society.rating, "Rating soon")}</span>
              </div>
              <h3>{society.name} Kharadi: complete society guide</h3>
              <p>{guideExcerpt(society)}</p>
              <div className="guide-facts">
                <span><MapPin size={15} /> {society.zone || "Kharadi"}</span>
                <span><IndianRupee size={15} /> {priceSummary(society)}</span>
                <span><Home size={15} /> {displayValue(society.status, "Status soon")}</span>
              </div>
              <div className="post-footer">
                <span>{displayValue(society.builder, "Builder details soon")}</span>
                <a href={`#/society/${society.slug}`}>Read full guide</a>
              </div>
            </article>
          ))}
          {filteredSocieties.length === 0 && (
            <div className="empty-state">
              <Search size={22} />
              <strong>No society found</strong>
              <span>Try another society, builder, or Kharadi zone.</span>
            </div>
          )}
        </div>
      </section>

      <section className="photo-research-section" id="photo-research">
        <div>
          <p className="eyebrow">Google Images workflow</p>
          <h2>HD photo research for every society</h2>
          <p>
            Every society page includes a direct HD Google Images search for society exteriors, flats, amenities, and local visuals. Verified photos can be added into the gallery as you approve them.
          </p>
        </div>
        <div className="engine-grid">
          <div><Sparkles /> Search society name plus Kharadi, flats, amenities, and HD photos.</div>
          <div><ShieldCheck /> Keep the site no-index while the content and photos are being prepared.</div>
          <div><CheckCircle2 /> Replace visual placeholders with approved society photos later.</div>
          <div><TrendingUp /> Use the same guide pages for future property selling services.</div>
        </div>
      </section>

      <section className="engine-section" id="market">
        <div>
          <p className="eyebrow">Private build mode</p>
          <h2>No-index society intelligence site</h2>
        </div>
        <div className="engine-grid">
          <div><CheckCircle2 /> HTML robots meta tag blocks indexing.</div>
          <div><ShieldCheck /> Vercel sends an X-Robots-Tag noindex header.</div>
          <div><TrendingUp /> 160 generated society guides are ready for refinement.</div>
          <div><Building2 /> The structure can become a listings and services portal next.</div>
        </div>
      </section>

      <footer>
        <strong>kharadi properties</strong>
        <span>Kharadi, Pune society blogs today. Property services tomorrow.</span>
      </footer>
    </main>
  );
}

function SocietyGuide({ society }) {
  const relatedCandidates = [
    ...societyProfiles.filter((item) => item.slug !== society.slug && item.zone === society.zone),
    ...societyProfiles.filter((item) => item.slug !== society.slug && item.segment === society.segment),
    ...societyProfiles.filter((item) => item.slug !== society.slug),
  ];
  const related = Array.from(new Map(relatedCandidates.map((item) => [item.slug, item])).values()).slice(0, 3);

  const priceCards = [
    ["1 BHK", society.oneBhk],
    ["2 BHK", society.twoBhk],
    ["3 BHK", society.threeBhk],
    ["4 BHK / Villa", society.fourBhk],
  ];

  return (
    <main className="detail-main">
      <SiteHeader />

      <section className="detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(17, 23, 19, 0.88), rgba(23, 107, 90, 0.55)), url(${society.heroImage})` }}>
        <div>
          <a className="back-link" href="#guides"><ArrowLeft size={17} /> Back to all society guides</a>
          <p className="eyebrow">{society.segment || "Kharadi society guide"}</p>
          <h1>{society.name} Kharadi: complete society guide</h1>
          <p className="hero-text">
            Price, rent, amenities, location, buyer profile, investment view, contact details, and HD photo research for {society.name}.
          </p>
          <div className="detail-tags">
            <span><MapPin size={16} /> {society.zone || "Kharadi"}</span>
            <span><Star size={16} /> {displayValue(society.rating, "Rating soon")}</span>
            <span><Home size={16} /> {displayValue(society.status, "Status soon")}</span>
          </div>
        </div>
      </section>

      <section className="article-shell">
        <aside className="fact-panel">
          <h2>Quick facts</h2>
          <Fact label="Builder" value={society.builder} />
          <Fact label="Possession" value={society.possession} />
          <Fact label="Carpet area" value={society.carpetArea} />
          <Fact label="Price per sq.ft" value={society.pricePerSqft} />
          <Fact label="Rent estimate" value={society.monthlyRent} />
          <Fact label="Rental yield" value={society.rentalYield} />
          <Fact label="Investment" value={society.investmentPotential} />
          <a className="primary-button panel-button" href={society.imageSearchUrl} target="_blank" rel="noreferrer">
            HD photo search <ExternalLink size={17} />
          </a>
        </aside>

        <article className="society-article">
          <section>
            <p className="eyebrow">Overview</p>
            <h2>Why {society.name} deserves attention</h2>
            <p>
              If you are comparing homes in {society.zone || "Kharadi"}, {society.name} is one of the societies worth shortlisting carefully. It sits in the {society.segment || "residential"} category and gives buyers and tenants a clear mix of location convenience, apartment options, amenities, and future value potential.
            </p>
            <p>
              The biggest reason people look at {society.name} is the Kharadi advantage itself. The area is close to major IT and business hubs, has strong rental movement, and continues to attract professionals who want daily convenience without moving away from Pune East's growth corridor.
            </p>
            {society.remarks && <p>{society.remarks}</p>}
          </section>

          <section>
            <p className="eyebrow">Price and configuration</p>
            <h2>Apartment pricing and rent view</h2>
            <div className="price-grid">
              {priceCards.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{displayValue(value)}</strong>
                </div>
              ))}
            </div>
            <p>
              Current pricing information in the database shows {priceSummary(society)} as the first available price band, with carpet area around {displayValue(society.carpetArea, "area details on request")}. Rental demand is supported by the local IT corridor, with a monthly rent estimate of {displayValue(society.monthlyRent, "rent on request")} and indicated rental yield of {displayValue(society.rentalYield, "yield on request")}.
            </p>
          </section>

          <section>
            <p className="eyebrow">Location</p>
            <h2>Address and Kharadi connectivity</h2>
            <p>
              {society.name} is listed around {society.address || `${society.zone || "Kharadi"}, Pune`}. This location works well for people who need access to EON IT Park, World Trade Center, Magarpatta, Viman Nagar, Pune Airport, and the wider Pune East office belt.
            </p>
            <p>
              For end users, the practical question is not only distance on a map. It is the daily rhythm: office commute, food options, school access, medical support, parking, cab availability, and how quickly you can move between Kharadi's inner roads and the bypass.
            </p>
          </section>

          <section>
            <p className="eyebrow">Lifestyle</p>
            <h2>Amenities and daily living</h2>
            <div className="amenity-cloud">
              {(society.amenities.length ? society.amenities : ["Clubhouse", "Security", "Parking", "Gym", "Landscape area"]).map((amenity) => (
                <span key={amenity}>{amenity}</span>
              ))}
            </div>
            <p>
              Amenities matter because Kharadi buyers are usually choosing between many similar-looking societies. The stronger societies make everyday life easier: cleaner common areas, better security, usable clubhouse spaces, reliable parking, and facilities that families actually use after possession.
            </p>
          </section>

          <section>
            <p className="eyebrow">Photo board</p>
            <h2>Society and flat visuals</h2>
            <div className="gallery-grid">
              {society.gallery.map((image, index) => (
                <img src={image} alt={`${society.name} visual ${index + 1}`} key={image} />
              ))}
            </div>
            <div className="photo-actions">
              <a href={society.imageSearchUrl} target="_blank" rel="noreferrer">
                Search {society.name} HD society photos <ExternalLink size={16} />
              </a>
              <a href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${society.name} Kharadi flat interiors`)}`} target="_blank" rel="noreferrer">
                Search flat interiors <ExternalLink size={16} />
              </a>
            </div>
          </section>

          <section>
            <p className="eyebrow">Buyer fit</p>
            <h2>Who should shortlist {society.name}?</h2>
            <p>
              The strongest buyer profile for this society is {displayValue(society.buyerProfile, "end users, investors, and Kharadi-focused tenants")}. If your priority is office proximity, rental demand, and a society with Kharadi address value, this guide should be part of your shortlist.
            </p>
            <p>
              Investors should compare the entry price, rent estimate, maintenance expectations, vacancy risk, and resale demand against nearby projects in the same segment. End users should visit during peak traffic hours and inspect parking, lift waiting time, water supply, and society rules before finalizing.
            </p>
          </section>

          <section>
            <p className="eyebrow">FAQ</p>
            <h2>Common questions</h2>
            <div className="faq-grid">
              <Faq question={`Is ${society.name} good for rental investment?`} answer={`The database indicates rent around ${displayValue(society.monthlyRent, "rent on request")} and yield around ${displayValue(society.rentalYield, "yield on request")}. Actual returns depend on furnishing, floor, view, maintenance, and current demand.`} />
              <Faq question={`What is the main location advantage?`} answer={`${society.name} is positioned around ${society.zone || "Kharadi"}, which is useful for EON IT Park, WTC, Pune East offices, airport access, and Kharadi's social infrastructure.`} />
              <Faq question="What should I verify before buying?" answer="Check title documents, RERA status where applicable, society dues, parking allotment, maintenance cost, builder handover quality, resale history, and live rent demand." />
              <Faq question="Can this page become a selling page later?" answer="Yes. The guide structure already supports photos, inquiry forms, owner listings, broker details, site visit CTAs, and verified property inventory." />
            </div>
          </section>

          <section>
            <p className="eyebrow">Contact intelligence</p>
            <h2>Broker and contact details</h2>
            <div className="contact-strip">
              <span>{displayValue(society.broker, "Contact to be updated")}</span>
              <strong>{displayValue(society.brokerPhone, "Phone to be updated")}</strong>
            </div>
          </section>

          <section>
            <p className="eyebrow">Compare next</p>
            <h2>Related society guides</h2>
            <div className="related-grid">
              {related.map((item) => (
                <a href={`#/society/${item.slug}`} key={item.slug}>
                  <span>{item.segment || "Society Guide"}</span>
                  <strong>{item.name}</strong>
                  <small>{item.zone || "Kharadi"}</small>
                </a>
              ))}
            </div>
          </section>
        </article>
      </section>

      <footer>
        <strong>kharadi properties</strong>
        <span>{society.name} society guide</span>
      </footer>
    </main>
  );
}

function Fact({ label, value }) {
  return (
    <div className="fact-row">
      <span>{label}</span>
      <strong>{displayValue(value)}</strong>
    </div>
  );
}

function Faq({ question, answer }) {
  return (
    <div className="faq-card">
      <strong>{question}</strong>
      <p>{answer}</p>
    </div>
  );
}

export default App;
