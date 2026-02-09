import webpush from "web-push";

// VAPID Keys geradas (Idealmente mover Private Key para .env)
const publicVapidKey =
  "BKryKhtb9t-EUojf0YDFdO0fi62nMuMSt6thOzwNnBq9myoJkL8gnbHNhZ54JxqQMvoxLFz2MIs4_SGVFTHBNOI";
const privateVapidKey =
  process.env.VAPID_PRIVATE_KEY ||
  "XuadbR5FGRpUz7l7faO92VRyT1MDRIJmvyp_GPA_ovQ";

webpush.setVapidDetails(
  "mailto:contato@lnimoveis.com.br",
  publicVapidKey,
  privateVapidKey,
);

export const sendPushNotification = async (
  subscription: webpush.PushSubscription,
  payload: string,
) => {
  try {
    await webpush.sendNotification(subscription, payload);
    return true;
  } catch (error) {
    console.error("Error sending push notification:", error);
    return false;
  }
};
