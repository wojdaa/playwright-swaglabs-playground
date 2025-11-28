import * as dotenv from 'dotenv'
import * as path from 'path'
import users from '../test-data/users.json'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

export const config = {
    password: process.env.PASSWORD,
    users: users,
    timeout: {
        default: 30000,
        performance: 60000,
    },
}

export type UserType = keyof typeof users

export const getUser = (userType: UserType) => {
    return {
        username: config.users[userType].username,
        password: config.password,
    }
}
