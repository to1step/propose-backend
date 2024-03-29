import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { CreateTransportForm, UpdateCourseForm } from '../type';
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

	toServiceModel(): CreateTransportForm {
		return {
			startStore: this.startStore,
			endStore: this.endStore,
			comment: this.comment ?? null,
			transportation: this.transportation ?? null,
		};
	}
}

class UpdateCourseDto {
	@IsString()
	name: string;

	@IsArray()
	@IsString({ each: true })
	stores: string[];

	@IsOptional()
	@IsString()
	representImage: string | null;

	@IsString()
	shortComment: string;

	@IsOptional()
	@IsString()
	longComment: string | null;

	@IsBoolean()
	isPrivate: boolean;

	@ValidateNested({ each: true })
	transports: TransportDto[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags: string[] | null;

	constructor(obj: UpdateCourseDto) {
		this.name = obj.name;
		this.stores = obj.stores;
		this.representImage = obj.representImage;
		this.shortComment = obj.shortComment;
		this.longComment = obj.longComment;
		this.isPrivate = obj.isPrivate;
		this.transports = obj.transports.map(
			(transport) => new TransportDto(transport)
		);
		this.tags = obj.tags;
	}

	toServiceModel(): UpdateCourseForm {
		return {
			name: this.name,
			stores: this.stores,
			representImage: this.representImage ?? null,
			shortComment: this.shortComment,
			longComment: this.longComment ?? null,
			isPrivate: this.isPrivate,
			transports: this.transports.map((transport) => {
				return transport.toServiceModel();
			}),
			tags: this.tags ?? [],
		};
	}
}

export default UpdateCourseDto;
