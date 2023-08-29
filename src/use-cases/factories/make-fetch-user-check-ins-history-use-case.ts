import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history"
import { GetUserMetricsUseCase } from "../get-user-metrics"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"

export function makeFecthUserCheckInsHistory() {
  const checkinsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkinsRepository)

  return useCase
}