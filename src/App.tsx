import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  Coffee,
  ExternalLink,
  LockKeyhole,
  Palette,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

const shopUrl = 'https://www.etsy.com/shop/SlippedCeramics'

type Product = {
  name: string
  price: string
  image: string
  alt: string
}

const products: Product[] = [
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
  .header-inner { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
  .wordmark { display: inline-flex; align-items: center; gap: 10px; color: #293e48; font-family: 'Playfair Display', Georgia, serif; font-size: 23px; letter-spacing: -.6px; white-space: nowrap; }
  .wordmark-icon { color: #c45e69; }
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
  .product-card { position: relative; isolation: isolate; border-radius: 5px; transition: transform .7s ease-out, box-shadow .3s ease; }
  .product-card::before { position: absolute; z-index: -1; inset: -12px; border-radius: 10px; background: #fffdf9; box-shadow: 0 12px 26px rgba(67,60,54,.11); content: ''; opacity: 0; transform: scale(.97); transition: opacity .3s ease, transform .45s cubic-bezier(.2,.7,.2,1); }
  .product-card:hover { z-index: 1; transform: translateY(-4px); }
  .product-card:hover::before { opacity: 1; transform: scale(1); }
  .product-image { display: block; aspect-ratio: 1; overflow: hidden; background: #eee8e2; border-radius: 5px; transition: transform .35s ease-out; }
  .product-card:hover .product-image { transform: scale(.96); }
  .product-image img { height: 100%; transition: transform .7s ease-out; }
  .product-card:hover .product-image img { transform: scale(1.03); }
  .product-details { display: flex; align-items: start; justify-content: space-between; gap: 12px; padding: 15px 0 9px; transition: padding .35s ease-out; }
  .product-card:hover .product-details { padding-inline: 8px; }
  .product-details h3 { margin: 0 0 5px; font-size: 19px; line-height: 1.3; }
  .product-details p { margin: 0; color: #56696f; font-size: 12px; }
  .price { padding-top: 3px; color: #293e48; font-size: 13px; font-weight: 600; white-space: nowrap; }
  .buy-link { display: inline-flex; align-items: center; gap: 7px; color: #28635d !important; font-size: 11px; font-weight: 600; letter-spacing: .02em; }
  .buy-link { margin-left: 0; transition: margin-left .35s ease-out, color .2s ease; }
  .product-card:hover .buy-link { margin-left: 8px; }
  .buy-link svg { width: 13px; height: 13px; transition: transform .3s ease; }
  .product-card:hover .buy-link svg, .buy-link:hover svg { transform: translate(.125rem, -.125rem); }
  .buy-link:hover { color: #a43c56 !important; }
  .artist-section { padding: 86px 0; background: #f7eddc; }
  .artist-grid { display: grid; grid-template-columns: .95fr 1fr; align-items: center; gap: clamp(42px, 8vw, 96px); }
  .artist-photo-wrap { position: relative; width: min(100%, 450px); }
  .artist-photo { aspect-ratio: 1 / 1.08; overflow: hidden; border: 7px solid rgba(255,250,240,.68); border-radius: 48% 48% 13px 13px; background: #a98d73; box-shadow: 0 18px 42px rgba(94,65,45,.14); }
  .artist-photo img { height: 100%; object-position: center; transition: transform .7s cubic-bezier(.2,.7,.2,1); }
  .artist-photo-wrap:hover img { transform: scale(1.035); }
  .artist-note { position: absolute; right: -18px; bottom: 22px; padding: 13px 18px; background: #fffdf9; color: #75434d; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-style: italic; box-shadow: 0 8px 24px rgba(65, 56, 49, .12); transform: rotate(-2deg); }
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
  .story-close { position: sticky; z-index: 2; top: 18px; float: right; width: 46px; height: 46px; display: grid; place-items: center; margin: 16px 16px -62px 0; border: 1px solid rgba(114,68,47,.24); border-radius: 47% 53% 50% 45% / 52% 46% 54% 48%; background: rgba(255,253,249,.9); color: #4a4740; cursor: pointer; transition: background-color .2s, transform .2s; }
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
  .admin-login-form input, .admin-product-form input { width: 100%; min-height: 46px; padding: 11px 13px; border: 1px solid #d1bba2; border-radius: 14px 5px 15px 5px / 6px 14px 5px 13px; background: #fffdf9; color: #293e48; font: 14px 'DM Sans', sans-serif; }
  .admin-login-form input:focus, .admin-product-form input:focus { border-color: #bc6655; outline: 3px solid rgba(188,102,85,.2); outline-offset: 2px; }
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
  .admin-product-info span { color: #758083; font-size: 11px; }
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
  .contact-form { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: clamp(23px, 3.2vw, 38px); border: 1px solid rgba(135,95,68,.18); border-radius: 38px 13px 34px 15px / 24px 37px 18px 31px; background: radial-gradient(rgba(117,76,53,.11) .65px, transparent .85px) 0 0 / 19px 19px, radial-gradient(rgba(255,255,255,.68), transparent 72%), #f5ead9; box-shadow: 0 20px 50px rgba(94,65,45,.12), inset 0 1px rgba(255,255,255,.72); }
  .form-field { display: grid; gap: 7px; }
  .form-field-wide { grid-column: 1 / -1; }
  .form-field label { color: #4b463d; font-size: 12px; font-weight: 600; }
  .form-field input, .form-field textarea { width: 100%; min-height: 47px; border: 1px solid #c6aa8e; border-radius: 16px 5px 17px 6px / 6px 17px 5px 16px; padding: 12px 14px; background: rgba(255,252,245,.82); color: #293e48; font: 14px 'DM Sans', sans-serif; transition: border-color .2s, box-shadow .2s, background .2s; }
  .form-field input:focus, .form-field textarea:focus { border-color: #8a6045; outline: 3px solid rgba(138,96,69,.28); outline-offset: 2px; background: #fffdf8; }
  .form-field textarea { min-height: 142px; resize: vertical; border-radius: 17px 6px 20px 5px / 7px 18px 6px 17px; }
  .contact-submit { position: relative; isolation: isolate; justify-self: start; overflow: hidden; min-height: 50px; border: 1px solid #704b39; border-radius: 19px 7px 17px 6px / 7px 18px 6px 17px; background: #31594f; color: #fff8ed !important; cursor: pointer; transition: transform .3s ease, box-shadow .3s ease, background-color .3s ease, border-color .3s ease; }
  .contact-submit::before { position: absolute; z-index: -1; top: -125%; left: -18%; width: 136%; height: 150%; border-radius: 48%; background: #a6654a; content: ''; opacity: .86; transform: translateY(70%) rotate(-7deg); transition: transform .42s cubic-bezier(.2,.7,.2,1); }
  .contact-submit:hover { border-color: #704b39; background: #31594f; box-shadow: 0 8px 18px rgba(79,55,40,.2); transform: translateY(-2px); }
  .contact-submit:hover::before { transform: translateY(20%) rotate(2deg); }
  .contact-submit:active { transition-duration: .15s; transform: translateY(1px) scale(.98); box-shadow: 0 2px 7px rgba(79,55,40,.18); }
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
    .product-grid.reveal-ready .product-card.is-visible:hover { transform: translateY(-4px); }
    .product-grid.reveal-ready .product-card:nth-child(1) { --reveal-delay: 0ms; }
    .product-grid.reveal-ready .product-card:nth-child(2) { --reveal-delay: 90ms; }
    .product-grid.reveal-ready .product-card:nth-child(3) { --reveal-delay: 180ms; }
    .product-grid.reveal-ready .product-card:nth-child(4) { --reveal-delay: 270ms; }
    .product-grid.reveal-ready .product-card:nth-child(5) { --reveal-delay: 360ms; }
    .product-grid.reveal-ready .product-card:nth-child(6) { --reveal-delay: 450ms; }
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
    .artist-grid { gap: 46px; }
    .contact-grid { gap: 32px; }
    .contact-form { padding: 23px; gap: 14px; }
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
    .artist-section { padding: 62px 0; }
    .artist-grid { grid-template-columns: 1fr; gap: 31px; }
    .artist-photo-wrap { max-width: 410px; width: calc(100% - 14px); margin: 0 auto; }
    .artist-note { right: -14px; }
    .artist-copy h2 { font-size: 42px; }
    .artist-copy p { font-size: 13px; }
    .story-overlay { display: block; padding: 10px; }
    .story-dialog { width: 100%; max-height: calc(100dvh - 20px); min-height: calc(100dvh - 20px); border-radius: 28px 12px 25px 11px / 15px 27px 14px 28px; }
    .story-dialog-inner { padding: 61px 22px 40px; }
    .story-close { position: sticky; top: 9px; width: 42px; height: 42px; margin: 9px 9px -51px 0; }
    .story-dialog h2 { font-size: clamp(36px, 10vw, 47px); }
    .story-dialog p { font-size: 14px; }
    .story-gallery { gap: 12px; margin-top: 27px; }
    .story-gallery figure:nth-child(2) { margin-top: 26px; }
    .studio-admin { padding-top: 20px; }
    .studio-admin .admin-shell { width: calc(100% - 32px); }
    .admin-topbar { margin-bottom: 36px; }
    .admin-heading { align-items: flex-start; flex-direction: column; }
    .admin-workspace { grid-template-columns: 1fr; }
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
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
  }
`

function StudioAdmin({
  inventory,
  onInventoryChange,
}: {
  inventory: Product[]
  onInventoryChange: (inventory: Product[]) => void
}) {
  const [unlocked, setUnlocked] = useState(false)
  const [previewPassword, setPreviewPassword] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<Product>({
    name: '',
    price: '',
    image: '',
    alt: '',
  })

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setUnlocked(true)
  }

  function resetDraft() {
    setDraft({ name: '', price: '', image: '', alt: '' })
    setEditingIndex(null)
  }

  function handleProductSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (editingIndex === null) {
      onInventoryChange([...inventory, draft])
    } else {
      onInventoryChange(
        inventory.map((product, index) => index === editingIndex ? draft : product),
      )
    }
    resetDraft()
  }

  function editProduct(index: number) {
    setDraft(inventory[index])
    setEditingIndex(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteProduct(index: number) {
    onInventoryChange(inventory.filter((_, productIndex) => productIndex !== index))
    if (editingIndex === index) resetDraft()
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
            <p className="admin-notice">
              Preview mode: the page is not protected by real authentication, and
              changes only affect this open session. Stripe and product storage
              are not connected.
            </p>
          </main>
        )}
      </div>
    </div>
  )
}

function App() {
  const [formStatus, setFormStatus] = useState('')
  const [storyOpen, setStoryOpen] = useState(false)
  const [catalog, setCatalog] = useState(products)
  const productGridRef = useRef<HTMLDivElement>(null)
  const storyTriggerRef = useRef<HTMLButtonElement>(null)
  const storyCloseRef = useRef<HTMLButtonElement>(null)

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

  if (window.location.pathname === '/studio') {
    return <StudioAdmin inventory={catalog} onInventoryChange={setCatalog} />
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
          <div className="header-social" aria-label="Social and shop links">
            <a href="https://www.instagram.com/slippedceramics/" target="_blank" rel="noopener noreferrer">
              Instagram <span className="header-social-arrow" aria-hidden="true">↗</span>
            </a>
            <span className="header-social-separator" aria-hidden="true">/</span>
            <a href={shopUrl} target="_blank" rel="noopener noreferrer">
              Etsy <span className="header-social-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
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
              <div className="hero-stamp studio-badge">made<br />with care</div>
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
            <div className="product-grid" ref={productGridRef}>
              {catalog.map((product) => (
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
                    <ArrowUpRight aria-hidden="true" />
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
                    src={products[5].image}
                    alt="Three handmade blue-glazed cups on a worktable with studio shelves in the background"
                    loading="lazy"
                  />
                </div>
                <figcaption className="contact-photo-caption">
                  <span>Little works in progress</span>
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
