import { Injectable } from '@nestjs/common';
import { ValkeyService } from '@toxicoder/nestjs-valkey';
import { json } from 'stream/consumers';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(private readonly valkeyService: ValkeyService) {}

  // Cabeçalho
  private readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Api-Key': 'ZWYzYmMxZDYtOGZiMy00NTc2LWI3MDgtM2I5ZDMxODBlYzQ2OjczMDQ3',
  };

  // Busca dos endpoints
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

  // Getter do cache
  private async getCachedValue(key: string): Promise<string | null> {
    return this.valkeyService.get(key);
  }

  // Setter do cache
  private async setCachedValue(key: string, value: string, ttl = 300) {
    return this.valkeyService.setEx(key, value, ttl);
  }

  // Retorna customers
  public async getCustomers() {
    const cacheKey = 'customers_cache'; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache

    // Se possui cache, converte em JSON
    if (cached) {
      this.updateCacheCustomers(cacheKey); // Atualiza o cache
      return JSON.parse(cached);
    }

    // Se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll('customers');
    await this.setCachedValue(cacheKey, JSON.stringify(response));

    // for(let item of response){
    //   console.log(item.id);
    // }

    return response;
  }

  // Atualiza o cache
  private async updateCacheCustomers(cacheKey: string) {
    try {
      const response = await this.searchAll('customers');
      await this.setCachedValue(cacheKey, JSON.stringify(response));
    } catch (err) {
      console.error('Falha!', err);
    }
  }

  // Retorna orders (Telemetria | Abertura de Chamado)
  public async getOrders() {
    const cacheKey = 'orders_cache'; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache

    // Se possui cache, converte em JSON
    if (cached) {
      this.updateCacheOrders(cacheKey);
      return JSON.parse(cached);
    }

    // Se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll(
      'orders',
      (order) => order.service?.id === 'MzE5NjIxOjczMDQ3',
    );
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  // Atualiza o cache
  private async updateCacheOrders(cacheKey: string) {
    try {
      const response = await this.searchAll(
        'orders',
        (order) => order.service?.id === 'MzE5NjIxOjczMDQ3',
      );
      await this.setCachedValue(cacheKey, JSON.stringify(response));
    } catch (err) {
      console.error('Falha!', err);
    }
  }

  // Retorna services
  public async getServices() {
    const cacheKey = 'services_cache'; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache

    // Se possui cache, converte em JSON
    if (cached) {
      this.updateCacheServices(cacheKey);
      return JSON.parse(cached);
    }

    // Se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll('services');
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  // Atualiza o cache
  private async updateCacheServices(cacheKey: string) {
    try {
      const response = await this.searchAll('services');
      await this.setCachedValue(cacheKey, JSON.stringify(response));
    } catch (err) {
      console.error('Falha!', err);
    }
  }

  // Retorna tasks (scheduled)
  public async getTasks() {
    const cacheKey = 'tasks_cache'; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache

    // Se possui cache, converte em JSON
    if (cached) {
      this.updateCacheTasks(cacheKey);
      return JSON.parse(cached);
    }

    // Se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll(
      'tasks',
      (task) => task.status === 'scheduled',
    );
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  // Atualiza o cache
  private async updateCacheTasks(cacheKey: string) {
    try {
      const response = await this.searchAll(
        'tasks',
        (task) => task.status === 'scheduled',
      );
      await this.setCachedValue(cacheKey, JSON.stringify(response));
    } catch (err) {
      console.error('Falha!', err);
    }
  }

  // Retorna locations
  public async getLocationsByCustomer(customerId: string) {
    const cacheKey = `locations_cache:${customerId}`; // Cria chave do cache
    const cached = await this.getCachedValue(cacheKey); // Cria armazenamento p/ cache

    // Se possui cache, converte em JSON
    if (cached) {
      this.updateCacheLocationsByCustomer(cacheKey, customerId);
      return JSON.parse(cached);
    }

    // Se não, busca os dados diretamente da API e armazena no cache criado
    const response = await this.searchAll(`customers/${customerId}/locations`);
    await this.setCachedValue(cacheKey, JSON.stringify(response));
    return response;
  }

  // Atualiza o cache
  private async updateCacheLocationsByCustomer(
    cacheKey: string,
    customerId: string,
  ) {
    try {
      const response = await this.searchAll(
        `customers/${customerId}/locations`,
      );
      await this.setCachedValue(cacheKey, JSON.stringify(response));
      return response;
    } catch (err) {
      console.error('Falha!', err);
      return [];
    }
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

  private async updateCacheAllLocationsByCustomer() {
    try {
      const customers: Array<any> = await this.searchAll('customers');

      for (const c of customers) {
        const customerId = c.id;

        const locations: Array<any> = await this.updateCacheLocationsByCustomer(
          `locations_cache:${customerId}`,
          customerId,
        );

        for(const l of locations){
          const key = `locations_cache:${customerId}_location:${l.id}`;
          await this.setCachedValue(key, JSON.stringify(l));
        }
      }
    } catch (err) {
      console.error('Falha ' + err);
    }
  }

  @Cron('0 */5 * * * *')
  public async schedule() {
    await this.updateCacheCustomers('customers_cache');
    await this.updateCacheOrders('orders_cache');
    await this.updateCacheServices('services_cache');
    await this.updateCacheTasks('tasks_cache');
    await this.updateCacheAllLocationsByCustomer();
  }
}
