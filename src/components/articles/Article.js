import html from './article.html';
import './article.css';
import Template from '../Template';

const template = new Template(html);

export default class Article {
  constructor(article) {
    // Get "source" from api
    this.source = article.source; 
    this.author = article.author;
    this.title = article.title;
    this.publishedAt = article.publishedAt;
    this.url = article.url;
    this.description = article.description;
    this.image = article.urlToImage;
  
  }

  render() {
    const dom = template.render();

    // Set path from api
    const source = this.source;
    const author = this.author;
    const title = this.title;
    const publishedAt = this.publishedAt;
    const url = this.url;
    const description = this.description;
    const image = this.image;

    // Add content from api
    dom.querySelector('.title').textContent = title;
    dom.querySelector('.author').textContent = author;
    dom.querySelector('.publisher').textContent = source.name;
    dom.querySelector('.publishedAt').textContent = publishedAt;
    dom.querySelector('.url').textContent = url;
    dom.querySelector('.description').textContent = description;

    // console.log(articles[0].author);
    // console.log(source.title);
    // console.log(source.name);

    // Add src and alt to images
    const img = dom.querySelector('.newsImage');
    if(image) {
      img.setAttribute('src', image);
      img.setAttribute('alt', `${title} by ${author}`);
    }
    else {
      img.classList.add('hidden');
    }

    return dom;
  }
}