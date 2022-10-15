export class Product {
    // public Id: string;
    public productCode:string;
    public productName: string;
    public productGroup: ProductGroup[];
    public productPrice: string;
  }

  export class ProductGroup {
    // public Id: string;
    public groupCode: string;
    public groupName: string;
  }
  