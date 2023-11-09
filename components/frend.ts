import fs from 'fs'

export interface friend {
    name: string;
    link: string;
    desc: string;
    avatar: string;
}

export const getFriends = (): friend[] => {
    const file = "data/friends.json"
    const content = fs.readFileSync(file, 'utf-8')
    const friends: friend[] = JSON.parse(content)
    return friends;
}