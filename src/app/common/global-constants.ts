export class GlobalConstants {
  api = {};

  url = {};

  static STATES_DATA = null;

  public static ROUTE_URLS = {
    dashboard: '/dashboard',
    admin: '/admin',
    login: '/login',
  };





  public static commonFunction = {

    addMonths(date: Date, months: number) {
      var d = date.getDate();
      date.setMonth(date.getMonth() + +months);
      if (date.getDate() != d) {
        date.setDate(0);
      }
      return date;
    },
    getMinMaxDate() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();
      const minDate = new Date(currentYear - 60, 0, 1);
      const maxDate = new Date(currentYear - 18, currentMonth, currentDay);
      return [minDate, maxDate];
    },

    getAdminChildMenu() {
      let menu = [
        { name: 'Users', route: 'users' },
        { name: 'Farmers', route: 'farmers' },
        { name: 'Company', route: 'company' },
      ];
      return menu;
    },

    isEmptyObject(value: object): boolean {
      if (value) {
                return Object.keys(value).length === 0
                    && value.constructor === Object; //  constructor check
            }
      return true;
    },

    getUserLanguages() {
      let menu = [
        { key: 'en', value: 'English' },
        { key: 'ar', value: 'Arabic' },
      ];
      return menu;
    },

    getUserRoles() {
      let menu = [
        { key: 'admin', value: 'Admin' },
        { key: 'user', value: 'User' },
      ];
      return menu;
    },

    getNewUserRoles() {
      let menu = [
        { key: 'SUPERADMIN', value: '5' },
        { key: 'TECHNICIAN', value: '4' },
        { key: 'ADMIN', value: '3' },
        { key: 'SUPERVISOR', value: '2' },
        { key: 'OPERATOR', value: '1' },
        { key: 'USER', value: '0' },
      ];

      return menu;
    },

    getLeftNavMenuItemsList(): LeftMenuItem[] {

      return [
        {
          menuName: 'Daily Transactions',
          menuIcon: '',
          routePath: 'transactions',
        },
        { menuName: 'Customer', menuIcon: '', routePath: 'customers' },
        { menuName: 'Supplier', menuIcon: '', routePath: 'suppliers' },
        {
          menuName: 'Transporters',
          menuIcon: '',
          routePath: 'transporters',
        },
        { menuName: 'Product', menuIcon: '', routePath: 'products' },
        {
          menuName: 'Vehicles',
          menuIcon: 'fa fa-truck',
          routePath: 'vehicles',
        },
        {
          menuName: 'Users',
          menuIcon: 'fa fa-user',
          routePath: 'users',
        },
        {
          menuName: 'Nationality',
          menuIcon: 'fa fa-flag',
          routePath: 'nationality',
        },
        { menuName: 'WeighBridgeSetting', menuIcon: 'fa fa-cog' , routePath: 'weighbridgesetting'},
        { menuName: 'Reports', menuIcon: 'fa fa-signal' , routePath: 'reports'},
        { menuName: 'Template', menuIcon: 'fa fa-signal' , routePath: 'template'},
      ];
    },
    getCurrentYear(): number {
      
      return new Date().getFullYear();
    },

    getNewUniqueId(inputData: any): string {
      let newId = inputData[inputData.length - 1]?.Id || 0;
      newId = newId + 1;
      return newId;
    },

    getPasswordResetQuestion(): any[] {
      let menu = [
        {
          key: 'Q1',
          value: 'What was the name of your first manager at your first job?',
        },
        { key: 'Q2', value: 'What was your favorite subject in high school?' },
        { key: 'Q3', value: 'What is your employee ID number?' },
        {
          key: 'Q4',
          value: 'Where did you go on your favorite vacation as a child?',
        },
        { key: 'Q5', value: 'What is the name of the road you grew up on?' },
      ];
      return menu;
    },

    getNationalityList(): any[] {
      let menu = [
        {
          Id: '1',
          Nationality: 'Indian',
        },
        {
          Id: '2',
          Nationality: 'Pakistani',
        },
        {
          Id: '3',
          Nationality: 'Saudi',
        },
        {
          Id: '4',
          Nationality: 'Syrian',
        },

        {
          Id: '5',
          Nationality: 'Turk',
        },
      ];

      return menu;
    },

    getGoodsOption(): any[] {
      let menu = [
        { key: 'INCOMING_GOODS', value: 'Incoming Goods' },
        { key: 'OUTGOING_GOODS', value: 'Outgoing Goods' },
      ];
      return menu;
    },

    getFormattedDate() {
      const date = new Date();
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');

      return  day + '/' + month + '/' + + year;
    },

    getFormattedSelectedDate(inputDate : Date) {
      const date = inputDate;
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');

      return  day + '/' + month + '/' + + year;
    },


    getOlderDate(months: number) :Date {
      const date = this.addMonths(new Date(),months);      
      return date;
    },

    getFormattedTime() {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutes1 = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes1 + ' ' + ampm;
      return strTime;
    },

    getAdminReportsOption(): any[] {
      let menu = [
        { key: 'customers', value: 'List Of Customers' },
        { key: 'suppliers', value: 'List Of Suppliers' },
        { key: 'transporter', value: 'List Of Transporters' },
        { key: 'products', value: 'List Of Products' },
        { key: 'vehicles', value: 'List Of Vehicles' },
        { key: 'customers', value: 'List Of Customers' },
        { key: 'customerprice', value: 'Customer Price List' },
        { key: 'supplierprice', value: 'Supplier Price List' },
        { key: 'loginhistory', value: 'Log In/Out History' },
        { key: 'productstock', value: 'Product Stock Status' },

      ];
      return menu;
    },

    getTransactionReportsOption(): any[] {
      let menu = [
        { key: 'customerreport', value: 'Report By Customer' },
        { key: 'supplierreport', value: 'Report By Supplier' },
        { key: 'vehiclereport', value: 'Report By Vehicle' },
        { key: 'transporterreport', value: 'Report By Transporter' },
        { key: 'incomingprodcut', value: 'Incoming Products' },
        { key: 'outgoingprodcut', value: 'Outgoing Products' },
        { key: 'datereport', value: 'Report By Date' },
        { key: 'datetimereport', value: 'Report By Date & Time' },   
        { key: 'summaryreportbycustomer', value: 'Summary Report By Customer' }, 
        { key: 'summaryreportbysupplier', value: 'Summary Report By Supplier' }, 
        { key: 'summaryreportbyproduct', value: 'Summary Report By Product' }, 
        { key: 'summaryreportbytransporter', value: 'Summary Report By Transporter' }, 
        { key: 'summaryreportbyvehicle', value: 'Summary Report By Vehicle' }, 
        { key: 'loginlogouthistoryreport', value: 'Log In and Log out History Report' }, 
      ];
      return menu;
    },

    getPortList(): any[] {
      let menu = [
        { key: '1', value: '1' },
        { key: '2', value: '2' },
        { key: '3', value: '3' },
        { key: '4', value: '4' },
        { key: '5', value: '5' },
        { key: '6', value: '6' },
        { key: '7', value: '7' },
        { key: '8', value: '8' },
        { key: '9', value: '9' },
      ];
      return menu;
    },

    getWeightList(): any[] {
      let menu = [
        { key: 'KG', value: 'KG' },
        { key: 'LB', value: 'LB' },        
      ];
      return menu;
    },


    getDataBitsList(): any[] {
      let menu = [
        { key: '4', value: '4' },
        { key: '5', value: '5' },
        { key: '6', value: '6' },
        { key: '7', value: '7' },
        { key: '8', value: '8' },
      ];
      return menu;
    },

    getParityList(): any[] {
      let menu = [
        { key: 'Odd', value: 'Odd' },
        { key: 'Even', value: 'Even' },
        { key: 'None', value: 'None' },
        { key: 'Mark', value: 'Mark' },
        { key: 'Space', value: 'Space' },
      ];
      return menu;
    },

    getStopBitsList(): any[] {
      let menu = [
        { key: '1', value: '1' },
        { key: '1.5', value: '1.5' },
        { key: '2', value: '2' },        
      ];
      return menu;
    },

    getBaudRateList(): any[] {
      let menu = [
        { key: '2400', value: '2400' },
        { key: '4800', value: '4800' },
        { key: '9600', value: '9600' },
        { key: '14400', value: '14400' },
        { key: '19200', value: '19200' },
        { key: '38400', value: '38400' },
      ];
      return menu;
    },
    getWeighBridgeType(): any[] {
      let menu = [
        { key: 'First Weight', value: 'FirstWeight',  },
        { key: 'Second Weight', value: 'SecondWeight',  },
      ];
      return menu;
    },

    getTemplateLabelNamesList(): any[] {
      return [
        { key: 'OperatorName', value: 'OperatorName' },
        { key: 'Role', value: 'Role' },
        { key: 'DateIn', value: 'DateIn' },
        { key: 'TimeIn', value: 'TimeIn' },
        { key: 'DateOut', value: 'DateOut' },
        { key: 'TimeOut', value: 'TimeOut' },
        { key: 'Sequence No', value: 'Sequence No' },
        { key: 'FirstWeight', value: 'FirstWeight' },
        { key: 'Customer/Supplier Name', value: 'Customer/Supplier Name' },
        { key: 'PlateNo', value: 'PlateNo' },
        { key: 'TransporterCode', value: 'TransporterCode' },
        { key: 'TransporterName', value: 'TransporterName' },
        { key: 'Supplier Code', value: 'Supplier Code' },
        { key: 'Supplier Name', value: 'Supplier Name' },
        { key: 'Customer Code', value: 'Customer Code' },
        { key: 'Customer Name', value: 'Customer Name' },
        { key: 'Product Code', value: 'Product Code' },
        { key: 'Product Name', value: 'Product Name' },
        { key: 'No of Pieces', value: 'No of Pieces' },
        { key: 'Driver License No', value: 'Driver License Name' },
        { key: 'Nationality', value: 'Nationality' },
        { key: 'Second Weight', value: 'Second Weight' },
        { key: 'Deduct Weight', value: 'Deduct Weight' },
        { key: 'Net Weight', value: 'Net Weight' },
        { key: 'Price per Ton', value: 'Price per Ton' },
        { key: 'Total Price', value: 'Total Price' },
        { key: 'Delivery Note', value: 'Delivery Note' },
        { key: 'Delivery Instructions', value: 'Delivery Instructions' },
        { key: 'Order No', value: 'Order No' },
      ];
    },
    getTemplateLabelValuesList(): string[] {
      return [
        'OperatorName_V',
        'Role_V',
        'DateIn_V',
        'TimeIn_V',
        'DateOut_V',
        'TimeOut_V',
        'Sequence No_V',
        'FirstWeight_V',
        'Customer/Supplier Name_V',
        'PlateNo_V',
        'TransporterCode_V',
        'TransporterName_V',
        'Supplier Code_V',
        'Supplier Name_V',
        'Customer Code_V',
        'Customer Name_V',
        'Product Code_V',
        'Product Name_V',
        'No of Pieces_V',
        'Driver License No_V',
        'Nationality_V',
        'Second Weight_V',
        'Deduct Weight_V',
        'Net Weight_V',
        'Price per Ton_V',
        'Total Price_V',
        'Delivery Note_V',
        'Delivery Instructions_V',
        'Order No_V',
      ];
    },
  };
}

export interface LeftMenuItem {
  menuName: string;
  menuIcon: string;
  routePath?: string;
}

export enum UserRoles {
  SUPERADMIN = 5,
  TECHNICIAN = 4,
  ADMIN = 3,
  SUPERVISOR = 2,
  USER = 1,
}


export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  TECHNICIAN = "TECHNICIAN",
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  OPERATOR ="OPERATOR",
  USER = "USER",
}