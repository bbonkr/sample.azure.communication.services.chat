import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

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
            console.info('response.data', response.data);
            throw response.data;
        }
    }

    protected throwsManagedError(err: Error | AxiosError): Error {
        if (axios.isAxiosError(err)) {
            const axiosError: AxiosError = err;

            return (
                axiosError.response?.data ??
                new Error('Unhandled exception occurred.')
            );
        } else {
            return err;
        }
    }

    private isSuccessResponse(statusCode: number): boolean {
        return statusCode >= 200 && statusCode < 300;
    }
}
