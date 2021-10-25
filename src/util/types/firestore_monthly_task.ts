import {Category} from './commonTypes'

export interface __DOC__MONTHLY_TASK {
    [key: string]: number | SingleTask;
    counter: number;
}

export enum dayEnum {
    sun = 0,
    mon,
    tue,
    wed,
    thu,
    fri,
    sat
}

export type TimeOption = "" | "morning" | "afternoon" | "evening" | "night";

export type Step = "define" | "ongoing" | "finish" | "done";

export type Day = keyof typeof dayEnum

export interface SingleTask extends TaskMetadata {
    daily_management: DailyManagement;
}

export interface TaskMetadata {
    category: Category;
    day_list: Array<keyof typeof dayEnum>;
    // later day_list will be replaced to:
    // day_list: Array<number>;
    week_list: Array<number>;
    min?: number;
    time?: number;
    name: string;
    time_option: TimeOption;
    counter: number;
}

export interface DailyManagement {
    [key: string]: DailyAssignment
}

export interface DailyAssignment {
    id: string;
    min?: number;
    time?: number;
    // later name will be deleted
    name?: string;
    result_list: Array<string>;
    step: Step;
    time_option: TimeOption;
    fulfilled: number;
}