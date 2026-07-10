import { useState } from 'react'
import Navbar from '../../components/layout/Navbar/Navbar.jsx'
import Footer from '../../components/layout/Footer/Footer.jsx'
import Button from '../../components/common/Button/Button.jsx'
import AccordionItem from '../../components/common/Accordion/Accordion.jsx'
import { FEATURES, STEPS, TESTIMONIALS, FAQS, STATS } from '../../data/landingContent.js'
import './Landing.css'

const FEATURE_ICONS = {
  globe: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 2.7 2.5 14.3 0 18M12 3c-2.5 2.7-2.5 14.3 0 18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20V10M12 20V4M20 20v-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  mobile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 8a3 3 0 100-6M14 14c2.8.4 5 2.8 5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  bell: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

function StarRating({ count = 5 }) {
  return (
    <div className="star-rating" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function Landing() {
  // Tracks which testimonial is active — mockup shows a next-arrow
  // control on desktop, implying a carousel rather than a static grid.
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  const showNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  return (
    <div className="landing">
      <Navbar />

      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="badge badge--outline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M8 12.5l2.5 2.5L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Trusted by 50,000+ users worldwide
            </span>

            <h1 className="hero__title">
              Share One Link.
              <br />
              <span className="hero__title-accent">Receive Airtime</span>
              <br />
              Anytime.
            </h1>

            <p className="hero__subtitle">
              Get mobile credit, airtime and data from friends, family, or fans. No more long
              USSD codes — just one simple link.
            </p>

            <div className="hero__actions">
              <Button
                variant="primary"
                size="lg"
                as="a"
                href="/signup"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                Get Started Now
              </Button>
              <Button variant="outline" size="lg" as="a" href="#how-it-works">
                View Demo
              </Button>
            </div>

            <div className="hero__social-proof">
              <div className="hero__avatars">
                <span className="hero__avatar" style={{ background: '#FBBF24' }} />
                <span className="hero__avatar" style={{ background: '#60A5FA' }} />
                <span className="hero__avatar" style={{ background: '#F472B6' }} />
              </div>
              <p>
                Join <strong>12k+</strong> people sharing links today
              </p>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero__visual-card">
              <div className="hero__visual-header">
                <span className="hero__visual-logo">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" fill="currentColor" />
                  </svg>
                  Recharge4Me
                </span>
                <span className="hero__visual-badge">Professional Dashboard</span>
              </div>
              <p className="hero__visual-label">Statistics</p>
              <div className="hero__visual-ring">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="30" stroke="var(--color-neutral-200)" strokeWidth="8" fill="none" />
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    stroke="var(--color-brand-primary)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="188.4"
                    strokeDashoffset="28"
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <span className="hero__visual-ring-label">85%</span>
              </div>
              <p className="hero__visual-caption">Recharge Trend (Last 7 Days)</p>
              <svg className="hero__visual-sparkline" width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                <polyline
                  points="0,30 30,25 60,32 90,15 120,20 150,8 180,12 200,5"
                  fill="none"
                  stroke="var(--color-brand-primary)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="hero__visual-float">
              <span className="hero__visual-float-icon">+</span>
              <div>
                <p className="hero__visual-float-label">RECEIVED</p>
                <p className="hero__visual-float-value">$50.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only stat pair from mobile mockup */}
        <div className="hero__mobile-stats container">
          {STATS.map((stat) => (
            <div key={stat.id} className="hero__mobile-stat">
              <p className="hero__mobile-stat-label">{stat.label.toUpperCase()}</p>
              <p className="hero__mobile-stat-value">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Key Features</span>
            <h2>Everything you need to get recharged</h2>
            <p className="section-subtitle">
              Powerful tools simplified for your daily mobile needs. Manage your links, track
              your income, and more.
            </p>
          </div>

          <div className="features__grid">
            {FEATURES.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-card__icon">{FEATURE_ICONS[feature.icon]}</div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="steps" id="how-it-works">
        <div className="container">
          <div className="steps__card">
            <div className="steps__intro">
              <h2>Three simple steps to start receiving</h2>
              <p>
                We've removed all the friction. No more manual USSD inputs or sharing private
                bank details.
              </p>
              <a href="#" className="steps__learn-more">
                Learn more about the process
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div className="steps__list">
              {STEPS.map((step) => (
                <div key={step.id} className="step">
                  <span className="step__number">{step.id}</span>
                  <h4 className="step__title">{step.title}</h4>
                  <p className="step__description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="testimonials__header">
            <div>
              <span className="eyebrow">Testimonials</span>
              <h2>Loved by creators worldwide</h2>
            </div>
            <button
              className="testimonials__next"
              onClick={showNextTestimonial}
              aria-label="Show next testimonial"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="testimonials__grid">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={t.id}
                className={`testimonial-card ${idx === testimonialIndex ? 'testimonial-card--active' : ''}`}
              >
                <StarRating count={t.rating} />
                <p className="testimonial-card__quote">"{t.quote}"</p>
                <div className="testimonial-card__author">
                  <span
                    className="testimonial-card__avatar"
                    style={{ background: `hsl(${t.name.length * 37}, 65%, 55%)` }}
                  />
                  <div>
                    <p className="testimonial-card__name">{t.name}</p>
                    <p className="testimonial-card__role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="faq" id="faq">
        <div className="container container--narrow">
          <div className="section-heading">
            <span className="eyebrow">Common Questions</span>
            <h2>Frequently Asked</h2>
          </div>

          <div className="faq__list">
            {FAQS.map((item) => (
              <AccordionItem key={item.id} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="final-cta">
        <div className="container final-cta__inner">
          <h2>Ready to simplify your recharges?</h2>
          <p>
            Join thousands of users who are already benefiting from the easiest way to receive
            airtime and data.
          </p>
          <div className="final-cta__actions">
            <Button variant="secondary" size="lg" as="a" href="/signup">
              Create Your Free Account
            </Button>
            <Button variant="outline" size="lg" as="a" href="/demo" className="final-cta__demo-btn">
              Schedule a Demo
            </Button>
          </div>
          <p className="final-cta__note">No credit card required · Cancel anytime · 100% Free to start</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Landing
