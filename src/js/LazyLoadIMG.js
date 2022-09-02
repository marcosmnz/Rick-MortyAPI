"use strict"
const intersectionHandle = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.onload = () => entry.target.removeAttribute('data-src');
    entry.target.src = entry.target.dataset.src;
    observer.unobserve(entry.target);
  });
};

const getElements = () => {
  return document.querySelectorAll('img:not([nolazy])');
};

const setObserver = (elements, observer) => {
  elements.forEach(elem => observer.observe(elem));
};

const defaults = {
  rootMargin: '100px'
};

export default class LazyLoadIMG {
  constructor(settings = null) {
    this._elements = getElements();
    this._settings = { ...defaults, ...settings };
    this._observer = new IntersectionObserver(intersectionHandle, this._settings);
  }
  init() {
    setObserver(this._elements, this._observer);
  }
  refresh() {
    this._elements = getElements();
    setObserver(this._elements, this._observer);
  }
};