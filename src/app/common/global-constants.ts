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

        getLeftNavMenuItemsList(): LeftMenuItem[] {

            return [{ menuName: 'Daily Transactions', menuIcon: '' }, { menuName: 'Customer', menuIcon: '', routePath: "customers" }, { menuName: 'Supplier', menuIcon: '', routePath: "suppliers" }, { menuName: 'Transporter', menuIcon: '', routePath: 'transporters' },
            { menuName: 'Product', menuIcon: '', routePath: 'products' }, { menuName: 'Product Group', menuIcon: '', routePath: 'productgroup' }, { menuName: 'Vehicle', menuIcon: 'local_shipping', routePath: "vehicle" },
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
        }


    };
}


export interface LeftMenuItem {
    menuName: string;
    menuIcon: string;
    routePath?: string;
};