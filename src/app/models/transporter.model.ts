export class Transporter {
    // public Id!: string;
    public transporterCode: string;
    public nameOfTransporter: string;
    public contactPerson: string;
    public mobileNo: string;
    public telephoneNo: string;
    public faxNo: string;
    public address: string;
    public localCreatedDateTime!: Date;
    public lastModifiedByUser!: string;   
  }

  export class TransporterList {
    public transporterCode: string;
    public nameOfTransporter: string;
  }
  