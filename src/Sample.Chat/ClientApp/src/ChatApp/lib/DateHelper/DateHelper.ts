export class DateHelper {
    public static ensureDateValue(
        value?: string | number | Date,
    ): Date | undefined {
        if (!value) {
            return undefined;
        }

        if (typeof value === 'string') {
            // TODO If need, implement
            return undefined;
        }
        if (typeof value === 'number') {
            return new Date(value);
        }

        return value;
    }
}
