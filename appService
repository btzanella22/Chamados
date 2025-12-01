import { Injectable } from '@nestjs/common';
import { ValkeyService } from '@toxicoder/nestjs-valkey';

@Injectable()
export class AppService {
  constructor(private readonly valkeyService: ValkeyService) {}

  // Cabeçalho
  private readonly DEFAULT_HEADERS = {
    'Content-Type': 'conteudo',
    'X-Api-Key': 'senha',
  };

  // Realiza busca os endpoints
  private async searchAll(
    endpoint: String,
    dataFilter?: ((item: any) => boolean) | null,
  ) {
    const cacheKey = `${endpoint}-${dataFilter ? 'filtered' : 'all'}`;

    let records = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const url = `https://carchost.fieldcontrol.com.br/${endpoint}?limit=${limit}&offset=${offset}&sort=-created_at`;
      const response = await fetch(url, { headers: this.DEFAULT_HEADERS });
      const data = await response.json();

      if (!data.items || data.items.length === 0) break;

      const itemsToAdd = dataFilter
        ? data.items.filter(dataFilter)
        : data.items;

      records = records.concat(itemsToAdd);

      if (data.items.length < limit) break;
      offset += limit;
    }

    return records;
  }

  // Retorna o cache armazenado
  private async getCachedValue(key: string): Promise<string | null> {
    return this.valkeyService.get(key);
  }

  // Insere o cache
  private async setCachedValue(key: string, value: string, ttl = 10) {
    return this.valkeyService.setEx(key, value, ttl);
  }

  public async getCustomers() {
    const cacheKey = 'customers_cache'; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache
    if (cached) return JSON.parse(cached); // Se possui cache, converte em JSON, se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll('customers');
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  public async getOrders() {
    const cacheKey = 'orders_cache'; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache
    if (cached) return JSON.parse(cached); // Se possui cache, converte em JSON, se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll(
      'orders',
      (order) => order.service?.id === 'MzE5NjIxOjczMDQ3',
    );
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  public async getServices() {
    const cacheKey = 'services_cache'; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache
    if (cached) return JSON.parse(cached); // Se possui cache, converte em JSON, se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll('services');
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  public async getTasks() {
    const cacheKey = 'tasks_cache'; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache
    if (cached) return JSON.parse(cached); // Se possui cache, converte em JSON, se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll(
      'tasks',
      (task) => task.status === 'scheduled',
    );
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  public async getLocationsByCustomer(customerId: string) {
    const cacheKey = `locations_cache:${customerId}`; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache
    if (cached) return JSON.parse(cached); // Se possui cache, converte em JSON, se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll(`customers/${customerId}/locations`);
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  public async getLocationByCustomer(customerId: string, locationId: string) {
    const cacheKey = `locations_cache:${customerId}_location:${locationId}`; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache
    if (cached) return JSON.parse(cached); // Se possui cache, converte em JSON, se não, busca os dados diretamente da API e armazena no cache criado
    const locations: Array<any> = await this.getLocationsByCustomer(customerId);
    const location = locations.filter((l) => l.id === locationId)[0];
    await this.setCachedValue(cacheKey, JSON.stringify(location));
    return location;
  }
}
