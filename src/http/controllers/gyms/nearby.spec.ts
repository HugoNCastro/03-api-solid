import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        latitude: -15.8425925,
        longitude: -48.0990316,
        description: 'near gym',
        phone: null
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        latitude: -15.79332,
        longitude: -47.8854303,
        description: 'far gym',
        phone: null
      })


    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -15.8425925,
        longitude: -48.0990316,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()


    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym'
      })
    ])

  })
})