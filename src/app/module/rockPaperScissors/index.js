export const ROCK = "ROCK";
export const PAPER = "PAPER";
export const SCISSOR = "SCISSOR";

const outcome = {
  ROCK: [SCISSOR],
  PAPER: [ROCK],
  SCISSOR: [PAPER],
};

export const getWinText = {
  ROCK: "ROCK SMASHES SCISSOR",
  PAPER: "PAPER COVERS ROCK",
  SCISSOR: "SCISSOR CUTS PAPER",
};

export const getWinner = (players) => {
  if (!players.length) {
    return { isDraw: false, winners: [], winningWeapon: "" };
  }
  const weapons = players.map((i) => i.weapon);
  if (hasAllWeapons(weapons) || hasSameWeapon(weapons)) {
    return { isDraw: true, winners: [], winningWeapon: "" };
  }
  const winningWeapon = getWinningWeapon(weapons);
  const result = players
    .filter((i) => i.weapon === winningWeapon)
    .map((i) => i.player);
  return { isDraw: false, winners: result, winningWeapon: winningWeapon };
};

const hasAllWeapons = (weapons) => {
  return new Set(weapons).size === Object.keys(outcome).length;
};

const hasSameWeapon = (weapons) => {
  return new Set(weapons).size === 1;
};

const getWinningWeapon = (weapons) => {
  const [weaponA, weaponB] = [...new Set(weapons)];
  return (
    (outcome[weaponA].includes(weaponB) && weaponA) ||
    (outcome[weaponB].includes(weaponA) && weaponB)
  );
};
