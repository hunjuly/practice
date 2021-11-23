/*
express에 종속되는 기능은 모두 여기에 둔다.
*/
export * from './HttpRouter'
export * from './HttpTransaction'
export * from './HttpServer'
export * from './HttpRequest'

export enum StatusCode {
    Ok = 200,
    Error = 400,
    NotFound = 404
}
