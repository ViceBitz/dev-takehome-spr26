import mongoose, { Schema, Document } from 'mongoose';
import { RequestStatus } from '@/lib/types/request';

export interface IRequest extends Document {
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: Date;
  lastEditedDate: Date | null;
  status: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    requestorName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    itemRequested: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    requestCreatedDate: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    lastEditedDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      required: true,
      default: RequestStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const Request =
  mongoose.models.Request ||
  mongoose.model<IRequest>('Request', RequestSchema);

export default Request;
