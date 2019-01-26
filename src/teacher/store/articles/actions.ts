import { Article } from "@/common/models/article";
import { ADD_ARTICLES } from "./actionTypes";

export function addArticles(articles: Article[]) {
  return { type: ADD_ARTICLES, articles };
}
