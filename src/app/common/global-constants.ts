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
          menuIcon: 'local_shipping',
          routePath: 'vehicles',
        },
        {
          menuName: 'Nationality',
          menuIcon: '',
          routePath: 'nationality',
        },
        { menuName: 'WeighBridgeSetting', menuIcon: 'settings' , routePath: 'weighbridgesetting'},
        { menuName: 'Reports', menuIcon: 'analytics' , routePath: 'reports'},
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
      
      ];
      return menu;
    },

    getPortList(): any[] {
      let menu = [
        { key: '1', value: '1' },
        { key: '2', value: '2' },
        { key: '3', value: '3' },
        { key: '4', value: '4' },
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
        { key: '7', value: '7' },
        { key: '14', value: '14' },
        { key: '21', value: '21' },
        { key: '28', value: '28' },
      ];
      return menu;
    },

    getParityList(): any[] {
      let menu = [
        { key: 'a', value: 'a' },
        { key: 'b', value: 'b' },
        { key: 'c', value: 'c' },
        { key: 'd', value: 'd' },
      ];
      return menu;
    },

    getStopBitsList(): any[] {
      let menu = [
        { key: '1', value: '1' },
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
  };
}

export interface LeftMenuItem {
  menuName: string;
  menuIcon: string;
  routePath?: string;
}
