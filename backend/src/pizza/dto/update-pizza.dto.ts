//import { IsEnum } from 'class-validator';
//import { TaskStatus } from '../pizza-meta.enum';

import { CrustType, Size } from "../pizza-meta.enum";

//export class UpdateTaskStatusDto {
//  @IsEnum(TaskStatus)
 // status: TaskStatus;
//}


export class UpdatePizzaDto{
  toppings: string[];

  description?: string;

  size: Size;
  crustType: CrustType;


}
