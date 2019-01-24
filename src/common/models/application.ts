import { Model } from "@/common/kit/type";
import { application } from "@/common/models/db";
import { POST_FORM, Ret } from "../kit/req";

type Application = Model<application, {}>;
export { Application };

export const ApplicationStatus = {
  STATUS_COMMIT: 0,
  STATUS_SUCCESS: 1,
  STATUS_FAIL: 2
};

export const ApplicationCategory = {
  CATEGORY_TEACHER: 0,
  CATEGORY_COURSE_COLUMN: 1,
  CATEGORY_COURSE_VIDEO: 2
};

export class ApplicationAPI {
  static async my(category: number): Promise<Application[]> {
    const resp = await POST_FORM<Application[]>("/apply/my", { category });
    return resp.data;
  }

  static async commit(
    id: number,
    title: string,
    content: string,
    category: number
  ): Promise<Ret> {
    const resp = await POST_FORM("/apply/commit", { id, title, content, category });
    return resp.data;
  }

  static async cancel(id: number) {
    const resp = await POST_FORM("/apply/cancel", { id });
    return resp.data;
  }
}
