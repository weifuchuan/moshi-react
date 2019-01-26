import { Model } from '../kit/type';
import { article } from './db';

export type Article = Model<article, {}>

export const ArticleStatus = {
  STATUS_INIT:0,
  STATUS_LOCK:1,
  STATUS_PUBLISH:1<<1
}

export class ArticleAPI{
  
}