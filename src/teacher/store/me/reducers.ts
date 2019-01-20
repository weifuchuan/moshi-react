import Account, { AccountStatus } from '@/common/models/account';
import { Action, AnyAction } from 'redux';
import { SET_ME, ACTIVATE } from './actionTypes';

export default function me(I: Account | null = null, action: AnyAction) {
	switch (action.type) {
		case SET_ME:
			return action.account;
		case ACTIVATE:
			if (I) {
				I.status = AccountStatus.STATUS_OK;
			}
			return;
		default:
			break;
	}
	return I;
}
