import html from './search.html';
import './search.css';
import Template from '../Template';

const template = new Template(html);

export default class Search {
  // constructor(doSearch) {
  //   this.doSearch = doSearch;
  // }

  render() {
    const dom = template.render();

  



    return dom;
  }
}