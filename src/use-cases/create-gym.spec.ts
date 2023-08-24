import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  })

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
     title: 'Javascript Gym', 
     latitude: -15.8425925,
     longitude: -48.0990316,
     description: null,
     phone: null      
    });

    expect(gym.id).toEqual(expect.any(String))
  });
});
