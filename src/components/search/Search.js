import html from './search.html';
import './search.css';
import Template from '../Template';

const template = new Template(html);

export default class Search {
  constructor(getSearch) {
    this.getSearch = getSearch;
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.searchInput.value);
    this.getSearch(this.searchInput.value);
  }

  render() {
    const dom = template.render();

    this.searchInput = dom.querySelector('input');

    const form = dom.querySelector('form');
    form.addEventListener('submit', event => this.handleSubmit(event));
    return dom;
  }
}