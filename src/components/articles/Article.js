import html from './article.html';
import './article.css';
import Template from '../Template';

const template = new Template(html);

export default class Article {
  constructor(article) {
    // Get "source" from api
    this.source = article.source; 
    
  }

  render() {
    const dom = template.render();

    // Set path to grab api
    const source = this.source;

    // Add content from api
    dom.querySelector('.title').textContent = source.title;
    dom.querySelector('.author').textContent = source.author;
    dom.querySelector('.publisher').textContent = source.id;
    dom.querySelector('.publishedAt').textContent = source.publishedAt;
    dom.querySelector('.url').textContent = source.url;
    dom.querySelector('.description').textContent = source.description;

    // Add src and alt to images
    const img = dom.querySelector('.newsImage');
    if(source.imageLinks) {
      img.setAttribute('src', source.imageLinks.newsImage);
      img.setAttribute('alt', `${source.title} by ${source.author[0]}`);
    }
    else {
      img.classList.add('hidden');
    }

    return dom;
  }
}