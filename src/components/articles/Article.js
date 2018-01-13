import html from './article.html';
import './article.css';
import Template from '../Template';

const template = new Template(html);

export default class Article {
  constructor(article) {
    
  }

  render() {
    const dom = template.render();


    return dom;
  }
}