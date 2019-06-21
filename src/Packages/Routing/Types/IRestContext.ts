import {
  ParameterizedContext,
  Response
} from "koa";

export interface KoaResponse<ResponseType = any> extends Response {
  body: ResponseType;
}

export interface IRestContext<ResponseType = any> extends ParameterizedContext {
  body: ResponseType;
  response: KoaResponse<ResponseType>;
}
