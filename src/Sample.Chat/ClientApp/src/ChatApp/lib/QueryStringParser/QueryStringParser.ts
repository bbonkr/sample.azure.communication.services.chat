export class QueryStringParser {
    public static parse(querystring: string): any {
        let obj = {};
        querystring.split('?').forEach((s) => {
            if (s) {
                s.split('&').forEach((t) => {
                    if (t) {
                        const tokens = t.split('=');

                        obj = {
                            ...obj,
                            [decodeURIComponent(tokens[0])]:
                                tokens.length > 0
                                    ? decodeURIComponent(tokens[1] ?? '')
                                    : undefined,
                        };
                    }
                });
            }
        });

        return obj;
    }
}
