import logger from "../config/logger.ts";

export const submitUserDetailsToShiftService = async (
  userId: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  designation: string,
) => {
  try {
    const response = await fetch("http://localhost:5003/api/details", {
      method: "POST",
      body: JSON.stringify({
        userId,
        firstName,
        lastName,
        phoneNumber,
        designation,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit user details`);
    }

    return;
  } catch (e) {
    logger.error(`Error submitting user details: ${e}`);
    throw new Error(`Error submitting user details: ${e}`);
  }
};
