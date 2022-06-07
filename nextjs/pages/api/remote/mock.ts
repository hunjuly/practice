import { ResponseType } from './request'
import { HeadersMock } from './HeadersMock'

export async function requestMock<T>(path: string, init?: RequestInit): Promise<ResponseType<T>> {
    let data = {} as T
    let headers = new HeadersMock({})

    if (init?.method === 'POST') {
        if (path === '/users') {
            data = {
                url: '/users/7d901688-132e-455d-9f2c-39916ed58cb3',
                id: '7d901688-132e-455d-9f2c-39916ed58cb3',
                email: 'abc@email.com',
                isActive: true,
                role: 'user',
                createDate: '2022-06-03T06:03:19.000Z',
                updateDate: '2022-06-03T06:03:19.000Z',
                version: 1
            } as unknown as T
        } else if (path === '/auth/login') {
            data = {
                id: '7d901688-132e-455d-9f2c-39916ed58cb3',
                email: 'abc@email.com'
            } as unknown as T

            headers = new HeadersMock({
                'set-cookie':
                    'connect.sid=s%3A6meWHO9n9753EJPGSGQQqvbne4NerXk_.cbPBDXTHaJ7ffpci92o3aaSIPMMI6rfls2shVLasncM; Path=/; HttpOnly'
            })
        }
    }

    return { data, headers }
}
