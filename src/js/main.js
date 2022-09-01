"use strict";
import { ENDPOINT, RESOURCES } from './utils/constants.js';
import { getData, createElem } from './utils/helpers.js';

import LazyLoadIMG from './LazyLoadIMG.js';

window.addEventListener('DOMContentLoaded', () => {
  const myModal = new bootstrap.Modal('#modal');
  const txtID = document.getElementById('txtID');
  const imgModal = document.getElementById('imgModal');
  const txtName = document.getElementById('txtName');
  const txtSpecie = document.getElementById('txtSpecie');
  const txtType = document.getElementById('txtType');
  const txtStatus = document.getElementById('txtStatus');
  const colorStatus = txtStatus.parentElement;
  const txtGender = document.getElementById('txtGender');
  const txtOrigin = document.getElementById('txtOrigin');
  const txtLocation = document.getElementById('txtLocation');

  const modalhandle = async (e) => {
    const id = e.target.dataset.id;
    try {
      const data = await getData(ENDPOINT + RESOURCES.characters + '/' + id);
      if (!!data.error) return alert(data.error);
      txtID.innerHTML = 'ID: ' + data.id;
      imgModal.src = data.image;
      imgModal.setAttribute('alt', data.name);
      txtName.innerHTML = data.name;
      txtSpecie.innerHTML = data.species;
      txtType.innerHTML = data.type !== '' ? data.type : '';
      txtStatus.innerHTML = data.status;
      colorStatus.classList.remove(colorStatus.classList[colorStatus.classList.length - 1]);
      switch (data.status) {
        case 'Alive': {
          colorStatus.classList.add('bg-success');
          break;
        }
        case 'Dead': {
          colorStatus.classList.add('bg-danger');
          break;
        }
        default: {
          colorStatus.classList.add('bg-secondary');
          break;
        }
      }
      txtGender.innerHTML = data.gender;
      txtOrigin.innerHTML = data.origin.name;
      txtLocation.innerHTML = 'Last known location: ' + data.location.name;
      myModal.show();
    } catch (err) { console.error(err); }
  };

  const init = async () => {
    const myUrl = window.location;
    const queryString = myUrl.search;
    const params = new URLSearchParams(queryString);
    const page = parseInt(params.get('page') === null ? 1 : params.get('page'));
    const url = ENDPOINT + RESOURCES.characters + `${page !== null ? `?page=${page}` : ''}`;

    const pagPrev = document.getElementById('pagPrev');
    const pagNext = document.getElementById('pagNext');

    const infoSection = document.getElementById('infoSection');

    const { info, results: data } = await getData(url);

    if (info.prev !== null) {
      pagPrev.href = myUrl.origin + myUrl.pathname + `?page=${(page - 1)}`;
      pagPrev.parentNode.classList.remove('disabled');
    } else {
      pagPrev.parentNode.classList.add('disabled');
    }
    if (info.next !== null) {
      pagNext.href = myUrl.origin + myUrl.pathname + `?page=${(page + 1)}`;
      pagNext.parentNode.classList.remove('disabled');
    } else {
      pagNext.parentNode.classList.add('disabled');
    }

    data.forEach((character, i) => {
      let div = createElem('div', ['col']);
      let card = createElem('div', ['card', 'shadow', 'p-3', 'mb-5', 'bg-body', 'rounded']);
      card.setAttribute('aria-hidden', true);
      let placeholder = createElem('div', ['placeholder-img']);
      let img = createElem('img', ['card-img-top', 'loading']);
      img.setAttribute('data-src', character.image);
      img.setAttribute('alt', character.name);
      placeholder.appendChild(img);
      let bodyCard = createElem('div', ['card-body']);
      let nameTag = createElem('h5', ['card-title', 'text-center', 'pb-3']);
      nameTag.innerHTML = character.name;
      let divButton = createElem('div', ['d-grid', 'd-md-flex', 'justify-content-center'])
      let button = createElem('button', ['btn', 'btn-info', 'text-light']);
      button.innerHTML = 'More about';
      button.setAttribute('data-id', character.id);
      button.addEventListener('click', modalhandle);
      divButton.appendChild(button);
      bodyCard.appendChild(nameTag);
      bodyCard.appendChild(divButton);
      card.appendChild(placeholder);
      card.appendChild(bodyCard);
      div.appendChild(card);
      infoSection.appendChild(div);
    });

    //LazyLoading
    const lazyLoading = new LazyLoadIMG();
    lazyLoading.init();

  };

  init();
});