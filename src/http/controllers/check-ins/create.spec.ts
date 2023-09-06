import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -15.8425925,
        longitude: -48.0990316,
      }
    })

    const response = await request(app.server)
      .post(`/gyms/${(await gym).id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -15.8425925,
        longitude: -48.0990316,
      })

    expect(response.statusCode).toEqual(201)

  })
})