import {FieldValue, Timestamp} from 'firebase/firestore'

export interface __DOC__STUDY_GROUP {
    active: boolean;
    create_at: FieldValue | Timestamp;
    end_at: FieldValue | Timestamp;
    gid: string;
    description: string;
    img: string;
    members: Array<string>;
    title: string;
    host: string;
}

export interface CHAT_MESSAGE {
    // "text" | MIME type
    type: string;

    // unix timestamp milliseconds
    tp: number;

    // sender uid
    sender: string;

    // case 
    // type: "text", message: text message
    // type: MIME type, message: download url
    message: string;

    // case
    // type: MIME type of image/*, video/*, file_name is empty string("")
    // type: MIME type of others like document files, pdf, file_name is the file_name uploader uploads. 
    filename?: string;

}