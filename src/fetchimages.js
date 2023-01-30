import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const FILTER =
  '?key=33209653-5dbc31627b917f6ce76059b0c&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    try {
      const response = await await axios.get(
        `${URL}${FILTER}&q=${this.searchQuery}&page=${this.page}`
      );
      const data = response.data;

      if (data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        this.incrementPage();
        return data;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQwery) {
    this.searchQuery = newQwery;
  }
}