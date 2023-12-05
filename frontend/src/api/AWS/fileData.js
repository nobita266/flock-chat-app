import { ENDPOINT } from "../../constants";

export const putFileDataInAWSS3 = async ({
  preSignedUrl,
  contentType,
  requestBody,
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", contentType);
  const file = requestBody;

  return await fetch(preSignedUrl, {
    method: "PUT",
    headers: myHeaders,
    body: file,
    redirect: "follow",
  });
};

export const fetchPreSignedGetUrl = async ({ fileName, accessToken }) =>
  await fetch(`${ENDPOINT}/api/message/fetchPreSignedGetUrl/${fileName}`, {
    method: "GET",
    headers: { authorization: `JWT ${accessToken}` },
  });
