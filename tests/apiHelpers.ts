import { APIRequestContext, request } from "@playwright/test";

export class APIHelper {
  private baseUrl: string;
  private request: APIRequestContext;

  constructor(baseUrl: string, request: APIRequestContext) {
    this.baseUrl = baseUrl;
    this.request = request;
  }

  async createClient(payload: object) {
    const response = await this.request.post(`/api/client/new`, {
      data: JSON.stringify(payload),
    });
    return response;
  }
}
