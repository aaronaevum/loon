const node = $environment && $environment.params ? $environment.params.node : null;
const API = "https://my.ippure.com/v1/info";
const TIMEOUT = 8;
const MAX_TRY = 2;

function finish(title, subtitle, body) {
  $notification.post(title, subtitle, body);
  $done();
}

function riskOf(score) {
  if (isNaN(score)) return { icon: "⚪️", level: "无评分" };
  if (score >= 80) return { icon: "🔴", level: "极高风险" };
  if (score >= 60) return { icon: "🟠", level: "高风险" };
  if (score >= 40) return { icon: "🟡", level: "中等风险" };
  if (score >= 20) return { icon: "🟢", level: "低风险" };
  return { icon: "🟢", level: "极低风险" };
}

function query(attempt) {
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
      const title = `IPPure｜${node}`;

      if (err || !resp || resp.status !== 200) {
        if (attempt < MAX_TRY) return query(attempt + 1);
        const reason = err ? String(err) : `HTTP ${resp ? resp.status : "无响应"}`;
        return finish(title, "❌ 检测失败", `${reason}\n已重试 ${MAX_TRY - 1} 次，可能是节点不可用或接口限流`);
      }

      let d;
      try {
        d = JSON.parse(data);
      } catch (e) {
        return finish(title, "❌ 解析失败", String(data).slice(0, 100));
      }

      const score = Number(d.fraudScore);
      const risk = riskOf(score);
      const scoreText = isNaN(score) ? "无评分" : score;
      const subtitle = `${risk.icon} 欺诈分 ${scoreText}（${risk.level}）`;
      const body =
        `IP：${d.ip || "未知"}\n` +
        `位置：${[d.country, d.region, d.city].filter(Boolean).join(" ") || "未知"}\n` +
        `ASN：AS${d.asn || "?"} ${d.asOrganization || ""}\n` +
        `类型：${d.isResidential ? "住宅 IP" : "非住宅"}${d.isBroadcast ? "｜广播 IP" : ""}\n` +
        `耗时：${ms} ms`;

      finish(title, subtitle, body);
    }
  );
}

if (!node) {
  finish("IPPure 检测", "未选中节点", "请在节点列表里长按某个节点再运行");
} else {
  query(1);
}
