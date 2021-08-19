
// caution: filter out the self messaging when create the chat trigger
export interface PrivateMessage {
    sender: string;
    receiver: string;
    text: string;
    tp: Date;
    read: boolean;
}

export interface GroupMessage {
    sender: string;
    group_id: string;
    text: string;
    tp: Date;
}

type MaxKey = string;

export interface GroupInfo {
    host: string;
    creation_time: Date;
    active: boolean;
    members: {
        [key: string]: MaxKey;
    }
    end_time: Date;
}

export interface PrivateInfo {
    creation_time: Date;
    active: boolean;
    end_time: Date;
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