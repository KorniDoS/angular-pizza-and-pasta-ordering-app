import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { CrustType, Size } from './pizza-meta.enum';
import { Pizza } from './pizza.entity';
import { PizzasService } from './pizzas.service';
import { ConfigService } from '@nestjs/config';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
@Controller('pizza')
@UseGuards(AuthGuard())
export class PizzasController {
  constructor(private pizzaService: PizzasService,
    /*private configService: ConfigService*/) {
      //console.log(configService.get('TEST_VALUE'))
    }

  @Get()
  getPizzas(): Promise<Pizza[]> {
    return this.pizzaService.getPizzas();
  }

  @Get('/user')
  getUserPizzas(@GetUser() user:User): Promise<any>{
    return this.pizzaService.getUserPizzas(user);
  }

  //@Get('/:id')
 // getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Pizza> {
  //  return this.pizzaService.getTaskById(id, user);
  //}


  @Get('/:item_id')
  getPizzaById(@Param('item_id') id:string, @GetUser() user: User){
    return this.pizzaService.getPizzaById(id, user);
  }

  @Post()
  createPizza(@Body() createPizzaDto: CreatePizzaDto,
  @GetUser() user: User): Promise<Pizza> {
    return this.pizzaService.createPizza(createPizzaDto, user);
  }

  @Delete('/:id')
  deletePizza(@Param('id') id: string, @GetUser() user: User): Promise<void> {
   return this.pizzaService.deletePizza(id, user);
  }

  @Patch('/:id')
  updatePizza(
   @Param('id') id: string,
   @Body() updatePizzaDto: UpdatePizzaDto,
   @GetUser() user: User,
  ): Promise<Pizza> {
  //const { status } = UpdatePizzaDto;
   return this.pizzaService.updatePizza(id, updatePizzaDto, user);
  }
}
