import {
    GetUserRequestModel,
    GetUserApiResponseModel,
    CreateUserRequestModel,
    DeleteUserApiResponse,
    CreateUserApiResponseModel,
    DeleteUserRequestModel,
} from '../../models/UserClient';
import { ApiClientBase } from '../ApiClientBase/ApiClientBase';

export class UserClient extends ApiClientBase {
    constructor() {
        super();
    }

    public async getUser(
        model: GetUserRequestModel,
    ): Promise<GetUserApiResponseModel> {
        const url = `${this.getBaseUrl()}/${encodeURIComponent(model.email)}`;

        const response = await this.getClient().get<GetUserApiResponseModel>(
            url,
        );

        return this.returnsModelIfSucceed(response);
    }

    public async createUser(
        model: CreateUserRequestModel,
    ): Promise<CreateUserApiResponseModel> {
        const url = `${this.getBaseUrl()}`;

        const response =
            await this.getClient().post<CreateUserApiResponseModel>(url, model);

        return this.returnsModelIfSucceed(response);
    }

    public async deleteUser(
        model: DeleteUserRequestModel,
    ): Promise<DeleteUserApiResponse> {
        const url = `${this.getBaseUrl()}/${encodeURIComponent(model.email)}`;

        const response = await this.getClient().delete<DeleteUserApiResponse>(
            url,
        );

        return this.returnsModelIfSucceed(response);
    }

    protected getBaseUrl(): string {
        return `${super.getBaseUrl()}/users`;
    }
}
