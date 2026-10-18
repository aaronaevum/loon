# -*- coding: utf-8 -*-
# 放在 仓库\loon\app_icons\ 里运行：python make_loon_json.py
# 作用：扫描 6 个图标文件夹，生成 6 个 Loon 图标 JSON（按英文名字母顺序，名称带中文）

import json
from pathlib import Path
from urllib.parse import quote

# ====== 只需改这三项 ======
GITHUB_USER = "aaronaevum"
REPO = "loon"
BRANCH = "main"
# ==========================

FOLDERS = ["cn144px", "cn512px", "cn1024px", "os144px", "os512px", "os1024px"]
EXTS = {".png", ".jpg", ".jpeg", ".webp"}
HERE = Path(__file__).resolve().parent

# 国旗：文件名为两位国家代码时，生成「中文名 代码」，如 中国 cn
COUNTRY = {
    "cn": "中国", "us": "美国", "hk": "香港", "tw": "台湾", "mo": "澳门",
    "jp": "日本", "kr": "韩国", "sg": "新加坡", "gb": "英国", "uk": "英国",
    "de": "德国", "fr": "法国", "ca": "加拿大", "au": "澳大利亚", "ru": "俄罗斯",
    "in": "印度", "my": "马来西亚", "th": "泰国", "vn": "越南", "ph": "菲律宾",
    "id": "印度尼西亚", "it": "意大利", "es": "西班牙", "nl": "荷兰", "tr": "土耳其",
    "br": "巴西", "ar": "阿根廷", "mx": "墨西哥", "ae": "阿联酋", "ch": "瑞士",
    "se": "瑞典", "no": "挪威", "fi": "芬兰", "dk": "丹麦", "pl": "波兰",
    "ua": "乌克兰", "il": "以色列", "eg": "埃及", "za": "南非", "nz": "新西兰",
    "ie": "爱尔兰", "pt": "葡萄牙", "at": "奥地利", "be": "比利时", "cz": "捷克",
    "gr": "希腊", "sa": "沙特阿拉伯", "pk": "巴基斯坦", "bd": "孟加拉国",
    "kh": "柬埔寨", "la": "老挝", "mm": "缅甸", "np": "尼泊尔", "lk": "斯里兰卡",
    "kz": "哈萨克斯坦", "cl": "智利", "co": "哥伦比亚", "pe": "秘鲁", "ng": "尼日利亚",
}

# 应用中文名（键用小写英文名）。没收录的会列入 missing_cn.txt，补进来再运行即可
APPS = {
    "alipay": "支付宝", "wechat": "微信", "qq": "QQ", "qq music": "QQ音乐",
    "taobao": "淘宝", "tmall": "天猫", "jd": "京东", "pinduoduo": "拼多多",
    "douyin": "抖音", "tiktok": "海外抖音", "kuaishou": "快手", "bilibili": "哔哩哔哩",
    "weibo": "微博", "xiaohongshu": "小红书", "zhihu": "知乎", "douban": "豆瓣",
    "baidu": "百度", "baidu netdisk": "百度网盘", "amap": "高德地图",
    "baidu maps": "百度地图", "didi": "滴滴出行", "meituan": "美团",
    "eleme": "饿了么", "dianping": "大众点评", "ctrip": "携程", "trip.com": "携程",
    "netease cloud music": "网易云音乐", "netease music": "网易云音乐",
    "kugou": "酷狗音乐", "kuwo": "酷我音乐", "iqiyi": "爱奇艺",
    "youku": "优酷", "tencent video": "腾讯视频", "mango tv": "芒果TV",
    "dingtalk": "钉钉", "feishu": "飞书", "lark": "飞书", "wps office": "WPS",
    "tencent meeting": "腾讯会议", "xianyu": "闲鱼", "alibaba": "阿里巴巴",
    "honor of kings": "王者荣耀", "peacekeeper elite": "和平精英",
    "genshin impact": "原神", "honkai star rail": "崩坏星穹铁道",
    "china mobile": "中国移动", "china unicom": "中国联通", "china telecom": "中国电信",
    "icbc": "工商银行", "ccb": "建设银行", "abc": "农业银行", "boc": "中国银行",
    "unionpay": "云闪付", "12306": "铁路12306", "uc browser": "UC浏览器",
    "quark": "夸克", "toutiao": "今日头条", "ximalaya": "喜马拉雅",
    "loon": "Loon", "shadowrocket": "小火箭", "quantumult x": "圈X",
    "surge": "Surge", "stash": "Stash", "clash": "Clash",
    "google": "谷歌", "google chrome": "谷歌浏览器", "chrome": "谷歌浏览器",
    "google maps": "谷歌地图", "google drive": "谷歌云端硬盘", "gmail": "谷歌邮箱",
    "youtube": "油管", "youtube music": "油管音乐", "google translate": "谷歌翻译",
    "google photos": "谷歌相册", "google play": "谷歌商店",
    "facebook": "脸书", "instagram": "照片墙", "whatsapp": "WhatsApp",
    "telegram": "电报", "twitter": "推特", "x": "推特X", "line": "连我",
    "discord": "Discord", "snapchat": "色拉布", "reddit": "红迪", "pinterest": "拼趣",
    "linkedin": "领英", "skype": "Skype", "zoom": "Zoom", "signal": "Signal",
    "netflix": "奈飞", "disney+": "迪士尼+", "hbo max": "HBO Max", "spotify": "声田",
    "twitch": "Twitch", "amazon": "亚马逊", "amazon prime video": "亚马逊影视",
    "ebay": "易贝", "paypal": "贝宝", "uber": "优步", "airbnb": "爱彼迎",
    "booking.com": "缤客", "microsoft": "微软", "microsoft edge": "微软Edge",
    "microsoft word": "微软Word", "microsoft excel": "微软Excel",
    "microsoft outlook": "微软邮箱", "onedrive": "OneDrive", "teams": "微软Teams",
    "dropbox": "多宝箱", "notion": "Notion", "evernote": "印象笔记",
    "chatgpt": "ChatGPT", "claude": "Claude", "gemini": "双子座",
    "github": "GitHub", "firefox": "火狐浏览器", "opera": "欧朋浏览器",
    "safari": "Safari浏览器", "app store": "应用商店", "apple music": "苹果音乐",
    "apple tv": "苹果电视", "apple news": "苹果新闻", "news": "新闻",
    "photos": "照片", "music": "音乐", "maps": "地图", "settings": "设置",
    "messages": "信息", "mail": "邮件", "notes": "备忘录", "reminders": "提醒事项",
    "calendar": "日历", "clock": "时钟", "camera": "相机", "weather": "天气",
    "wallet": "钱包", "health": "健康", "fitness": "健身", "testflight": "TestFlight",
    "shortcuts": "快捷指令", "files": "文件", "facetime": "FaceTime",
    "phone": "电话", "contacts": "通讯录", "podcasts": "播客", "books": "图书",
    "stocks": "股市", "translate": "翻译", "find my": "查找",
    "iphone": "苹果手机", "apple": "苹果", "giffgaff": "giffgaff",
}


def cn_name(stem: str) -> str:
    """返回中文名；没有则返回空字符串"""
    low = stem.lower().strip()
    if low in APPS:
        return APPS[low]
    return ""


def make_name(stem: str):
    """返回 (显示名, 是否缺中文名)"""
    low = stem.lower().strip()
    if len(low) == 2 and low in COUNTRY:
        return f"{COUNTRY[low]} {low}", False
    zh = cn_name(stem)
    if zh:
        if zh.lower() == low:
            return stem, False
        return f"{zh} {stem}", False
    return stem, True


def main():
    missing = set()
    for folder in FOLDERS:
        d = HERE / folder
        if not d.is_dir():
            print(f"[跳过] 没找到文件夹 {folder}")
            continue
        files = [p for p in d.iterdir() if p.suffix.lower() in EXTS]
        # 按英文文件名字母顺序（不分大小写）
        files.sort(key=lambda p: p.stem.lower())
        icons = []
        for p in files:
            name, lack = make_name(p.stem)
            if lack:
                missing.add(p.stem)
            url = (
                f"https://raw.githubusercontent.com/{GITHUB_USER}/{REPO}/{BRANCH}"
                f"/loon/app_icons/{folder}/{quote(p.name)}"
            )
            icons.append({"name": name, "url": url})
        data = {
            "name": folder,
            "description": f"{folder} 图标合集，共 {len(icons)} 个",
            "icons": icons,
        }
        out = HERE / f"{folder}.json"
        out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"[完成] {out.name}：{len(icons)} 个图标")

    if missing:
        (HERE / "missing_cn.txt").write_text("\n".join(sorted(missing, key=str.lower)), encoding="utf-8")
        print(f"[提示] {len(missing)} 个图标没有中文名，已写入 missing_cn.txt")


if __name__ == "__main__":
    main()
