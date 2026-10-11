import "server-only";

/**
 * Optional instant pings for new leads, in addition to email:
 * - SLACK_WEBHOOK_URL → Slack incoming webhook.
 * - TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID → message from your Telegram bot.
 * Both are skipped when not configured. Failures are thrown to the caller, which logs them.
 */
export async function notifyChannels(summary: string) {
  const jobs: Promise<void>[] = [];

  const slack = process.env.SLACK_WEBHOOK_URL;
  if (slack) {
    jobs.push(
      fetch(slack, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      }).then((response) => {
        if (!response.ok) throw new Error(`Slack webhook failed with ${response.status}`);
      }),
    );
  }

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChat = process.env.TELEGRAM_CHAT_ID;
  if (telegramToken && telegramChat) {
    jobs.push(
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChat,
          text: summary,
          disable_web_page_preview: true,
        }),
      }).then((response) => {
        if (!response.ok) throw new Error(`Telegram failed with ${response.status}`);
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  const failed = results.find((result) => result.status === "rejected");
  if (failed && failed.status === "rejected") throw failed.reason;
}
