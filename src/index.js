import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './fetchimages.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const apiService = new ApiService();

formEl.addEventListener('submit', onSubmitForm);
loadMore.addEventListener('click', onLoadMoreBtnClick);
btnHidden();

function onSubmitForm(event) {
  event.preventDefault();
  btnHidden();
  apiService.query = event.target.elements.searchQuery.value;

  if (apiService.query === '') {
    return Notify.failure(
      'Sorry, please type something in the search bar. Your request is empty.'
    );
  }
  apiService.resetPage();
  apiService.fetchImages().then(photos => {
    if (photos.totalHits > 40) {
      btnVisualy();
    } else {
      btnHidden();
    }
    Notify.info(`Hooray! We found ${photos.totalHits} images.`);
    clearGallery();
    renderCardsOfImages(photos.hits);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
  });
}

function onLoadMoreBtnClick() {
  apiService.fetchImages().then(photos => {
    if (photos.totalHits / 40 > apiService.page) {
      btnVisualy();
    } else {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      btnHidden();
    }
    renderCardsOfImages(photos.hits);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
  });
}

function renderCardsOfImages(cards) {
  const markup = cards
    .map(card => {
      return `<a href="${card.largeImageURL}"><div class="photo-card">
  <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${card.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${card.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${card.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${card.downloads}</b>
    </p>
  </div>
</div></a>`;
    }).join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function btnHidden() {
  loadMore.classList.add('is-hidden');
}

function btnVisualy() {
  loadMore.classList.remove('is-hidden');
}