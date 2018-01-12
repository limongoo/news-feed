// Basic imports
import html from './app.html';
import './app.css';
import Template from '../Template';

// Import Search
import Search from '../search/Search';

const template = new Template(html);

export default class App {
  render() {
    const dom = template.render();

    const search = new Search();
    const searchBox = dom.getElementById('search');
    searchBox.appendChild(search.render());
    return dom;
  }
}