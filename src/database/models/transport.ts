import { Model, model, Schema } from 'mongoose';

enum ITransportation {
	BUS = 'BUS',
	WALK = 'WALK',
	SUBWAY = 'SUBWAY',
}

interface ITransport {
	startStoreUUID: string;
	endStoreUUID: string;
	comment: string;
	transportation: ITransportation;
}

type ITransportModel = Model<ITransport>;

const transportSchema = new Schema<ITransport, ITransportModel>({
	startStoreUUID: { type: String, required: true }, // 출발 가게 uuid
	endStoreUUID: { type: String, required: true }, // 도착 가게 uuid
	comment: { type: String }, // 이동 방법에 대한 코멘트
	transportation: { type: String }, // 이동할 수단 버스/지하철/도보 중 택 1
});

const Transport = model<ITransport, ITransportModel>(
	'Transport',
	transportSchema
);

export { ITransport, Transport };
