import Article, { IArticle } from '@/common/models/Article';

export interface IArticleAdmin extends IArticle {

}

export default class ArticleAdmin extends Article implements IArticleAdmin {
  constructor(){super()}


}