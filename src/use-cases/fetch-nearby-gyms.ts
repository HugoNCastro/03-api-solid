import { Gym } from "@prisma/client"
import { GymsRepository } from "@/repositories/gyms-repository"

interface FetchNearbGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbGymsUseCase {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({
    userLatitude,
    userLongitude
  }: FetchNearbGymsUseCaseRequest): Promise<FetchNearbGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({ latitude: userLatitude, longitude: userLongitude })

    return {
      gyms,
    }
  }
} 