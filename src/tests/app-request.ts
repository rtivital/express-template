/* eslint-disable security/detect-object-injection */
import request, { Response } from 'supertest';
import { app } from '@/app';

type DefaultPayload = Record<PropertyKey, any>;
type ResponseWithBody<ResponseBody> = Promise<Omit<Response, 'body'> & { body: ResponseBody }>;

interface AppRequestInput<Payload extends DefaultPayload = DefaultPayload> {
  /** URL to which the request should be sent */
  url: string;

  /** HTTP method to be used for the request */
  method: 'get' | 'post' | 'put' | 'delete';

  /** Payload to be sent with the request */
  payload?: Payload;
}

export async function appRequest<
  ResponseBody = DefaultPayload,
  Payload extends DefaultPayload = DefaultPayload,
>({ url, method, payload }: AppRequestInput<Payload>): ResponseWithBody<ResponseBody> {
  const response = await request(app)[method](url).send(payload);
  return response;
}

interface AppRequestWithAuthInput<Payload extends DefaultPayload = DefaultPayload>
  extends AppRequestInput<Payload> {
  /** Email of the user at which behalf the request should be sent */
  email: string;
}

export async function appRequestWithAuth<
  ResponseBody = DefaultPayload,
  Payload extends DefaultPayload = DefaultPayload,
>({
  email,
  url,
  method,
  payload,
}: AppRequestWithAuthInput<Payload>): ResponseWithBody<ResponseBody> {
  const authResponse = await request(app).post('/api/v1/users/login').send({ email });
  const cookie = authResponse.headers['set-cookie'];
  const response = await request(app)[method](url).set('Cookie', cookie).send(payload);
  return response;
}
