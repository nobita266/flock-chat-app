import { ENDPOINT } from "../constants";

export const fetchChats = async (accessToken) =>
  await fetch(`${ENDPOINT}/api/chat/fetchChats`, {
    method: "GET",
    headers: { authorization: `JWT ${accessToken}` },
  });

export const accessChat = async ({ accessToken, recieverUserId }) =>
  await fetch(`${ENDPOINT}/api/chat/accessChats`, {
    method: "POST",
    headers: {
      authorization: `JWT ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recieverUserId }),
  });

export const accessRoom = async ({ accessToken, roomName }) =>
  await fetch(`${ENDPOINT}/api/chat/accessRoom`, {
    method: "POST",
    headers: {
      authorization: `JWT ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName }),
  });

export const searchRooms = async ({ accessToken, search }) =>
  await fetch(`${ENDPOINT}/api/chat/searchRooms?chatName=${search}`, {
    method: "GET",
    headers: { authorization: `JWT ${accessToken}` },
  });

export const createRoom = async ({ accessToken, roomName }) =>
  await fetch(`${ENDPOINT}/api/chat/createRoom`, {
    method: "POST",
    headers: {
      authorization: `JWT ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName }),
  });
