export function startWebhookPSRV() {
    Bun.serve({
        port: process.env.PORT || 8080,
        async fetch(_req, _server) {
            return new Response(
                JSON.stringify({ error: "not found", status: 404 }),
                {
                    status: 404,
                },
            );
        },
    });
}
