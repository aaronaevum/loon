const node = $environment && $environment.params ? $environment.params.node : null;
const API = "https://my.ippure.com/v1/info";
const TIMEOUT = 8;
const MAX_TRY = 2;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function show(title, lines) {
  $done({ title: title, htmlMessage: lines.map(esc).join("<br>") });
}

function riskOf(score) {
  if (isNaN(score)) return { icon: "⚪️", level: "无评分" };
  if (score >= 80) return { icon: "🔴", level: "极高风险" };
  if (score >= 60) return { icon: "🟠", level: "高风险" };
  if (score >= 40) return { icon: "🟡", level: "中等风险" };
  if (score >= 20) return { icon: "🟢", level: "低风险" };
  return { icon: "🟢", level: "极低风险" };
}

function query(attempt, lastErr) {
  const start = Date.now();
  $httpClient.get(
    {
      url: API,
      node: node,
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: TIMEOUT,
    },
    (err, resp, data) => {
      const ms = Date.now() - start;
      const title = "IPPure 检测";

      if (err || !resp || resp.status !== 200) {
        const reason = err ? String(err) : `HTTP ${resp ? resp.status : "无响应"}`;
        if (attempt < MAX_TRY) return query(attempt + 1, reason);
        return show(title, [
          "❌ 检测失败",
          `节点：${node}`,
          `原因：${reason}`,
          `已尝试 ${MAX_TRY} 次，最后一次耗时 ${ms} ms`,
        ]);
      }

      let d;
      try {
        d = JSON.parse(data);
      } catch (e) {
        return show(title, ["❌ 解析失败", `节点：${node}`, String(data).slice(0, 150)]);
      }

      const score = Number(d.fraudScore);
      const risk = riskOf(score);
      const scoreText = isNaN(score) ? "无评分" : score;

      show(title, [
        `${risk.icon} 欺诈分 ${scoreText}（${risk.level}）`,
        `IP：${d.ip || "未知"}`,
        `位置：${[d.country, d.region, d.city].filter(Boolean).join(" ") || "未知"}`,
        `ASN：AS${d.asn || "?"} ${d.asOrganization || ""}`,
        `类型：${d.isResidential ? "住宅 IP" : "非住宅"}${d.isBroadcast ? "｜广播 IP" : ""}`,
        `耗时：${ms} ms`,
        `节点：${node}`,
      ]);
    }
  );
}

if (!node) {
  show("IPPure 检测", ["未选中节点", "请在节点列表里长按某个节点再运行"]);
} else {
  query(1, "");
}
