export interface ApiResponseModel<TData = {}> {
    statusCode: number;
    message: string;
    data: TData;
}
