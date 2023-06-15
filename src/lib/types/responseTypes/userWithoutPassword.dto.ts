class UserWithoutPasswordDto {
	email: string;

	nickname: string;

	provider: string;

	profileImage: string;

	commentAlarm: boolean;

	updateAlarm: boolean;

	constructor(obj: UserWithoutPasswordDto) {
		this.email = obj.email;
		this.nickname = obj.nickname;
		this.provider = obj.provider;
		this.profileImage = obj.profileImage;
		this.commentAlarm = obj.commentAlarm;
		this.updateAlarm = obj.updateAlarm;
	}
}

export default UserWithoutPasswordDto;
