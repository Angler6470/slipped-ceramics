import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  Coffee,
  ExternalLink,
  Hand,
  Heart,
  LockKeyhole,
  Palette,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'

const shopUrl = 'https://www.etsy.com/shop/SlippedCeramics'

const productPairings: Record<string, string[]> = {
  'colorful-speckled-stoneware-mug': [
    'carved-blueberry-tumbler',
    'blue-glazed-ceramic-cup-set',
  ],
  'speckled-ceramic-catch-all': [
    'speckled-ombre-vase',
    'speckled-ceramic-bowl',
  ],
  'speckled-ceramic-bowl': [
    'speckled-ceramic-catch-all',
    'carved-blueberry-tumbler',
  ],
  'carved-blueberry-tumbler': [
    'colorful-speckled-stoneware-mug',
    'speckled-ceramic-bowl',
  ],
  'speckled-ombre-vase': [
    'speckled-ceramic-catch-all',
    'blue-glazed-ceramic-cup-set',
  ],
  'blue-glazed-ceramic-cup-set': [
    'colorful-speckled-stoneware-mug',
    'carved-blueberry-tumbler',
  ],
}

type Product = {
  name: string
  price: string
  image: string
  alt: string
  description: string
  subtitle: string
}

const defaultProductSubtitle = 'Small-batch stoneware, shaped slowly and meant to be lived with.'
const catalogStorageKey = 'slipped-ceramics-product-catalog'

const products: Product[] = [
  {
    name: 'Colorful Speckled Stoneware Mug',
    price: '$52.00',
    image: '/products/blue-speckled-mug.webp',
    alt: 'Handmade blue-speckled stoneware mug held outdoors',
    description: 'A one-of-a-kind wheel-thrown stoneware mug finished in a soft blue-speckled glaze. Its comfortable handle and generous shape make it a lovely companion for everyday coffee or tea.',
    subtitle: defaultProductSubtitle,
  },
  {
    name: 'Speckled Ceramic Catch-All',
    price: '$33.50',
    image: '/products/scalloped-catchall.webp',
    alt: 'Handmade speckled ceramic dish with a softly scalloped edge',
    description: 'A hand-shaped speckled stoneware catch-all with an easy, softly scalloped edge. Keep it by the sink for rings, on a desk for small treasures, or wherever a little handmade detail belongs.',
    subtitle: defaultProductSubtitle,
  },
  {
    name: 'Speckled Ceramic Bowl',
    price: '$42.50',
    image: '/products/green-rim-bowl.webp',
    alt: 'Handmade speckled ceramic bowl with a mint-green rim',
    description: 'This small-batch stoneware bowl pairs a softly speckled clay body with a fresh green rim. Each one is shaped and glazed by hand, so the details are always its own.',
    subtitle: defaultProductSubtitle,
  },
  {
    name: 'Carved Blueberry Tumbler',
    price: '$48.00',
    image: '/products/blueberry-tumbler.webp',
    alt: 'Wheel-thrown cream tumbler with carved lines and blueberry details',
    description: 'A wheel-thrown cream stoneware tumbler with hand-carved lines and tiny blueberry details. The tactile grooves and one-of-a-kind surface make it a cheerful piece for slow sips.',
    subtitle: defaultProductSubtitle,
  },
  {
    name: 'Speckled Ombre Vase',
    price: 'See listing',
    image: '/products/speckled-vase.webp',
    alt: 'Round handmade vase with a soft pink and cream speckled glaze',
    description: 'A round, hand-thrown stoneware vase with a warm pink-and-cream glaze that settles into a soft, speckled finish. Lovely with a few garden stems or simply as a sculptural little accent.',
    subtitle: defaultProductSubtitle,
  },
  {
    name: 'Blue Glazed Ceramic Cup Set',
    price: 'See listing',
    image: '/products/blue-cup-set.webp',
    alt: 'Three handmade cups with blue glaze arranged together',
    description: 'A set of three individually wheel-thrown cups in a softly varied blue glaze. Their subtle differences celebrate the small marks and variations that make handmade pottery special.',
    subtitle: defaultProductSubtitle,
  },
]

function isProduct(product: unknown): product is Product {
  if (!product || typeof product !== 'object') return false
  return (
    'name' in product && typeof product.name === 'string' &&
    'price' in product && typeof product.price === 'string' &&
    'image' in product && typeof product.image === 'string' &&
    'alt' in product && typeof product.alt === 'string' &&
    'description' in product && typeof product.description === 'string' &&
    'subtitle' in product && typeof product.subtitle === 'string'
  )
}

function readCatalog(): Product[] {
  const storedCatalog = window.localStorage.getItem(catalogStorageKey)
  if (!storedCatalog) return products

  const catalog: unknown = JSON.parse(storedCatalog)
  if (!Array.isArray(catalog) || !catalog.every(isProduct)) {
    throw new Error('Saved product listings have an unexpected format.')
  }
  return catalog
}

type CatalogState = {
  catalog: Product[]
  status: string
}

function getCatalogState(): CatalogState {
  try {
    return { catalog: readCatalog(), status: '' }
  } catch (error) {
    return {
      catalog: products,
      status: error instanceof Error ? error.message : 'Could not load saved product listings.',
    }
  }
}

type StudioUpdate = {
  id: string
  caption: string
  category: string
  image: string
  postedAt: string
}

const studioUpdatesStorageKey = 'slipped-ceramics-studio-updates'
const maxStudioUpdates = 9
const maxStudioPhotoBytes = 8 * 1024 * 1024

function isStudioUpdate(update: unknown): update is StudioUpdate {
  if (!update || typeof update !== 'object') return false
  return (
    'id' in update &&
    typeof update.id === 'string' &&
    'caption' in update &&
    typeof update.caption === 'string' &&
    'category' in update &&
    typeof update.category === 'string' &&
    'image' in update &&
    typeof update.image === 'string' &&
    'postedAt' in update &&
    typeof update.postedAt === 'string'
  )
}

function readStudioUpdates(): StudioUpdate[] {
  const storedUpdates = window.localStorage.getItem(studioUpdatesStorageKey)
  if (!storedUpdates) return []

  const updates: unknown = JSON.parse(storedUpdates)
  if (!Array.isArray(updates) || !updates.every(isStudioUpdate)) {
    throw new Error('Saved studio notes have an unexpected format.')
  }
  return updates.slice(0, maxStudioUpdates)
}

type StudioUpdatesState = {
  updates: StudioUpdate[]
  status: string
}

function getStudioUpdatesState(): StudioUpdatesState {
  try {
    return { updates: readStudioUpdates(), status: '' }
  } catch (error) {
    return {
      updates: [],
      status: error instanceof Error ? error.message : 'Could not load studio notes.',
    }
  }
}

async function prepareStudioPhoto(file: File): Promise<string> {
  if (file.size > maxStudioPhotoBytes) {
    throw new Error('Choose a photo smaller than 8 MB.')
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file to post.')
  }

  const photo = await createImageBitmap(file)
  const scale = Math.min(1, 1280 / Math.max(photo.width, photo.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(photo.width * scale)
  canvas.height = Math.round(photo.height * scale)
  const context = canvas.getContext('2d')
  if (!context) {
    photo.close()
    throw new Error('This browser could not prepare the photo.')
  }
  context.drawImage(photo, 0, 0, canvas.width, canvas.height)
  photo.close()

  const compressedPhoto = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob
        ? resolve(blob)
        : reject(new Error('This browser could not compress the photo.')),
      'image/jpeg',
      0.8,
    )
  })

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('This browser could not read the prepared photo.'))
    }
    reader.onerror = () => reject(new Error('This browser could not read the prepared photo.'))
    reader.readAsDataURL(compressedPhoto)
  })
}

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
  .site-header { position: sticky; z-index: 50; top: 0; height: 84px; display: flex; align-items: center; border-bottom: 1px solid rgba(231,225,216,.5); background: rgba(250,247,242,.8); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
  .header-inner { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
  .wordmark { display: inline-flex; align-items: center; gap: 10px; color: #293e48; font-family: 'Playfair Display', Georgia, serif; font-size: 23px; letter-spacing: -.6px; white-space: nowrap; }
  .wordmark-icon { color: #c45e69; }
  @keyframes liquid-logo-twirl {
    0% { transform: rotate(0) scale(1, 1); }
    22% { transform: rotate(-42deg) scale(1.17, .84); }
    56% { transform: rotate(205deg) scale(.86, 1.14); }
    78% { transform: rotate(318deg) scale(1.08, .94); }
    100% { transform: rotate(360deg) scale(1, 1); }
  }
  @media (prefers-reduced-motion: no-preference) {
    .wordmark-icon { transform-origin: center; }
    .wordmark:hover .wordmark-icon, .wordmark:focus-visible .wordmark-icon, .wordmark.logo-twirling .wordmark-icon { animation: liquid-logo-twirl 1s cubic-bezier(.2,.8,.25,1) both; }
  }
  .nav-links { position: absolute; left: 50%; display: flex; align-items: center; gap: 2px; padding: 5px; border: 1px solid #e8dfd2; border-radius: 999px; background: #f4efe7; box-shadow: inset 0 1px 2px rgba(70,57,43,.05), 0 2px 8px rgba(70,57,43,.04); color: #40565e; font-size: 12px; transform: translateX(-50%); }
  .nav-links a { padding: 9px 19px; border-radius: 999px; transition: color .25s ease, background-color .25s ease, box-shadow .25s ease; white-space: nowrap; }
  .nav-links a:hover { background: #fffdf9; color: #a83f59; box-shadow: 0 2px 8px rgba(70,57,43,.09); }
  .nav-links a:focus-visible { outline: 2px solid #a83f59; outline-offset: 2px; }
  .header-social { display: flex; align-items: center; gap: 12px; color: #6d6a62; font-size: 10px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; white-space: nowrap; }
  .header-social a { display: inline-flex; align-items: center; gap: 4px; transition: color .2s ease; }
  .header-social a:hover { color: #292c29; }
  .header-social a:focus-visible { border-radius: 3px; outline: 2px solid #a83f59; outline-offset: 4px; }
  .header-social-arrow { display: inline-block; transition: transform .2s ease; }
  .header-social a:hover .header-social-arrow { transform: translate(.125rem, -.125rem); }
  .header-social-separator { color: #d8d0c4; }
  .footer-links a { transition: color .2s ease; }
  .nav-links a:hover, .footer-links a:hover { color: #a83f59; }
  .button { min-height: 48px; padding: 0 22px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; border: 1px solid #27645e; border-radius: 3px; background: #27645e; color: #fff !important; font: 600 12px 'DM Sans', sans-serif; letter-spacing: .04em; transition: background-color .3s ease, transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
  .button:hover { background: #1d514c; border-color: #1d514c; transform: translateY(-1px); }
  .button:active { transition-duration: .15s; transform: scale(.98); }
  .button svg { width: 15px; height: 15px; }
  .button-light { background: transparent; color: #42535a !important; }
  .button-light:hover { background: #42535a; color: #fff !important; }
  .hero { position: relative; isolation: isolate; min-height: 570px; display: flex; align-items: center; padding: 74px 0 80px; background: linear-gradient(115deg, #fff0e9 2%, #f8f0e4 50%, #e5f4ef 100%); }
  .hero::before, .hero::after { content: ''; position: absolute; z-index: -1; border-radius: 50%; filter: blur(1px); }
  .hero::before { width: 370px; height: 370px; right: -100px; top: -145px; background: rgba(235, 173, 177, .38); transform: translate(var(--blob-x, 0px), var(--blob-y, 0px)); transition: transform .25s ease-out; }
  .hero::after { width: 280px; height: 280px; left: 34%; bottom: -195px; background: rgba(151, 206, 182, .42); transform: translate(calc(var(--blob-x, 0px) * -.7), calc(var(--blob-y, 0px) * -.7)); transition: transform .3s ease-out; }
  .hero-grid { display: grid; grid-template-columns: 1fr .9fr; align-items: center; gap: 76px; }
  .eyebrow { margin: 0 0 18px; color: #a43c56; font-size: 10px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; }
  .hero h1 { max-width: 570px; margin: 0 0 19px; font-size: clamp(44px, 5.2vw, 68px); line-height: 1.08; letter-spacing: -.045em; }
  .hero-copy { max-width: 440px; margin-bottom: 30px; color: #435860; font-size: 15px; line-height: 1.8; }
  .hero-note { margin: 20px 0 0; color: #536a67; font-size: 11px; letter-spacing: .04em; }
  .hero-art { position: relative; width: min(100%, 440px); height: 390px; justify-self: end; }
  .hero-photo { position: absolute; inset: 0 24px 0 38px; overflow: hidden; border-radius: 48% 48% 4px 4px; background: #b8d9d1; }
  .hero-photo img { height: 100%; }
  .clay-divider { position: relative; z-index: 1; height: 0; color: #94775c; pointer-events: none; }
  .clay-divider svg { position: absolute; top: 50%; left: 0; width: 100%; height: 32px; overflow: visible; transform: translateY(-50%); }
  .clay-divider path { fill: none; stroke: currentColor; stroke-width: 1.15; stroke-linecap: round; opacity: .34; }
  .clay-divider path + path { stroke-width: .8; opacity: .2; }
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
  .product-card { position: relative; isolation: isolate; border-radius: 5px; transition: box-shadow .25s ease; }
  .product-card::before { position: absolute; z-index: -1; inset: -12px; border-radius: 10px; background: #fffdf9; box-shadow: 0 12px 26px rgba(67,60,54,.11); content: ''; opacity: 0; transition: opacity .25s ease; }
  .product-card:hover::before, .product-card:focus-within::before { opacity: 1; }
  .product-image { display: block; aspect-ratio: 1; overflow: hidden; padding: 12px; background: #eee8e2; border-radius: 5px; }
  .product-image img { height: 100%; object-fit: contain; }
  .product-details { display: flex; align-items: start; justify-content: space-between; gap: 12px; padding: 15px 0 9px; }
  .product-details h3 { margin: 0 0 5px; font-size: 19px; line-height: 1.3; }
  .product-details p { margin: 0; color: #56696f; font-size: 12px; }
  .price { padding-top: 3px; color: #293e48; font-size: 13px; font-weight: 600; white-space: nowrap; }
  .buy-link { display: inline-flex; align-items: center; gap: 7px; color: #28635d !important; font-size: 11px; font-weight: 600; letter-spacing: .02em; }
  .buy-link { transition: color .2s ease; }
  .buy-link svg { width: 13px; height: 13px; transition: transform .3s ease; }
  .product-card:hover .buy-link svg, .buy-link:hover svg { transform: translate(.125rem, -.125rem); }
  .buy-link:hover { color: #a43c56 !important; }
  .product-detail { min-height: 100vh; background: radial-gradient(ellipse at 83% 12%, rgba(223,235,219,.62), transparent 35%), radial-gradient(ellipse at 8% 56%, rgba(246,224,210,.48), transparent 34%), #fffaf2; }
  .product-detail a, .product-detail a:visited { color: inherit; text-decoration: none; }
  .product-detail-header .wordmark, .product-detail-header .wordmark:visited { color: #293e48; }
  .product-detail-header { position: sticky; z-index: 5; top: 0; padding: 19px 0; border-bottom: 1px solid rgba(174,151,121,.25); background: rgba(255,250,242,.82); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
  .product-detail-header .shell { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .product-detail-main { padding: clamp(40px, 7vw, 76px) 0 70px; }
  .product-detail-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(300px, .9fr); align-items: center; gap: clamp(32px, 6vw, 78px); }
  .product-detail-photo { position: relative; display: grid; aspect-ratio: 1 / 1.04; place-items: center; overflow: hidden; padding: clamp(18px, 4vw, 54px); border: 1px solid rgba(146,118,88,.24); border-radius: 32px 12px 37px 15px / 16px 35px 13px 30px; background: radial-gradient(ellipse at 50% 40%, #fffdf8 0%, #f3ebdd 76%); box-shadow: 0 24px 58px rgba(79,65,48,.12), inset 0 1px rgba(255,255,255,.9); }
  .product-detail-photo::after { position: absolute; inset: 12px; border: 1px solid rgba(146,118,88,.13); border-radius: 25px 9px 30px 11px / 11px 28px 9px 24px; content: ''; pointer-events: none; }
  .product-detail-photo img { display: block; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 16px 14px rgba(61,53,42,.13)); }
  .product-detail-copy { padding: clamp(5px, 2vw, 24px) 0; }
  .product-detail-copy .eyebrow { margin-bottom: 14px; color: #a43c56; }
  .product-detail-copy h1 { margin: 0 0 14px; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(38px, 5vw, 62px); font-weight: 400; line-height: 1.08; letter-spacing: -.04em; }
  .product-detail-price { margin: 0 0 19px; color: #805047; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; }
  .product-detail-description { margin: 0 0 23px; color: #4d5b59; font-size: 14px; line-height: 1.9; }
  .product-detail-note { margin: 21px 0 0; color: #69716a; font-family: 'Playfair Display', Georgia, serif; font-size: 13px; font-style: italic; }
  .product-detail-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; }
  .product-detail-back { color: #425d56 !important; font-size: 12px; text-decoration: underline !important; text-underline-offset: 4px; }
  .product-detail-back:hover { color: #a43c56 !important; }
  .product-buy-button { min-height: 52px; padding: 0 23px; border: 1px solid #774939; border-radius: 24px 9px 22px 10px / 10px 23px 8px 22px; background: #a85d45; box-shadow: 0 5px 0 #774939, 0 10px 20px rgba(119,73,57,.14); color: #fff9ee !important; font-size: 12px; letter-spacing: .035em; }
  .product-buy-button:hover { border-color: #774939; background: #965039; box-shadow: 0 3px 0 #774939, 0 8px 17px rgba(119,73,57,.17); transform: translateY(2px) rotate(-1deg); }
  .product-buy-button:active { box-shadow: 0 1px 0 #774939; transform: translateY(4px) rotate(1deg) scale(.98); }
  .product-pairings { padding: 58px 0 82px; border-top: 1px solid rgba(146,118,88,.19); background: rgba(255,253,248,.63); }
  .product-pairings-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 23px; }
  .product-pairings-heading .eyebrow { margin-bottom: 9px; }
  .product-pairings-heading h2 { margin: 0; font-size: clamp(29px, 4vw, 40px); }
  .product-pairings-heading > p { max-width: 310px; margin: 0 0 4px; color: #68706a; font-size: 12px; line-height: 1.7; }
  .product-pairing-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .product-pairing-card { display: grid; grid-template-columns: minmax(110px, .42fr) 1fr; overflow: hidden; border: 1px solid rgba(146,118,88,.22); border-radius: 23px 8px 21px 10px; background: #fffdf8; color: inherit; box-shadow: 0 10px 25px rgba(79,65,48,.06); transition: transform .3s ease, box-shadow .3s ease; }
  .product-pairing-card:hover { box-shadow: 0 15px 32px rgba(79,65,48,.12); transform: translateY(-3px) rotate(-.4deg); }
  .product-pairing-card img { width: 100%; height: 100%; min-height: 142px; padding: 10px; background: #f2ebdf; object-fit: contain; }
  .product-pairing-copy { align-self: center; padding: 17px 19px; }
  .product-pairing-copy p { margin: 0 0 6px; color: #a05d4e; font-size: 9px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; }
  .product-pairing-copy h3 { margin: 0 0 7px; color: #33484e; font-family: 'Playfair Display', Georgia, serif; font-size: 19px; font-weight: 400; line-height: 1.25; }
  .product-pairing-copy span { color: #805047; font-size: 11px; font-weight: 600; }
  .product-detail-enter .product-detail-photo { animation: reveal-ceramic 680ms cubic-bezier(.2,.75,.25,1) both; }
  .product-detail-enter .product-detail-copy { animation: settle-copy 520ms 100ms ease-out both; }
  @keyframes reveal-ceramic { from { opacity: 0; transform: translateY(22px) rotate(1.5deg) scale(.975); } to { opacity: 1; transform: translateY(0) rotate(0) scale(1); } }
  @keyframes settle-copy { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .product-detail-missing { max-width: 620px; margin: 12vh auto; padding: 36px; text-align: center; }
  .studio-updates-section { padding: 82px 0; background: #fffaf1; }
  .studio-updates-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
  .studio-updates-heading h2 { margin: 0 0 8px; font-size: clamp(34px, 4vw, 46px); letter-spacing: -.035em; }
  .studio-updates-heading > p { max-width: 350px; margin: 0 0 4px; color: #58645f; font-size: 12px; line-height: 1.75; }
  .studio-updates-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
  .studio-update-card { overflow: hidden; border: 1px solid rgba(135,95,68,.17); border-radius: 23px 8px 20px 9px; background: #fffdf9; box-shadow: 0 10px 28px rgba(79,65,48,.07); }
  .studio-update-card img { aspect-ratio: 1 / .88; background: #eee5d9; }
  .studio-update-copy { padding: 16px 18px 19px; }
  .studio-update-category { margin: 0 0 7px; color: #a05d4e; font-size: 9px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; }
  .studio-update-copy p:last-child { margin: 0; color: #46575a; font-size: 12px; line-height: 1.7; }
  .studio-updates-empty { padding: 30px; border: 1px dashed #c9ad91; border-radius: 22px 8px 20px 9px; color: #6a675f; text-align: center; font-size: 13px; }
  .admin-update-composer { display: grid; gap: 11px; margin-bottom: 25px; padding-bottom: 24px; border-bottom: 1px solid rgba(135,95,68,.17); }
  .admin-update-composer h3 { margin: 0; color: #33484e; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 400; }
  .admin-update-composer label { color: #344b52; font-size: 12px; font-weight: 600; }
  .admin-update-composer input, .admin-update-composer textarea, .admin-update-composer select { width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid #d1bba2; border-radius: 14px 5px 15px 5px / 6px 14px 5px 13px; background: #fffdf9; color: #293e48; font: 13px 'DM Sans', sans-serif; }
  .admin-update-composer textarea { min-height: 80px; resize: vertical; }
  .admin-update-composer input:focus, .admin-update-composer textarea:focus, .admin-update-composer select:focus { border-color: #bc6655; outline: 3px solid rgba(188,102,85,.2); outline-offset: 2px; }
  .admin-update-list { display: grid; gap: 9px; }
  .admin-update-row { display: grid; grid-template-columns: 58px minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 8px; border-radius: 15px 6px 14px 7px; background: #fff8ed; }
  .admin-update-row img { width: 58px; height: 58px; border-radius: 11px 4px 10px 5px; object-fit: cover; }
  .admin-update-row p { margin: 0; color: #52666a; font-size: 11px; line-height: 1.5; }
  .admin-update-notice { margin: 0; color: #765c44; font-size: 10px; line-height: 1.6; }
  .admin-updates-workspace { margin-top: 24px; }
  .admin-updates-workspace > .admin-inventory { max-width: 850px; }
  .quality-section { padding: 28px 0 54px; background: #fffdf9; }
  .quality-eyebrow { margin-bottom: 17px; color: #8d6b53; text-align: center; }
  .quality-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .quality-card { min-height: 100px; display: grid; grid-template-columns: 38px minmax(0, 1fr); align-items: center; gap: 13px; padding: 17px 19px; border: 1px solid #c6aa8e; border-radius: 20px 7px 19px 8px / 8px 19px 7px 20px; background: rgba(255,252,245,.82); box-shadow: inset 0 1px rgba(255,255,255,.8); }
  .quality-icon { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid rgba(138,96,69,.2); border-radius: 50%; background: #f1e5d5; color: #8a6045; }
  .quality-icon svg { width: 17px; height: 17px; stroke-width: 1.7; }
  .quality-card h3 { margin: 0 0 4px; color: #34484e; font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 400; line-height: 1.25; }
  .quality-card p { margin: 0; color: #62645c; font-size: 11px; line-height: 1.55; }
  .kiln-status-section { padding: 42px 0 58px; background: #f7eddc; }
  .kiln-status-card { display: flex; align-items: center; justify-content: space-between; gap: 36px; padding: clamp(25px, 4vw, 42px); border: 1px solid rgba(135,95,68,.2); border-radius: 34px 12px 30px 14px / 19px 33px 15px 31px; background: radial-gradient(rgba(117,76,53,.09) .65px, transparent .85px) 0 0 / 21px 21px, rgba(255,253,249,.76); box-shadow: 0 15px 40px rgba(94,65,45,.08), inset 0 1px rgba(255,255,255,.8); }
  .kiln-status-copy { max-width: 520px; }
  .kiln-status-copy .eyebrow { margin-bottom: 10px; color: #8d4b36; }
  .kiln-status-copy h2 { margin: 0 0 8px; font-size: clamp(30px, 4vw, 42px); letter-spacing: -.035em; }
  .kiln-status-description { margin: 0; color: #4d5149; font-size: 13px; line-height: 1.75; }
  .notify-form { flex: 0 0 min(100%, 390px); display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 10px; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; clip-path: inset(50%); }
  .notify-form input { width: 100%; min-width: 0; min-height: 48px; padding: 11px 14px; border: 1px solid #c6aa8e; border-radius: 16px 5px 17px 6px / 6px 17px 5px 16px; background: rgba(255,252,245,.88); color: #293e48; font: 13px 'DM Sans', sans-serif; transition: border-color .2s, box-shadow .2s, background .2s; }
  .notify-form input:focus { border-color: #8a6045; outline: 3px solid rgba(138,96,69,.25); outline-offset: 2px; background: #fffdf8; }
  .notify-button { min-height: 48px; padding: 0 18px; border: 1px solid #704b39; border-radius: 19px 7px 17px 6px / 7px 18px 6px 17px; background: #31594f; color: #fff8ed; cursor: pointer; font: 600 11px 'DM Sans', sans-serif; letter-spacing: .04em; transition: background .25s, transform .25s, box-shadow .25s; }
  .notify-button:hover { background: #1d514c; box-shadow: 0 6px 15px rgba(79,55,40,.16); transform: translateY(-1px); }
  .notify-button:focus-visible { outline: 3px solid #8a6045; outline-offset: 3px; }
  .notify-status { grid-column: 1 / -1; margin: 3px 0 0; color: #795541; font-size: 11px; line-height: 1.6; }
  .artist-section { padding: 86px 0; background: #f7eddc; }
  .artist-grid { display: grid; grid-template-columns: .95fr 1fr; align-items: center; gap: clamp(42px, 8vw, 96px); }
  .artist-photo-wrap { position: relative; width: min(100%, 450px); }
  .artist-photo { aspect-ratio: 1 / 1.08; overflow: hidden; border: 7px solid rgba(255,250,240,.68); border-radius: 48% 48% 13px 13px; background: #a98d73; box-shadow: 0 18px 42px rgba(94,65,45,.14); }
  .artist-photo img { height: 100%; object-position: center; animation: maker-photo-breathe 15s ease-in-out infinite alternate; }
  @keyframes maker-photo-breathe { from { transform: scale(1); } to { transform: scale(1.055); } }
  .artist-photo-wrap:hover img { animation-duration: 9s; }
  .artist-note { position: absolute; right: -18px; bottom: 22px; padding: 13px 18px; background: #fffdf9; color: #75434d; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-style: italic; box-shadow: 0 8px 24px rgba(65, 56, 49, .12); transform: rotate(-2deg); }
  .artist-copy { position: relative; z-index: 1; margin-left: -58px; padding: clamp(24px, 4vw, 43px); border: 1px solid rgba(255,250,240,.76); border-radius: 29px 11px 27px 12px / 14px 28px 12px 25px; background: rgba(255,250,240,.82); box-shadow: 0 16px 40px rgba(94,65,45,.1); -webkit-backdrop-filter: blur(9px); backdrop-filter: blur(9px); }
  .artist-copy .eyebrow { margin-bottom: 15px; color: #a43c56; }
  .artist-copy h2 { max-width: 530px; margin: 0 0 18px; font-size: clamp(38px, 4.5vw, 54px); line-height: 1.12; letter-spacing: -.035em; }
  .artist-copy p { max-width: 510px; margin: 0 0 24px; color: #3f555d; font-size: 14px; line-height: 1.9; }
  .artist-story-trigger { min-height: 49px; padding: 0 18px; display: inline-flex; align-items: center; gap: 10px; border: 1px solid rgba(164,60,86,.42); border-radius: 22px 7px 20px 8px / 8px 20px 7px 21px; background: rgba(255,253,249,.68); color: #793e49 !important; font: 600 12px 'DM Sans', sans-serif; transition: background-color .3s, box-shadow .3s, transform .3s; }
  .artist-story-trigger:hover { background: #fffdf9; box-shadow: 0 7px 18px rgba(94,65,45,.12); transform: translateY(-2px); }
  .artist-story-trigger:active { transform: translateY(0) scale(.98); }
  .artist-story-trigger:focus-visible, .story-close:focus-visible { outline: 3px solid #8a6045; outline-offset: 4px; }
  .artist-story-trigger svg { width: 15px; height: 15px; transition: transform .3s; }
  .artist-story-trigger:hover svg { transform: translate(.125rem, -.125rem); }
  .story-overlay { position: fixed; z-index: 30; inset: 0; display: grid; place-items: center; overflow-y: auto; overscroll-behavior: contain; padding: 28px; background: rgba(33,37,34,.48); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
  .story-dialog { position: relative; width: min(100%, 920px); max-height: min(900px, calc(100dvh - 56px)); overflow: auto; overscroll-behavior: contain; border: 1px solid rgba(255,255,255,.7); border-radius: 34px 15px 30px 14px / 18px 32px 16px 34px; background: radial-gradient(rgba(117,76,53,.08) .65px, transparent .85px) 0 0 / 21px 21px, #fffaf0; box-shadow: 0 28px 90px rgba(20,26,22,.28); scrollbar-color: #c9ad91 transparent; }
  .story-dialog-inner { max-width: 760px; margin: 0 auto; padding: clamp(32px, 7vw, 76px); }
  .story-close { position: sticky; z-index: 4; top: 12px; width: 46px; height: 46px; display: grid; place-items: center; margin: 12px 12px -58px auto; border: 1px solid rgba(114,68,47,.24); border-radius: 47% 53% 50% 45% / 52% 46% 54% 48%; background: rgba(255,253,249,.96); color: #4a4740; cursor: pointer; transition: background-color .2s, transform .2s; }
  .story-close:hover { background: #f1dfcb; transform: rotate(7deg); }
  .story-close svg { width: 19px; height: 19px; }
  .story-dialog .eyebrow { margin-bottom: 15px; color: #a43c56; }
  .story-dialog h2 { max-width: 650px; margin: 0 0 28px; font-size: clamp(38px, 6vw, 64px); line-height: 1.08; letter-spacing: -.04em; }
  .story-dialog h3 { margin: 37px 0 11px; font-size: clamp(23px, 3vw, 30px); line-height: 1.2; }
  .story-dialog p { color: #46575a; font-size: 15px; line-height: 1.9; }
  .story-gallery { display: grid; grid-template-columns: 1.05fr .95fr; align-items: start; gap: 20px; margin: 37px 0 12px; }
  .story-gallery figure { margin: 0; }
  .story-gallery figure:nth-child(2) { margin-top: 42px; }
  .story-gallery img { width: 100%; aspect-ratio: 1.15; overflow: hidden; border-radius: 48% 48% 9px 9px; background: #eee3d4; object-fit: cover; }
  .story-gallery figcaption { margin-top: 10px; color: #6b5c4e; font-family: 'Playfair Display', Georgia, serif; font-size: 13px; font-style: italic; }
  .story-signoff { margin-top: 35px; color: #8e3f55 !important; font-family: 'Playfair Display', Georgia, serif; font-size: 20px !important; font-style: italic; }
  .studio-admin { min-height: 100vh; padding: 30px 0 64px; background: radial-gradient(ellipse at 90% 3%, rgba(255,199,120,.55), transparent 30%), radial-gradient(ellipse at 0% 28%, rgba(255,185,173,.4), transparent 35%), #fff8e9; color: #293e48; }
  .studio-admin .admin-shell { width: min(1160px, calc(100% - 48px)); margin: 0 auto; }
  .admin-topbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 55px; }
  .admin-wordmark { display: inline-flex; align-items: center; gap: 10px; color: #293e48; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; }
  .admin-wordmark svg { color: #d46253; }
  .admin-back { color: #52666a !important; font-size: 13px; text-decoration: underline !important; text-underline-offset: 4px; }
  .admin-login-wrap { min-height: calc(100vh - 170px); display: grid; place-items: center; }
  .admin-login-card { width: min(100%, 480px); padding: clamp(28px, 6vw, 54px); border: 1px solid rgba(135,95,68,.15); border-radius: 42px 16px 35px 17px / 24px 40px 19px 34px; background: rgba(255,253,249,.9); box-shadow: 0 24px 65px rgba(111,78,51,.13); }
  .admin-login-icon { width: 50px; height: 50px; display: grid; place-items: center; margin-bottom: 24px; border-radius: 50%; background: #ffe0a9; color: #8a4d41; }
  .admin-kicker { margin: 0 0 12px; color: #b14c48; font-size: 10px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; }
  .admin-login-card h1, .admin-heading h1 { margin: 0 0 14px; font-family: 'Playfair Display', Georgia, serif; font-weight: 400; color: #293e48; letter-spacing: -.04em; }
  .admin-login-card h1 { font-size: clamp(38px, 6vw, 52px); line-height: 1.08; }
  .admin-login-card > p:not(.admin-kicker) { margin: 0 0 24px; color: #56696f; font-size: 13px; line-height: 1.8; }
  .admin-login-form { display: grid; gap: 10px; }
  .admin-login-form label, .admin-product-form label { color: #344b52; font-size: 12px; font-weight: 600; }
  .admin-login-form input, .admin-product-form input, .admin-product-form textarea { width: 100%; min-height: 46px; padding: 11px 13px; border: 1px solid #d1bba2; border-radius: 14px 5px 15px 5px / 6px 14px 5px 13px; background: #fffdf9; color: #293e48; font: 14px 'DM Sans', sans-serif; }
  .admin-product-form textarea { min-height: 100px; resize: vertical; }
  .admin-login-form input:focus, .admin-product-form input:focus, .admin-product-form textarea:focus { border-color: #bc6655; outline: 3px solid rgba(188,102,85,.2); outline-offset: 2px; }
  .admin-primary { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 0 18px; border: 1px solid #a54d47; border-radius: 18px 6px 17px 6px / 6px 17px 6px 17px; background: #bd5c4e; color: white; cursor: pointer; font: 600 12px 'DM Sans', sans-serif; transition: background .25s, transform .25s, box-shadow .25s; }
  .admin-primary:hover { background: #a94d44; box-shadow: 0 7px 18px rgba(137,69,56,.2); transform: translateY(-1px); }
  .admin-primary svg { width: 16px; height: 16px; }
  .admin-notice { margin-top: 22px !important; padding: 12px 14px; border-radius: 12px; background: #fff0d8; color: #75563c !important; font-size: 11px !important; line-height: 1.65 !important; }
  .admin-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 30px; }
  .admin-heading h1 { font-size: clamp(40px, 6vw, 60px); line-height: 1.08; }
  .admin-heading p:not(.admin-kicker) { margin: 0; color: #56696f; font-size: 13px; }
  .admin-metrics { display: flex; gap: 12px; margin-bottom: 27px; }
  .admin-metric { min-width: 145px; padding: 16px 20px; border: 1px solid rgba(135,95,68,.12); border-radius: 20px 8px 18px 9px; background: rgba(255,253,249,.78); }
  .admin-metric strong { display: block; color: #9a5348; font-family: 'Playfair Display', Georgia, serif; font-size: 27px; font-weight: 400; line-height: 1.1; }
  .admin-metric span { color: #637175; font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
  .admin-workspace { display: grid; grid-template-columns: minmax(0, 1fr) 330px; align-items: start; gap: 28px; }
  .admin-inventory, .admin-editor { padding: 24px; border: 1px solid rgba(135,95,68,.14); border-radius: 27px 11px 25px 12px; background: rgba(255,253,249,.84); box-shadow: 0 12px 36px rgba(111,78,51,.08); }
  .admin-panel-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
  .admin-panel-title h2 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 25px; font-weight: 400; }
  .admin-panel-title span { color: #798386; font-size: 11px; }
  .admin-product-list { display: grid; gap: 10px; }
  .admin-product-row { display: grid; grid-template-columns: 66px minmax(0, 1fr) auto; align-items: center; gap: 14px; padding: 10px; border-radius: 17px 7px 16px 8px; background: #fff8ed; }
  .admin-product-row img { width: 66px; height: 66px; border-radius: 13px 5px 12px 6px; object-fit: cover; background: #eee3d4; }
  .admin-product-info { min-width: 0; }
  .admin-product-info strong { display: block; overflow: hidden; color: #33484e; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
  .admin-product-info span { display: block; color: #758083; font-size: 11px; line-height: 1.45; }
  .admin-row-actions { display: flex; gap: 7px; }
  .admin-icon-button { width: 35px; height: 35px; display: grid; place-items: center; border: 1px solid #ead8c4; border-radius: 12px 5px 12px 5px; background: #fffdf9; color: #52666a; cursor: pointer; transition: background .2s, color .2s; }
  .admin-icon-button:hover { background: #ffe2c2; color: #8a4d41; }
  .admin-icon-button.delete:hover { background: #f9d9d2; color: #a13f3f; }
  .admin-icon-button svg { width: 15px; height: 15px; }
  .admin-product-form { display: grid; gap: 9px; }
  .admin-product-form h2 { margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif; font-size: 25px; font-weight: 400; }
  .admin-form-actions { display: flex; gap: 8px; margin-top: 9px; }
  .admin-secondary { min-height: 44px; padding: 0 14px; border: 1px solid #d7c4ad; border-radius: 15px 5px 14px 6px; background: transparent; color: #52666a; cursor: pointer; font: 600 11px 'DM Sans', sans-serif; }
  .admin-secondary:hover { background: #f8ecde; }
  .admin-empty { padding: 30px 16px; color: #758083; text-align: center; font-size: 13px; }
  .contact-section { position: relative; isolation: isolate; overflow: hidden; padding: 88px 0; background: radial-gradient(ellipse at 12% 16%, rgba(255,255,255,.72), transparent 37%), radial-gradient(ellipse at 90% 84%, rgba(190,112,82,.12), transparent 36%), #eadbc5; }
  .contact-section::before { position: absolute; z-index: -1; inset: 0; content: ''; background-image: radial-gradient(rgba(117,76,53,.14) .65px, transparent .8px), radial-gradient(rgba(255,255,255,.45) .7px, transparent .9px); background-position: 0 0, 11px 13px; background-size: 23px 23px, 31px 31px; opacity: .36; pointer-events: none; }
  .contact-grid { display: grid; grid-template-columns: .92fr 1fr; gap: 66px; align-items: center; }
  .contact-copy { min-width: 0; }
  .contact-intro { position: relative; }
  .contact-heading-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
  .contact-copy .eyebrow { margin-bottom: 0; color: #8d4b36; }
  .contact-copy h2 { max-width: 480px; margin: 0 0 16px; font-size: clamp(36px, 4vw, 49px); line-height: 1.12; letter-spacing: -.035em; }
  .contact-copy .contact-description { max-width: 420px; margin: 0; color: #4d5149; font-size: 14px; line-height: 1.85; }
  .maker-mark { flex: 0 0 auto; width: 74px; height: 74px; display: grid; align-content: center; justify-items: center; gap: 2px; border: 1px solid rgba(114,68,47,.65); border-radius: 50%; outline: 1px solid rgba(114,68,47,.32); outline-offset: 4px; background: #bd7154; color: #fff5e8; text-align: center; font-family: 'Playfair Display', Georgia, serif; font-size: 10px; line-height: 1.15; transform: rotate(9deg); }
  .maker-mark span:first-child { font-size: 11px; font-style: italic; }
  .maker-mark span:last-child { font-size: 13px; }
  .contact-photo-wrap { position: relative; width: min(100%, 430px); margin: 34px 0 0 8px; }
  .contact-photo { aspect-ratio: 1.14; overflow: hidden; border: 7px solid rgba(255,250,240,.68); border-radius: 48% 48% 13px 13px; background: #a98d73; box-shadow: 0 18px 42px rgba(94,65,45,.16); }
  .contact-photo img { height: 100%; object-position: center 57%; transition: transform .65s cubic-bezier(.2,.7,.2,1); }
  .contact-photo-wrap:hover img { transform: scale(1.035); }
  .contact-photo-caption { display: flex; justify-content: space-between; gap: 12px; margin: 13px 9px 0; color: #655748; font-family: 'Playfair Display', Georgia, serif; font-size: 12px; font-style: italic; }
  .contact-form { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: clamp(23px, 3.2vw, 38px); border: 1px solid rgba(135,95,68,.18); border-radius: 38px 13px 34px 15px / 24px 37px 18px 31px; background: radial-gradient(rgba(117,76,53,.11) .65px, transparent .85px) 0 0 / 19px 19px, radial-gradient(rgba(255,255,255,.68), transparent 72%), #f5ead9; box-shadow: 0 20px 50px rgba(94,65,45,.12), inset 0 1px rgba(255,255,255,.72); transform: rotate(-.6deg); transition: transform .3s ease, box-shadow .3s ease; }
  .contact-form:focus-within { transform: rotate(0); box-shadow: 0 22px 54px rgba(94,65,45,.15), inset 0 1px rgba(255,255,255,.72); }
  .form-field { position: relative; display: grid; gap: 7px; }
  .form-field::after { position: absolute; right: 0; bottom: 0; left: 0; height: 3px; border-radius: 999px; background: #a64f38; content: ''; transform: scaleX(0); transform-origin: left; transition: transform .45s cubic-bezier(.2,.75,.25,1); }
  .form-field:focus-within::after { transform: scaleX(1); }
  .form-field-wide { grid-column: 1 / -1; }
  .form-field label { color: #4b463d; font-size: 12px; font-weight: 600; }
  .form-field input, .form-field textarea { width: 100%; min-height: 47px; border: 1px solid #c6aa8e; border-radius: 16px 5px 17px 6px / 6px 17px 5px 16px; padding: 12px 14px; background: rgba(255,252,245,.82); color: #293e48; font: 14px 'DM Sans', sans-serif; transition: border-color .2s, box-shadow .2s, background .2s; }
  .form-field input:focus, .form-field textarea:focus { border-color: #8a6045; border-bottom-color: transparent; outline: 2px solid rgba(138,96,69,.2); outline-offset: 2px; background: #fffdf8; box-shadow: none; }
  .form-field textarea { min-height: 142px; resize: vertical; border-radius: 17px 6px 20px 5px / 7px 18px 6px 17px; }
  .contact-submit { position: relative; justify-self: start; min-height: 50px; padding: 0 21px 0 43px; border: 1px dashed #9c684d; border-radius: 999px; background: #fff5e8; color: #704b39 !important; cursor: pointer; box-shadow: 0 4px 0 rgba(156,104,77,.2); transition: transform .28s cubic-bezier(.2,.8,.25,1), box-shadow .28s, background-color .28s; }
  .contact-submit::before { position: absolute; left: 16px; color: #b86d50; content: '✿'; font-size: 16px; line-height: 1; transition: transform .35s cubic-bezier(.2,.8,.25,1); }
  .contact-submit:hover { border-color: #9c684d; background: #ffebd7; box-shadow: 0 6px 0 rgba(156,104,77,.2); transform: translateY(-2px) rotate(-1.5deg); }
  .contact-submit:hover::before { transform: rotate(28deg) scale(1.18); }
  .contact-submit:active { transition-duration: .12s; box-shadow: 0 1px 0 rgba(156,104,77,.24); transform: translateY(3px) rotate(1deg) scale(.98); }
  .contact-submit:focus-visible { outline: 3px solid #8a6045; outline-offset: 3px; }
  .form-status { grid-column: 1 / -1; margin: 0; color: #754238; font-size: 13px; line-height: 1.6; }
  .site-footer { padding: 27px 0; background: #fffdf9; }
  .footer-inner { display: flex; justify-content: space-between; align-items: center; gap: 20px; color: #4d6268; font-size: 11px; }
  .footer-links { display: flex; align-items: center; gap: 22px; }
  .footer-shop { display: inline-flex; align-items: center; gap: 6px; color: #50676b !important; font-weight: 400; }
  .footer-shop svg { width: 13px; }
  @media (prefers-reduced-motion: no-preference) {
    @keyframes slow-float {
      0%, 100% { translate: 0 0; }
      50% { translate: 0 -6px; }
    }
    @keyframes arch-entrance {
      from { opacity: 0; transform: scale(.98); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes story-backdrop-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes story-bloom-in {
      from { opacity: 0; clip-path: ellipse(0% 0% at 50% 48%); transform: scale(.97); }
      to { opacity: 1; clip-path: ellipse(100% 100% at 50% 48%); transform: scale(1); }
    }
    .hero::before, .hero::after { animation: slow-float 7s ease-in-out infinite; }
    .hero::after { animation-delay: -3.5s; }
    .hero-photo { animation: arch-entrance .8s ease-out both; }
    .story-overlay { animation: story-backdrop-in .35s ease-out both; }
    .story-dialog { animation: story-bloom-in .75s cubic-bezier(.16,1,.3,1) both; }
    .studio-badge { translate: 0 var(--badge-scroll-y, 0px); }
    .storefront.badges-reveal-ready .studio-badge { opacity: 0; scale: .97; transition: opacity .8s ease, scale .8s ease; }
    .storefront.badges-reveal-ready .studio-badge.is-visible { opacity: 1; scale: 1; }
    .product-grid.reveal-ready .product-card { opacity: 0; transform: translateY(14px); transition: opacity .7s ease-out var(--reveal-delay, 0ms), transform .7s ease-out, box-shadow .3s ease; }
    .product-grid.reveal-ready .product-card.is-visible { opacity: 1; transform: translateY(0); }
    .product-grid.reveal-ready .product-card:nth-child(1) { --reveal-delay: 0ms; }
    .product-grid.reveal-ready .product-card:nth-child(2) { --reveal-delay: 90ms; }
    .product-grid.reveal-ready .product-card:nth-child(3) { --reveal-delay: 180ms; }
    .product-grid.reveal-ready .product-card:nth-child(4) { --reveal-delay: 270ms; }
    .product-grid.reveal-ready .product-card:nth-child(5) { --reveal-delay: 360ms; }
    .product-grid.reveal-ready .product-card:nth-child(6) { --reveal-delay: 450ms; }
  }
  @media (prefers-reduced-motion: reduce) {
    .artist-photo img { animation: none; }
    .hero::before, .hero::after { transition: none; }
    .product-detail-enter .product-detail-photo,
    .product-detail-enter .product-detail-copy { animation: none; }
  }
  @media (max-width: 820px) {
    .shell { width: min(100% - 40px, 620px); }
    .site-header { height: auto; min-height: 72px; padding: 12px 0; }
    .header-inner { flex-direction: column; gap: 12px; }
    .nav-links { position: static; max-width: 100%; font-size: 12px; transform: none; }
    .nav-links a { padding: 8px 17px; }
    .header-social { display: none; }
    .hero { min-height: auto; padding: 66px 0 62px; }
    .hero-grid { grid-template-columns: 1fr .82fr; gap: 26px; }
    .hero-art { height: 330px; }
    .hero h1 { font-size: clamp(39px, 6vw, 54px); }
    .section { padding: 76px 0; }
    .product-grid { gap: 32px 18px; }
    .quality-grid { gap: 10px; }
    .quality-card { grid-template-columns: 32px minmax(0, 1fr); gap: 9px; padding: 15px 12px; }
    .quality-icon { width: 32px; height: 32px; }
    .quality-card h3 { font-size: 14px; }
    .kiln-status-card { align-items: flex-start; flex-direction: column; gap: 22px; }
    .notify-form { flex-basis: auto; width: 100%; }
    .artist-grid { gap: 46px; }
    .contact-grid { gap: 32px; }
    .contact-form { padding: 23px; gap: 14px; }
    .product-detail-grid { gap: 34px; }
    .studio-updates-grid { gap: 13px; }
    .studio-update-copy { padding: 13px 14px 15px; }
  }
  @media (max-width: 600px) {
    .shell { width: calc(100% - 36px); }
    .site-header { height: auto; min-height: 70px; padding: 14px 0; }
    .header-inner { align-items: center; flex-direction: column; flex-wrap: nowrap; gap: 12px; }
    .wordmark { font-size: 21px; }
    .nav-links { order: initial; width: fit-content; justify-content: center; gap: 0; font-size: 11px; }
    .nav-links a { padding: 8px 14px; }
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
    .product-detail-main { padding: 38px 0 58px; }
    .product-detail-grid { grid-template-columns: 1fr; gap: 28px; }
    .product-detail-photo { width: min(100%, 430px); margin: 0 auto; }
    .product-detail-copy h1 { font-size: clamp(38px, 11vw, 52px); }
    .product-pairings { padding: 46px 0 58px; }
    .product-pairings-heading { align-items: flex-start; flex-direction: column; gap: 9px; }
    .product-pairing-grid { grid-template-columns: 1fr; gap: 12px; }
    .product-pairing-card { grid-template-columns: minmax(95px, .38fr) 1fr; }
    .product-pairing-card img { min-height: 118px; }
    .product-pairing-copy { padding: 13px; }
    .product-pairing-copy h3 { font-size: 17px; }
    .studio-updates-section { padding: 58px 0; }
    .studio-updates-heading { align-items: flex-start; flex-direction: column; gap: 10px; margin-bottom: 22px; }
    .studio-updates-grid { grid-template-columns: 1fr; gap: 15px; }
    .studio-update-card { display: grid; grid-template-columns: minmax(110px, .8fr) 1fr; }
    .studio-update-card img { height: 100%; aspect-ratio: auto; }
    .studio-update-copy { align-self: center; }
    .quality-section { padding: 28px 0 42px; }
    .quality-grid { grid-template-columns: 1fr; gap: 10px; }
    .quality-card { grid-template-columns: 38px minmax(0, 1fr); gap: 12px; padding: 14px 16px; }
    .quality-icon { width: 36px; height: 36px; }
    .quality-card h3 { font-size: 16px; }
    .kiln-status-section { padding: 34px 0 44px; }
    .kiln-status-card { gap: 19px; padding: 24px 19px; }
    .notify-form { grid-template-columns: minmax(0, 1fr); gap: 9px; }
    .notify-button { justify-self: start; }
    .artist-section { padding: 62px 0; }
    .artist-grid { grid-template-columns: 1fr; gap: 31px; }
    .artist-photo-wrap { max-width: 410px; width: calc(100% - 14px); margin: 0 auto; }
    .artist-copy { margin-left: 0; padding: 22px 0 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; -webkit-backdrop-filter: none; backdrop-filter: none; }
    .artist-note { right: -14px; }
    .artist-copy h2 { font-size: 42px; }
    .artist-copy p { font-size: 13px; }
    .story-overlay { display: block; padding: 10px; }
    .story-dialog { width: 100%; max-height: calc(100dvh - 20px); min-height: calc(100dvh - 20px); border-radius: 28px 12px 25px 11px / 15px 27px 14px 28px; }
    .story-dialog-inner { padding: 61px 22px 40px; }
    .story-close { top: 9px; width: 42px; height: 42px; margin: 9px 9px -51px auto; }
    .story-dialog h2 { font-size: clamp(36px, 10vw, 47px); }
    .story-dialog p { font-size: 14px; }
    .story-gallery { gap: 12px; margin-top: 27px; }
    .story-gallery figure:nth-child(2) { margin-top: 26px; }
    .studio-admin { padding-top: 20px; }
    .studio-admin .admin-shell { width: calc(100% - 32px); }
    .admin-topbar { margin-bottom: 36px; }
    .admin-heading { align-items: flex-start; flex-direction: column; }
    .admin-workspace { grid-template-columns: 1fr; }
    .admin-updates-workspace > .admin-inventory { padding: 18px; }
    .admin-product-row { grid-template-columns: 55px minmax(0, 1fr) auto; gap: 10px; }
    .admin-product-row img { width: 55px; height: 55px; }
    .admin-inventory, .admin-editor { padding: 18px; }
    .admin-metric { min-width: 0; flex: 1; padding: 14px; }
    .contact-section { padding: 61px 0; }
    .contact-grid { grid-template-columns: 1fr; gap: 32px; }
    .contact-photo-wrap { max-width: 390px; margin-top: 28px; }
    .maker-mark { width: 64px; height: 64px; font-size: 9px; }
    .maker-mark span:first-child { font-size: 10px; }
    .maker-mark span:last-child { font-size: 12px; }
    .contact-form { grid-template-columns: 1fr; }
    .form-field-wide, .form-status { grid-column: 1; }
    .contact-form { padding: 24px 20px; }
    .footer-inner { align-items: flex-start; flex-direction: column; gap: 14px; }
    .footer-links { gap: 16px; }
  }
  .storefront { color: #263a3e; font-size: 16px; }
  .storefront h1, .storefront h2, .storefront h3 { color: #20343a; font-weight: 500; }
  .storefront p:not(.eyebrow) { color: #3f4d4c; }
  .storefront .eyebrow { color: #873247; font-size: 11px; letter-spacing: .16em; }
  .header-social { color: #4f4b43; font-size: 11px; }
  .nav-links { color: #31474d; }
  .header-social-separator { color: #8e8171; }
  .hero-copy, .section-heading p, .product-details p, .artist-copy p,
  .contact-copy .contact-description, .kiln-status-description,
  .studio-updates-heading > p, .product-detail-description {
    color: #3d4b4a;
  }
  .hero-note, .product-detail-note, .contact-photo-caption,
  .story-gallery figcaption { color: #51483f; }
  .quality-card p, .product-pairings-heading > p,
  .studio-update-copy p:last-child {
    color: #494d47;
  }
  .product-details h3, .quality-card h3,
  .product-pairing-copy h3 { color: #263b40; font-weight: 500; }
  .price, .product-detail-price, .product-pairing-copy span { color: #643a2e; }
  .buy-link, .product-detail-back,
  .footer-shop { color: #20554d !important; font-weight: 600; }
  .footer-inner { color: #3c4e52; font-size: 12px; }
  .studio-update-category, .product-pairing-copy > p { color: #873f32; }
  .notify-status, .form-status { color: #673d30; }
  .form-field input::placeholder, .form-field textarea::placeholder,
  .notify-form input::placeholder { color: #5b5a52; opacity: 1; }
  .admin-login-card > p:not(.admin-kicker), .admin-heading p:not(.admin-kicker),
  .admin-product-info span, .admin-empty, .admin-panel-title span,
  .admin-update-notice, .admin-product-row p {
    color: #465655;
  }
  .admin-kicker, .admin-metric span { color: #843b35; }
  .admin-metric strong, .admin-product-info strong { color: #703d33; }
  .product-detail { color: #263a3e; font-size: 16px; }
  .product-detail h1, .product-detail h2, .product-detail h3 { color: #20343a; font-weight: 500; }
  .product-detail p:not(.eyebrow) { color: #3f4d4c; }
  .product-detail .eyebrow { color: #873247; font-size: 11px; letter-spacing: .16em; }
  .product-detail p.product-detail-price { color: #643a2e; font-size: 21px; font-weight: 500; }
  .product-detail p.product-detail-note { color: #51483f; }
  .product-detail .product-detail-back { color: #20554d !important; font-weight: 600; }
  .product-detail .product-pairing-copy > p { color: #873f32; }
  .product-detail .product-pairing-copy span { color: #643a2e; font-weight: 600; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
  }
`

function ClayDivider() {
  return (
    <div className="clay-divider" aria-hidden="true">
      <svg viewBox="0 0 1200 32" preserveAspectRatio="none">
        <path d="M0 17 C72 13 126 20 198 16 S322 12 402 17 529 20 603 15 727 11 801 16 929 21 1002 16 1128 12 1200 17" />
        <path d="M183 21 C218 19 248 22 279 20 M746 11 C777 9 809 11 838 10 M1030 21 C1060 19 1091 21 1120 19" />
      </svg>
    </div>
  )
}

function productSlug(product: Product) {
  return product.name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function getPairedProducts(product: Product, allProducts: Product[]) {
  const pairedSlugs = productPairings[productSlug(product)] ?? []
  const pairings = pairedSlugs
    .map((slug) => allProducts.find((item) => productSlug(item) === slug))
    .filter((item): item is Product => Boolean(item))

  return [
    ...pairings,
    ...allProducts.filter((item) =>
      productSlug(item) !== productSlug(product) &&
      !pairings.some((pairing) => productSlug(pairing) === productSlug(item)),
    ),
  ].slice(0, 2)
}

function ProductDetail({
  product,
  allProducts,
}: {
  product: Product | undefined
  allProducts: Product[]
}) {
  const pairedProducts = product ? getPairedProducts(product, allProducts) : []

  return (
    <div className="product-detail product-detail-enter">
      <style>{styles}</style>
      <header className="site-header product-detail-header">
        <div className="shell header-inner">
          <a className="wordmark" href="/#home" aria-label="SlippedCeramics home">
            <Palette className="wordmark-icon" size={22} strokeWidth={1.5} />
            <span>SlippedCeramics</span>
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="/#collection">Shop Collection</a>
            <a href="/#artist">Meet Kelly</a>
            <a href="/#contact">Contact</a>
          </nav>
          <div className="header-social" aria-label="Social and shop links">
            <a href="https://www.instagram.com/slippedceramics/" target="_blank" rel="noopener noreferrer">
              Instagram <span className="header-social-arrow" aria-hidden="true">↗</span>
            </a>
            <span className="header-social-separator" aria-hidden="true">/</span>
            <a href="https://www.tiktok.com/@slippedceramics" target="_blank" rel="noopener noreferrer">
              TikTok <span className="header-social-arrow" aria-hidden="true">↗</span>
            </a>
            <span className="header-social-separator" aria-hidden="true">/</span>
            <a href={shopUrl} target="_blank" rel="noopener noreferrer">
              Etsy <span className="header-social-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>
      {product ? (
        <>
        <main className="product-detail-main">
          <div className="shell product-detail-grid">
            <div className="product-detail-photo">
              <img src={product.image} alt={product.alt} />
            </div>
            <div className="product-detail-copy">
              <p className="eyebrow">MADE BY HAND IN NEWTOWN, CT</p>
              <h1>{product.name}</h1>
              <p className="product-detail-price">{product.price}</p>
              <p className="product-detail-description">{product.description}</p>
              <div className="product-detail-actions">
                <a className="button product-buy-button" href={shopUrl} target="_blank" rel="noopener noreferrer">
                  Bring this piece home <ArrowUpRight aria-hidden="true" />
                </a>
                <a className="product-detail-back" href="/#collection">Explore more pieces</a>
              </div>
              <p className="product-detail-note">{product.subtitle}</p>
            </div>
          </div>
        </main>
        {pairedProducts.length > 0 && (
          <section className="product-pairings" aria-labelledby="product-pairings-title">
            <div className="shell">
              <div className="product-pairings-heading">
                <div>
                  <p className="eyebrow">A lovely little pairing</p>
                  <h2 id="product-pairings-title">Goes beautifully with…</h2>
                </div>
                <p>Handmade pieces that feel right at home alongside this one.</p>
              </div>
              <div className="product-pairing-grid">
                {pairedProducts.map((pairedProduct) => (
                  <a
                    className="product-pairing-card"
                    href={`/piece/${productSlug(pairedProduct)}`}
                    key={productSlug(pairedProduct)}
                  >
                    <img src={pairedProduct.image} alt={pairedProduct.alt} loading="lazy" />
                    <div className="product-pairing-copy">
                      <p>Pair it with</p>
                      <h3>{pairedProduct.name}</h3>
                      <span>{pairedProduct.price}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
        </>
      ) : (
        <main className="product-detail-missing">
          <p className="eyebrow">A piece from another shelf?</p>
          <h1>This piece isn't in the current collection.</h1>
          <p>It may have found a home already. Browse the pieces Kelly has available now.</p>
          <a className="button" href="/#collection">Back to the collection</a>
        </main>
      )}
    </div>
  )
}

function StudioUpdatesGallery({
  updates,
  status,
}: {
  updates: StudioUpdate[]
  status: string
}) {
  return (
    <section className="studio-updates-section" aria-labelledby="studio-updates-title">
      <div className="shell">
        <div className="studio-updates-heading">
          <div>
            <p className="eyebrow">A peek at the workbench</p>
            <h2 id="studio-updates-title">Notes from the studio.</h2>
          </div>
          <p>Little in-between moments from Kelly’s studio, shared as they happen.</p>
        </div>
        {status ? (
          <p className="studio-updates-empty" role="alert">{status}</p>
        ) : updates.length ? (
          <div className="studio-updates-grid">
            {updates.map((update) => (
              <article className="studio-update-card" key={update.id}>
                <img src={update.image} alt={update.caption} loading="lazy" />
                <div className="studio-update-copy">
                  <p className="studio-update-category">{update.category}</p>
                  <p>{update.caption}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="studio-updates-empty">
            The studio is quiet for a moment. Kelly’s next little update will find its way here.
          </p>
        )}
      </div>
    </section>
  )
}

function StudioAdmin({
  inventory,
  onInventoryChange,
  catalogStatus,
}: {
  inventory: Product[]
  onInventoryChange: (inventory: Product[]) => boolean
  catalogStatus: string
}) {
  const [unlocked, setUnlocked] = useState(false)
  const [previewPassword, setPreviewPassword] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<Product>({
    name: '',
    price: '',
    image: '',
    alt: '',
    description: '',
    subtitle: '',
  })
  const [studioUpdatesState, setStudioUpdatesState] = useState(getStudioUpdatesState)
  const { updates, status: updateStatus } = studioUpdatesState
  const [postingUpdate, setPostingUpdate] = useState(false)

  function setUpdateStatus(status: string) {
    setStudioUpdatesState((current) => ({ ...current, status }))
  }

  useEffect(() => {
    function syncUpdates(event: StorageEvent) {
      if (event.key !== studioUpdatesStorageKey) return
      setStudioUpdatesState(getStudioUpdatesState())
    }

    window.addEventListener('storage', syncUpdates)
    return () => window.removeEventListener('storage', syncUpdates)
  }, [])

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setUnlocked(true)
  }

  function resetDraft() {
    setDraft({ name: '', price: '', image: '', alt: '', description: '', subtitle: '' })
    setEditingIndex(null)
  }

  function handleProductSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedDraft = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      subtitle: draft.subtitle.trim(),
    }
    if (editingIndex === null) {
      if (onInventoryChange([...inventory, normalizedDraft])) resetDraft()
    } else {
      if (onInventoryChange(
        inventory.map((product, index) => index === editingIndex ? normalizedDraft : product),
      )) resetDraft()
    }
  }

  function editProduct(index: number) {
    setDraft(inventory[index])
    setEditingIndex(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteProduct(index: number) {
    if (onInventoryChange(inventory.filter((_, productIndex) => productIndex !== index))) {
      if (editingIndex === index) resetDraft()
    }
  }

  async function handleStudioUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const photo = formData.get('photo')
    if (!(photo instanceof File) || photo.size === 0) {
      setUpdateStatus('Choose a photo from your device before posting.')
      return
    }

    setPostingUpdate(true)
    setUpdateStatus('')
    try {
      const image = await prepareStudioPhoto(photo)
      const nextUpdates = [{
        id: crypto.randomUUID(),
        caption: String(formData.get('caption')).trim(),
        category: String(formData.get('category')),
        image,
        postedAt: new Date().toISOString(),
      }, ...updates].slice(0, maxStudioUpdates)
      window.localStorage.setItem(studioUpdatesStorageKey, JSON.stringify(nextUpdates))
      setStudioUpdatesState({ updates: nextUpdates, status: 'Your studio note is posted on this browser.' })
      form.reset()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save the studio note.'
      setStudioUpdatesState((current) => ({
        ...current,
        status: `${message} Check this browser’s available storage and try again.`,
      }))
    } finally {
      setPostingUpdate(false)
    }
  }

  function deleteStudioUpdate(updateId: string) {
    const nextUpdates = updates.filter((update) => update.id !== updateId)
    try {
      window.localStorage.setItem(studioUpdatesStorageKey, JSON.stringify(nextUpdates))
      setStudioUpdatesState({ updates: nextUpdates, status: 'Studio note removed.' })
    } catch (error) {
      setStudioUpdatesState((current) => ({
        ...current,
        status: error instanceof Error ? error.message : 'Could not remove the studio note.',
      }))
    }
  }

  return (
    <div className="studio-admin">
      <style>{styles}</style>
      <div className="admin-shell">
        <header className="admin-topbar">
          <a className="admin-wordmark" href="/" aria-label="Return to SlippedCeramics">
            <Palette size={22} strokeWidth={1.5} aria-hidden="true" />
            <span>SlippedCeramics</span>
            <span aria-hidden="true">/</span>
            <span>Studio</span>
          </a>
          <a className="admin-back" href="/">Back to the shop</a>
        </header>

        {!unlocked ? (
          <main className="admin-login-wrap">
            <section className="admin-login-card" aria-labelledby="studio-login-title">
              <div className="admin-login-icon">
                <LockKeyhole aria-hidden="true" />
              </div>
              <p className="admin-kicker">A little room of your own</p>
              <h1 id="studio-login-title">Welcome to the studio.</h1>
              <p>
                A private-feeling preview of the place to tend to your collection,
                update pieces, and get ready for what comes next.
              </p>
              <form className="admin-login-form" onSubmit={handleLogin}>
                <label htmlFor="studio-preview-password">Preview passphrase</label>
                <input
                  id="studio-preview-password"
                  type="password"
                  autoComplete="current-password"
                  value={previewPassword}
                  onChange={(event) => setPreviewPassword(event.target.value)}
                  required
                />
                <button className="admin-primary" type="submit">
                  Enter the studio
                  <ArrowUpRight aria-hidden="true" />
                </button>
              </form>
              <p className="admin-notice">
                Prototype only: this passphrase is not checked, this page is not
                secure, and any product edits reset when you leave or refresh.
              </p>
            </section>
          </main>
        ) : (
          <main>
            <div className="admin-heading">
              <div>
                <p className="admin-kicker">Your little corner of the internet</p>
                <h1>Studio shelf.</h1>
                <p>Shape your collection, one lovely piece at a time.</p>
              </div>
              <button
                className="admin-secondary"
                type="button"
                onClick={() => setUnlocked(false)}
              >
                Leave studio
              </button>
            </div>

            <div className="admin-metrics" aria-label="Collection summary">
              <div className="admin-metric">
                <strong>{inventory.length}</strong>
                <span>pieces on the shelf</span>
              </div>
              <div className="admin-metric">
                <strong>Small batch</strong>
                <span>always handmade</span>
              </div>
            </div>

            <div className="admin-workspace">
              <section className="admin-inventory" aria-labelledby="inventory-title">
                <div className="admin-panel-title">
                  <h2 id="inventory-title">Current collection</h2>
                  <span>{inventory.length} pieces</span>
                </div>
                {inventory.length ? (
                  <div className="admin-product-list">
                    {inventory.map((product, index) => (
                      <article className="admin-product-row" key={`${product.name}-${index}`}>
                        <img src={product.image} alt={product.alt} />
                        <div className="admin-product-info">
                          <strong>{product.name}</strong>
                          <span>{product.price}</span>
                          <span>{product.subtitle}</span>
                        </div>
                        <div className="admin-row-actions">
                          <button
                            className="admin-icon-button"
                            type="button"
                            onClick={() => editProduct(index)}
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil aria-hidden="true" />
                          </button>
                          <button
                            className="admin-icon-button delete"
                            type="button"
                            onClick={() => deleteProduct(index)}
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 aria-hidden="true" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="admin-empty">Your shelf is ready for its first piece.</p>
                )}
              </section>

              <section className="admin-editor" aria-labelledby="product-editor-title">
                <form className="admin-product-form" onSubmit={handleProductSave}>
                  <h2 id="product-editor-title">
                    {editingIndex === null ? 'Add a piece' : 'Edit this piece'}
                  </h2>
                  <label htmlFor="product-name">Piece name</label>
                  <input
                    id="product-name"
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    required
                  />
                  <label htmlFor="product-price">Price or listing note</label>
                  <input
                    id="product-price"
                    placeholder="$48.00"
                    value={draft.price}
                    onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                    required
                  />
                  <label htmlFor="product-image">Image path or URL</label>
                  <input
                    id="product-image"
                    placeholder="/products/blue-mug.webp"
                    value={draft.image}
                    onChange={(event) => setDraft({ ...draft, image: event.target.value })}
                    required
                  />
                  <label htmlFor="product-alt">Image description</label>
                  <input
                    id="product-alt"
                    value={draft.alt}
                    onChange={(event) => setDraft({ ...draft, alt: event.target.value })}
                    required
                  />
                  <label htmlFor="product-description">Product description</label>
                  <textarea
                    id="product-description"
                    value={draft.description}
                    onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                    required
                  />
                  <label htmlFor="product-subtitle">Product subtext</label>
                  <input
                    id="product-subtitle"
                    value={draft.subtitle}
                    onChange={(event) => setDraft({ ...draft, subtitle: event.target.value })}
                    placeholder="A short note shown beneath the description"
                    required
                  />
                  <div className="admin-form-actions">
                    <button className="admin-primary" type="submit">
                      {editingIndex === null ? <Plus aria-hidden="true" /> : <Pencil aria-hidden="true" />}
                      {editingIndex === null ? 'Add to shelf' : 'Save changes'}
                    </button>
                    {editingIndex !== null && (
                      <button className="admin-secondary" type="button" onClick={resetDraft}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </div>
            <section className="admin-updates-workspace" aria-labelledby="studio-updates-admin-title">
              <div className="admin-inventory">
                <div className="admin-panel-title">
                  <h2 id="studio-updates-admin-title">Notes from the workbench</h2>
                  <span>{updates.length} / {maxStudioUpdates} posts</span>
                </div>
                <form className="admin-update-composer" onSubmit={handleStudioUpdateSubmit}>
                  <h3>Share a fresh little moment</h3>
                  <label htmlFor="studio-update-photo">Phone snap</label>
                  <input
                    id="studio-update-photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    required
                  />
                  <label htmlFor="studio-update-category">What’s on the bench?</label>
                  <select id="studio-update-category" name="category" defaultValue="Fresh greenware">
                    <option>Fresh greenware</option>
                    <option>Clay delivery</option>
                    <option>Glaze testing</option>
                    <option>From the workbench</option>
                  </select>
                  <label htmlFor="studio-update-caption">A quick note</label>
                  <textarea
                    id="studio-update-caption"
                    name="caption"
                    placeholder="A few words about this little studio moment..."
                    maxLength={180}
                    required
                  />
                  <button className="admin-primary" type="submit" disabled={postingUpdate}>
                    <Plus aria-hidden="true" />
                    {postingUpdate ? 'Preparing photo...' : 'Post studio note'}
                  </button>
                  <p className="admin-update-notice">
                    Photos are resized and saved in this browser only. Up to {maxStudioUpdates} notes appear on the shop when opened in this same browser.
                  </p>
                  {updateStatus && <p className="admin-update-notice" role="status">{updateStatus}</p>}
                </form>
                {updates.length ? (
                  <div className="admin-update-list">
                    {updates.map((update) => (
                      <article className="admin-update-row" key={update.id}>
                        <img src={update.image} alt="" />
                        <p><strong>{update.category}</strong><br />{update.caption}</p>
                        <button
                          className="admin-icon-button delete"
                          type="button"
                          onClick={() => deleteStudioUpdate(update.id)}
                          aria-label={`Remove studio note: ${update.caption}`}
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="admin-empty">The workbench board is ready for its first snap.</p>
                )}
              </div>
            </section>
            {catalogStatus && <p className="admin-notice" role="alert">{catalogStatus}</p>}
            <p className="admin-notice">
              Preview mode: the page is not protected by real authentication, and
              product listings and studio notes are saved only in this browser
              and are not shared with other visitors.
            </p>
          </main>
        )}
      </div>
    </div>
  )
}

function App() {
  const [formStatus, setFormStatus] = useState('')
  const [notifyStatus, setNotifyStatus] = useState('')
  const [storyOpen, setStoryOpen] = useState(false)
  const [logoTwirling, setLogoTwirling] = useState(false)
  const [catalogState, setCatalogState] = useState(getCatalogState)
  const { catalog, status: catalogStatus } = catalogState
  const [studioUpdatesState, setStudioUpdatesState] = useState(getStudioUpdatesState)
  const productGridRef = useRef<HTMLDivElement>(null)
  const storyTriggerRef = useRef<HTMLButtonElement>(null)
  const storyCloseRef = useRef<HTMLButtonElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const logoTwirlTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const hero = heroRef.current
    if (hero === null) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handleHeroMouseMove = (event: MouseEvent) => {
      const bounds = hero.getBoundingClientRect()
      const horizontalPosition = (event.clientX - bounds.left) / bounds.width
      const verticalPosition = (event.clientY - bounds.top) / bounds.height
      const shiftX = (0.5 - horizontalPosition) * 32
      const shiftY = (0.5 - verticalPosition) * 24
      hero.style.setProperty('--blob-x', `${shiftX}px`)
      hero.style.setProperty('--blob-y', `${shiftY}px`)
    }

    const resetHeroBlobs = () => {
      hero.style.removeProperty('--blob-x')
      hero.style.removeProperty('--blob-y')
    }

    hero.addEventListener('mousemove', handleHeroMouseMove)
    hero.addEventListener('mouseleave', resetHeroBlobs)
    return () => {
      hero.removeEventListener('mousemove', handleHeroMouseMove)
      hero.removeEventListener('mouseleave', resetHeroBlobs)
      resetHeroBlobs()
    }
  }, [])

  useEffect(() => {
    function syncStorage(event: StorageEvent) {
      if (event.key === studioUpdatesStorageKey) {
        setStudioUpdatesState(getStudioUpdatesState())
      }
      if (event.key === catalogStorageKey) {
        setCatalogState(getCatalogState())
      }
    }

    window.addEventListener('storage', syncStorage)
    return () => window.removeEventListener('storage', syncStorage)
  }, [])

  function updateCatalog(nextCatalog: Product[]) {
    try {
      window.localStorage.setItem(catalogStorageKey, JSON.stringify(nextCatalog))
      setCatalogState({ catalog: nextCatalog, status: '' })
      return true
    } catch (error) {
      setCatalogState((current) => ({
        ...current,
        status: error instanceof Error
          ? `Could not save product listings: ${error.message}`
          : 'Could not save product listings in this browser.',
      }))
      return false
    }
  }

  useEffect(() => () => {
    if (logoTwirlTimeoutRef.current !== undefined) {
      window.clearTimeout(logoTwirlTimeoutRef.current)
    }
  }, [])

  function handleWordmarkClick() {
    setLogoTwirling(false)
    window.requestAnimationFrame(() => {
      setLogoTwirling(true)
      if (logoTwirlTimeoutRef.current !== undefined) {
        window.clearTimeout(logoTwirlTimeoutRef.current)
      }
      logoTwirlTimeoutRef.current = window.setTimeout(() => {
        setLogoTwirling(false)
        logoTwirlTimeoutRef.current = undefined
      }, 1050)
    })
  }

  useEffect(() => {
    if (!storyOpen) return

    const trigger = storyTriggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    storyCloseRef.current?.focus()

    function handleStoryKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setStoryOpen(false)
        return
      }

      if (event.key === 'Tab') {
        event.preventDefault()
        storyCloseRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleStoryKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleStoryKeyDown)
      trigger?.focus()
    }
  }, [storyOpen])

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return

    const badges = document.querySelectorAll<HTMLElement>('.studio-badge')
    let frame = 0

    function updateBadgePositions() {
      frame = 0
      const viewportCenter = window.innerHeight / 2
      badges.forEach((badge) => {
        const bounds = badge.getBoundingClientRect()
        const distanceFromCenter = viewportCenter - (bounds.top + bounds.height / 2)
        const offset = Math.max(-22, Math.min(22, distanceFromCenter * 0.08))
        badge.style.setProperty('--badge-scroll-y', `${offset}px`)
      })
    }

    function scheduleBadgeUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateBadgePositions)
    }

    updateBadgePositions()
    window.addEventListener('scroll', scheduleBadgeUpdate, { passive: true })
    window.addEventListener('resize', scheduleBadgeUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleBadgeUpdate)
      window.removeEventListener('resize', scheduleBadgeUpdate)
      if (frame) window.cancelAnimationFrame(frame)
      badges.forEach((badge) => badge.style.removeProperty('--badge-scroll-y'))
    }
  }, [])

  useEffect(() => {
    const grid = productGridRef.current
    if (
      !grid ||
      !('IntersectionObserver' in window) ||
      !window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    ) return

    const cards = grid.querySelectorAll('.product-card')
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            cardObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    const storefront = grid.closest('.storefront')
    const badges = storefront?.querySelectorAll('.studio-badge')
    const badgeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
        })
      },
      { threshold: 0.25 },
    )

    grid.classList.add('reveal-ready')
    cards.forEach((card) => cardObserver.observe(card))
    storefront?.classList.add('badges-reveal-ready')
    badges?.forEach((badge) => badgeObserver.observe(badge))

    return () => {
      cardObserver.disconnect()
      badgeObserver.disconnect()
    }
  }, [])

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus(
      'Your message has not been sent. The contact form is not connected yet.',
    )
  }

  function handleNotifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotifyStatus(
      'Email notifications are not connected yet. Please check back for the next kiln drop.',
    )
  }

  if (window.location.pathname === '/studio') {
    return (
      <StudioAdmin
        inventory={catalog}
        onInventoryChange={updateCatalog}
        catalogStatus={catalogStatus}
      />
    )
  }

  const productPath = window.location.pathname.match(/^\/piece\/([^/]+)\/?$/)
  if (productPath) {
    const slug = decodeURIComponent(productPath[1])
    return (
      <ProductDetail
        product={catalog.find((product) => productSlug(product) === slug)}
        allProducts={catalog}
      />
    )
  }

  return (
    <div className="storefront">
      <style>{styles}</style>

      <header className="site-header">
        <div className="shell header-inner">
          <a
            className={`wordmark${logoTwirling ? ' logo-twirling' : ''}`}
            href="#home"
            aria-label="SlippedCeramics home"
            onClick={handleWordmarkClick}
          >
            <Palette className="wordmark-icon" size={22} strokeWidth={1.5} />
            <span>SlippedCeramics</span>
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#collection">Shop Collection</a>
            <a href="#artist">Meet Kelly</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="header-social" aria-label="Social and shop links">
            <a href="https://www.instagram.com/slippedceramics/" target="_blank" rel="noopener noreferrer">
              Instagram <span className="header-social-arrow" aria-hidden="true">↗</span>
            </a>
            <span className="header-social-separator" aria-hidden="true">/</span>
            <a href="https://www.tiktok.com/@slippedceramics" target="_blank" rel="noopener noreferrer">
              TikTok <span className="header-social-arrow" aria-hidden="true">↗</span>
            </a>
            <span className="header-social-separator" aria-hidden="true">/</span>
            <a href={shopUrl} target="_blank" rel="noopener noreferrer">
              Etsy <span className="header-social-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home" ref={heroRef}>
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
              <div className="hero-stamp studio-badge">made<br />with care</div>
              <div className="hero-caption">
                <Coffee aria-hidden="true" />
                <span>A little everyday lovely</span>
              </div>
            </div>
          </div>
        </section>

        <ClayDivider />

        <section className="section" id="collection">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Kelly's current collection</p>
                <h2>One of a kind, made by hand.</h2>
              </div>
              <p>Explore the pieces currently available, each shaped and finished by hand.</p>
            </div>
            <div className="product-grid" ref={productGridRef}>
              {catalog.map((product) => (
                <article className="product-card" key={product.name}>
                  <a
                    className="product-image"
                    href={`/piece/${productSlug(product)}`}
                    aria-label={`View ${product.name} in Kelly's shop`}
                  >
                    <img src={product.image} alt={product.alt} loading="lazy" />
                  </a>
                  <div className="product-details">
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.subtitle}</p>
                    </div>
                    <span className="price">{product.price}</span>
                  </div>
                  <a className="buy-link" href={`/piece/${productSlug(product)}`}>
                    Read about this piece
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <StudioUpdatesGallery updates={studioUpdatesState.updates} status={studioUpdatesState.status} />

        <section className="kiln-status-section" aria-labelledby="kiln-status-title">
          <div className="shell">
            <div className="kiln-status-card">
              <div className="kiln-status-copy">
                <p className="eyebrow">STUDIO STATUS</p>
                <h2 id="kiln-status-title">Firing Batch 05</h2>
                <p className="kiln-status-description">
                  The kiln is cooling. New one-of-a-kind pieces dropping soon.
                </p>
              </div>
              <form className="notify-form" onSubmit={handleNotifySubmit}>
                <label className="visually-hidden" htmlFor="notify-email">Email address</label>
                <input
                  id="notify-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  required
                />
                <button className="notify-button" type="submit">Notify Me</button>
                {notifyStatus && (
                  <p className="notify-status" role="status">{notifyStatus}</p>
                )}
              </form>
            </div>
          </div>
        </section>

        <section className="quality-section" aria-label="Everyday quality">
          <div className="shell">
            <p className="eyebrow quality-eyebrow">Everyday Quality</p>
            <div className="quality-grid">
              <article className="quality-card">
                <span className="quality-icon"><ShieldCheck aria-hidden="true" /></span>
                <div>
                  <h3>Food &amp; Dishwasher Safe</h3>
                  <p>Cone 6 vitrified stoneware</p>
                </div>
              </article>
              <article className="quality-card">
                <span className="quality-icon"><Hand aria-hidden="true" /></span>
                <div>
                  <h3>Hand-Thrown in CT</h3>
                  <p>Small-batch, one-of-a-kind</p>
                </div>
              </article>
              <article className="quality-card">
                <span className="quality-icon"><Heart aria-hidden="true" /></span>
                <div>
                  <h3>Slow Living Daily Ware</h3>
                  <p>Ergonomic handles &amp; heat retention</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="artist-section" id="artist">
          <div className="shell artist-grid">
            <div className="artist-photo-wrap">
              <div className="artist-photo">
                <img
                  src={products[5].image}
                  alt="Kelly's handmade blue-glazed cups on a studio worktable with shelves in the background"
                  loading="lazy"
                />
              </div>
              <div className="artist-note studio-badge">A little clay, a lot of heart</div>
            </div>
            <div className="artist-copy">
              <p className="eyebrow">MEET THE MAKER</p>
              <h2>From Raw Earth to Morning Rituals.</h2>
              <p>
                What started as an outlet for quiet, tactile creation quickly
                evolved into Slipped Ceramics. Kelly crafts small-batch,
                wheel-thrown stoneware designed to bring warmth and slow
                intention to everyday spaces.
              </p>
              <button
                ref={storyTriggerRef}
                className="artist-story-trigger"
                type="button"
                onClick={() => setStoryOpen(true)}
                aria-haspopup="dialog"
              >
                Read Kelly&apos;s Full Story
                <ArrowUpRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {storyOpen && (
          <div
            className="story-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) setStoryOpen(false)
            }}
          >
            <section
              className="story-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="story-title"
              aria-describedby="story-introduction"
              tabIndex={-1}
            >
              <button
                ref={storyCloseRef}
                className="story-close"
                type="button"
                onClick={() => setStoryOpen(false)}
                aria-label="Close Kelly's story"
              >
                <X aria-hidden="true" />
              </button>
              <div className="story-dialog-inner">
                <p className="eyebrow">A little about the hands behind the clay</p>
                <h2 id="story-title">Hands in Clay: The Story of Slipped Ceramics</h2>
                <p id="story-introduction">
                  Hi, I’m Kelly Wasko, an American ceramic artist creating in
                  Newtown, Connecticut. Slipped Ceramics grew from a love of the
                  quiet rhythm of the wheel and the everyday rituals that make
                  a handmade piece feel at home.
                </p>

                <h3>A quieter kind of beginning</h3>
                <p>
                  I first sat down at a pottery wheel looking for something
                  tangible and meditative to balance the busy pace of daily
                  routines. I found myself drawn to the feel of cool, yielding
                  clay—and to the way it never behaves quite the same way twice.
                  Glaze adds another layer of surprise: color shifts, settles,
                  and responds to the heat in ways that make every firing its
                  own small discovery.
                </p>

                <h3>Made slowly, meant to be lived with</h3>
                <p>
                  I make stoneware in small batches, shaping and finishing each
                  piece by hand. Finger ridges, soft variations, and the
                  occasional gentle glaze drip are part of the story, not flaws
                  to erase. I’m drawn to the individual character that comes
                  from making slowly, rather than the sameness of factory
                  perfection.
                </p>

                <div className="story-gallery">
                  <figure>
                    <img
                      src={products[5].image}
                      alt="Handmade blue-glazed cups arranged on a wooden studio worktable"
                      loading="lazy"
                    />
                    <figcaption>Finished pieces resting on the studio worktable.</figcaption>
                  </figure>
                  <figure>
                    <img
                      src={products[2].image}
                      alt="Handmade speckled ceramic bowl with a soft green rim, photographed outdoors"
                      loading="lazy"
                    />
                    <figcaption>A one-of-a-kind piece, shaped and glazed by hand.</figcaption>
                  </figure>
                </div>

                <h3>Studio life in Connecticut</h3>
                <p>
                  My studio nook is a little pocket of focus within a full family
                  life in Newtown. I love imagining a quiet morning mug finding
                  its place on someone’s breakfast table, becoming part of the
                  familiar, ordinary moments that make a home. That’s what keeps
                  me coming back to the wheel: making useful objects with care,
                  and sending a little piece of that slower rhythm out into the
                  world.
                </p>
                <p className="story-signoff">With muddy hands and a grateful heart, Kelly</p>
              </div>
            </section>
          </div>
        )}

        <section className="contact-section" id="contact">
          <div className="shell contact-grid">
            <div className="contact-copy">
              <div className="contact-intro">
                <div className="contact-heading-row">
                  <p className="eyebrow">DIRECT FROM THE BENCH</p>
                  <div className="maker-mark studio-badge" aria-hidden="true">
                    <span>handmade</span>
                    <span>✳</span>
                    <span>with care</span>
                  </div>
                </div>
                <h2>Let’s shape something together.</h2>
                <p className="contact-description">
                  Whether you have a custom piece in mind, a question about a
                  glaze, or just want to talk shop—Kelly is always happy to pull
                  up another stool at the wheel.
                </p>
              </div>
              <figure className="contact-photo-wrap">
                <div className="contact-photo">
                  <img
                    src={products[3].image}
                    alt="Hand holding Kelly's cream stoneware tumbler with carved lines and blueberry details"
                    loading="lazy"
                  />
                </div>
                <figcaption className="contact-photo-caption">
                  <span>One of a kind, made slowly</span>
                  <span>Newtown, Connecticut</span>
                </figcaption>
              </figure>
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
              <button className="button contact-submit" type="submit">Send to the Studio</button>
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
