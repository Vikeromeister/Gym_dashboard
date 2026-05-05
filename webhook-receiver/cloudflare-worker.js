// Optional future backend: deploy this separately to Cloudflare Workers.
// GitHub Pages cannot receive Hevy webhook POST requests directly.
// Add HEVY_API_KEY as a Cloudflare Worker secret, not in frontend code.

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://vikeromeister.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
    }

    if (!payload.workoutId) {
      return new Response("Missing workoutId", { status: 400, headers: corsHeaders });
    }

    // Minimal behavior: acknowledge the webhook fast.
    // TODO: Store workoutId in KV, D1, Supabase, Firebase, etc.
    // TODO: Fetch full workout details with Hevy API from this backend only.
    // Example shape only; confirm auth header against the latest Hevy docs before production use.
    // const hevyResponse = await fetch(`https://api.hevyapp.com/v1/workouts/${payload.workoutId}`, {
    //   headers: { "api-key": env.HEVY_API_KEY },
    // });
    // const workout = await hevyResponse.json();

    return Response.json(
      { ok: true, receivedWorkoutId: payload.workoutId, receivedAt: new Date().toISOString() },
      { status: 200, headers: corsHeaders }
    );
  },
};
