import { SignJWT, jwtVerify } from "jose";

// Convert your secret strings to Uint8Array
const encoder = new TextEncoder();
const accessSecret = encoder.encode(process.env.ACCESS_TOKEN_SECRET);
const refreshSecret = encoder.encode(process.env.REFRESH_TOKEN_SECRET);

function normalizePayload(payload) {
  if (payload.id && typeof payload.id !== 'string') {
    return { ...payload, id: payload.id.toString() };
  }
  return payload;
}

export const generateAccessToken = async (payload, expiresIn = "15m") => {
  const normalizedPayload = normalizePayload(payload);
  return new SignJWT(normalizedPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(accessSecret);
};

export const generateRefreshToken = async (payload, expiresIn = "7d") => {
  const normalizedPayload = normalizePayload(payload);
  return new SignJWT(normalizedPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(refreshSecret);
};


export const verifyAccessToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, accessSecret);
    return payload.id;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload.id;
  } catch (error) {
    return null;
  }
};
