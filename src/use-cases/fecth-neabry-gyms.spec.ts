import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbGymsUseCase(gymsRepository);
  })

  it("should be able to fetch nearby gym", async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -15.8425925,
      longitude: -48.0990316,
      description: null,
      phone: null
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -15.79332,
      longitude: -47.8854303,
      description: null,
      phone: null
    })

    const { gyms } = await sut.execute({
      userLatitude: -15.8761137,
      userLongitude: -48.090551,
    });

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  });

  //-15.79332,-47.8854303 -- localidade acima de 10km
})
