import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 시간 관련해서 자주 사용할 것 같아서 class화 시킴 / 매번 지역 설정해주어야 하기 때문
class DayjsKR {
	private static instance: DayjsKR;

	constructor() {
		dayjs.extend(utc);
		dayjs.extend(timezone);
		dayjs.tz.setDefault('Asia/Seoul');
	}

	static getInstance(): DayjsKR {
		if (!DayjsKR.instance) {
			DayjsKR.instance = new DayjsKR();
		}

		return DayjsKR.instance;
	}

	getWeek(): [string, string] {
		const sunStart = dayjs().tz().startOf('week').utc().unix().toString();
		const satEnd = dayjs()
			.tz()
			.endOf('week')
			.endOf('day')
			.utc()
			.unix()
			.toString();
		return [sunStart, satEnd];
	}
}

export default DayjsKR;
