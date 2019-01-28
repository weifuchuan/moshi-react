import { Issue } from '@/common/models/issue';
import { ADD_ISSUES, ENTER_ISSUE_PAGE } from './actionTypes';

export function addIssues(issues:Issue[]){
  return {
    type:ADD_ISSUES,
    issues 
  }
}

export function enterIssuePage(id:number){
  return {
    type:ENTER_ISSUE_PAGE,
    id
  }
}
