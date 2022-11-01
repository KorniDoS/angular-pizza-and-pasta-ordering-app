import { JwtPayload } from './jwt-payload';
import { Injectable, UnauthorizedException, Inject, forwardRef, Body } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CartRepository } from 'src/cart/cart.repository';
@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository, private jwtService: JwtService, private readonly cartRepository: CartRepository){}

    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void>{
        return this.usersRepository.createUser(authCredentialsDto);
    }


    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        const {username, password, role} = authCredentialsDto;

        const user = await this.usersRepository.findOne({where: {username}});

        if(user && (await bcrypt.compare(password, user.password) )){

          const payload: JwtPayload = {username};
          const accessToken: string = await this.jwtService.sign(payload);
          return {accessToken};

        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }

    }

}
