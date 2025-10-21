async function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeUser(userId) {
  const registration = await navigator.serviceWorker.register('/sw.js');

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('BHJfJCFE6hrArR4NN_mY1EiD1Cw1EaB4gMn7Jp10mxft9EqYrAbBuKI96CzpwKcSZsDoWT7agDgxfRPQkWxRnhI')
  });

  await fetch('/users/save-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription, userId })
  });

  console.log("✅ User subscribed for push notifications");
}
