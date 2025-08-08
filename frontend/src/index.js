import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
// Hide preloader with min/max duration read from JSON config
const hidePreloader = () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;

  let minMs = 2500, maxMs = 4500;
  try {
    const cfgEl = document.getElementById('preloader-config');
    if (cfgEl && cfgEl.textContent) {
      const cfg = JSON.parse(cfgEl.textContent);
      if (typeof cfg.minDurationMs === 'number') minMs = cfg.minDurationMs;
      if (typeof cfg.maxDurationMs === 'number') maxMs = cfg.maxDurationMs;
    }
  } catch {}

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const rand = (lo, hi) => Math.floor(lo + Math.random() * (hi - lo));
  const delay = clamp(rand(minMs, maxMs), 0, 10000);

  setTimeout(() => {
    pre.classList.add('preloader--hide');
    setTimeout(() => pre.parentNode && pre.parentNode.removeChild(pre), 500);
  }, delay);
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Defer to next frame so initial paint shows the bird, then hide after duration
requestAnimationFrame(hidePreloader);
