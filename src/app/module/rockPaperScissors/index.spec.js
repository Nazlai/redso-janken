/* eslint-disable no-undef */

import { getWinner, ROCK, PAPER, SCISSOR } from "./";

const draw = { isDraw: true, winners: [], winningWeapon: "" };

describe("tests draw", () => {
  test("should return draw if one of each weapons are present", () => {
    expect(
      getWinner([
        { player: "john", weapon: ROCK },
        { player: "nate", weapon: PAPER },
        { player: "robinson", weapon: SCISSOR },
      ])
    ).toEqual(draw);
  });
  test("should return draw if one of each weapons are present", () => {
    expect(
      getWinner([
        { player: "john", weapon: ROCK },
        { player: "nate", weapon: PAPER },
        { player: "robinson", weapon: SCISSOR },
        { player: "duncan", weapon: SCISSOR },
      ])
    ).toEqual(draw);
  });
  test("should return draw if all weapons are same", () => {
    expect(
      getWinner([
        { player: "john", weapon: ROCK },
        { player: "nate", weapon: ROCK },
        { player: "robinson", weapon: ROCK },
      ])
    ).toEqual(draw);
  });
  test("should return draw if all weapons are same", () => {
    expect(
      getWinner([
        { player: "john", weapon: ROCK },
        { player: "nate", weapon: ROCK },
      ])
    ).toEqual(draw);
  });
});

describe("tests win condition", () => {
  test("should return players if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: PAPER },
        { player: "nate", weapon: PAPER },
        { player: "robinson", weapon: ROCK },
      ])
    ).toEqual({
      isDraw: false,
      winners: ["john", "nate"],
      winningWeapon: PAPER,
    });
  });
  test("should return players if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: PAPER },
        { player: "nate", weapon: ROCK },
      ])
    ).toEqual({ isDraw: false, winners: ["john"], winningWeapon: PAPER });
  });
  test("should return player if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: ROCK },
        { player: "nate", weapon: PAPER },
      ])
    ).toEqual({ isDraw: false, winners: ["nate"], winningWeapon: PAPER });
  });
  test("should return player if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: ROCK },
        { player: "nate", weapon: SCISSOR },
      ])
    ).toEqual({ isDraw: false, winners: ["john"], winningWeapon: ROCK });
  });
  test("should return player if using winning weapon", () => {
    expect(
      getWinner([
        { player: "john", weapon: PAPER },
        { player: "nate", weapon: SCISSOR },
      ])
    ).toEqual({ isDraw: false, winners: ["nate"], winningWeapon: SCISSOR });
  });
});

describe("test invalid data input", () => {
  test("should return empty array if input is empty", () => {
    expect(getWinner([])).toEqual({
      isDraw: false,
      winners: [],
      winningWeapon: "",
    });
  });
});
