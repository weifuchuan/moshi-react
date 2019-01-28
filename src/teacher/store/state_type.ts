import { Account } from "@/common/models/account";
import { Course } from "@/common/models/course";
import { Article } from "@/common/models/article";
import { Issue, IssueComment } from "@/common/models/issue";
import { ArticleComment } from "@/common/models/article_comment";

export interface State {
  me: Account | null;
  courses: Course[];
  articles: Article[];
  articleComments: ArticleComment[];
  issues: Issue[];
  issueComments:IssueComment[]; 
}
