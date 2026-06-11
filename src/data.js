// ─────────────────────────────────────────────────────────────────
// src/data.js  —  ALL STATIC DATA
//
// Keeping data in its own file makes App.jsx easier to read.
// If you want to add a new store or clothing type, you only
// need to edit this file — nothing else.
// ─────────────────────────────────────────────────────────────────


// ── CLOTHING TYPES ──────────────────────────────────────────────
// Each object has:
//   value: what goes into the search query
//   label: what the user sees in the dropdown
export const CLOTHING_TYPES = [
  { value: '',            label: '— Select type —' },
  { value: 'dress',       label: 'Dress' },
  { value: 'maxi dress',  label: 'Maxi Dress' },
  { value: 'midi dress',  label: 'Midi Dress' },
  { value: 'mini dress',  label: 'Mini Dress' },
  { value: 'skirt',       label: 'Skirt' },
  { value: 'maxi skirt',  label: 'Maxi Skirt' },
  { value: 'midi skirt',  label: 'Midi Skirt' },
  { value: 'pants',       label: 'Pants / Trousers' },
  { value: 'jeans',       label: 'Jeans' },
  { value: 'leggings',    label: 'Leggings' },
  { value: 'shorts',      label: 'Shorts' },
  { value: 'blouse',      label: 'Blouse / Top' },
  { value: 'sweater',     label: 'Sweater' },
  { value: 'jacket',      label: 'Jacket / Coat' },
  { value: 'jumpsuit',    label: 'Jumpsuit / Romper' },
];


// ── SIZES ────────────────────────────────────────────────────────
export const SIZES = [
  { value: '',    label: '— Any size —' },
  { value: 'XS',  label: 'XS' },
  { value: 'S',   label: 'S' },
  { value: 'M',   label: 'M' },
  { value: 'L',   label: 'L' },
  { value: 'XL',  label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: '0',   label: 'Size 0' },
  { value: '2',   label: 'Size 2' },
  { value: '4',   label: 'Size 4' },
  { value: '6',   label: 'Size 6' },
  { value: '8',   label: 'Size 8' },
  { value: '10',  label: 'Size 10' },
  { value: '12',  label: 'Size 12' },
  { value: '14',  label: 'Size 14' },
  { value: '16',  label: 'Size 16' },
];


// ── SHOPPING SITES ───────────────────────────────────────────────
// Each site has:
//   id:       unique key used in React lists and in state (a Set of ids)
//   name:     label shown in the checkbox
//   buildUrl: a function — pass it a search term, get back a full URL
//
// HOW buildUrl WORKS:
//   encodeURIComponent(term) converts spaces and special characters
//   into URL-safe format.  Example: "navy blue dress" → "navy%20blue%20dress"
//   This is required — URLs cannot contain raw spaces.
//
// TO ADD A NEW STORE:
//   1. Find its search URL by searching on the site and copying the URL
//   2. Replace the search term in the URL with ${encodeURIComponent(term)}
//   3. Add a new object below following the same pattern
export const SITES = [
  {
    id: 'amazon',
    name: 'Amazon',
    buildUrl: (term) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(term)}&i=fashion-womens`,
  },
  {
    id: 'asos',
    name: 'ASOS',
    buildUrl: (term) =>
      `https://www.asos.com/us/search/?q=${encodeURIComponent(term)}`,
  },
  {
    id: 'nordstrom',
    name: 'Nordstrom',
    buildUrl: (term) =>
      `https://www.nordstrom.com/sr?keyword=${encodeURIComponent(term)}`,
  },
  {
    id: 'macys',
    name: "Macy's",
    buildUrl: (term) =>
      `https://www.macys.com/shop/featured/${encodeURIComponent(term)}`,
  },
  {
    id: 'shein',
    name: 'SHEIN',
    buildUrl: (term) =>
      `https://www.shein.com/pdsearch/${encodeURIComponent(term)}/`,
  },
  {
    id: 'target',
    name: 'Target',
    buildUrl: (term) =>
      `https://www.target.com/s?searchTerm=${encodeURIComponent(term)}&category=5xtg6`,
  },
  {
    id: 'hm',
    name: 'H&M',
    buildUrl: (term) =>
      `https://www2.hm.com/en_us/search-results.html?q=${encodeURIComponent(term)}`,
  },
  {
    id: 'bohme',
    name: 'Bohme',
    buildUrl: (term) =>
      `https://bohme.com/search?q=${encodeURIComponent(term)}`,
  },
];
