import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponseModelBase } from '../../models/ApiResponseModelBase';

export abstract class ApiClientBase {
    protected getBaseUrl(): string {
        return '/api/v1.0';
    }

    protected getClient(): AxiosInstance {
        const instance = axios.create({});

        return instance;
    }

    protected returnsModelIfSucceed<T>(response: AxiosResponse<T>): T {
        if (this.isSuccessResponse(response.status)) {
            return response.data;
        } else {
            throw response.data;
        }
    }

    private isSuccessResponse(statusCode: number): boolean {
        return statusCode >= 200 && statusCode < 300;
    }
}
