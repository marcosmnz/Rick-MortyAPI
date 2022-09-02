"use strict"
const getData = async (url) => {
  const res = await fetch(url);
  return res.json();
};

const createElem = (type, className = '') => {
  const elem = document.createElement(type);
  if (className !== '') elem.classList.add(...className);
  return elem;
};

export {
  getData,
  createElem
};