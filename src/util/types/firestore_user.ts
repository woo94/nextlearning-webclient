import { FieldValue } from "@firebase/firestore";

export interface __DOC__USER {
    uid: string;
    name: string;
    membership: string;
    sponsor_list: Array<string>;
    latest: FieldValue;
    friend_list: Array<string>;
    study_group_list: Array<string>;
    img: string;
    email: string;
}

export interface __DOC__PUBLIC_INFO {
    uid: string;
    name: string;
    email: string;
    img: string;
}

export interface __DOC__PRIVATE_MY_STUDY_GROUP {
    [key: string]: {
        last_read: string;
    }
}

export interface __DOC__MONTHLY_TASK {
    [key: string]: Array<TaskUnit>;
}

export interface __DOC__PUBLIC_FRIEND_REQUEST {
    sent: Array<FriendRequest>;
    received: Array<FriendRequest>;
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