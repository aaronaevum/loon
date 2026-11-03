const node = $environment && $environment.params ? $environment.params.node : null;
const TIMEOUT_MS = 8000;
const DEADLINE_MS = 45000;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const DISNEY_TOKEN = "ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84";
const COLOR = { green: "#1aa66b", red: "#e5484d", orange: "#e08a00", blue: "#1677ff", gray: "#8e8e93" };

const CN = {
  US: "美国", HK: "香港", JP: "日本", SG: "新加坡", TW: "台湾", KR: "韩国", GB: "英国", DE: "德国",
  FR: "法国", CA: "加拿大", AU: "澳大利亚", NL: "荷兰", RU: "俄罗斯", IN: "印度", MY: "马来西亚",
  TH: "泰国", VN: "越南", PH: "菲律宾", ID: "印度尼西亚", TR: "土耳其", AR: "阿根廷", BR: "巴西",
  IT: "意大利", ES: "西班牙", CH: "瑞士", SE: "瑞典", MO: "澳门", CN: "中国", AE: "阿联酋",
  IL: "以色列", PL: "波兰", MX: "墨西哥", CL: "智利", ZA: "南非", NG: "尼日利亚", EG: "埃及",
};

const data = { ippure: null, ippureErr: "", ipapi: null, scam: null, svc: {} };
let finished = false;

// ---------- 工具函数 ----------
const esc = (s) =>
  String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fc = (color, text) => `<font color="${color}">${esc(text)}</font>`;
const gray = (text) => `<font color="${COLOR.gray}" size="2">${esc(text)}</font>`;
const head = (text) => `<br><b><font color="${COLOR.blue}">▌ ${esc(text)}</font></b><br>`;
const flag = (cc) =>
  cc && /^[A-Za-z]{2}$/.test(cc)
    ? String.fromCodePoint(...cc.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
    : "🏳️";
const cname = (cc, fallback) => CN[String(cc || "").toUpperCase()] || fallback || cc || "未知";

function hget(h, name) {
  if (!h) return null;
  const k = Object.keys(h).find((x) => x.toLowerCase() === name);
  return k ? h[k] : null;
}

function riskOf(score) {
  if (score == null || isNaN(score)) return { level: "无评分", color: COLOR.gray };
  if (score >= 80) return { level: "极高风险", color: COLOR.red };
  if (score >= 60) return { level: "高风险", color: COLOR.red };
  if (score >= 40) return { level: "中等风险", color: COLOR.orange };
  if (score >= 20) return { level: "低风险", color: COLOR.green };
  return { level: "极低风险", color: COLOR.green };
}

// 统一请求：强制走选中节点；超时单位异常时自动去掉 timeout 重试
function call(method, opts) {
  return new Promise((resolve) => {
    const o = Object.assign({ node: node }, opts);
    o.headers = Object.assign({ "User-Agent": UA }, opts.headers || {});
    o.timeout = TIMEOUT_MS;
    const start = Date.now();
    $httpClient[method](o, (err, resp, body) => {
      const ms = Date.now() - start;
      if (err && ms < 500 && /timeout/i.test(String(err))) {
        delete o.timeout;
        const s2 = Date.now();
        return $httpClient[method](o, (e2, r2, b2) =>
          resolve({ err: e2, resp: r2, body: b2, ms: Date.now() - s2 })
        );
      }
      resolve({ err: err, resp: resp, body: body, ms: ms });
    });
  });
}

const st = (r) => (r && r.resp ? r.resp.status : 0);
const errText = (r) => (r.err ? String(r.err).replace(/\s+/g, " ").slice(0, 80) : `HTTP ${st(r)}`);

async function safe(fn) {
  try {
    return await fn();
  } catch (e) {
    return { state: "warn", text: "检测异常", note: String(e).slice(0, 80) };
  }
}

// ---------- 数据源 ----------
async function getIppure() {
  for (let i = 0; i < 2; i++) {
    const r = await call("get", { url: "https://my.ippure.com/v1/info" });
    if (r.resp && r.resp.status === 200) {
      try {
        data.ippure = JSON.parse(r.body);
        return;
      } catch (e) {
        data.ippureErr = "解析失败：" + String(r.body).slice(0, 100);
      }
    } else {
      data.ippureErr = errText(r);
    }
  }
}

async function getIpapi(ip) {
  const r = await call("get", {
    url: `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,isp,org,as,mobile,proxy,hosting,query`,
  });
  try {
    const j = JSON.parse(r.body);
    if (j && j.status === "success") data.ipapi = j;
  } catch (e) {}
}

async function getScam(ip) {
  const r = await call("get", { url: `https://scamalytics.com/ip/${ip}` });
  const m = r.body && String(r.body).match(/Fraud Score:\s*(\d+)/i);
  if (m) data.scam = Number(m[1]);
}

// ---------- 流媒体 / AI ----------
async function netflix() {
  const [a, b] = await Promise.all([
    call("get", { url: "https://www.netflix.com/title/81280792" }),
    call("get", { url: "https://www.netflix.com/title/80018499" }),
  ]);
  const note = "测试片标题页可达，不代表登录后可播放";
  if (!a.resp && !b.resp) return { state: "fail", text: "无法连接", note: errText(a) };
  const region = (r) => {
    const u = hget(r.resp && r.resp.headers, "x-originating-url");
    if (!u) return null;
    const m = String(u).match(/netflix\.com\/([a-z]{2})(?:-[a-z]{2})?\/title/i);
    return m ? m[1].toUpperCase() : "US";
  };
  if (st(a) === 403 || st(b) === 403) return { state: "fail", text: "IP 被拒绝（403）", note };
  if (st(a) === 200) return { state: "ok", text: "端点可达/地区支持", region: region(a), note };
  if (st(b) === 200)
    return { state: "warn", text: "仅部分可达（疑似仅自制剧）", region: region(b), note };
  return { state: "fail", text: "端点不可达/地区不支持", note };
}

async function youtube() {
  const r = await call("get", { url: "https://www.youtube.com/premium", headers: { "Accept-Language": "en" } });
  const note = "Premium 页面可达并返回地区字段，不代表可购买";
  if (!r.resp) return { state: "fail", text: "无法连接", note: errText(r) };
  const body = String(r.body || "");
  if (/not available in your country/i.test(body)) return { state: "fail", text: "Premium 地区不支持", note };
  const m = body.match(/"countryCode":"(\w{2})"/) || body.match(/"INNERTUBE_CONTEXT_GL":"(\w{2})"/);
  if (m) return { state: "ok", text: "端点可达/地区支持", region: m[1].toUpperCase(), note };
  return { state: "warn", text: "可达，但未返回地区", note: `HTTP ${st(r)}` };
}

async function prime() {
  const r = await call("get", { url: "https://www.primevideo.com" });
  const note = "端点返回 currentTerritory，不代表实际播放";
  if (!r.resp) return { state: "fail", text: "无法连接", note: errText(r) };
  const m = String(r.body || "").match(/"currentTerritory":"(\w+)"/);
  if (m) return { state: "ok", text: "端点可达/地区支持", region: m[1].toUpperCase().slice(0, 2), note };
  if (st(r) >= 400) return { state: "fail", text: `端点被拒绝（HTTP ${st(r)}）`, note };
  return { state: "warn", text: "可达，但未返回地区", note };
}

async function tiktok() {
  const r = await call("get", { url: "https://www.tiktok.com/", headers: { "Accept-Language": "en" } });
  const note = "页面端点返回地区字段";
  if (!r.resp) return { state: "fail", text: "无法连接", note: errText(r) };
  const m = String(r.body || "").match(/"region":"(\w{2})"/);
  if (m) return { state: "ok", text: "端点可达/地区支持", region: m[1].toUpperCase(), note };
  if (st(r) >= 400) return { state: "fail", text: `端点被拒绝（HTTP ${st(r)}）`, note };
  return { state: "warn", text: "可达，但未返回地区", note };
}

async function reddit() {
  const r = await call("get", { url: "https://www.reddit.com/" });
  const note = "首页端点 HTTP 状态，不代表账号功能";
  if (!r.resp) return { state: "fail", text: "无法连接", note: errText(r) };
  if (st(r) >= 200 && st(r) < 400) return { state: "ok", text: "端点可达/地区支持", note: `HTTP ${st(r)}，${note}` };
  return { state: "fail", text: `端点被拒绝（HTTP ${st(r)}）`, note };
}

async function chatgpt() {
  const [t, w, a] = await Promise.all([
    call("get", { url: "https://chatgpt.com/cdn-cgi/trace" }),
    call("get", { url: "https://api.openai.com/compliance/cookie_requirements" }),
    call("get", { url: "https://ios.chat.openai.com/" }),
  ]);
  const loc = t.body && (String(t.body).match(/^loc=(\w+)/m) || [])[1];
  const webOk = !!w.resp && !/unsupported_country/i.test(String(w.body || ""));
  const appOk = !!a.resp && !/vpn/i.test(String(a.body || ""));
  const note =
    `Web ${webOk ? "✓" : "✗"} / App ${appOk ? "✓" : "✗"}（App 项靠页面关键词判断，可信度较低）` +
    (loc ? `，出口 ${loc}` : "");
  if (webOk && appOk) return { state: "ok", text: "端点可达/地区支持", note };
  if (webOk || appOk) return { state: "warn", text: "部分可达", note };
  if (!w.resp && !a.resp) return { state: "fail", text: "无法连接", note: errText(w) };
  return { state: "fail", text: "地区不支持/被拦截", note };
}

async function disney() {
  const r = await call("post", {
    url: "https://disney.api.edge.bamgrid.com/graph/v1/device/graphql",
    headers: { "Accept-Language": "en", Authorization: DISNEY_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({
      query:
        "mutation registerDevice($input: RegisterDeviceInput!) { registerDevice(registerDevice: $input) { grant { grantType assertion } } }",
      variables: {
        input: {
          applicationRuntime: "chrome",
          attributes: {
            browserName: "chrome",
            browserVersion: "94.0.4606",
            manufacturer: "apple",
            model: null,
            operatingSystem: "macintosh",
            operatingSystemVersion: "10.15.7",
            osDeviceIds: [],
          },
          deviceFamily: "browser",
          deviceLanguage: "en",
          deviceProfile: "macintosh",
        },
      },
    }),
  });
  if (!r.resp) return { state: "fail", text: "无法连接", note: errText(r) };
  let j;
  try {
    j = JSON.parse(r.body);
  } catch (e) {
    return { state: "warn", text: "接口返回异常", note: `HTTP ${st(r)}，不代表不可用` };
  }
  const sess = j && j.extensions && j.extensions.sdk && j.extensions.sdk.session;
  if (!sess) return { state: "warn", text: "接口返回异常", note: `HTTP ${st(r)}，不代表不可用` };
  const cc = sess.location && sess.location.countryCode ? String(sess.location.countryCode).toUpperCase() : null;
  if (sess.inSupportedLocation === true || sess.inSupportedLocation === "true")
    return { state: "ok", text: "端点可达/地区支持", region: cc, note: "inSupportedLocation=true" };
  return { state: "warn", text: "即将登陆/暂未支持", region: cc, note: "inSupportedLocation=false" };
}

const SERVICES = [
  ["TikTok", tiktok],
  ["Disney+", disney],
  ["Netflix", netflix],
  ["YouTube", youtube],
  ["Prime Video", prime],
  ["Reddit", reddit],
  ["ChatGPT", chatgpt],
];
const REGION_SET = ["TikTok", "Disney+", "Netflix", "YouTube", "Prime Video"];

// ---------- 渲染 ----------
function render() {
  const p = data.ippure;
  const ia = data.ipapi;
  const exitCC = String(p.countryCode || "").toUpperCase();
  const ip = String(p.ip || "未知");
  const place = [cname(exitCC, p.country), p.city].filter(Boolean).join(" ");
  let h = "";

  // 顶部
  h += gray(`节点 · ${node}`) + "<br>";
  h += `${flag(exitCC)} ${esc(place)} ${fc(p.isResidential ? COLOR.green : COLOR.orange, p.isResidential ? "住宅" : "非住宅")}<br>`;
  h += `<font size="${ip.length > 20 ? 4 : 6}"><b>${esc(ip)}</b></font><br>`;
  h += gray(`AS${p.asn || "?"} · ${p.asOrganization || ""}`) + "<br>";

  // IP 类型属性
  h += head("IP 类型属性");
  h += `<b>IPPure</b><br>`;
  h += `类型 ${fc(p.isResidential ? COLOR.green : COLOR.orange, p.isResidential ? "住宅 IP" : "非住宅")}${p.isBroadcast ? " " + fc(COLOR.orange, "｜广播 IP") : ""}<br>`;
  h += `<b>ip-api</b><br>`;
  if (ia) {
    h += `机房/托管 ${fc(ia.hosting ? COLOR.red : COLOR.green, ia.hosting ? "是" : "否")}　移动网络 ${fc(ia.mobile ? COLOR.orange : COLOR.green, ia.mobile ? "是" : "否")}<br>`;
    h += gray(`${ia.isp || ""}${ia.org && ia.org !== ia.isp ? " / " + ia.org : ""}`) + "<br>";
  } else {
    h += gray("本次未返回") + "<br>";
  }

  // 风险评分
  h += head("风险评分");
  const fs = Number(p.fraudScore);
  const r1 = riskOf(isNaN(fs) ? null : fs);
  h += `${fc(r1.color, "●")} <b>IPPure</b> ${fc(r1.color, `${isNaN(fs) ? "无评分" : fs} · ${r1.level}`)}<br>`;
  const missing = [];
  if (data.scam != null) {
    const r2 = riskOf(data.scam);
    h += `${fc(r2.color, "●")} <b>Scamalytics</b> ${fc(r2.color, `${data.scam} · ${r2.level}`)}<br>`;
  } else missing.push("Scamalytics");
  if (missing.length) h += gray(`本次未返回：${missing.join("、")}`) + "<br>";

  // 风险因素
  h += head("风险因素");
  h += `<b>IPPure</b> · ${flag(exitCC)} [${esc(exitCC)}]<br>`;
  h += p.isBroadcast ? fc(COLOR.red, "命中 广播 IP") : fc(COLOR.green, "未命中 广播 IP");
  h += "<br>";
  h += `<b>ip-api</b>${ia ? ` · ${flag(ia.countryCode)} [${esc(ia.countryCode)}]` : ""}<br>`;
  if (ia) {
    const hits = [];
    if (ia.proxy) hits.push("代理");
    if (ia.hosting) hits.push("机房/托管");
    h += hits.length ? fc(COLOR.red, `命中 ${hits.join("、")}`) : fc(COLOR.green, "未命中 代理、机房/托管");
    h += "<br>";
  } else h += gray("本次未返回") + "<br>";

  // 流媒体与 AI
  h += head("流媒体与 AI 可达性");
  SERVICES.forEach(([name]) => {
    const s = data.svc[name];
    if (!s) {
      h += `⏳ <b>${esc(name)}</b> ${gray("未完成（超时）")}<br>`;
      return;
    }
    const icon = s.state === "ok" ? "✅" : s.state === "warn" ? "⚠️" : "❌";
    const col = s.state === "ok" ? COLOR.green : s.state === "warn" ? COLOR.orange : COLOR.red;
    h += `${icon} <b>${esc(name)}</b> ${fc(col, s.text + (s.region ? ` · [${s.region}]` : ""))}<br>`;
    if (s.note) h += gray(s.note) + "<br>";
  });

  // 服务地区一致性
  h += head("服务地区一致性");
  h += `出口地区 ${flag(exitCC)} [${esc(exitCC)}]<br>`;
  const rows = REGION_SET.map((n) => [n, data.svc[n] && data.svc[n].region]).filter((x) => x[1]);
  if (rows.length) {
    const same = rows.filter((x) => x[1] === exitCC).length;
    const all = same === rows.length;
    h += fc(all ? COLOR.green : COLOR.orange, `${all ? "地区全部一致" : "存在地区不一致"} · ${same}/${rows.length}`) + "<br>";
    rows.forEach(([n, rg]) => {
      h += `<b>${esc(n)}</b> ${flag(rg)} [${esc(rg)}] ${rg === exitCC ? fc(COLOR.green, "一致") : fc(COLOR.red, "不一致")}<br>`;
    });
  } else h += gray("没有服务返回地区信息") + "<br>";

  // 页脚
  h +=
    "<br>" +
    gray(
      "说明：各数据源独立展示，不生成综合结论；评分分档为本脚本自定参考。可达性只代表探测端点可达，不代表账号可用或可播放。未接入 IPinfo / IP2Location / IPQS（需 API Key）。"
    );
  return h;
}

function finish() {
  if (finished) return;
  finished = true;
  if (!data.ippure) {
    return $done({
      title: "IPPure 检测",
      htmlMessage: `❌ 检测失败<br>节点：${esc(node)}<br>原因：${esc(data.ippureErr || "超时未响应")}`,
    });
  }
  $done({ title: "节点 IP 质量检测", htmlMessage: render() });
}

// ---------- 主流程 ----------
async function main() {
  await getIppure();
  if (!data.ippure) return;
  const ip = data.ippure.ip;
  const tasks = [getIpapi(ip), getScam(ip)];
  SERVICES.forEach(([name, fn]) => {
    tasks.push(
      safe(fn).then((res) => {
        data.svc[name] = res;
      })
    );
  });
  await Promise.all(tasks);
}

if (!node) {
  finished = true;
  $done({ title: "IPPure 检测", htmlMessage: "未选中节点<br>请在节点列表里长按某个节点再运行" });
} else {
  // 整体超时保护：环境不支持 setTimeout 时跳过，不影响其余功能
  if (typeof setTimeout === "function") setTimeout(finish, DEADLINE_MS);
  main().then(finish, finish);
}
