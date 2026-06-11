// ─────────────────────────────────────────────────────────────────
// src/App.jsx  —  THE MAIN COMPONENT
//
// This file contains all the app logic and the UI (JSX).
// JSX = JavaScript + HTML-like syntax. React compiles it
// into real browser DOM elements.
//
// FILE STRUCTURE:
//   1. Imports
//   2. Helper function: buildSearchTerm()
//   3. The App component (state → handlers → JSX)
//   4. Export
// ─────────────────────────────────────────────────────────────────


// ── 1. IMPORTS ───────────────────────────────────────────────────

// React itself, plus useState (lets us store changing data)
import React, { useState, useEffect } from 'react';

// Our component-level CSS styles
import './App.css';

// The data arrays we defined in data.js
// Curly braces = "named exports" (we exported them with "export const")
import { CLOTHING_TYPES, SIZES, SITES } from './data';

// The key used to save/load history from localStorage
const HISTORY_KEY = 'clothing-search-history';

// Maximum number of history items to keep
const MAX_HISTORY = 10;

// ── 2. HELPER FUNCTION ───────────────────────────────────────────

/**
 * buildSearchTerm
 *
 * Takes all the form values and combines them into one search string.
 *
 * Example inputs:
 *   type      = "maxi dress"
 *   minLength = "42"
 *   color     = "navy blue"
 *   size      = "M"
 *   keywords  = "boho pockets"
 *
 * Example output:
 *   "navy blue maxi dress size M 42 inch length boho pockets"
 *
 * @param {object} fields - an object with all the form values
 * @returns {string} - the combined search term
 */
function buildSearchTerm({ type, minLength, color, size, keywords }) {
  // Build an array of all the parts we want in the query.
  // Empty strings are "falsy" in JavaScript, so filter(Boolean)
  // removes them — we only keep parts that have a value.
  const parts = [
    color,                                       // "navy blue"
    type,                                        // "maxi dress"
    size      ? `size ${size}`        : '',      // "size M"  (or skip)
    minLength ? `${minLength} inch length` : '', // "42 inch length"  (or skip)
    keywords,                                    // "boho pockets"
  ].filter(Boolean); // removes any empty strings

  // Join everything with a space: ["navy blue", "dress"] → "navy blue dress"
  return parts.join(' ');
}

/**
 * loadHistory
 * Reads saved history from localStorage and returns it as an array.
 * localStorage only stores strings, so JSON.parse converts it back
 * to a real JavaScript array. Returns [] if nothing is saved yet.
 */
function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * saveHistory
 * Writes the history array to localStorage as a string.
 * Called automatically via useEffect whenever history changes.
 */
function saveHistory(historyArray) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyArray));
  } catch {
    // Silently ignore — localStorage can fail in private/incognito mode
  }
}

// ── 3. THE APP COMPONENT ──────────────────────────────────────────

/**
 * App
 *
 * This is the root (top-level) React component.
 * React calls this function every time state changes,
 * and uses the returned JSX to update the browser.
 */
function App() {

  // ── STATE ─────────────────────────────────────────────────────
  //
  // useState(initialValue) gives us:
  //   [currentValue, setterFunction]
  //
  // Calling the setter (e.g. setColor("red")) does two things:
  //   1. Updates the stored value
  //   2. Triggers a re-render so the UI stays in sync
  //
  // Rule: NEVER directly modify state (e.g. color = "red" won't work).
  //       Always use the setter function.

  const [type,      setType]      = useState('');   // selected clothing type
  const [minLength, setMinLength] = useState('');   // minimum length in inches
  const [color,     setColor]     = useState('');   // color text
  const [size,      setSize]      = useState('');   // selected size
  const [keywords,  setKeywords]  = useState('');   // extra search keywords
  

  // A Set of site IDs that are currently checked.
  // We start with ALL sites selected.
  // new Set([...]) creates a Set from an array.
  // SITES.map(s => s.id) = ['amazon', 'asos', 'nordstrom', ...]
  const [selectedSites, setSelectedSites] = useState(
    new Set(SITES.map(s => s.id))
  );

  // The feedback message shown below the button after a search.
  // null = no message. Otherwise: { type: 'success'|'warning', text: '...' }
  const [status, setStatus] = useState(null);
  // Search history — each item: { id, term, timestamp, siteIds }
// Initialized from localStorage so history survives page refreshes.
// Passing loadHistory (without parentheses) is "lazy initialization" —
// React only calls it once on first render, not on every re-render.
const [history, setHistory] = useState(loadHistory);

// Keep localStorage in sync whenever history changes.
// useEffect(fn, [deps]) runs fn after every render where deps changed.
useEffect(() => {
  saveHistory(history);
}, [history]);

// Live search preview — recalculated from form fields on every render.
// No useState needed because it's just derived from existing state.
const previewTerm = buildSearchTerm({ type, minLength, color, size, keywords });

  // ── EVENT HANDLERS ────────────────────────────────────────────
  //
  // These functions are called when the user interacts with the UI.
  // We pass them to JSX elements as props: onClick={handleSearch}

  /**
   * toggleSite
   * Checks or unchecks a store checkbox.
   * @param {string} siteId - the id of the store being toggled
   */
  function toggleSite(siteId) {
    // We use the "functional update" form of setState: setX(prev => next)
    // This is safer when the new value depends on the old value,
    // because React guarantees "prev" is the latest value.
    setSelectedSites(prev => {
      const next = new Set(prev); // copy the old Set (we never mutate state directly)
      if (next.has(siteId)) {
        next.delete(siteId); // was checked → uncheck it
      } else {
        next.add(siteId);    // was unchecked → check it
      }
      return next;
    });
  }

  /**
   * handleSearch
   * Called when the "Search" button is clicked.
   * Builds URLs and opens them in new browser tabs.
   */
  function handleSearch() {
    // Build the combined search term from all form values
    const term = buildSearchTerm({ type, minLength, color, size, keywords });

    // Guard: if the term is empty (user didn't fill anything in), warn them
    if (!term.trim()) {
      setStatus({ type: 'warning', text: 'Please fill in at least one field before searching.' });
      return; // stop here — don't try to open any tabs
    }

    // Filter the SITES array down to only the ones the user has checked
    const sitesToOpen = SITES.filter(site => selectedSites.has(site.id));

    // Guard: if somehow no sites are checked, warn them
    if (sitesToOpen.length === 0) {
      setStatus({ type: 'warning', text: 'Please select at least one store.' });
      return;
    }

    // Open each selected store in a new browser tab.
    // forEach = loop through the array and run a function for each item.
    // window.open(url, '_blank') = open URL in a new tab.
    //
    // ⚠️  BROWSER POP-UP BLOCKER NOTE:
    // The first time this runs, the browser may block the new tabs.
    // The user will see a notification — they should click
    // "Always allow pop-ups from this site" to fix it permanently.
    // Open ALL tabs first, before any state updates.
    // Browsers require window.open() calls to happen immediately
    // inside the click handler — any delay (like a setState call)
    // can cause the browser to treat extra tabs as pop-ups and block them.
    const count = sitesToOpen.length;
    sitesToOpen.forEach(site => {
      window.open(site.buildUrl(term), '_blank');
    });

    // State updates happen AFTER all tabs are opened
    const entry = {
      id:        Date.now(),
      term,
      timestamp: new Date().toLocaleString(),
      siteIds:   sitesToOpen.map(s => s.id),
    };

    setHistory(prev => {
      const updated = [entry, ...prev];
      return updated.slice(0, MAX_HISTORY);
    });

    setStatus({
      type: 'success',
      text: `✓ Opened ${count} search tab${count !== 1 ? 's' : ''} for: "${term}"`,
    });
  }
  /**
 * handleRerun
 * Re-opens a past search when the user clicks a history item.
 */
function handleRerun(entry) {
  entry.siteIds.forEach(id => {
    const site = SITES.find(s => s.id === id);
    if (site) window.open(site.buildUrl(entry.term), '_blank');
  });
  setStatus({ type: 'success', text: `✓ Re-ran search: "${entry.term}"` });
}

/**
 * handleDeleteHistory
 * Removes one item from history.
 * e.stopPropagation() prevents the click from also triggering
 * the parent row's onClick (which would re-run the search).
 */
function handleDeleteHistory(id, e) {
  e.stopPropagation();
  setHistory(prev => prev.filter(item => item.id !== id));
}

/**
 * handleClearHistory
 * Wipes all history entries at once.
 */
function handleClearHistory() {
  setHistory([]);
}

  // ── DERIVED VALUES ────────────────────────────────────────────
  //
  // Values computed from state on every render.
  // We don't store these in state — we just recalculate them.

  // Disable the button if no stores are checked
  const isDisabled = selectedSites.size === 0;

  // Button label changes based on how many stores are selected
  const buttonLabel = isDisabled
    ? 'Select at least one store'
    : `Search ${selectedSites.size} Store${selectedSites.size !== 1 ? 's' : ''} →`;


  // ── JSX (THE UI) ──────────────────────────────────────────────
  //
  // JSX looks like HTML but compiles to JavaScript.
  // Key differences:
  //   • Use className instead of class
  //   • Use htmlFor instead of for (on <label>)
  //   • Event handlers are camelCase: onClick, onChange
  //   • Embed JS expressions with {curly braces}
  //   • Self-closing tags need /> e.g. <input />
  //   • Comments inside JSX use {/* this syntax */}
  //
  // The return value must be ONE root element.
  // We use <> ... </> (a "Fragment") to wrap multiple elements
  // without adding an extra <div> to the DOM.

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <header>
        <p className="header-eyebrow">✦ Style finder ✦</p>
        <h1 className="header-title">Clothing Search</h1>
        <p className="header-subtitle">
          Search multiple stores at once by size &amp; measurements
        </p>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main>
        <div className="card">

          {/* ── FORM FIELDS (2-column grid) ── */}
          <div className="form-grid">

            {/* CLOTHING TYPE */}
            <div className="field">
              <label htmlFor="type">Clothing Type</label>
              {/*
                <select> is a dropdown menu.
                value={type} makes it a "controlled input" — React
                  decides what's shown, based on our state.
                onChange fires every time the user picks a new option.
                  e.target.value = the value="" of the chosen <option>.
              */}
              <div className="select-wrapper">
                <select
                  id="type"
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                  {/*
                    .map() loops through CLOTHING_TYPES and renders
                    an <option> for each item.
                    key={} is required by React when rendering lists —
                    it helps React efficiently update the DOM.
                  */}
                  {CLOTHING_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SIZE */}
            <div className="field">
              <label htmlFor="size">Size</label>
              <div className="select-wrapper">
                <select
                  id="size"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                >
                  {SIZES.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* COLOR */}
            <div className="field">
              <label htmlFor="color">Color</label>
              <input
                id="color"
                type="text"
                placeholder="e.g. navy blue, floral"
                value={color}
                onChange={e => setColor(e.target.value)}
              />
            </div>

            {/* MINIMUM LENGTH */}
            <div className="field">
              <label htmlFor="minLength">Min Length (inches)</label>
              {/*
                type="number" shows a numeric keyboard on phones
                and adds up/down arrows on desktop.
                min="1" prevents negative numbers.
              */}
              <input
                id="minLength"
                type="number"
                placeholder="e.g. 40"
                min="1"
                value={minLength}
                onChange={e => setMinLength(e.target.value)}
              />
            </div>

            {/* EXTRA KEYWORDS — full width (spans both columns) */}
            <div className="field full-width">
              <label htmlFor="keywords">Extra Keywords</label>
              <textarea
                id="keywords"
                placeholder="e.g. boho, pockets, wrap style, casual"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
              />
            </div>

          </div> {/* end .form-grid */}

          {/* HORIZONTAL DIVIDER LINE */}
          <hr className="divider" />

          {/* ── STORE CHECKBOXES ── */}
          <span className="sites-label">Search these stores</span>
          <div className="sites-grid">
            {/*
              Loop through all stores and render a checkbox for each.

              Note: we use <label> as the outer element so that
              clicking anywhere on the box (not just the checkbox)
              toggles it. The <input type="checkbox"> inside is
              linked to the <label> automatically.

              We add the "checked" CSS class when the site is selected,
              which gives it a highlighted border (see App.css).
            */}
            {SITES.map(site => (
              <label
                key={site.id}
                className={`site-option ${selectedSites.has(site.id) ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedSites.has(site.id)}
                  onChange={() => toggleSite(site.id)}
                />
                <span>{site.name}</span>
              </label>
            ))}
          </div>

          {/* ── SEARCH BUTTON ── */}
          <button
            className="btn-search"
            onClick={handleSearch}
            disabled={isDisabled}
          >
            {buttonLabel}
          </button>

          {/* ── STATUS MESSAGE ── */}
          {/*
            "status && (...)" is short for:
            "if status is not null, render the div"
            This is React's way of conditionally showing something.
          */}
          {status && (
            <div className={`status-message ${status.type}`}>
              {status.text}
            </div>
          )}

        </div> {/* end .card */}
        {/* ── PREVIEW QUERY ── */}
        {/* Shows the live search string as the user fills in fields */}
        <div className="preview-box">
          <span className="preview-label">Search preview</span>
          {previewTerm ? (
            <q className="preview-term">{previewTerm}</q>
          ) : (
            <span className="preview-empty">Fill in any field above to see your search query</span>
          )}
        </div>
        {/* ── SEARCH HISTORY ── */}
        {/* Only rendered when there are saved searches */}
        {history.length > 0 && (
          <div className="history-card">

            <div className="history-header">
              <span className="history-title">Recent Searches</span>
              <button className="btn-clear-history" onClick={handleClearHistory}>
                Clear all
              </button>
            </div>

            <ul className="history-list">
              {history.map(entry => (
                <li
                  key={entry.id}
                  className="history-item"
                  onClick={() => handleRerun(entry)}
                  title={`Click to re-run: ${entry.term}`}
                >
                  <div className="history-item-main">
                    <span className="history-term">{entry.term}</span>
                    <span className="history-meta">
                      {entry.siteIds.length} store{entry.siteIds.length !== 1 ? 's' : ''}
                      &nbsp;·&nbsp;
                      {entry.timestamp}
                    </span>
                  </div>
                  <div className="history-item-actions">
                    <span className="history-rerun-hint">↩ re-run</span>
                    <button
                      className="btn-delete-history"
                      onClick={(e) => handleDeleteHistory(entry.id, e)}
                      aria-label="Remove this search from history"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>

          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer>
        Opens search results in new tabs · Allow pop-ups in your browser if tabs don't open
      </footer>
    </>
  );
}


// ── 4. EXPORT ────────────────────────────────────────────────────
//
// "export default" makes App available to other files.
// src/index.js imports it with: import App from './App'
export default App;