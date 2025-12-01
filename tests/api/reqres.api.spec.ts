import { test, expect } from '@playwright/test'

const API_KEY = process.env.API_KEY || ''

test.describe('Reqres API test', () => {
    test('GET /users returns a list of users @api @regression', async ({
        request,
    }) => {
        const response = await request.get(
            'https://reqres.in/api/users?page=2',
            {
                headers: {
                    'x-api-key': API_KEY,
                },
            }
        )

        console.log('GET /users STATUS:', response.status())
        console.log('GET /users URL:', response.url())

        expect(response.status()).toBe(200)
        const responseBody = await response.json()
        expect(Array.isArray(responseBody.data)).toBe(true)
        expect(responseBody.data.length).toBeGreaterThan(0)
        const user = responseBody.data[0]
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('first_name')
        expect(user).toHaveProperty('last_name')
    })

    test('POST /users creates a new user @api @regression', async ({
        request,
    }) => {
        const newUser = {
            name: 'Arek QA',
            job: 'Automation Engineer',
        }

        const response = await request.post('https://reqres.in/api/users', {
            headers: {
                'x-api-key': API_KEY,
            },
            data: newUser,
        })

        console.log('POST /users STATUS:', response.status())
        console.log('POST /users URL:', response.url())

        expect(response.status()).toBe(201)

        const responseBody = await response.json()
        expect(responseBody.name).toBe(newUser.name)
        expect(responseBody.job).toBe(newUser.job)
        expect(responseBody.id).toBeTruthy()
        expect(responseBody.createdAt).toBeTruthy()
    })

    test('POST /login fails with missing password @api @regression', async ({
        request,
    }) => {
        const response = await request.post('https://reqres.in/api/login', {
            headers: {
                'x-api-key': API_KEY,
            },
            data: {
                email: 'peter@klaven',
            },
        })

        console.log('POST /login STATUS:', response.status())
        console.log('POST /login URL:', response.url())

        expect(response.status()).toBe(400)

        const responseBody = await response.json()
        expect(responseBody).toHaveProperty('error')
        expect(responseBody.error).toBe('Missing password')
    })
})
