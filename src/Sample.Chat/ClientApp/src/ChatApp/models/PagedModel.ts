export interface PagedModel<TItem> {
    currentPage: number;
    limit: number;
    totalItems: number;
    tatalPages: number;
    items: TItem[];
}
