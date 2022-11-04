
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, QueryBuilder, Repository } from 'typeorm';
import { CrustType, Size, TrueOrFalse } from './pizza-meta.enum';
import { Pizza } from './pizza.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class PizzasRepository extends Repository<Pizza> {
  constructor(private dataSource: DataSource) {
    super(Pizza, dataSource.createEntityManager());
  }

  async getPizzas(): Promise<Pizza[]> {
   // const { role, global } = getPizzasFilterDto;

    const query = this.createQueryBuilder('pizza');

    query.where('pizza.global = 1');

    // if(role){
    // query.andWhere('pizza.global = :global', {global});
    // }

    // if(search){
    // query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', {search: `%${search}%`});
    // }
    //
    const tasks = await query.getMany();

    return tasks;
  }
  async createTask(createPizzaDto: CreatePizzaDto, user: User): Promise<Pizza> {
    const { name, description, price, size, crustType, global, image, toppings } = createPizzaDto;
    //console.log(global);
   // console.log(user.role);

    console.log(user);

    if (user.role === 'admin') {
      const task = this.create({
        name,
        description,
        price: price,
        size: size,
        crustType: crustType,
        global: TrueOrFalse.TRUE,
        image: image,
        toppings: toppings,
        user,
      });

      await this.save(task);
      return task;
    } else {
      const task = this.create({
        name,
        description,
        price: price,
        size: size,
        crustType: crustType,
        image: image,
        toppings: toppings,
        global: TrueOrFalse.FALSE,
        user,
      });
      await this.save(task);
      return task;
    }
  }

  async getUserPizzas(user: User) {
    // const {id} = user;
    //const record = this.findOne({where: {id, user.id}})

    const {id} = user;

    const query = this.createQueryBuilder('pizza');
    query.where('pizza.userId = :id', {id});

    const pizzas = await query.getMany();

    return pizzas;
    
  }


  async getPizzaById(id: string, user: User){
    const query = this.createQueryBuilder('pizza');

    query.where('pizza.id = :id ', {id: id});
    
    if(await query.getCount() === 0){
      throw new NotFoundException(`Item with ${id} does not exist`);
    } else { 
     // await query;
     const pizza = await query.getOne();
      return pizza;
    }
  }
  //async deleteTask(id: string): Promise<Task>{
  //   this.delete()
  //}

   async deletePizza(id: string, user: User): Promise<any>{
    const {pizza} = user;
    console.log(pizza);
   const found = await this.findOne({where: {id}});

   //console.log(found);

   if(!!found){
      this.delete(id);
    }

   // return found;

   }
}
