// Basic imports
import html from './app.html';
import './app.css';
import Template from '../Template';

// Import Search
import Search from '../search/Search';

// Import New API
import { searchNews } from '../../services/newsApi';

// Import Article List
import ArticleList from '../articles/ArticleList';

const template = new Template(html);

export default class App {
  
// Setting search values
  handleSearch(searchTerm) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.runSearch();
  }
  
  // Run search function
  runSearch() {

    searchNews(this.searchTerm, this.pageIndex)
      .then(data => {
        console.log(data);
        const newsArticles = data.items;

        const articlesSection = this.articlesSection;

        while(articlesSection.hasChildNodes()) {
          articlesSection.removeChild(articlesSection.lastChild);
        }

        const articleList = new ArticleList(newsArticles);
        articlesSection.appendChild(articleList.render());


      });
  }

  render() {
    const dom = template.render();

    // Reference search from Search.js and place to dom
    // search => this.handleSearch(search) in Search() - linked to Search() in Search.js
    const search = new Search(search => this.handleSearch(search));
    const searchBox = dom.getElementById('search');
    searchBox.appendChild(search.render());
    
    return dom;
  }
}