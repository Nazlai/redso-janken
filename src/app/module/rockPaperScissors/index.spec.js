/* eslint-disable no-undef */

import { getWinner } from "./";

const draw = { result: ["draw"] };

describe("tests draw", () => {
  test("should return draw if one of each weapons are present", () => {
    expect(
      getWinner([
        { player: "john", weapon: "ROCK" },
        { player: "nate", weapon: "PAPER" },
        { player: "robinson", weapon: "SCISSOR" },
      ])
    ).toEqual(draw);
  });
  test("should return draw if all weapons are same", () => {
    expect(
      getWinner([
        { player: "john", weapon: "ROCK" },
        { player: "nate", weapon: "ROCK" },
        { player: "robinson", weapon: "ROCK" },
      ])
    ).toEqual(draw);
  });
  test("should return draw if all weapons are same", () => {
    expect(
      getWinner([
        { player: "john", weapon: "ROCK" },
        { player: "nate", weapon: "ROCK" },
      ])
    ).toEqual(draw);
  });
});

describe("tests win condition", () => {
  test("should return players if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: "PAPER" },
        { player: "nate", weapon: "PAPER" },
        { player: "robinson", weapon: "ROCK" },
      ])
    ).toEqual({ result: ["john", "nate"] });
  });
  test("should return players if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: "PAPER" },
        { player: "nate", weapon: "ROCK" },
      ])
    ).toEqual({ result: ["john"] });
  });
  test("should return player if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: "ROCK" },
        { player: "nate", weapon: "PAPER" },
      ])
    ).toEqual({ result: ["nate"] });
  });
  test("should return player if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: "ROCK" },
        { player: "nate", weapon: "SCISSOR" },
      ])
    ).toEqual({ result: ["john"] });
  });
  test("should return player if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: "PAPER" },
        { player: "nate", weapon: "SCISSOR" },
      ])
    ).toEqual({ result: ["nate"] });
  });
});
