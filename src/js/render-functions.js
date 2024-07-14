import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let lightbox;

export function renderGallery(images) {
  const galleryContainer = document.querySelector('.gallery');
  const galleryMarkup = images.map(image => createGalleryItem(image)).join('');
  galleryContainer.innerHTML += galleryMarkup;

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      overlayOpacity: 0.8,
    });
  } else {
    lightbox.refresh();
  }
}

function createGalleryItem({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <a href="${largeImageURL}" class="gallery-link">
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery-image"/>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>
    </a>
  `;
}

export function clearGallery() {
  const galleryContainer = document.querySelector('.gallery');
  galleryContainer.innerHTML = '';
}

export function renderError(message) {
  iziToast.error({
    title: 'Error',
    message: message,
  });
}

export function renderLoading(isLoading) {
  const loader = document.querySelector('.loader');
  if (isLoading) {
    loader.classList.add('loader-active');
  } else {
    loader.classList.remove('loader-active');
  }
}

export function showEndOfResultsMessage() {
  iziToast.info({
    title: 'Info',
    message: "We're sorry, but you've reached the end of search results.",
  });
}
