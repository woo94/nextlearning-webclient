import {Category} from './commonTypes'
import {FieldValue} from 'firebase/firestore'

export interface __DOC__MONTHLY_TASK {
    [key: string]: number | SingleTask | FieldValue;
    counter: number;
}

export type TimeOption = "" | "morning" | "afternoon" | "evening" | "night";

export type Step = "define" | "ongoing" | "finish" | "done";

export interface SingleTask extends TaskMetadata {
    daily_management: DailyManagement;
}

export interface TaskMetadata {
    category: Category;
    day_list: Array<number>;
    week_list: Array<number>;
    min: number;
    name: string;
    time_option: TimeOption;
    counter: number;
}

export interface DailyManagement {
    [key: string]: DailyAssignment
}

export interface DailyAssignment {
    id: string;
    min: number;
    // later name will be deleted
    name: string;
    result_list: Array<string>;
    step: Step;
    time_option: TimeOption;
    fulfilled: number;
    mode: "" | "timer" | "record";
}