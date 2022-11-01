import { JwtPayload } from './../../dist/auth/dto/jwt-payload.dto.d';
import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private usersRepository: UsersRepository,
        private configService: ConfigService){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPayload): Promise<User>{
        const {username} = payload;
        const user: User = await this.usersRepository.findOne({where: {username}});

        if(!user){
            throw new UnauthorizedException();
        }
        //console.log(user);
        return user;
    }
}