# Loon 插件+图标

## 图标订阅地址

[Emby 点击导入SenPlayer](https://aaronaevum.github.io/loon/senplayer_import.html?iconset=https://raw.githubusercontent.com/aaronaevum/loon/refs/heads/main/emby.json)<br><br>
[AV_Photo 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fav_photo.json)<br><br>
[机场 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fjichang.json)<br><br>
[APP图标CN 144PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fapp_icons%2Fcn144px.json)<br><br>
[APP图标CN 512PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fapp_icons%2Fcn512px.json)<br><br>
[APP图标CN 1024PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fapp_icons%2Fcn1024px.json)<br><br>
[APP图标OS 144PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fapp_icons%2Fos144px.json)<br><br>
[APP图标OS 512PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fapp_icons%2Fos512px.json)<br><br>
[APP图标OS 1024PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fapp_icons%2Fos1024px.json)<br><br>
[国旗 144PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fflags%2F144px.json)<br><br>
[国旗 512PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fflags%2F512px.json)<br><br>
[国旗 1024PX 点击导入Loon](https://www.nsloon.com/openloon/import?iconset=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fflags%2F1024px.json)
## 多邻国 v11

适用于 iOS / iPadOS 版多邻国，版本日期：2026-10-12

### 一键导入

[点击导入 Loon](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2Faaronaevum%2Floon%2Frefs%2Fheads%2Fmain%2Fplugins%2Fduolingo%2Fduolingo.plugin)

### 手动导入

Loon → 配置 → 插件 → 右上角 + → 粘贴下面的地址：

https://raw.githubusercontent.com/aaronaevum/loon/refs/heads/main/plugins/duolingo/duolingo.plugin

### 功能

保持真实：
- 连胜天数：显示真实数据
- 学习日历：显示真实数据

会被修改：
- 宝石：999999
- 会员：显示为 Super 会员
- Max 功能：补全功能列表，打开视频通话、角色扮演入口
- 红心：无限
- 能量：9999
- 时间宝：999
- 连胜道具：连胜冻结 999、周末护身符、连胜赌注
- 安全盾：有效期延长到 2099 年
- 完美连胜周数：999
- 成就：全部满级
- 经验加成：5 倍
- 商店：购买物品请求改为免费

### 生效范围（主机名）

- ios-api-2.duolingo.cn
- duolingo-achievements-prod.duolingo.cn
- api2.duolingo.cn

### 使用前提

1. 在 Loon 里安装 MITM 证书
2. 到 设置 → 通用 → 关于本机 → 证书信任设置，打开 Loon 证书的开关
3. 打开 Loon 的 MITM 总开关
4. 导入插件后，打开插件开关
5. 彻底关闭多邻国，再重新打开

iPad 需要单独安装并信任证书，iPhone 上装过不会同步。

### 检查是否生效

打开多邻国后，在 Loon 的请求记录里点 MITM 和 Script 标签，搜索 duolingo。能看到 ios-api-2.duolingo.cn，说明解密成功。

### 常见问题

- 插件显示"资源异常"：检查脚本地址能否在浏览器打开，必须显示 JS 代码
- 改了脚本没变化：在插件里点更新，再重启多邻国
- 两个多邻国插件同时开启会冲突，只保留一个
- 只修改 App 本地显示的数据，多邻国更新后可能失效

### 文件说明

- loon/duolingo/duolingo.plugin：Loon 插件文件
- loon/duolingo/duolingo_v11.js：脚本文件
