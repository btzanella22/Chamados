import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { get } from 'http';
import { isPromise } from 'util/types';

interface Chamado {
  id: string;
  dataHora: string;
  cliente: string;
  localizacao: string;
  descricao: string;
  observacao: string;
}

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/customers')
  async getCustomers() {
    let success = true;
    const data = await this.appService.getCustomers().catch(() => {
      success = false;
      return [];
    });
    return {
      success,
      data,
    };
  }

  @Get('/services')
  async getServices() {
    let sucess = true;
    const data = await this.appService.getServices().catch(() => {
      sucess = false;
      return [];
    });
    return {
      sucess,
      data,
    };
  }

  @Get('/tasks')
  async getTasks() {
    let sucess = true;
    const data = await this.appService.getTasks().catch(() => {
      sucess = false;
      return [];
    });
    return {
      sucess,
      data,
    };
  }

  @Get('/orders')
  async getOrders() {
    let sucess = true;
    const data = await this.appService.getOrders().catch(() => {
      sucess = false;
      return [];
    });
    return {
      sucess,
      data,
    };
  }

  @Get('/locations/:customerId')
  async getLocations(
    @Param('customerId')
    customerId: string,
  ) {
    let sucess = true;
    const data = await this.appService
      .getLocationsByCustomer(customerId)
      .catch(() => {
        sucess = false;
        return [];
      });
    return {
      sucess,
      data,
    };
  }

  @Get('/ultimos')
  async getAll(
  ) {
    const [customers, orders, services, tasks] = await Promise.all([
      this.appService.getCustomers(),
      this.appService.getOrders(),
      this.appService.getServices(),
      this.appService.getTasks(),
    ]);

    // Array temporário
    const chamadosTemp: Chamado[] = [];

    // Busca dos dados
    for (let t of tasks) {
      if (!t.order || !t.order.id) continue;

      const order = orders.find((o) => o.id === t.order.id);
      if (!order) continue;

      // verifica customer
      if (!order.customer || !order.customer.id) continue;

      const customer = customers.find((c) => c.id === order.customer.id);
      if (!customer) continue;

      // verifica location
      if (!order.location || !order.location.id) continue;
      const localizacao = await this.appService.getLocationByCustomer(order.customer.id, order.location.id);

      // Ajusta data/hora padrão
      const dataUTC = t.createdAt;
      const data = new Date(dataUTC);
      const hora = data.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      chamadosTemp.push({
        id: order.identifier,
        dataHora: hora,
        cliente: customer.name,
        localizacao: localizacao.name,
        descricao: order.description,
        observacao: t.description,
      });

    }

    return chamadosTemp;
  }
}
