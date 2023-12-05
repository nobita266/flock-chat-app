import { ENDPOINT } from "../constants";

export const searchUsers = async ({ accessToken, search }) =>
  await fetch(`${ENDPOINT}/api/user/searchUsers?user=${search}`, {
    method: "GET",
    headers: { authorization: `JWT ${accessToken}` },
  });
