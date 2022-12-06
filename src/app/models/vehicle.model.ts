import { Transporter } from "./transporter.model";

export class Vehicle {
    // public Id: string;
    public plateNo:string;
    public vehicleType: string;
    transporters: Transporter;
    vehicleWeight: number;
  }
  