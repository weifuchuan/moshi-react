import { observable } from "mobx";
import Account from "@/common/models/Account";
import Course from "@/common/models/Course";
import React from "react";
import Article from "@/common/models/Article";
import Issue from "@/common/models/Issue";
import Audio from "@/common/models/Audio";
import Video from "@/common/models/Video";
import Section from "@/common/models/Section";

export class Store {
  @observable me: Account | null = null;
  @observable courses: Course[] = [];
  @observable articles: Article[] = [];
  @observable issues: Issue[] = [];
  @observable audios: Audio[] = [];
  @observable videos: Video[] = [];
  @observable sections: Section[] = [];
}

const store = new Store();

export const StoreContext = React.createContext(store);

export default store;
