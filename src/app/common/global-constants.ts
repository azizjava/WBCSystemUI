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

            return [{ menuName: 'Daily Transactions', menuIcon: '', routePath: "transactions" }, { menuName: 'Customer', menuIcon: '', routePath: "customers" }, { menuName: 'Supplier', menuIcon: '', routePath: "suppliers" }, { menuName: 'Transporters', menuIcon: '', routePath: 'transporters' },
            { menuName: 'Product', menuIcon: '', routePath: 'products' }, { menuName: 'Product Group', menuIcon: '', routePath: 'productgroup' }, { menuName: 'Vehicles', menuIcon: 'local_shipping', routePath: "vehicles" },
            { menuName: 'Operator', menuIcon: '', routePath: 'operators' }, { menuName: 'Nationality', menuIcon: '', routePath: "nationality" }, { menuName: 'Product prices', menuIcon: '' }, { menuName: 'Reports', menuIcon: 'analytics' }
            ];
        },
        getCurrentYear(): number {

            return new Date().getFullYear();
        },

        getNewUniqueId(inputData: any): string {
            let newId = inputData[inputData.length - 1]?.Id || 0;
            newId = newId +1;
            return newId;
        },

        getPasswordResetQuestion(): any[] {
            let menu = [
                { key: 'Q1', value: 'What was the name of your first manager at your first job?' },
                { key: 'Q2', value: 'What was your favorite subject in high school?' },
                { key: 'Q3', value: 'What is your employee ID number?' },
                { key: 'Q4', value: 'Where did you go on your favorite vacation as a child?' },
                { key: 'Q5', value: 'What is the name of the road you grew up on?' },
            ];
            return menu;
        },

        getNationalityList():any[] {

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
                { key: 'incoming', value: 'Incoming Goods' },
                { key: 'outgoing', value: 'Outgoing Goods' },              
            ];
            return menu;
        },

        getFormattedDate() {
            const date = new Date();
            let year = date.getFullYear();
            let month = (1 + date.getMonth()).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
          
            return month + '/' + day + '/' + year;
        },

        getFormattedTime() {
            const date = new Date();          
            let hours = date.getHours();
            let minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const minutes1 = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes1 + ' ' + ampm;
            return strTime;
        },

    };
}


export interface LeftMenuItem {
    menuName: string;
    menuIcon: string;
    routePath?: string;
};