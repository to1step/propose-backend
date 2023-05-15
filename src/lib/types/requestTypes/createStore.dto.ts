import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { CreateStoreForm } from '../type';

class CreateStoreDto {
	@IsString()
	name: string;

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

	constructor(obj: CreateStoreDto) {
		this.name = obj.name;
		this.coordinates = obj.coordinates;
		this.representImage = obj.representImage;
		this.tags = obj.tags;
		this.startTime = obj.startTime;
		this.endTime = obj.endTime;
	}

	toServiceModel(): CreateStoreForm {
		return {
			name: this.name,
			coordinates: this.coordinates,
			representImage: this.representImage ?? null,
			tags: this.tags ?? [],
			startTime: this.startTime ?? null,
			endTime: this.endTime ?? null,
		};
	}
}

export default CreateStoreDto;
