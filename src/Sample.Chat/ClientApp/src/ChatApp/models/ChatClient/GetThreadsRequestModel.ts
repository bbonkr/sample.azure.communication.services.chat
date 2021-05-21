import { ApiResponseModel } from '../ApiResponseModel';
import { PagedModel } from '../PagedModel';

export interface GetThreadsRequestModel {
    email: string;
    page: number;
    limit: number;
    keyword?: string;
}

export interface ThreadParticipantDisplayName {
    displayName: string;
}

export interface GetThreadResponseModel {
    id: string;
    topic: string;
    participants: ThreadParticipantDisplayName[];
}

export type GetThreadsApiResponseModel = ApiResponseModel<
    PagedModel<GetThreadResponseModel>
>;

export interface CreateThreadRequestModel {
    topic: string;
    participantIds: string[];
}

export interface CreateThreadResponseModel {
    id: string;
}

export type CreateThreadApiResponseModel =
    ApiResponseModel<CreateThreadResponseModel>;

export interface JoinThreadRequestModel {
    threadId: string;
    participantIds: string[];
}

export type JoinThreadApiResponseModel = ApiResponseModel<boolean>;

export type LeaveThreadRequestModel = JoinThreadRequestModel;
export type LeaveThreadApiResponseModel = JoinThreadApiResponseModel;

export interface DeleteThreadRequestModel {
    threadId: string;
}

export type DeleteThreadApiResponseModel = ApiResponseModel<boolean>;

enum SendMessageContentType {
    Text,
    Html,
}

export interface SendMessageRequestModel {
    threadId: string;
    senderId: string;
    content: string;
    contentType: SendMessageContentType;
}

export type SendMessageApiResponseModel = ApiResponseModel<boolean>;

export interface SendFileRequestModel {
    threadId: string;
    senderId: string;
    // TODO file type
    files: any[];
}

export type SendFileApiResponseMode = ApiResponseModel<boolean>;
