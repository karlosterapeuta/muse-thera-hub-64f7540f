import { supabase } from '@/integrations/supabase/client';

// VAPID public key - this is safe to expose client-side
const VAPID_PUBLIC_KEY = 'BDzX3qpFSJh5g_OqxNi_Uy_FxPqFhPA8c2CO4OaaQekqBj_P1hRN2tDJHaQ2x4TtEBOO9PVqCOieMrpQXMkl6Y0';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerPushSubscription(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('[Push] Push notifications not supported');
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('[Push] Permission denied');
      return 'denied';
    }

    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready;
    
    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }

    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn('[Push] No authenticated user');
      return 'denied';
    }

    // Extract keys from subscription
    const subscriptionJson = subscription.toJSON();
    const p256dh = subscriptionJson.keys?.p256dh || '';
    const auth = subscriptionJson.keys?.auth || '';
    const endpoint = subscription.endpoint;

    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';

    // Save to database (upsert)
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: session.user.id,
          endpoint,
          p256dh,
          auth,
          timezone,
        },
        { onConflict: 'user_id,endpoint' }
      );

    if (error) {
      console.error('[Push] Error saving subscription:', error);
      return 'denied';
    }

    console.log('[Push] Subscription registered successfully');
    return 'granted';
  } catch (error) {
    console.error('[Push] Registration error:', error);
    return 'denied';
  }
}

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function getPushPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}
