import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Filter,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { featuredLocalities, posts, societies, stats } from "./data/properties.js";
import { fetchPublishedPosts } from "./lib/supabase.js";

const categories = ["All", "Society Guide", "Rent", "Buying", "Local Area"];

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [publishedPosts, setPublishedPosts] = useState(posts);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      setIsLoadingPosts(true);

      try {
        const supabasePosts = await fetchPublishedPosts();
        if (isMounted && supabasePosts.length > 0) {
          setPublishedPosts(
            supabasePosts.map((post) => ({
              id: post.slug || post.id,
              category: post.category,
              date: post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })
                : "Draft",
              title: post.title,
              society: post.society || "Kharadi",
              location: post.location,
              excerpt: post.excerpt,
            }))
          );
        }
      } catch (error) {
        console.warn("Using sample posts because Supabase posts could not load.", error);
      } finally {
        if (isMounted) {
          setIsLoadingPosts(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const haystack = `${post.title} ${post.excerpt} ${post.society} ${post.location}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [category, publishedPosts, query]);

  const selectCategory = (item) => {
    setCategory(item);
    setQuery("");
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KHARADI PROPERTIES home">
          <span className="brand-mark"><Building2 size={22} /></span>
          <span>KHARADI PROPERTIES</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#blogs">Blogs</a>
          <a href="#societies">Societies</a>
          <a href="#localities">Localities</a>
          <a className="nav-cta" href="#submit">Post Details</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Pune real estate blog, starting with Kharadi</p>
          <h1>KHARADI PROPERTIES</h1>
          <p className="hero-text">
            Society-wise notes, rent ranges, buying guides, locality updates, and verified property information for people searching in Kharadi.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#blogs">
              Explore blogs <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="#submit">Share a society update</a>
          </div>
        </div>
        <div className="search-panel" aria-label="Property blog search">
          <div className="search-title">
            <Search size={20} />
            <span>Find property information</span>
          </div>
          <label>
            Search society, topic, or area
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="E.g. EON Free Zone, rent, World Trade Center"
            />
          </label>
          <div className="quick-filters" aria-label="Blog category filters">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => selectCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-band" aria-label="Site highlights">
        {stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section-grid" id="blogs">
        <div className="section-heading">
          <p className="eyebrow">Property blog engine</p>
          <h2>Latest Kharadi property notes</h2>
          <p>
            Start with curated blog-style information now. Later, the same structure can power listings, owner leads, service pages, and paid property promotion.
          </p>
          {isLoadingPosts && <span className="sync-note">Checking Supabase posts...</span>}
        </div>
        <div className="blog-list">
          {filteredPosts.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-meta">
                <span>{post.category}</span>
                <span><CalendarDays size={14} /> {post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="post-footer">
                <span><MapPin size={15} /> {post.location}</span>
                <a href={`#post-${post.id}`}>Read guide</a>
              </div>
            </article>
          ))}
          {filteredPosts.length === 0 && (
            <div className="empty-state">
              <Search size={22} />
              <strong>No matching notes yet</strong>
              <span>Try another society, area, or category.</span>
            </div>
          )}
        </div>
      </section>

      <section className="society-section" id="societies">
        <div className="section-heading compact">
          <p className="eyebrow">Society directory</p>
          <h2>Society pages coming first</h2>
        </div>
        <div className="society-table" role="table" aria-label="Kharadi society overview">
          <div className="table-row table-head" role="row">
            <span>Society</span>
            <span>Area</span>
            <span>Focus</span>
            <span>Status</span>
          </div>
          {societies.map((society) => (
            <div className="table-row" role="row" key={society.name}>
              <span>{society.name}</span>
              <span>{society.area}</span>
              <span>{society.focus}</span>
              <span className="status">{society.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="locality-section" id="localities">
        <div className="section-heading compact">
          <p className="eyebrow">Area intelligence</p>
          <h2>Micro-localities to cover</h2>
        </div>
        <div className="locality-grid">
          {featuredLocalities.map((locality) => (
            <article key={locality.name} className="locality-card">
              <span className="locality-icon">{locality.icon}</span>
              <h3>{locality.name}</h3>
              <p>{locality.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="engine-section">
        <div>
          <p className="eyebrow">Ready for Supabase + Vercel</p>
          <h2>Built like a property content engine</h2>
        </div>
        <div className="engine-grid">
          <div><CheckCircle2 /> Blog posts can move from sample data to Supabase rows.</div>
          <div><ShieldCheck /> Admin posting can be added with Supabase Auth.</div>
          <div><Filter /> Categories support society guides, rent, buying, and area news.</div>
          <div><TrendingUp /> Service and listing pages can be added without rebuilding the layout.</div>
        </div>
      </section>

      <section className="submit-section" id="submit">
        <div>
          <p className="eyebrow">Next step</p>
          <h2>Post society details later</h2>
          <p>
            This form is a front-end placeholder. Once Supabase is connected, it can save society updates, rent details, owner listings, and broker/service requests.
          </p>
        </div>
        <form>
          <label>
            Society name
            <input placeholder="Enter society name" />
          </label>
          <label>
            Update type
            <select defaultValue="Society Guide">
              <option>Society Guide</option>
              <option>Rent Update</option>
              <option>Buying Note</option>
              <option>Local Area Update</option>
            </select>
          </label>
          <label>
            Details
            <textarea placeholder="Write parking, amenities, rent, location, nearby IT parks..." />
          </label>
          <button type="button">Save draft soon</button>
        </form>
      </section>

      <footer>
        <strong>KHARADI PROPERTIES</strong>
        <span>Kharadi, Pune property blog today. Property services tomorrow.</span>
      </footer>
    </main>
  );
}

export default App;
