import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PizzasRepository } from './pizzas.repository';
import { Pizza } from './pizza.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class PizzasService {
  constructor(private readonly pizzaRepository: PizzasRepository) {}

  getPizzas(): Promise<Pizza[]>{
    return this.pizzaRepository.getPizzas();
  }

  async getUserPizzas(user: User): Promise<any>{
    console.log(user);
    const {id} = user;

    return this.pizzaRepository.getUserPizzas(user);
    //const record = await this.pizzaRepository.findOne({where: {user.id, id}});
   // return record;
  }

  async getPizzaById(item_id: string, user: User): Promise<any>{

    return this.pizzaRepository.getPizzaById(item_id, user);
    //const { id } = user;



   // const record = this.pizzaRepository.findOne({where: {id, user}})

   // if(!record){
   //   throw new NotFoundException();
   // }

   // return record;

  // console.log(user);
   //console.log(id);
  }
 // async getTaskById(id: string, user: User): Promise<Pizza> {
   // const record = this.pizzaRepository.findOne({ where: { id, user } });
   // if (!record) {
   //   throw new NotFoundException();
   // }
   // return record;
  //}


  createPizza(createPizzaDto: CreatePizzaDto, user: User): Promise<Pizza> {
    return this.pizzaRepository.createTask(createPizzaDto, user);
  }

  async updatePizza(id: string, updatePizzaDto: UpdatePizzaDto, user: User){
    const pizza = await this.getPizzaById(id, user);

    const { size, description, toppings, crustType } = updatePizzaDto;

    pizza.size = size;
    pizza.description = description;
    pizza.toppings = toppings;
    pizza.crustType = crustType;

    await this.pizzaRepository.save(pizza);

    return pizza;
  }


  async deletePizza(id: string, user: User): Promise<void>{
   // const result = await this.pizzaRepository.delete({id, user});
    
    //if(result.affected === 0){
    //  throw new NotFoundException(`Task with ID ${id} does not exist.`);

   // }

   return this.pizzaRepository.deletePizza(id, user);

  }

  //async updateTaskStatus(id: string, taskStatus: TaskStatus, user: User): Promise<Task>{
  //  const task = await this.getTaskById(id, user);

  //  task.status = taskStatus;
   // await this.pizzaRepository.save(task);

 //  return task;
 // }
}
