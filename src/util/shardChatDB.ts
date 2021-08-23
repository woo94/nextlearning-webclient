const DB1 = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R']
// const DB2 = ['S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9']

const private1 = "nextlearning-505ce-private-chat-1"
const private2 = "nextlearning-505ce-private-chat-2"
const group1 = "nextlearning-505ce-group-chat-1"
const group2 = "nextlearning-505ce-group-chat-2"

const instanceNameToURL = (name: string) => `https://${name}.firebaseio.com/`

export function getPrivateChatInstanceById(uid: string) {
    const firstChar = uid[0]
    
    if(DB1.includes(firstChar)) {
        return {
            instance: private1,
            url: instanceNameToURL(private1)
        }
    }
    else {
        return {
            instance: private2,
            url: instanceNameToURL(private2)
        }
    }
}

export function getPrivateChatInstanceByNum(num: number) {
    if(num === 1) {
        return private1
    }
    else {
        return private2
    }
}

export function getGroupChatInstanceById(gid: string) {
    const firstChar = gid[0]

    if(DB1.includes(firstChar)) {
        return {
            instance: group1,
            url: instanceNameToURL(group1)
        }
    }
    else {
        return {
            instance: group2,
            url: instanceNameToURL(group2)
        }
    }
}

export function getGroupChatInstanceByNum(num: number) {
    if(num === 1) {
        return group1
    }
    else {
        return group2
    }
}

