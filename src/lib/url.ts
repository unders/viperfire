interface Value {
    (name: string): string;
}

export class url {
    static Query(search?: string): Value {
        const vars = new Vars();
        const f = (name: string): string => {
            try {
                return vars[name] || "";
            } catch {
                return "";
            }
        };

        try {
            if (!search) {
                search = window.location.search.substring(1);
            }
            const query = decodeURIComponent(search);
            if (!query || query === "") {
                return f;
            }

            const varsArray = query.split('&');
            for (let v of varsArray) {
                const a = v.split('=');
                if (a.length !== 2) {
                    continue;
                }
                vars[a[0]] = a[1];
            }
            return f;
        } catch(e) {
            return f;
        }
    }
}

class Vars {
    [key: string]: string;
}
