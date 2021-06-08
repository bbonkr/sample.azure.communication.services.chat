import { ApiResponseModel } from '../ApiResponseModel';
import { PagedModel } from '../PagedModel';

export interface GetUserRequestModel {
    email: string;
}

export type DeleteUserRequestModel = GetUserRequestModel;

export interface GetUserResponseModel {
    id: string;
    email: string;
    displayName: string;
    token: string;
    gatewayUrl: string;
    expiresOn: number;
}

export interface GetUserApiResponseModel
    extends ApiResponseModel<GetUserResponseModel> {}

export type CreateUserApiResponseModel = GetUserApiResponseModel;

export interface CreateUserRequestModel {
    email: string;
    displayName: string;
}

export type DeleteUserApiResponse = ApiResponseModel<boolean>;

export interface GetUsersRequestModel {
    page: number;
    limit: number;
    keyword: string;
}

export type GetUsersApiResponseModel = ApiResponseModel<
    PagedModel<GetUserResponseModel>
>;
