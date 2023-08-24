import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distante-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JS Gym',
      description: '',
      phone: '61982121299',
      latitude: -15.8425925,
      longitude: -48.0990316
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.8425925,
      userLongitude: -48.0990316,
    });

    expect(checkIn.id).toEqual(expect.any(String))
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.8425925,
      userLongitude: -48.0990316,
    });

    await expect(() => sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.8425925,
      userLongitude: -48.0990316,
    }))
      .rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  });

  it("should not be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.8425925,
      userLongitude: -48.0990316,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.8425925,
      userLongitude: -48.0990316,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'CMX Gym',
      description: '',
      phone: '61982121299',
      latitude: new Decimal(-15.8297262),
      longitude: new Decimal(-48.0612646)
    })

    // -15.8761137,-48.090551 --- 100m da localizaçao do usuário
    // -15.8297262,-48.0612646 --- Mais de cem metros da localizaçao do usuário  

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -15.8761137,
        userLongitude: -48.090551,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  });
})
