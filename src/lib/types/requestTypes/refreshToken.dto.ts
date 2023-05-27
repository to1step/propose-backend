import { Equals, IsString } from 'class-validator';

class RefreshTokenDto {
	@Equals('refresh_token')
	grant_type: 'refresh_token';

	@IsString()
	refresh_token: string;

	constructor(obj: RefreshTokenDto) {
		this.grant_type = obj.grant_type;
		this.refresh_token = obj.refresh_token;
	}
}

export default RefreshTokenDto;
