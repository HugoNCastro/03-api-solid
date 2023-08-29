import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { FetchNearbGymsUseCase } from "../fetch-nearby-gyms"

export function makeFecthNearbyGymsUseCase() {
  const gymsRepository  = new PrismaGymsRepository()
  const useCase = new FetchNearbGymsUseCase(gymsRepository)

  return useCase
}