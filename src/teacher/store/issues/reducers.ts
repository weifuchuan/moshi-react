import { Issue } from '@/common/models/issue';
import { AnyAction } from "redux";
import { ADD_ISSUES } from './actionTypes';

export default function issues(iss: Issue[] = [], action: AnyAction) {
  switch (action.type) {
    case ADD_ISSUES:
      const arts2 = [];
      for (let a of action.issues) {
        let ok = true;
        for (let ar of iss) {
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
      return [...iss, ...arts2];
      break;
  }
  return iss;
}
