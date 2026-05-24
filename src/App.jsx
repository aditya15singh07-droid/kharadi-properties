import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  IndianRupee,
  MapPin,
  Search,
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

const siteName = "Kharadi Properties";

const fallbackImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=82",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=82",
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1800&q=82",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=82",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1800&q=82",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=82",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=82",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=82",
];

function fallbackImageFor(society, offset = 0) {
  const seed = society?.id || society?.slug?.length || 0;
  return fallbackImages[(seed + offset) % fallbackImages.length];
}

function SafeImage({ src, society, fallbackOffset = 0, alt, loading = "lazy", ...props }) {
  const fallbackBase = fallbackImageFor(society, fallbackOffset);
  const [imageSrc, setImageSrc] = useState(src || fallbackBase);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setImageSrc(src || fallbackBase);
    setAttempt(0);
  }, [src, fallbackBase]);

  function handleError() {
    const nextAttempt = attempt + 1;
    if (nextAttempt > fallbackImages.length) return;
    setAttempt(nextAttempt);
    setImageSrc(fallbackImageFor(society, fallbackOffset + nextAttempt));
  }

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={handleError}
    />
  );
}

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
  return `${society.name} is a ${segment} society in ${zone}, Kharadi. This guide covers pricing, rent demand, amenities, location, buyer profile, and investment view for serious home seekers. Monthly rent estimate: ${rent}.`;
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
      ? `${selectedSociety.name} Kharadi | ${siteName}`
      : siteName;
  }, [selectedSociety]);

  if (selectedSociety) {
    return <SocietyGuide society={selectedSociety} />;
  }

  return <HomePage />;
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Kharadi Properties home">
        <span className="brand-mark"><Building2 size={22} /></span>
        <span>{siteName}</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#guides">Society Guides</a>
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
  const topMatches = filteredSocieties.slice(0, 5);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const bestMatch = filteredSocieties[0];
    if (bestMatch) {
      window.location.hash = `#/society/${bestMatch.slug}`;
      return;
    }
    document.querySelector("#guides")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">160 society guides for Kharadi and Upper Kharadi</p>
          <h1>{siteName}</h1>
          <p className="hero-text">
            Detailed Kharadi society blogs with price notes, rent ranges, amenities, location context, buyer fit, and investment view.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#guides">
              Explore society guides <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="#market">View market notes</a>
          </div>
        </div>
        <form className="search-panel" aria-label="Society guide search" onSubmit={handleSearchSubmit}>
          <div className="search-title">
            <Search size={20} />
            <span>Search Kharadi societies</span>
          </div>
          <label>
            Society, builder, zone, or landmark
            <span className="search-input-row">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="E.g. Marvel Cerise, EON, riverfront"
              />
              <button type="submit" aria-label="Open best matching society guide">
                <Search size={20} />
              </button>
            </span>
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
          <div className="search-results-preview" aria-label="Top matching society guides">
            {topMatches.map((society) => (
              <a href={`#/society/${society.slug}`} key={society.slug}>
                <span>{society.name}</span>
                <small>{society.zone || "Kharadi"} · {society.segment || "Society Guide"}</small>
              </a>
            ))}
          </div>
        </form>
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
            Each guide reads like a focused property blog: overview, pricing, apartment mix, location, lifestyle, investment angle, and buyer fit.
          </p>
        </div>
        <div className="spotlight-grid">
          {premiumSocieties.map((society) => (
            <a className="spotlight-card" href={`#/society/${society.slug}`} key={society.slug}>
              <SafeImage src={society.heroImage} society={society} alt={`${society.name} Kharadi society visual`} />
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
            Search any society from the database and open its full guide. The pages are ready for service CTAs, lead forms, and verified property inventory later.
          </p>
        </div>
        <div className="blog-list">
          {filteredSocieties.map((society) => (
            <article className="post-card society-guide-card" key={society.slug}>
              <a className="post-image" href={`#/society/${society.slug}`}>
                <SafeImage src={society.heroImage} society={society} alt={`${society.name} Kharadi`} />
              </a>
              <div className="post-card-body">
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

      <section className="engine-section" id="market">
        <div>
          <p className="eyebrow">Kharadi market</p>
          <h2>How to read these society blogs</h2>
        </div>
        <div className="engine-grid">
          <div><CheckCircle2 /> Compare the quoted price band with live resale and rent demand.</div>
          <div><MapPin /> Check daily commute to EON, WTC, Magarpatta, Viman Nagar, and the airport.</div>
          <div><TrendingUp /> Review rental yield, maintenance cost, and vacancy risk before investing.</div>
          <div><Building2 /> Shortlist societies by builder, possession status, amenities, and buyer profile.</div>
        </div>
      </section>

      <footer>
        <strong>{siteName}</strong>
        <span>Kharadi, Pune society blogs today. Property services tomorrow.</span>
      </footer>
    </main>
  );
}

function SocietyGuide({ society }) {
  const [heroBackground, setHeroBackground] = useState(society.heroImage || fallbackImageFor(society));

  useEffect(() => {
    setHeroBackground(society.heroImage || fallbackImageFor(society));
  }, [society]);

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

  const galleryImages = Array.from(
    new Set(
      (society.gallery.length > 0
        ? society.gallery
        : [society.heroImage, fallbackImageFor(society, 1), fallbackImageFor(society, 2)]
      ).filter(Boolean)
    )
  ).slice(0, 3);

  return (
    <main className="detail-main">
      <SiteHeader />

      <section className="detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(17, 23, 19, 0.88), rgba(23, 107, 90, 0.55)), url(${heroBackground})` }}>
        <img
          className="detail-hero-probe"
          src={heroBackground}
          alt=""
          aria-hidden="true"
          onError={() => setHeroBackground(fallbackImageFor(society))}
        />
        <div>
          <a className="back-link" href="#guides"><ArrowLeft size={17} /> Back to all society guides</a>
          <p className="eyebrow">{society.segment || "Kharadi society guide"}</p>
          <h1>{society.name} Kharadi: complete society guide</h1>
          <p className="hero-text">
            Price, rent, amenities, location, buyer profile, investment view, and contact details for {society.name}.
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
            <p className="eyebrow">Gallery</p>
            <h2>{society.name} visuals</h2>
            <div className={`gallery-grid count-${galleryImages.length}`}>
              {galleryImages.map((image, index) => (
                <SafeImage
                  src={image}
                  society={society}
                  fallbackOffset={index + 1}
                  alt={`${society.name} visual ${index + 1}`}
                  key={`${image}-${index}`}
                />
              ))}
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
        <strong>{siteName}</strong>
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
