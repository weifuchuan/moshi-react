import {Account} from '@/common/models/account';
import { Course } from '@/common/models/course';

export interface State {
	me: Account | null;
	courses:Course[]; 
}
