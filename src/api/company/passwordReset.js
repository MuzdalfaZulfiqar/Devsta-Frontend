// src/api/company/passwordReset.js
import axios from "axios";
import { BACKEND_URL } from "../../../config";


const BASE = `${BACKEND_URL}/api`;
/**
 * Step 1 – request an OTP to be emailed
 * @param {string} email
 */
export async function requestPasswordResetOtp(email) {
  const { data } = await axios.post(`${BASE}/company/auth/forgot-password`, { email });
  return data;
}

/**
 * Step 2 – verify the OTP the user typed
 * @param {string} email
 * @param {string} otp   6-digit code
 */
export async function verifyPasswordResetOtp(email, otp) {
  const { data } = await axios.post(`${BASE}/company/auth/verify-otp`, { email, otp });
  return data;
}

/**
 * Step 3 – set the new password
 * @param {string} email
 * @param {string} otp
 * @param {string} newPassword
 */
export async function resetCompanyPassword(email, otp, newPassword) {
  const { data } = await axios.post(`${BASE}/company/auth/reset-password`, {
    email,
    otp,
    newPassword,
  });
  return data;
}
