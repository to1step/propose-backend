class GetUserDataDto {
	email: string;

	nickname: string;

	provider: string;

	profileImage: string | null;

	commentAlarm: boolean;

	updateAlarm: boolean;

	constructor(obj: GetUserDataDto) {
		this.email = obj.email;
		this.nickname = obj.nickname;
		this.provider = obj.provider;
		this.profileImage = obj.profileImage;
		this.commentAlarm = obj.commentAlarm;
		this.updateAlarm = obj.updateAlarm;
	}
}

export default GetUserDataDto;
