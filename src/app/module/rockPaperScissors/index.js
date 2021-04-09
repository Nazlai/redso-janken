export const ROCK = "ROCK";
export const PAPER = "PAPER";
export const SCISSOR = "SCISSOR";

const outcome = {
  ROCK: [SCISSOR],
  PAPER: [ROCK],
  SCISSOR: [PAPER],
};

export const getWinner = (players) => {
  if (!players.length) {
    return { result: [] };
  }
  const weapons = players.map((i) => i.weapon);
  if (hasAllWeapons(weapons) || hasSameWeapon(weapons)) {
    return { result: ["draw"] };
  }
  const winningWeapon = getWinningWeapon(weapons);
  const result = players
    .filter((i) => i.weapon === winningWeapon)
    .map((i) => i.player);
  return { result };
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
