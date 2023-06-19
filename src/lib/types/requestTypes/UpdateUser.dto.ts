import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ChangeProfileForm } from '../type';

class UpdateUserDto {
	@IsString()
	nickname: string;

	@IsOptional()
	@IsString()
	profileImage: string | null;

	@IsBoolean()
	commentAlarm: boolean;

	@IsBoolean()
	updateAlarm: boolean;

	constructor(obj: UpdateUserDto) {
		this.nickname = obj.nickname;
		this.profileImage = obj.profileImage;
		this.commentAlarm = obj.commentAlarm;
		this.updateAlarm = obj.updateAlarm;
	}

	toServiceModel(): ChangeProfileForm {
		return {
			nickname: this.nickname,
			profileImage: this.profileImage ?? null,
			commentAlarm: this.commentAlarm,
			updateAlarm: this.updateAlarm,
		};
	}
}

export default UpdateUserDto;
