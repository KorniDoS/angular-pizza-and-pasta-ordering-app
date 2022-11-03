import { UpdatePastaDto } from './dto/update-pasta.dto';
import { CreatePastaDto } from './dto/create-pasta.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PastaRepository } from './pasta.repository';
import { Pasta } from './pasta.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class PastaService {
  constructor(private readonly pastaRepository: PastaRepository) {}

  getPastas(): Promise<Pasta[]> {
    return this.pastaRepository.getPastas();
  }

  async getUserPastas(user: User): Promise<any> {
    console.log(user);
    const { id } = user;

    return this.pastaRepository.getUserPastas(user);
    //const record = await this.pastaRepository.findOne({where: {user.id, id}});
    // return record;
  }

  async getPastaById(item_id: string, user: User): Promise<any> {
    return this.pastaRepository.getPastaById(item_id);
    //const { id } = user;

    // const record = this.pastaRepository.findOne({where: {id, user}})

    // if(!record){
    //   throw new NotFoundException();
    // }

    // return record;

    // console.log(user);
    //console.log(id);
  }
  // async getTaskById(id: string, user: User): Promise<Pizza> {
  // const record = this.pastaRepository.findOne({ where: { id, user } });
  // if (!record) {
  //   throw new NotFoundException();
  // }
  // return record;
  //}

  createPasta(createPastaDto: CreatePastaDto, user: User): Promise<Pasta> {
    return this.pastaRepository.createPasta(createPastaDto, user);
  }

  async updatePasta(id: string, updatePastaDto: UpdatePastaDto, user: User) {
    const pasta = await this.getPastaById(id, user);

    const { description, toppings } = updatePastaDto;

    pasta.description = description;
    pasta.toppings = toppings;

    await this.pastaRepository.save(pasta);

    return pasta;
  }

  async deletePasta(id: string, user: User): Promise<void> {
    // const result = await this.pastaRepository.delete({id, user});

    //if(result.affected === 0){
    //  throw new NotFoundException(`Task with ID ${id} does not exist.`);

    // }

    return this.pastaRepository.deletePasta(id, user);
  }

  //async updateTaskStatus(id: string, taskStatus: TaskStatus, user: User): Promise<Task>{
  //  const task = await this.getTaskById(id, user);

  //  task.status = taskStatus;
  // await this.pastaRepository.save(task);

  //  return task;
  // }
}
