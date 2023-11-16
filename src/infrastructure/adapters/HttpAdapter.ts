import { Observable, catchError, map, of, pipe, retry, timer } from "rxjs";
import { IHttpAdapter, Params } from "./IHttpAdapter";
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

// Options for the HttpClient request
const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json",
        //Authorization: 'my-auth-token',
    }),
    observe: "body" as const, // 'body' | 'events' | 'response',
    params: {},
    reportProgress: false,
    responseType: "json" as const,
    withCredentials: false,
};

@Injectable()
export class HttpAdapter<T> implements IHttpAdapter<T> {
    private http = inject(HttpClient); // HTTP service
    url = ""; // URL endpoint. Value injected by the repository

    /**
     * Obtains a parameter of type string or Params and from these formats the
     *   'url' and 'parms' parameters requested by the _get function.
     * If arg is of type string, it is added to the URL (Endpoint of type '/endpoint/:id')
     * If arg is of type Params (a typescript dictionary), the parameters are placed inside
     *   an object of type HttpParams. This object, within an HttpClient request, among other
     *   things, encodes the parameters to be added to the URL as query string parameters
     *   (Endpoint of type '/endpoint/?key1=value1&key2=value2&...')
     *
     * @param arg string or Params, a typescript dictionary with the params to be send
     * @returns The Observable of type resp<T> returned by the _get function
     */
    getSome = (arg: "" | Params): Observable<T[]> => {
        return this._parameters("get", arg) as Observable<T[]>;
    };

    getOne = (id: string): Observable<T> => {
        return this._parameters("get", id) as Observable<T>;
    };

    put = (id: string, data: Partial<T>): Observable<T> => {
        //console.log("ARG", arg)
        return this._parameters("put", id, data) as Observable<T>;
    };

    delete = (id: string): Observable<T> => {
        return this._parameters("delete", id) as Observable<T>;
    };

    private _parameters = (
        method: string,
        arg: string | Params,
        data?: Partial<T>
    ) => {
        let params = new HttpParams(); // Query params
        let url = this.url;

        if (typeof arg == "object") params = params.appendAll(arg);
        else if (arg != "") url += `/${arg}`; // id
console.log("PARAMS", method, url, params, data);

        return this._query(method, url, params, data);
    };

    /**
     * Get HTTP request
     *
     * @param url String with destination endpoint
     * @param params Type HttpParams. Query string parameters to send with the
     *   application/x-www-form-urlencode MIME type.
     * @returns An Observable of type <resp<T>> with the response from the server
     *   or an error description
     */
    private _query = (
        method: string,
        url: string,
        params: HttpParams,
        data?: Partial<T>
    ) => {
        const operations = pipe(
            map(res => {
                return res; // kind of useless
            }),
            retry({ count: 2, delay: this.shouldRetry }),
            catchError(this.handleError<T>("http " + method))
        );
        console.log("URL", url, method);
        switch (method) {
            case "get":
                return this.http
                    .get<T>(url, { ...httpOptions, params })
                    .pipe(operations);
                break;
            case "put":
                return this.http
                    .put<T>(url, data, { ...httpOptions, params })
                    .pipe(operations);
                break;
            case "delete":
                return this.http
                    .delete<T>(url, { ...httpOptions, params })
                    .pipe(operations);
                break;
            default:
                return of();
        }
    };

    /**
     * This function returns a function that takes an HttpErrorResponse and
     *   returns an Observable of type resp<T> with the error status, the error
     *   description, and empty data.
     * The IHttpAdapter uses this type of response.
     *
     * @param operation String with the name or description of the process that
     *   returned the error
     * @returns Function of type (HttpErrorResponse) => Observable<resp<T>>
     */
    private handleError<T>(operation: string) {
        return (error: HttpErrorResponse): Observable<T> => {
            const status = error.status;
            const message =
                error instanceof HttpErrorResponse
                    ? error.message
                    : (error as Error).message;
            //const data = [] as Array<T>;

            console.log(`${operation} failed: ${message}`, status, error);

            // Let the app keep running by returning a safe result.
            return of();
        };
    }

    // A custom method to check should retry a request or not
    // Retry when the status code is not 404
    private shouldRetry(error: HttpErrorResponse) {
        if (error.status != 404) {
            return timer(1000); // Adding a timer from RxJS to return observable<0> to delay param.
        }

        throw error;
    }
}
