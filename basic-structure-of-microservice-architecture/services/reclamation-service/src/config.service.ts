import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppConfigService {
  private config: Record<string, any> = {};

  constructor(private readonly configService: ConfigService) {}

  async loadConfig() {
    try {
      const configServerUrl = process.env.CONFIG_SERVER_URL || 'http://localhost:8888';
      const serviceName = process.env.SERVICE_NAME || 'reclamation-service';

      const response = await axios.get(`${configServerUrl}/${serviceName}/default`);
      const properties = response.data.propertySources[0].source;
      this.config = properties;
      console.log('Configuration loaded:', this.config);
    } catch (error) {
      console.error('Failed to fetch configuration from Config Server:', error.message);
    }
  }

  get(key: string): any {
    return this.config[key] || this.configService.get(key);
  }
}
