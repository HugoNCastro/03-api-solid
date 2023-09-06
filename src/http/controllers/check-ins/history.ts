import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFecthUserCheckInsHistory } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'


export async function history(request: FastifyRequest, reply: FastifyReply) {
  const historyCheckInQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  })

  const { page } = historyCheckInQuerySchema.parse(request.query)

  const fecthUserCheckInsHistory = makeFecthUserCheckInsHistory()

  const { checkIns } = await fecthUserCheckInsHistory.execute({
    userId: request.user.sub,
    page
  })

  return reply.status(200).send({
    checkIns
  })
}
