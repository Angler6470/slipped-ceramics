import { useState, type FormEvent } from 'react'
import {
  Coffee,
  ExternalLink,
  Heart,
  Palette,
} from 'lucide-react'

const shopUrl = 'https://www.etsy.com/shop/SlippedCeramics'

const products = [
  {
    name: 'Colorful Speckled Stoneware Mug',
    price: '$52.00',
    image: '/products/blue-speckled-mug.webp',
    alt: 'Handmade blue-speckled stoneware mug held outdoors',
  },
  {
    name: 'Speckled Ceramic Catch-All',
    price: '$33.50',
    image: '/products/scalloped-catchall.webp',
    alt: 'Handmade speckled ceramic dish with a softly scalloped edge',
  },
  {
    name: 'Speckled Ceramic Bowl',
    price: '$42.50',
    image: '/products/green-rim-bowl.webp',
    alt: 'Handmade speckled ceramic bowl with a mint-green rim',
  },
  {
    name: 'Carved Blueberry Tumbler',
    price: '$48.00',
    image: '/products/blueberry-tumbler.webp',
    alt: 'Wheel-thrown cream tumbler with carved lines and blueberry details',
  },
  {
    name: 'Speckled Ombre Vase',
    price: 'See listing',
    image: '/products/speckled-vase.webp',
    alt: 'Round handmade vase with a soft pink and cream speckled glaze',
  },
  {
    name: 'Blue Glazed Ceramic Cup Set',
    price: 'See listing',
    image: '/products/blue-cup-set.webp',
    alt: 'Three handmade cups with blue glaze arranged together',
  },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@400;500;600&display=swap');

  html { scroll-behavior: smooth; }
  :root {
    color-scheme: light;
    color: #293e48;
    background: #fffdf9;
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
  }
  body { margin: 0; min-width: 320px; }
  #root {
    width: 100%;
    max-width: none;
    min-height: 100vh;
    margin: 0;
    border: 0;
    display: block;
    text-align: left;
  }
  * { box-sizing: border-box; }
  .storefront { overflow-x: clip; color: #293e48; background: #fffdf9; }
  .storefront a { color: inherit; text-decoration: none; }
  .storefront button, .storefront a { -webkit-tap-highlight-color: transparent; }
  .storefront img { display: block; width: 100%; object-fit: cover; }
  .serif, .storefront h1, .storefront h2, .storefront h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 400;
    color: #263b45;
  }
  .storefront h1, .storefront h2, .storefront h3, .storefront p { margin-top: 0; }
  .shell { width: min(1180px, calc(100% - 56px)); margin: 0 auto; }
  .site-header { position: sticky; z-index: 10; top: 0; height: 84px; display: flex; align-items: center; border-bottom: 1px solid #e5e8e2; background: #fffdf9; }
  .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 28px; }
  .wordmark { display: inline-flex; align-items: center; gap: 10px; color: #293e48; font-family: 'Playfair Display', Georgia, serif; font-size: 23px; letter-spacing: -.6px; white-space: nowrap; }
  .wordmark-icon { color: #c45e69; }
  .nav-links { display: flex; align-items: center; gap: 34px; color: #40565e; font-size: 13px; }
  .nav-links a, .footer-links a { transition: color .2s ease; }
  .nav-links a:hover, .footer-links a:hover { color: #a83f59; }
  .button { min-height: 48px; padding: 0 22px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; border: 1px solid #27645e; border-radius: 3px; background: #27645e; color: #fff !important; font: 600 12px 'DM Sans', sans-serif; letter-spacing: .04em; transition: background .2s, transform .2s, border-color .2s; }
  .button:hover { background: #1d514c; border-color: #1d514c; transform: translateY(-1px); }
  .button svg { width: 15px; height: 15px; }
  .button-light { background: transparent; color: #42535a !important; }
  .button-light:hover { background: #42535a; color: #fff !important; }
  .hero { position: relative; isolation: isolate; min-height: 570px; display: flex; align-items: center; padding: 74px 0 80px; background: linear-gradient(115deg, #fff0e9 2%, #f8f0e4 50%, #e5f4ef 100%); }
  .hero::before, .hero::after { content: ''; position: absolute; z-index: -1; border-radius: 50%; filter: blur(1px); }
  .hero::before { width: 370px; height: 370px; right: -100px; top: -145px; background: rgba(235, 173, 177, .38); }
  .hero::after { width: 280px; height: 280px; left: 34%; bottom: -195px; background: rgba(151, 206, 182, .42); }
  .hero-grid { display: grid; grid-template-columns: 1fr .9fr; align-items: center; gap: 76px; }
  .eyebrow { margin: 0 0 18px; color: #a43c56; font-size: 10px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; }
  .hero h1 { max-width: 570px; margin: 0 0 19px; font-size: clamp(44px, 5.2vw, 68px); line-height: 1.08; letter-spacing: -.045em; }
  .hero-copy { max-width: 440px; margin-bottom: 30px; color: #435860; font-size: 15px; line-height: 1.8; }
  .hero-note { margin: 20px 0 0; color: #536a67; font-size: 11px; letter-spacing: .04em; }
  .hero-art { position: relative; width: min(100%, 440px); height: 390px; justify-self: end; }
  .hero-photo { position: absolute; inset: 0 24px 0 38px; overflow: hidden; border-radius: 48% 48% 4px 4px; background: #b8d9d1; }
  .hero-photo img { height: 100%; }
  .hero-caption { position: absolute; right: 0; bottom: 22px; display: flex; align-items: center; gap: 10px; padding: 13px 16px; background: #fffdf9; color: #344b53; font-size: 11px; box-shadow: 0 10px 35px rgba(67, 60, 54, .12); }
  .hero-caption svg { width: 16px; color: #b5435d; }
  .hero-stamp { position: absolute; left: 0; top: 24px; width: 86px; height: 86px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.95); border-radius: 50%; background: #f8d7cb; color: #75434d; text-align: center; font-family: 'Playfair Display', Georgia, serif; font-size: 13px; line-height: 1.35; transform: rotate(-10deg); }
  .section { padding: 100px 0; }
  #home, #collection, #artist, #contact { scroll-margin-top: 108px; }
  .section#collection { padding: 72px 0; }
  .section#collection .section-heading { margin-bottom: 30px; }
  .section-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 39px; }
  .section-heading h2 { margin: 0; font-size: clamp(34px, 4vw, 47px); letter-spacing: -.035em; }
  .section-heading p { max-width: 310px; margin: 0 0 5px; color: #50636a; font-size: 13px; line-height: 1.7; }
  .product-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 30px 24px; }
  .product-image { display: block; aspect-ratio: 1; overflow: hidden; background: #eee8e2; border-radius: 5px; }
  .product-image img { height: 100%; transition: transform .5s cubic-bezier(.2,.7,.2,1); }
  .product-card:hover .product-image img { transform: scale(1.035); }
  .product-details { display: flex; align-items: start; justify-content: space-between; gap: 12px; padding: 15px 0 9px; }
  .product-details h3 { margin: 0 0 5px; font-size: 19px; line-height: 1.3; }
  .product-details p { margin: 0; color: #56696f; font-size: 12px; }
  .price { padding-top: 3px; color: #293e48; font-size: 13px; font-weight: 600; white-space: nowrap; }
  .buy-link { display: inline-flex; align-items: center; gap: 7px; color: #28635d !important; font-size: 11px; font-weight: 600; letter-spacing: .02em; }
  .buy-link svg { width: 13px; height: 13px; }
  .buy-link:hover { color: #a43c56 !important; }
  .artist-section { padding: 82px 0; background: #f7eddc; }
  .artist-grid { display: grid; grid-template-columns: .92fr 1fr; align-items: center; gap: 90px; }
  .artist-photo-wrap { position: relative; max-width: 440px; }
  .artist-photo { aspect-ratio: 4 / 4.35; overflow: hidden; background: #bde4dc; }
  .artist-photo svg { display: block; width: 100%; height: 100%; }
  .artist-note { position: absolute; right: -26px; bottom: 24px; padding: 13px 18px; background: #fffdf9; color: #75434d; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-style: italic; box-shadow: 0 8px 24px rgba(65, 56, 49, .12); }
  .artist-copy .eyebrow { margin-bottom: 13px; }
  .artist-copy h2 { margin: 0 0 22px; font-size: clamp(37px, 4vw, 51px); line-height: 1.15; letter-spacing: -.035em; }
  .artist-copy p { max-width: 490px; margin: 0 0 17px; color: #3f555d; font-size: 14px; line-height: 1.9; }
  .artist-copy .signature { display: flex; align-items: center; gap: 9px; margin-top: 28px; color: #8e3f55; font-family: 'Playfair Display', Georgia, serif; font-size: 19px; font-style: italic; }
  .artist-copy .signature svg { width: 17px; color: #bd4f65; }
  .contact-section { padding: 76px 0; background: #e8f3ed; }
  .contact-grid { display: grid; grid-template-columns: .8fr 1fr; gap: 70px; align-items: start; }
  .contact-copy h2 { margin: 0 0 14px; font-size: clamp(34px, 4vw, 46px); }
  .contact-copy > p:last-child { max-width: 380px; color: #40575c; font-size: 14px; line-height: 1.8; }
  .contact-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-field { display: grid; gap: 7px; }
  .form-field-wide { grid-column: 1 / -1; }
  .form-field label { color: #344b52; font-size: 12px; font-weight: 600; }
  .form-field input, .form-field textarea { width: 100%; border: 1px solid #aebfba; border-radius: 3px; padding: 12px 13px; background: #fffdf9; color: #293e48; font: 14px 'DM Sans', sans-serif; }
  .form-field input:focus, .form-field textarea:focus { outline: 2px solid #4b8477; outline-offset: 1px; }
  .form-field textarea { min-height: 132px; resize: vertical; }
  .contact-form .button { justify-self: start; cursor: pointer; }
  .form-status { grid-column: 1 / -1; margin: 0; color: #7d3446; font-size: 13px; line-height: 1.6; }
  .site-footer { padding: 27px 0; background: #fffdf9; }
  .footer-inner { display: flex; justify-content: space-between; align-items: center; gap: 20px; color: #4d6268; font-size: 11px; }
  .footer-links { display: flex; align-items: center; gap: 22px; }
  .footer-shop { display: inline-flex; align-items: center; gap: 6px; color: #50676b !important; font-weight: 400; }
  .footer-shop svg { width: 13px; }
  @media (max-width: 820px) {
    .shell { width: min(100% - 40px, 620px); }
    .site-header { height: 72px; }
    .header-inner { gap: 16px; }
    .nav-links { gap: 17px; font-size: 12px; }
    .hero { min-height: auto; padding: 66px 0 62px; }
    .hero-grid { grid-template-columns: 1fr .82fr; gap: 26px; }
    .hero-art { height: 330px; }
    .hero h1 { font-size: clamp(39px, 6vw, 54px); }
    .section { padding: 76px 0; }
    .product-grid { gap: 32px 18px; }
    .artist-grid { gap: 46px; }
  }
  @media (max-width: 600px) {
    .shell { width: calc(100% - 36px); }
    .site-header { height: auto; min-height: 70px; padding: 14px 0; }
    .header-inner { align-items: center; flex-direction: row; flex-wrap: wrap; gap: 13px; }
    .wordmark { font-size: 21px; }
    .nav-links { order: 3; flex-basis: 100%; justify-content: space-between; gap: 10px; font-size: 11px; }
    .hero { padding: 53px 0 46px; }
    .hero-grid { grid-template-columns: 1fr; gap: 35px; }
    .hero h1 { max-width: 450px; font-size: clamp(43px, 12vw, 58px); }
    .hero-copy { font-size: 14px; }
    .hero-art { width: 100%; max-width: 430px; height: 310px; justify-self: center; }
    .hero-photo { inset-inline: 25px; }
    .hero-stamp { left: 0; top: 13px; width: 73px; height: 73px; font-size: 11px; }
    .section { padding: 64px 0; }
    .section#collection { padding: 54px 0; }
    .section-heading { align-items: flex-start; flex-direction: column; gap: 10px; margin-bottom: 25px; }
    .section-heading p { font-size: 12px; }
    .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 27px 13px; }
    .product-details { flex-direction: column; gap: 6px; padding-top: 11px; }
    .product-details h3 { font-size: 16px; }
    .product-details p, .price { font-size: 11px; }
    .artist-section { padding: 62px 0; }
    .artist-grid { grid-template-columns: 1fr; gap: 39px; }
    .artist-photo-wrap { max-width: 410px; width: calc(100% - 14px); }
    .artist-note { right: -14px; }
    .artist-copy h2 { font-size: 42px; }
    .artist-copy p { font-size: 13px; }
    .contact-section { padding: 61px 0; }
    .contact-grid { grid-template-columns: 1fr; gap: 27px; }
    .contact-form { grid-template-columns: 1fr; }
    .form-field-wide, .form-status { grid-column: 1; }
    .footer-inner { align-items: flex-start; flex-direction: column; gap: 14px; }
    .footer-links { gap: 16px; }
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
  }
`

function ArtistPortrait() {
  return (
    <svg
      viewBox="0 0 400 470"
      role="img"
      aria-labelledby="kelly-portrait-title"
      preserveAspectRatio="xMidYMid slice"
    >
      <title id="kelly-portrait-title">
        Illustration of Kelly Wasko, an American ceramic artist with dirty-blonde
        hair and no bangs
      </title>
      <rect width="400" height="470" fill="#bde4dc" />
      <circle cx="315" cy="88" r="51" fill="#ffd18f" />
      <path d="M0 313c42-48 67-27 103 8s69 26 103-2 75-27 194 5v146H0Z" fill="#78aa7e" />
      <path d="M0 365c62-42 106-22 150 9s104 34 151 1 74-26 99-12v107H0Z" fill="#548b71" />
      <path d="M54 470c5-98 49-144 146-144s141 46 146 144Z" fill="#de8b78" />
      <path d="M116 470c6-79 37-119 84-119s78 40 84 119Z" fill="#3e7778" />
      <path d="M172 285h56v73c-14 19-42 19-56 0Z" fill="#d49472" />
      <path
        d="M121 202c-32-110 2-157 78-159 82-2 115 54 78 165l-22 40-111 1Z"
        fill="#987044"
      />
      <path
        d="M133 159c0-52 24-79 67-79 44 0 68 29 68 79v72c0 44-28 73-68 73s-67-29-67-73Z"
        fill="#e8b892"
      />
      <path
        d="M134 148c5-51 29-78 68-78 38 0 63 25 67 76-19-24-42-34-68-33-26 1-48 12-67 35Z"
        fill="#b18a4f"
      />
      <path d="M132 147c-5 36 1 79 15 105-23-5-38-35-37-68 0-21 8-38 22-46Z" fill="#a47b43" />
      <path d="M270 146c9 41 2 82-13 106 23-5 38-35 37-68-1-20-9-33-24-38Z" fill="#a47b43" />
      <path d="M160 192c8-6 19-6 27 0" fill="none" stroke="#654b3e" strokeWidth="4" strokeLinecap="round" />
      <path d="M213 192c8-6 19-6 27 0" fill="none" stroke="#654b3e" strokeWidth="4" strokeLinecap="round" />
      <path d="M169 205v5m62-5v5" stroke="#34464a" strokeWidth="5" strokeLinecap="round" />
      <path d="M198 207c-2 15-7 24-3 28 4 3 10 3 14 0" fill="none" stroke="#bd805e" strokeWidth="3" strokeLinecap="round" />
      <path d="M181 253c11 9 28 10 40-1" fill="none" stroke="#a95f5d" strokeWidth="4" strokeLinecap="round" />
      <path d="M198 72v31" fill="none" stroke="#d0ae74" strokeWidth="3" strokeLinecap="round" />
      <path d="M95 470c11-53 32-82 62-96l43 37 43-37c31 14 52 43 62 96" fill="#438184" />
      <path d="m157 374 43 37 43-37-20-15h-46Z" fill="#f3d3bb" />
    </svg>
  )
}

function App() {
  const [formStatus, setFormStatus] = useState('')

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus(
      'Your message has not been sent. The contact form is not connected yet.',
    )
  }

  return (
    <div className="storefront">
      <style>{styles}</style>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="wordmark" href="#home" aria-label="SlippedCeramics home">
            <Palette className="wordmark-icon" size={22} strokeWidth={1.5} />
            <span>SlippedCeramics</span>
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#collection">Shop Collection</a>
            <a href="#artist">Meet Kelly</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="shell hero-grid">
            <div>
              <p className="eyebrow">Small-batch pottery · Newtown, Connecticut</p>
              <h1>Handcrafted Ceramics for Everyday Moments.</h1>
              <p className="hero-copy">
                Modern, unique pottery made with love in Newtown, CT. Thoughtful
                pieces for slow mornings, shared meals, and all the little
                moments in between.
              </p>
              <a className="button" href="#collection">
                Shop available pieces <span aria-hidden="true">↘</span>
              </a>
              <p className="hero-note">Made by hand, meant to be held.</p>
            </div>
            <div className="hero-art" aria-label="A glimpse of Kelly's handmade pottery">
              <div className="hero-photo">
                <img
                  src={products[0].image}
                  alt={products[0].alt}
                />
              </div>
              <div className="hero-stamp">made<br />with care</div>
              <div className="hero-caption">
                <Coffee aria-hidden="true" />
                <span>A little everyday lovely</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="collection">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Kelly's current collection</p>
                <h2>One of a kind, made by hand.</h2>
              </div>
              <p>Explore the pieces currently available, each shaped and finished by hand.</p>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.name}>
                  <a
                    className="product-image"
                    href={shopUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${product.name} in Kelly's shop`}
                  >
                    <img src={product.image} alt={product.alt} loading="lazy" />
                  </a>
                  <div className="product-details">
                    <div>
                      <h3>{product.name}</h3>
                      <p>Handmade in Newtown, CT</p>
                    </div>
                    <span className="price">{product.price}</span>
                  </div>
                  <a className="buy-link" href={shopUrl} target="_blank" rel="noreferrer">
                    View piece
                    <ExternalLink aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="artist-section" id="artist">
          <div className="shell artist-grid">
            <div className="artist-photo-wrap">
              <div className="artist-photo">
                <ArtistPortrait />
              </div>
              <div className="artist-note">A little clay, a lot of heart</div>
            </div>
            <div className="artist-copy">
              <p className="eyebrow">The hands behind the handmade</p>
              <h2>Meet Kelly.</h2>
              <p>
                Hi, I’m Kelly Wasko, an American ceramic artist creating in
                Newtown, Connecticut. I love the quiet rhythm of the pottery
                wheel and turning a lump of clay into something you’ll reach for
                every day.
              </p>
              <p>
                When I’m not covered in clay, I’m keeping up with my 8-year-old
                Charlie, 6-year-old Blake, my husband Ken, and our dog Luna. Our
                family life—and all the everyday kitchen moments we share—inspires
                every functional, one-of-a-kind piece I make.
              </p>
              <div className="signature"><Heart aria-hidden="true" /> Made with love, Kelly</div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="shell contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">Say hello</p>
              <h2>Get in touch.</h2>
              <p>
                Have a question about a piece or a custom idea? Kelly would love
                to hear from you. The message form is not connected yet, so
                messages entered here will not be sent.
              </p>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-field">
                <label htmlFor="contact-name">Your name</label>
                <input id="contact-name" name="name" autoComplete="name" required />
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">Email address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-field form-field-wide">
                <label htmlFor="contact-message">Your message</label>
                <textarea id="contact-message" name="message" required />
              </div>
              <button className="button" type="submit">Send message</button>
              {formStatus && (
                <p className="form-status" role="status">{formStatus}</p>
              )}
            </form>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <span>© {new Date().getFullYear()} SlippedCeramics by Kelly Wasko</span>
          <div className="footer-links">
            <span>Handmade with care in Newtown, CT</span>
            <a className="footer-shop" href={shopUrl} target="_blank" rel="noreferrer">
              Etsy <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
