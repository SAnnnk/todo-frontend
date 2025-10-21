// pushNotifications.js
import axios from "axios";

// Helper function: convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// Request Notification Permission & Subscribe User
export async function requestNotificationPermission(userId) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Web Push is not supported in this browser.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission denied!");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BO-AJuGGekp51spL207GrID8C5B59fpmOzL6l5d4SZLEb8crUEGRrgqCMucWQcwciE9AZNiipSpzrpaTNb7K6dw"
      )
    });

    console.log("✅ Web Push subscription:", subscription);

    await axios.post(`${process.env.REACT_APP_API_URL}/notifications/save-subscription`, {
      userId,
      subscription
    });

    alert("Notifications enabled!");
  } catch (error) {
    console.error("Error subscribing to Web Push:", error);
    alert("Failed to enable notifications.");
  }
}
