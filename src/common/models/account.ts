import { Model } from '../kit/type';
import { account } from './db';
import { GET, Ret, POST_FORM } from '../kit/req';

type Account = Model<account, { password: string }>;
export default Account;

export const AccountStatus = {
	STATUS_LOCK_ID: -1, // 锁定
	STATUS_REG: 0, // 注册但未激活
	STATUS_OK: 1 // 注册已激活
};

export async function probeLoggedAccount(): Promise<Account> {
	if (__DEV__) {
		throw ""; 
		return ({
			id: 0,
			nickName: 'fuchuan',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
			email: 'fuchuan.wei@hotmail.com',
			status: 1,
			createAt: Date.now()
		} as Partial<Account>) as Account;
	}
	const resp = await GET<Ret & { account: Account }>('/login/probe');
	if (resp.data.state === 'ok') return resp.data.account;
	else throw resp.data.msg;
}

export async function login(email: string, password: string, captcha: string): Promise<Account> {
	const resp = await POST_FORM<Ret & { account: Account }>('/login', {
		email,
		password,
		captcha
	});
	if (resp.data.state === 'ok') return resp.data.account;
	else throw resp.data.msg;
}

export async function reg(email: string, nickName: string, password: string, captcha: string): Promise<Account> {
	const resp = await POST_FORM<Ret & { account: Account }>('/reg', {
		email,
		nickName,
		password,
		captcha
	});
	if (resp.data.state === 'ok') return resp.data.account;
	else throw resp.data.msg;
}

export async function activate() {
	// TODO
}
