import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()
  // 1 - buscar token dentro dos headers, caso não existe já é retornado erro 500
  // 2 - se esse token existir nos headers, ela verifica se foi gerado pela nossa aplicação | request.user os dados contidos no token ficam aqui dentro

  return reply.status(200).send()
}
