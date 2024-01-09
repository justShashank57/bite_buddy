import { IsEmail,Length } from "class-validator";
export class createCustomerInputs{

    @IsEmail()
    email:string;

    @Length(7,12)
    phone:string;

    @Length(6,12)
    password:string;
}

export class userLoginInputs{

    @IsEmail()
    email:string;

    @Length(6,12)
    password:string;
}

export class editCustomerProfileInputs{
     @Length(3,16)
     firstName:string;

     @Length(3,16)
     lastName:string;

     @Length(6,16)
     address:string;
}

export interface customerPayload{
       _id:string;
       email:string;
       verified:boolean;
}

export class cartItem{
    _id:string;
    unit:number;
}

export class orderInputs{
      txnId:string;
      amount:string;
      items:[cartItem];
}