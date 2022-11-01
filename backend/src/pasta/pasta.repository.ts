
import { CreatePastaDto } from './dto/create-pasta.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, QueryBuilder, Repository } from 'typeorm';
import { TrueOrFalse } from './true-false.enum';
import { Pasta } from './pasta.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class PastaRepository extends Repository<Pasta> {
  constructor(private dataSource: DataSource) {
    super(Pasta, dataSource.createEntityManager());
  }

  async getPastas(): Promise<Pasta[]> {
   // const { role, global } = getPizzasFilterDto;

    const query = this.createQueryBuilder('pasta');

    query.where('pasta.global = 1');

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

  async createPasta(createPastaDto: CreatePastaDto, user: User): Promise<Pasta> {
    const { name, description, price, global, image, toppings } = createPastaDto;
    console.log(global);
    console.log(user.role);

    if (user.role === 'admin') {
      const task = this.create({
        name,
        description,
        price: price,
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
        image: image,
        toppings: toppings,
        global: TrueOrFalse.FALSE,
        user,
      });
      await this.save(task);
      return task;
    }
  }

  async getUserPastas(user: User): Promise<Pasta[]> {
    // const {id} = user;
    //const record = this.findOne({where: {id, user.id}})

    const {id} = user;
    console.log(id);
    const query = this.createQueryBuilder('pasta');
    query.where('pasta.userId = :id', {id});

    const pastas = await query.getMany();

    return pastas;
    
  }


  async getPastaById(id: string){
    const query = this.createQueryBuilder('pasta');

    query.where('pasta.id = :id', {id});

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

   async deletePasta(id: string, user: User): Promise<void>{
    const {pasta} = user;
    console.log(pasta);
   const found = await this.findOne({where: {id}});

   //console.log(found);

   if(!!found){
      this.delete(id);
    }

   // return found;

   }
}
