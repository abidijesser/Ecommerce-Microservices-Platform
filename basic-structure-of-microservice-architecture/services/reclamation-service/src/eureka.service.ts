import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EurekaService implements OnModuleInit, OnModuleDestroy {
  private readonly eurekaServerUrl = 'http://localhost:8761/eureka/apps/reclamation-service';
  private readonly instanceId = 'localhost:3001'; // Correct format
  private readonly serviceName = 'RECLAMATION-SERVICE';

  async onModuleInit() {
    console.log('Registering with Eureka...');
    await this.registerWithEureka();
  }

  async registerWithEureka() {
    try {
      const response = await axios.post(
        this.eurekaServerUrl,
        {
          instance: {
            instanceId: this.instanceId,
            hostName: 'localhost',
            app: this.serviceName,
            ipAddr: '127.0.0.1',
            status: 'UP',
            port: { "$": 3001, "@enabled": true },
            vipAddress: this.serviceName,
            secureVipAddress: this.serviceName,
            homePageUrl: 'http://localhost:3001/',
            statusPageUrl: 'http://localhost:3001/actuator/info',
            healthCheckUrl: 'http://localhost:3001/actuator/health',

            // ✅ Required for Eureka registration
            dataCenterInfo: {
              "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
              name: "MyOwn"
            }
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log('✅ Successfully registered with Eureka:', response.status);
    } catch (error) {
      console.error('❌ Eureka Registration Failed:', error.response?.data || error.message);
    }
  }

  async onModuleDestroy() {
    await this.deregisterFromEureka();
  }

  async deregisterFromEureka() {
    try {
      await axios.delete(`${this.eurekaServerUrl}/${this.instanceId}`);
      console.log('🛑 Successfully deregistered from Eureka');
    } catch (error) {
      console.error('❌ Failed to deregister from Eureka:', error.response?.data || error.message);
    }
  }
}
