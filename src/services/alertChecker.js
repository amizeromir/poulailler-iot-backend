import { sendAlertEmail } from "./emailService.js";
 
export function checkAlerts(deviceId, data) {
  if (data.temperature > 35) {
    sendAlertEmail(
      "Alerte température élevée",
      `La température dépasse 35°C dans le poulailler (device ${deviceId}).`
    );
 
    return {
      type: "temp_high",
      message: "Température trop élevée !",
    };
  }
 
  if (data.temperature < 20) {
    sendAlertEmail(
      "Alerte température basse",
      `La température est inférieure à 20°C (device ${deviceId}).`
    );
 
    return {
      type: "temp_low",
      message: "Température trop basse !",
    };
  }
 
  if (data.ammonia > 25) {
    sendAlertEmail(
      "Alerte ammoniac",
      `Le niveau d'ammoniac dépasse 25 ppm dans le poulailler.`
    );
 
    return {
      type: "nh3_high",
      message: "Ammoniac trop élevé !",
    };
  }
 
  return null; // pas d'alerte
}