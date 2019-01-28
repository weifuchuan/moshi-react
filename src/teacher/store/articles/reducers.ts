import { Article } from "@/common/models/article";
import { AnyAction } from "redux";
import { ADD_ARTICLES } from "./actionTypes";

export default function articles(arts: Article[] = [], action: AnyAction) {
  switch (action.type) {
    case ADD_ARTICLES:
      const arts2 = [];
      for (let a of action.articles) {
        let ok = true;
        for (let ar of arts) {
          if (ar.id === a) {
            Object.assign(ar, a);
            ok = false;
            break;
          }
        }
        if (ok) {
          arts2.push(a);
        }
      }
      return [...arts, ...arts2];
      break;
  }
  return arts;
}
