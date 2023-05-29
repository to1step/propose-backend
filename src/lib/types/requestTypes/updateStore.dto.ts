import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { UpdateStoreForm } from '../type';

class UpdateStoreDto {
	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsString()
	location: string;

	@IsArray()
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	@IsNumber({}, { each: true })
	coordinates: number[];

	@IsOptional()
	@IsString()
	representImage: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags: string[];

	@IsOptional()
	@IsString()
	startTime: string;

	@IsOptional()
	@IsString()
	endTime: string;

	constructor(obj: UpdateStoreDto) {
		this.name = obj.name;
		this.description = obj.description;
		this.location = obj.location;
		this.coordinates = obj.coordinates;
		this.representImage = obj.representImage;
		this.tags = obj.tags;
		this.startTime = obj.startTime;
		this.endTime = obj.endTime;
	}

	toServiceModel(): UpdateStoreForm {
		return {
			name: this.name,
			description: this.description,
			location: this.location,
			coordinates: this.coordinates,
			representImage: this.representImage ?? null,
			tags: this.tags ?? [],
			startTime: this.startTime ?? null,
			endTime: this.endTime ?? null,
		};
	}
}

export default UpdateStoreDto;
