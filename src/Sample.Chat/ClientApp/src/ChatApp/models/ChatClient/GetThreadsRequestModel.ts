import { ChatMessage } from '@azure/communication-chat';
import { ApiResponseModel } from '../ApiResponseModel';
import { PagedModel } from '../PagedModel';

export interface GetThreadsRequestModel {
    email: string;
    page: number;
    limit: number;
    keyword?: string;
}

export interface ThreadParticipantDisplayName {
    id: string;
    displayName: string;
}

export type ChatParticipant = ThreadParticipantDisplayName;

export interface GetThreadResponseModel {
    id: string;
    topic: string;
    participants: ThreadParticipantDisplayName[];
    createdOn: Date;
    updatedOn?: Date;
}

export type GetThreadsApiResponseModel = ApiResponseModel<
    PagedModel<GetThreadResponseModel>
>;

export interface CreateThreadRequestModel {
    topic: string;
    participantIds: string[];
}

export type CreateThreadResponseModel = GetThreadResponseModel;

export type CreateThreadApiResponseModel =
    ApiResponseModel<CreateThreadResponseModel>;

export interface JoinThreadRequestModel {
    threadId: string;
    participantIds: string[];
}
export type JoinThreadResponseModel = GetThreadResponseModel;
export type JoinThreadApiResponseModel =
    ApiResponseModel<JoinThreadResponseModel>;

export type LeaveThreadRequestModel = JoinThreadRequestModel;
export type LeaveThreadResponseModel = GetThreadResponseModel;
export type LeaveThreadApiResponseModel =
    ApiResponseModel<LeaveThreadResponseModel>;

export interface DeleteThreadRequestModel {
    threadId: string;
}

export type DeleteThreadApiResponseModel = ApiResponseModel<string>;

export enum SendMessageContentType {
    Text,
    Html,
}

export interface SendMessageRequestModel {
    threadId: string;
    senderId: string;
    content: string;
    contentType: SendMessageContentType;
}

export type SendMessageApiResponseModel = ApiResponseModel<ChatMessage[]>;

export interface SendFileRequestModel {
    threadId: string;
    senderId: string;
    files: File[];
}

export type SendFileApiResponseModel = ApiResponseModel<ChatMessage[]>;

export interface AddChatMessagesModel {
    threadId: string;
    messages: ChatMessage[];
}

export interface AddParticipantsModel {
    threadId: string;
    participants: ChatParticipant[];
}

export interface RemoveParticipantModel {
    threadId: string;
    participants: (Pick<ChatParticipant, 'id'> & Partial<ChatParticipant>)[];
}

export interface ClearParticipantsModel {
    threadId: string;
}
