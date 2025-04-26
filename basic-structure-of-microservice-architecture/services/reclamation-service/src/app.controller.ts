import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Reclamation } from './reclamation.schema';

@Controller("/api/v1/reclamations")
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post()
  async createReclamation(@Body() reclamation: Reclamation) {
    return this.appService.createReclamation(reclamation);
  }

  @Get()
  async getAllReclamations() {
    return this.appService.findAllReclamations();
  }
  @Delete('/:id')
  async deleteReclamation(@Param('id') id: string) {
    return this.appService.deleteReclamation(id);
  }
}
