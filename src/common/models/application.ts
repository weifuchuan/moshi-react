import { Model } from '@/common/kit/type';
import { application } from '@/common/models/db';
import { POST_FORM, Ret } from '../kit/req';

type Application = Model<application, {}>;
export { Application };

export const ApplicationStatus = {
	STATUS_COMMIT: 0,
	STATUS_SUCCESS: 1,
	STATUS_FAIL: 2
};

export async function commit(id: number, title: string, content: string): Promise<Ret> {
	const resp = await POST_FORM('/apply/commit', { id, title, content });
	return resp.data;
}

export async function cancel(id: number) {
	const resp = await POST_FORM('/apply/cancel', { id });
	return resp.data;
}
