import { Cart } from 'src/cart/cart.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersRepository extends Repository<User>{
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, role } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword, role });
    try {
      //const abc = this.dataSource.getRepository(Cart);
     // await abc
      await this.save(user);
    } catch (error) {
      if (Number(error.code) === 23505) {
        //duplicate username
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  //async getUserTasks(user: User){
   // const { id } = user;

   // const record = this.findBy()

 // }
}
