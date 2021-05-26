import {
    GetThreadsRequestModel,
    GetThreadsApiResponseModel,
    CreateThreadRequestModel,
    CreateThreadApiResponseModel,
    JoinThreadRequestModel,
    JoinThreadApiResponseModel,
    LeaveThreadRequestModel,
    LeaveThreadApiResponseModel,
    DeleteThreadRequestModel,
    DeleteThreadApiResponseModel,
    SendMessageRequestModel,
    SendMessageApiResponseModel,
    SendFileRequestModel,
    SendFileApiResponseMode,
} from '../../models/ChatClient';
import { ApiClientBase } from '../ApiClientBase';

export class ChatClient extends ApiClientBase {
    constructor() {
        super();
    }

    public async getThreads(
        model: GetThreadsRequestModel,
    ): Promise<GetThreadsApiResponseModel> {
        const url = `${this.getBaseUrl()}/${encodeURIComponent(
            model.email,
        )}/threads?page=${model.page}&limit=${
            model.limit
        }&keyword=${encodeURIComponent(model.keyword ?? '')}`;

        try {
            const response =
                await this.getClient().get<GetThreadsApiResponseModel>(url);

            return this.returnsModelIfSucceed(response);
        } catch (err) {
            throw this.throwsManagedError(err);
        }
    }

    public async createThread(
        model: CreateThreadRequestModel,
    ): Promise<CreateThreadApiResponseModel> {
        const url = `${this.getBaseUrl()}/threads`;

        try {
            const response =
                await this.getClient().post<CreateThreadApiResponseModel>(
                    url,
                    model,
                );

            return this.returnsModelIfSucceed(response);
        } catch (err) {
            throw this.throwsManagedError(err);
        }
    }

    public async joinToThread(
        model: JoinThreadRequestModel,
    ): Promise<JoinThreadApiResponseModel> {
        const url = `${this.getBaseUrl()}/threads/${model.threadId}/join`;

        try {
            const response = await this.getClient().patch(url, model);

            return this.returnsModelIfSucceed(response);
        } catch (err) {
            throw this.throwsManagedError(err);
        }
    }

    public async leaveFromThread(
        model: LeaveThreadRequestModel,
    ): Promise<LeaveThreadApiResponseModel> {
        const url = `${this.getBaseUrl()}/threads/${model.threadId}/leave`;

        try {
            const response = await this.getClient().patch(url, model);

            return this.returnsModelIfSucceed(response);
        } catch (err) {
            throw this.throwsManagedError(err);
        }
    }

    public async deleteThread(
        model: DeleteThreadRequestModel,
    ): Promise<DeleteThreadApiResponseModel> {
        const url = `${this.getBaseUrl()}/threads/${model.threadId}`;

        try {
            const response = await this.getClient().delete(url);

            return this.returnsModelIfSucceed(response);
        } catch (err) {
            throw this.throwsManagedError(err);
        }
    }

    public async sendMessage(
        model: SendMessageRequestModel,
    ): Promise<SendMessageApiResponseModel> {
        const url = `${this.getBaseUrl}/threads/${model.threadId}/messages`;

        try {
            const response = await this.getClient().post(url, model);

            return this.returnsModelIfSucceed(response);
        } catch (err) {
            throw this.throwsManagedError(err);
        }
    }

    public async sendFile(
        model: SendFileRequestModel,
    ): Promise<SendFileApiResponseMode> {
        const url = `${this.getBaseUrl}/threads/${model.threadId}/files`;

        try {
            const response = await this.getClient().post(url, model);

            return this.returnsModelIfSucceed(response);
        } catch (err) {
            throw this.throwsManagedError(err);
        }
    }

    protected getBaseUrl(): string {
        return `${super.getBaseUrl()}/chats`;
    }
}
