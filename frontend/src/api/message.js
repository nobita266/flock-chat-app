import { ENDPOINT } from "../constants";

export const fetchAllMessages = async ({ id, accessToken }) =>
  await fetch(`${ENDPOINT}/api/message/fetchAllMessages/${id}`, {
    headers: { authorization: `JWT ${accessToken}` },
    method: "GET",
  });

export const sendMessage = async ({ messageBody,accessToken }) =>
  await fetch(`${ENDPOINT}/api/message/sendMessage`, {
    method: "POST",
    headers: {
      authorization: `JWT ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: messageBody,
  });
