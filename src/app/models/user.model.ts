export class User {
    id!: number;
    email!: string;
    password!: string;  
    token!: string;
    language!:string;
    userName!:string;
    registeredDate?:Date;
    role!:string;
}

export interface tableOperation {
    data:any,
    action:string
  }

  export class signup {
    email!: string;
    password!: string;  
    username!:string;
    role!:string[];
}