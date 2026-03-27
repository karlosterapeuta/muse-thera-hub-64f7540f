import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushSubscriptionRecord {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  timezone: string;
}

// Convert VAPID key from base64url to Uint8Array
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const rawData = atob(base64 + padding);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Import Web Push utilities using web-push npm package via esm.sh
async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<Response> {
  // Use the web-push library
  const webpush = await import("npm:web-push@3.6.7");
  
  webpush.setVapidDetails(
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  );

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };

  try {
    await webpush.sendNotification(pushSubscription, payload);
    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Web push error:', error);
    return new Response(error.message || 'Failed', { status: error.statusCode || 500 });
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!;
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const NOTIFICATION_MESSAGE = "Faça suas devolutivas com os pais usando a Escala Musetera!";
    const SCHEDULE_HOURS = [8, 12]; // 08:00 and 12:00

    // Get all active push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      return new Response(JSON.stringify({ error: 'Failed to fetch subscriptions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscriptions found', sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let sentCount = 0;
    let errorCount = 0;
    const removedEndpoints: string[] = [];

    for (const sub of subscriptions as PushSubscriptionRecord[]) {
      // Calculate current time in user's timezone
      const now = new Date();
      const userTime = new Date(now.toLocaleString('en-US', { timeZone: sub.timezone || 'America/Sao_Paulo' }));
      const currentHour = userTime.getHours();
      const currentMinute = userTime.getMinutes();

      // Check if it's time to send (within 30-minute window for each scheduled hour)
      const shouldSend = SCHEDULE_HOURS.some(hour => 
        currentHour === hour && currentMinute < 30
      );

      if (!shouldSend) continue;

      // Check for duplicate using schedule_key
      const dateStr = userTime.toISOString().split('T')[0];
      const scheduleKey = `${sub.user_id}_${dateStr}_${currentHour}`;

      const { data: existingLog } = await supabase
        .from('notification_logs')
        .select('id')
        .eq('schedule_key', scheduleKey)
        .maybeSingle();

      if (existingLog) continue; // Already sent

      // Send push notification
      try {
        const payload = JSON.stringify({
          title: '🎵 Musetera',
          body: NOTIFICATION_MESSAGE,
          icon: '/icon-original.png',
          badge: '/icon-original.png',
          tag: `musetera-${currentHour}`,
          data: {
            url: '/evaluation',
          },
        });

        const result = await sendWebPush(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          payload,
          vapidPublicKey,
          vapidPrivateKey,
          'mailto:contato@musetera.com'
        );

        if (result.status === 201 || result.status === 200) {
          // Log successful send
          await supabase.from('notification_logs').insert({
            user_id: sub.user_id,
            message: NOTIFICATION_MESSAGE,
            schedule_key: scheduleKey,
            status: 'sent',
          });
          sentCount++;
        } else if (result.status === 410 || result.status === 404) {
          // Subscription expired/invalid - remove it
          removedEndpoints.push(sub.endpoint);
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id);
        } else {
          errorCount++;
          console.error(`Failed to send to ${sub.user_id}: status ${result.status}`);
        }
      } catch (pushError) {
        errorCount++;
        console.error(`Push error for ${sub.user_id}:`, pushError);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Notifications processed',
        sent: sentCount,
        errors: errorCount,
        removed: removedEndpoints.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-notifications:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
