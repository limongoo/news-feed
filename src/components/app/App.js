// Basic imports
import html from './app.html';
import './app.css';
import Template from '../Template';
import Search from '../search/Search';
import ArticleList from '../articles/ArticleList';
import Paging from '../search/Paging';
import { searchNews } from '../../services/newsApi';


const template = new Template(html);

export default class App {
  
  // Setting search values
  handleSearch(searchTerm) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.runSearch();
  }
  
  // Paging
  handllePaging(pageIndex) {
    this.pageIndex = pageIndex;
    this.runSearch();
  }

  // Run search function
  runSearch() {

    searchNews(this.searchTerm, this.pageIndex)
      .then(data => {
        console.log(data);

        // articles and totalResults from api
        const newsArticles = data.articles;
        const total = data.totalResults;

        const articlesSection = this.articlesSection;

        while(articlesSection.hasChildNodes()) {
          articlesSection.removeChild(articlesSection.lastChild);
        }

        const articleList = new ArticleList(newsArticles);
        articlesSection.appendChild(articleList.render());

        // paging update
        this.paging.update(this.pageIndex, 20, total, this.searchTerm);

      });
  }

  render() {
    const dom = template.render();

    // Reference for new section
    this.articlesSection = dom.getElementById('news');

    // Reference search from Search.js and place to dom
    const searchBox = dom.getElementById('search');

    // search => this.handleSearch(search) in Search() - linked to Search() in Search.js
    const search = new Search(search => this.handleSearch(search));
    searchBox.appendChild(search.render());

    // Reference for paging
    const pagination = dom.getElementById('paging');
    this.paging = new Paging(pageIndex => this.handllePaging(pageIndex));
    pagination.appendChild(this.paging.render());
    
    return dom;
  }
}