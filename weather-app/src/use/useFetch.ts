
const cache = new Map();
export type GetRequest = RequestInit & { method?: 'GET' }
export function useFetch() {
    function _fetchClient<T>(url: string, options?: RequestInit, isCache: boolean = false): Promise<T> {

        if (isCache && cache.has(url)) {
            return Promise.resolve(cache.get(url));
        } else {
            return fetch(url, options).then(async (response: Response) => {
                if (response.ok) {
                    const apiResponse = await response.json();

                    if (isCache && !cache.has(url)) {
                        cache.set(url, apiResponse);
                    }

                    return apiResponse;
                }

                throw new Error(`${response.status} Occurred try after sometime`);
            }).catch((error: Error) => {
                if ('message' in error) {
                    throw new Error(error.message);
                }
                throw new Error('Something went wrong try after sometime');
            })
        }
    }

    function get<T>(url: string, options?: GetRequest, isCache: boolean = true): Promise<T> {
        return _fetchClient<T>(url, {
            method: "GET",
            ...options
        } satisfies GetRequest, isCache);
    }

    return {
        get
    }
}