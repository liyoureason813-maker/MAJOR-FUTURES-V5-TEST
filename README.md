# MAJOR FUTURES V5.0 Alpha — GitHub Pages 测试部署版

测试站专用；不替换 MAJOR-FUTURES V4.2.2 和 global-majors-guide。

## 1. 在 GitHub 创建独立测试仓库

访问 https://github.com/new
- Owner: `liyoureason813-maker`
- Repository name: `MAJOR-FUTURES-V5-TEST`
- Visibility: Public（GitHub Free 下用于 GitHub Pages）
- Add a README file: 可以不勾选，因为部署包中已包含 README.md。
- 点击 Create repository。

## 2. 上传文件

解压本 ZIP，进入解压后的 `v5-github-pages-ready` 文件夹，选中内部所有文件及 `data` 文件夹，而不是上传 ZIP 本身、也不要在仓库根目录额外套一层文件夹。

在 GitHub 仓库内点 Add file → Upload files；把上述文件/文件夹拖进去，Commit changes 保存至 `main`。

仓库根目录至少应看到：
- index.html
- app.js
- styles.css
- data/global-majors-data.js
- data/global-majors.json
- data/crosswalk-28-to-100.json
- README.md
- .nojekyll （隐藏文件，辅助 GitHub Pages）

## 3. 启用 GitHub Pages

仓库 Settings → Pages → Build and deployment
- Source: Deploy from a branch
- Branch: `main`
- Folder: `/(root)`
- Save

然后查看 Actions 中 pages build and deployment 是否成功。

## 4. 访问预期地址

https://liyoureason813-maker.github.io/MAJOR-FUTURES-V5-TEST/

该地址只在新仓库创建并部署成功后可访问。

## 5. 测试清单

- [ ] 100专业目录可加载、搜索、筛选
- [ ] 手动RIASEC与A-Level科目对专业排序的影响
- [ ] 三专业对比
- [ ] 从功能中心打开原MAJOR FUTURES（60题、PDF、历史记录）
- [ ] 从功能中心打开原百大专业指南（详情、薪酬、原专业对比）
- [ ] 同浏览器/同源下的测评历史读取
- [ ] 手机与电脑布局

注意：这只是融合 Alpha；原网站功能通过链接/嵌入提供。没有把React完整专业详情和原网站全部功能重构成一个独立程序。
