import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  renderError,
  renderLoading,
  clearGallery,
  showEndOfResultsMessage,
} from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more');
let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.query.value.trim();
  if (!query) {
    return renderError('Please enter a search query');
  }
  currentPage = 1;
  currentQuery = query;
  clearGallery();
  renderLoading(true);
  try {
    const data = await fetchImages(query, currentPage);
    if (data.hits.length === 0) {
      renderError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      loadMoreBtn.style.display = 'none';
      return;
    }
    renderGallery(data.hits);
    toggleLoadMoreBtn(data.totalHits);
  } catch (error) {
    renderError('Failed to fetch images');
  } finally {
    renderLoading(false);
  }
}

async function onLoadMore() {
  currentPage += 1;
  renderLoading(true);
  try {
    const data = await fetchImages(currentQuery, currentPage);
    renderGallery(data.hits);
    toggleLoadMoreBtn(data.totalHits);
    scrollToNewImages();
  } catch (error) {
    renderError('Failed to fetch more images');
  } finally {
    renderLoading(false);
  }
}

function toggleLoadMoreBtn(totalHits) {
  if (currentPage * 15 >= totalHits) {
    loadMoreBtn.style.display = 'none';
    showEndOfResultsMessage();
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

function scrollToNewImages() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

const lightbox = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.8,
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
