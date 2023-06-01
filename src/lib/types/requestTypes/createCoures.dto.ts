import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { CreateCourseForm } from '../type';
import { Transportation } from '../../../database/types/enums';

class TransportDto {
	@IsString()
	startStore: string;

	@IsString()
	endStore: string;

	@IsOptional()
	@IsString()
	comment: string;

	@IsOptional()
	@IsEnum(Transportation)
	transportation: Transportation;

	constructor(obj: TransportDto) {
		this.startStore = obj.startStore;
		this.endStore = obj.endStore;
		this.comment = obj.comment ?? null;
		this.transportation = obj.transportation ?? null;
	}
}

class CreateCourseDto {
	@IsString()
	name: string;

	@IsArray()
	@IsString({ each: true })
	stores: string[];

	@IsString()
	shortComment: string;

	@IsOptional()
	@IsString()
	longComment: string;

	@IsBoolean()
	isPrivate: boolean;

	@ValidateNested({ each: true })
	transport: TransportDto[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags: string[];

	constructor(obj: CreateCourseDto) {
		this.name = obj.name;
		this.stores = obj.stores;
		this.shortComment = obj.shortComment;
		this.longComment = obj.longComment;
		this.isPrivate = obj.isPrivate;
		this.transport = obj.transport.map((t) => new TransportDto(t));
		this.tags = obj.tags;
	}

	toServiceModel(): CreateCourseForm {
		return {
			name: this.name,
			stores: this.stores,
			shortComment: this.shortComment,
			longComment: this.longComment ?? null,
			isPrivate: this.isPrivate,
			transport: this.transport,
			tags: this.tags ?? [],
		};
	}
}

export default CreateCourseDto;
