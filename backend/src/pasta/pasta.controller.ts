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
import { CreatePastaDto } from './dto/create-pasta.dto';
import {Pasta } from './pasta.entity';
import { PastaService} from './pasta.service';
import { ConfigService } from '@nestjs/config';
import { UpdatePastaDto } from './dto/update-pasta.dto';
@Controller('pasta')
@UseGuards(AuthGuard())
export class PastaController {
  constructor(private pastaService: PastaService,
    /*private configService: ConfigService*/) {
      //console.log(configService.get('TEST_VALUE'))
    }

  @Get()
  getPastas(): Promise<Pasta[]> {
    return this.pastaService.getPastas();
  }

  @Get('/user')
  getUserPastas(@GetUser() user:User): Promise<any>{
    return this.pastaService.getUserPastas(user);
  }

  //@Get('/:id')
 // getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<PaSTA> {
  //  return this.pastaService.getTaskById(id, user);
  //}


  @Get('/:item_id')
  getPastaById(@Param('item_id') id:string, @GetUser() user: User){
    return this.pastaService.getPastaById(id, user);
  }

  @Post()
  createPasta(@Body() createPaSTADto: CreatePastaDto,
  @GetUser() user: User): Promise<Pasta> {
    return this.pastaService.createPasta(createPaSTADto, user);
  }

  @Delete('/:id')
  deletePasta(@Param('id') id: string, @GetUser() user: User): Promise<void> {
   return this.pastaService.deletePasta(id, user);
  }

  @Patch('/:id')
  updatePasta(
   @Param('id') id: string,
   @Body() updatePastaDto: UpdatePastaDto,
   @GetUser() user: User,
  ): Promise<Pasta> {
  //const { status } = UpdatePaSTADto;
   return this.pastaService.updatePasta(id, updatePastaDto, user);
  }
}
