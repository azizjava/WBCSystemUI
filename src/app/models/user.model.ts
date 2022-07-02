export class User {
    id!: number;
    email!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    token!: string;
    language!:string;
}

export interface tableOperation {
    data:any,
    action:string
  }