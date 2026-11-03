const node = $environment && $environment.params ? $environment.params.node : null;
const TIMEOUT_MS = 8000;
const DEADLINE_MS = 45000;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const DISNEY_TOKEN = "ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84";
const COLOR = { green: "#1aa66b", red: "#e5484d", orange: "#e08a00", blue: "#1677ff", gray: "#8e8e93" };
const FONT = "-apple-system, 'SF Pro Text', 'PingFang SC', Helvetica, Arial, sans-serif";

// 全部国家/地区中文名（ISO 3166-1 alpha-2，另含科索沃 XK）
const CN = {
  AD: "安道尔", AE: "阿联酋", AF: "阿富汗", AG: "安提瓜和巴布达", AI: "安圭拉", AL: "阿尔巴尼亚",
  AM: "亚美尼亚", AO: "安哥拉", AQ: "南极洲", AR: "阿根廷", AS: "美属萨摩亚", AT: "奥地利",
  AU: "澳大利亚", AW: "阿鲁巴", AX: "奥兰群岛", AZ: "阿塞拜疆",
  BA: "波黑", BB: "巴巴多斯", BD: "孟加拉国", BE: "比利时", BF: "布基纳法索", BG: "保加利亚",
  BH: "巴林", BI: "布隆迪", BJ: "贝宁", BL: "圣巴泰勒米", BM: "百慕大", BN: "文莱",
  BO: "玻利维亚", BQ: "荷属加勒比区", BR: "巴西", BS: "巴哈马", BT: "不丹", BV: "布韦岛",
  BW: "博茨瓦纳", BY: "白俄罗斯", BZ: "伯利兹",
  CA: "加拿大", CC: "科科斯群岛", CD: "刚果（金）", CF: "中非", CG: "刚果（布）", CH: "瑞士",
  CI: "科特迪瓦", CK: "库克群岛", CL: "智利", CM: "喀麦隆", CN: "中国", CO: "哥伦比亚",
  CR: "哥斯达黎加", CU: "古巴", CV: "佛得角", CW: "库拉索", CX: "圣诞岛", CY: "塞浦路斯", CZ: "捷克",
  DE: "德国", DJ: "吉布提", DK: "丹麦", DM: "多米尼克", DO: "多米尼加", DZ: "阿尔及利亚",
  EC: "厄瓜多尔", EE: "爱沙尼亚", EG: "埃及", EH: "西撒哈拉", ER: "厄立特里亚", ES: "西班牙", ET: "埃塞俄比亚",
  FI: "芬兰", FJ: "斐济", FK: "福克兰群岛", FM: "密克罗尼西亚", FO: "法罗群岛", FR: "法国",
  GA: "加蓬", GB: "英国", GD: "格林纳达", GE: "格鲁吉亚", GF: "法属圭亚那", GG: "根西岛",
  GH: "加纳", GI: "直布罗陀", GL: "格陵兰", GM: "冈比亚", GN: "几内亚", GP: "瓜德罗普",
  GQ: "赤道几内亚", GR: "希腊", GS: "南乔治亚和南桑威奇群岛", GT: "危地马拉", GU: "关岛",
  GW: "几内亚比绍", GY: "圭亚那",
  HK: "香港", HM: "赫德岛和麦克唐纳群岛", HN: "洪都拉斯", HR: "克罗地亚", HT: "海地", HU: "匈牙利",
  ID: "印度尼西亚", IE: "爱尔兰", IL: "以色列", IM: "马恩岛", IN: "印度", IO: "英属印度洋领地",
  IQ: "伊拉克", IR: "伊朗", IS: "冰岛", IT: "意大利",
  JE: "泽西岛", JM: "牙买加", JO: "约旦", JP: "日本",
  KE: "肯尼亚", KG: "吉尔吉斯斯坦", KH: "柬埔寨", KI: "基里巴斯", KM: "科摩罗", KN: "圣基茨和尼维斯",
  KP: "朝鲜", KR: "韩国", KW: "科威特", KY: "开曼群岛", KZ: "哈萨克斯坦",
  LA: "老挝", LB: "黎巴嫩", LC: "圣卢西亚", LI: "列支敦士登", LK: "斯里兰卡", LR: "利比里亚",
  LS: "莱索托", LT: "立陶宛", LU: "卢森堡", LV: "拉脱维亚", LY: "利比亚",
  MA: "摩洛哥", MC: "摩纳哥", MD: "摩尔多瓦", ME: "黑山", MF: "法属圣马丁", MG: "马达加斯加",
  MH: "马绍尔群岛", MK: "北马其顿", ML: "马里", MM: "缅甸", MN: "蒙古", MO: "澳门",
  MP: "北马里亚纳群岛", MQ: "马提尼克", MR: "毛里塔尼亚", MS: "蒙特塞拉特", MT: "马耳他",
  MU: "毛里求斯", MV: "马尔代夫", MW: "马拉维", MX: "墨西哥", MY: "马来西亚", MZ: "莫桑比克",
  NA: "纳米比亚", NC: "新喀里多尼亚", NE: "尼日尔", NF: "诺福克岛", NG: "尼日利亚", NI: "尼加拉瓜",
  NL: "荷兰", NO: "挪威", NP: "尼泊尔", NR: "瑙鲁", NU: "纽埃", NZ: "新西兰",
  OM: "阿曼",
  PA: "巴拿马", PE: "秘鲁", PF: "法属波利尼西亚", PG: "巴布亚新几内亚", PH: "菲律宾", PK: "巴基斯坦",
  PL: "波兰", PM: "圣皮埃尔和密克隆", PN: "皮特凯恩群岛", PR: "波多黎各", PS: "巴勒斯坦",
  PT: "葡萄牙", PW: "帕劳", PY: "巴拉圭",
  QA: "卡塔尔",
  RE: "留尼汪", RO: "罗马尼亚", RS: "塞尔维亚", RU: "俄罗斯", RW: "卢旺达",
  SA: "沙特阿拉伯", SB: "所罗门群岛", SC: "塞舌尔", SD: "苏丹", SE: "瑞典", SG: "新加坡",
  SH: "圣赫勒拿", SI: "斯洛文尼亚", SJ: "斯瓦尔巴和扬马延", SK: "斯洛伐克", SL: "塞拉利昂",
  SM: "圣马力诺", SN: "塞内加尔", SO: "索马里", SR: "苏里南", SS: "南苏丹", ST: "圣多美和普林西比",
  SV: "萨尔瓦多", SX: "荷属圣马丁", SY: "叙利亚", SZ: "斯威士兰",
  TC: "特克斯和凯科斯群岛", TD: "乍得", TF: "法属南部领地", TG: "多哥", TH: "泰国", TJ: "塔吉克斯坦",
  TK: "托克劳", TL: "东帝汶", TM: "土库曼斯坦", TN: "突尼斯", TO: "汤加", TR: "土耳其",
  TT: "特立尼达和多巴哥", TV: "图瓦卢", TW: "台湾", TZ: "坦桑尼亚",
  UA: "乌克兰", UG: "乌干达", UM: "美国本土外小岛屿", US: "美国", UY: "乌拉圭", UZ: "乌兹别克斯坦",
  VA: "梵蒂冈", VC: "圣文森特和格林纳丁斯", VE: "委内瑞拉", VG: "英属维尔京群岛",
  VI: "美属维尔京群岛", VN: "越南", VU: "瓦努阿图",
  WF: "瓦利斯和富图纳", WS: "萨摩亚",
  XK: "科索沃",
  YE: "也门", YT: "马约特",
  ZA: "南非", ZM: "赞比亚", ZW: "津巴布韦",
};

// 备用：表里查不到时，尝试用系统自带的地区名称（环境不支持则自动跳过）
let regionNames = null;
try {
  if (typeof Intl !== "undefined" && Intl.DisplayNames) {
    regionNames = new Intl.DisplayNames(["zh-Hans"], { type: "region" });
  }
} catch (e) {
  regionNames = null;
}

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
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, "");

function cname(cc, fallback) {
  const c = String(cc || "").toUpperCase();
  if (CN[c]) return CN[c];
  if (regionNames && /^[A-Z]{2}$/.test(c)) {
    try {
      const n = regionNames.of(c);
      if (n && n !== c) return n;
    } catch (e) {}
  }
  return fallback || c || "未知";
}

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
  const note = "页面端点返回地区字段";
  const pick = (r) => {
    const m = String((r && r.body) || "").match(/"region"\s*:\s*"([A-Za-z]{2})"/);
    return m ? m[1].toUpperCase() : null;
  };
  const r1 = await call("get", { url: "https://www.tiktok.com/", headers: { "Accept-Language": "en" } });
  if (!r1.resp) return { state: "fail", text: "无法连接", note: errText(r1) };
  let region = pick(r1);
  let last = r1;
  if (!region) {
    // 兜底：首页没带地区字段时，再试 explore 页
    const r2 = await call("get", { url: "https://www.tiktok.com/explore", headers: { "Accept-Language": "en" } });
    if (r2.resp) {
      last = r2;
      region = pick(r2);
    }
  }
  if (region) return { state: "ok", text: "端点可达/地区支持", region, note };
  if (st(last) >= 400) return { state: "fail", text: `端点被拒绝（HTTP ${st(last)}）`, note };
  return { state: "warn", text: "可达，但未返回地区", note: `HTTP ${st(last)}，页面未带地区字段` };
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

  // IP 类型属性（压缩为两行）
  h += head("IP 类型属性");
  h += `<b>IPPure</b>　${fc(p.isResidential ? COLOR.green : COLOR.orange, p.isResidential ? "住宅 IP" : "非住宅")}${p.isBroadcast ? " " + fc(COLOR.orange, "｜广播 IP") : ""}<br>`;
  if (ia) {
    h += `<b>ip-api</b>　机房/托管 ${fc(ia.hosting ? COLOR.red : COLOR.green, ia.hosting ? "是" : "否")}　移动网络 ${fc(ia.mobile ? COLOR.orange : COLOR.green, ia.mobile ? "是" : "否")}<br>`;
    const org = ia.org && norm(ia.org) !== norm(ia.isp) ? ` / ${ia.org}` : "";
    h += gray(`${ia.isp || ""}${org}`) + "<br>";
  } else {
    h += `<b>ip-api</b>　${gray("本次未返回")}<br>`;
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
  h += "<br>" + gray("各数据源独立展示，不生成综合结论；评分分档为本脚本自定。可达性不代表账号可用或可播放。未接入需 API Key 的 IPinfo / IP2Location / IPQS。");
  return `<div style="font-family:${FONT}">${h}</div>`;
}

function finish() {
  if (finished) return;
  finished = true;
  if (!data.ippure) {
    return $done({
      title: "IPPure 检测",
      htmlMessage: `<div style="font-family:${FONT}">❌ 检测失败<br>节点：${esc(node)}<br>原因：${esc(data.ippureErr || "超时未响应")}</div>`,
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
