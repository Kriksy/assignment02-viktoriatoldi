import { APIRequestContext, request } from "@playwright/test";

export class APIHelper {
  private baseUrl: string;
  private request: APIRequestContext;

  constructor(baseUrl: string, request: APIRequestContext) {
    this.baseUrl = baseUrl;
    this.request = request;
  }
  // ### CLIENT ###

  // Create a new client
  async createClient(payload: object) {
    const response = await this.request.post(`/api/client/new`, {
      data: JSON.stringify(payload),
    });
    return response;
  }

  // Get client by id
  async getClientById(id: string) {
    const response = await this.request.get(`/api/client/${id}`);
    return response;
  }

  // Retrieve all clients
  async getAllClients() {
    const response = await this.request.get(`/api/clients`);
    return response;
  }

  // Delete a client by id
  async deleteClientById(id: string) {
    const response = await this.request.delete(`/api/client/${id}`);
    return response;
  }

  // Update a client by id
  async updateClientById(id: string) {
    const response = await this.request.put(`/api/client/${id}`);
    return response;
  }

  // ### BILL ###

  // Create a new client
  async createBill(payload: object) {
    const response = await this.request.post(`/api/bill/new`, {
      data: JSON.stringify(payload),
    });
    return response;
  }

  // Delete a bill by id
  async deleteBillById(id: string) {
    const response = await this.request.delete(`/api/bill/${id}`);
    return response;
  }
}
