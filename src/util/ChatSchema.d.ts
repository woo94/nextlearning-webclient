
declare namespace ChatSchema {
    // caution: filter out the self messaging when create the chat trigger
    export interface PrivateMessage {
        sender: string;
        receiver: string;
        text: string;
        tp: number;
        read: boolean;
    }

    export interface Chatlist_PrivateMessage {
        text: string;
        tp: number;
    }

    export interface GroupMessage {
        sender: string;
        group_id: string;
        text: string;
        tp: number;
    }

    type MaxKey = string;

    export interface GroupInfo {
        host: string;
        creation_time: number;
        active: boolean;
        members: {
            [key: string]: MaxKey;
        }
        end_time: number;
    }

    export interface PrivateInfo {
        creation_time: number;
        active: boolean;
        end_time: number;
        members: [string, string];
    }

    export interface GroupChatRoom {
        group_info: GroupInfo;
        [key: string]: GroupMessage | GroupInfo;
    }

    export interface PrivateChatRoom {
        private_info: PrivateInfo;
        [key: string]: PrivateMessage | PrivateInfo
    }
}