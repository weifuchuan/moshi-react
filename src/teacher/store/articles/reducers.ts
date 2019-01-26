import { Article } from "@/common/models/article";
import { AnyAction } from "redux";
import { ADD_ARTICLES } from "./actionTypes";

export default function articles(arts: Article[] = [], action: AnyAction) {
  switch (action.type) {
    case ADD_ARTICLES:
      return [...arts, ...action.articles];
      break;
  }
  return arts;
}
