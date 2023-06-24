export class ClientTemplate {
    public city: string;
    public clientID: number;
    public companyLogo: any;
    public companyName: string;
    public email: string;
    public localCreatedDateTime!: Date;
    public phoneNo: string; 
    public streetAddress: string;
    public zipCode: string;
    public templateType: string;
    public lastModifiedByUser!: string;
  }

  export enum TemplateType {
    PLAIN = 'PLAIN',
    HEADER ='HEADER',
    LOGO ='LOGO',
  }