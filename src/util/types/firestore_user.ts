import { FieldValue } from "@firebase/firestore";

export interface __DOC__USER {
    uid: string;
    name: string;
    membership: string;
    sponsor: Array<string>;
    latest: FieldValue;
    friend_list: Array<string>;
    email: string;
}

export interface __DOC__PUBLIC_INFO {
    uid: string;
    name: string;
    email: string;
    img: string;
}

export interface __DOC__MY_STUDY_GROUP {
    enter_at: number;
    last_read: string;
}

export interface __DOC__MONTHLY_TASK {
    [key: string]: Array<TaskUnit>;
}

export interface __DOC__PUBLIC_FRIEND_REQUEST {
    sent: Array<FriendRequest>;
    received: Array<FriendRequest>;
}

export interface __DOC__MY_STUDY_GROUP {
    enter_at: number;
    last_read: string;
    name: string;
}

export interface Friend {
    uid: string;
    accept: boolean;
}

interface TaskUnit {
    category: string;
    name: string;
    min: number;
    fulfilled: number;
    step: 'define' | 'ongoing' | 'finish' | 'done';
}

interface FriendRequest {
    uid: string;
    tp: number;
}