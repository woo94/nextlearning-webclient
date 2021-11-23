import {__DOC__PLANNER} from 'src/util/types/firestore_planner'
import { __DOC__DAILY_MANAGEMENT } from '../types/firestore_daily_management'
export default 1

interface DayDate {
    year: number;
    month: number;
    // 0: sun ~ 6: sat
    day: number;
}

interface MonthDate {
    year: number;
    month: number;
    monthName: string;
    daysInMonth: number;
}

interface initialState {
    dates: {
        yesterday: DayDate;
        today: DayDate;
        tomorrow: DayDate;

        lastMonth: MonthDate;
        thisMonth: MonthDate;
        nextMonth: MonthDate;
    };

    plans: {
        lastMonth: __DOC__PLANNER;
        thisMonth: __DOC__PLANNER;
        nextMonth: __DOC__PLANNER;
    };

    dailyManagements: {
        lastMonth: __DOC__DAILY_MANAGEMENT;
        thisMonth: __DOC__DAILY_MANAGEMENT;
        nextMonth: __DOC__DAILY_MANAGEMENT;
    }
}