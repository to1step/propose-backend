import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { CreateStoreForm } from '../type';
import { StoreCategory } from '../../../database/types/enums';

class CreateStoreDto {
	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsEnum(StoreCategory)
	category: StoreCategory;

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
	tags: string[] | null;

	@IsOptional()
	@IsString()
	startTime: string;

	@IsOptional()
	@IsString()
	endTime: string;

	constructor(obj: CreateStoreDto) {
		this.name = obj.name;
		this.description = obj.description;
		this.category = obj.category;
		this.location = obj.location;
		this.coordinates = obj.coordinates;
		this.representImage = obj.representImage;
		this.tags = obj.tags;
		this.startTime = obj.startTime;
		this.endTime = obj.endTime;
	}

	toServiceModel(): CreateStoreForm {
		return {
			name: this.name,
			description: this.description,
			category: this.category,
			location: this.location,
			coordinates: this.coordinates,
			representImage: this.representImage ?? null,
			tags: this.tags ?? [],
			startTime: this.startTime ?? null,
			endTime: this.endTime ?? null,
		};
	}
}

export default CreateStoreDto;
