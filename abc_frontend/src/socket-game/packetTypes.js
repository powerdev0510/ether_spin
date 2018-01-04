export const client = {
  ENTER: "ENTER",
  AUTH: "AUTH",
  // MSG: "MSG"
}

export const server = {
  ERROR: "ERROR", // notify error
  GAMEDATA: "GAMEDATA", // notify new game data after the state of game updated
  SUCCESS: { // sending success packet to single socket
      ENTER: "SUCCESS_ENTER",
      AUTH: "SUCCESS_AUTH",
      // MSG: "SUCCESS_MSG"
  }
}