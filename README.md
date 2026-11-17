# MAJOR FUTURES V5.0 — 百大专业全量内容融合测试版

版本日期：2026-11-17。**本包用于独立测试仓库，不得覆盖两个正式站。**

## 已完成的原生功能

- 100专业搜索、11学科类别、RIASEC兴趣类型、A-Level 7科探索匹配；60题RIASEC测评、历史与进度；最多3专业对比、个人报告及PDF打印 / HTML报告 / JSON备份。
- 28个重点专业提供9组方向/专业、27条岗位示例、学历与AI任务影响的原生补充。
- **100专业全部剩余内容的自动迁移**：运行 `tools/build-atlas.mjs` 从你自己维护的 `global-majors-guide` 已编译发布数据中精确提取 100 条完整专业介绍、适合人群、A-Level科目对应理由、MBTI偏好示例、职业出口、前沿方向、职业场景长文、申请准备建议、活动、88条公开课信息（各专业复用）、相关专业、原版中国薪酬阶段区间、原图鉴页码、UCAS/BigFuture/QS外部查询资源。构建生成 `data/atlas-full.js` 和 `data/atlas-full.json`，部署后用户端只从 **V5测试站自己的目录**读取专业数据，不需要浏览器请求旧网站、运行旧React应用或使用iframe。
- 2027 Oxford/UCL/LSE课程级入学考试速查；旧站岗位/学历说明与申请规则仍有资料年份及覆盖边界，需要持续维护。

## 最重要：部署方式改为 GitHub Actions

本包里的100专业完整档案数据在**GitHub Pages的构建步骤**从原作者的公开仓库自动生成。上传ZIP时 **`data/atlas-full.js`尚未存在是正常的**，无需自行创建，也不要用空文件代替。

1. 解压ZIP，打开 `MAJOR_FUTURES_V5_COMPLETE` 文件夹，将**里面所有文件和子目录**上传到 `MAJOR-FUTURES-V5-TEST` 的 `main` 根目录。必须包括隐藏目录 `.github/workflows/deploy.yml`。GitHub网页版上传文件时请确认这个隐藏目录完整保留；如果网页上传工具没有保留，可以在GitHub网页新建 `.github/workflows/deploy.yml` 并粘贴本包内容。
2. 进入 `Settings → Pages → Build and deployment → Source`，从 `Deploy from a branch` 切换至 **`GitHub Actions`**，保存。
3. 打开 `Actions`，找到 **Build and deploy complete V5 major atlas**。首次运行可手动点 `Run workflow`；等待 `build`、`deploy` 均变绿色。
4. 打开 `https://liyoureason813-maker.github.io/MAJOR-FUTURES-V5-TEST/`，强制刷新。首页**必须**显示：`100个完整专业档案已载入`，否则代表尚未成功生成并部署完整数据。
5. 抽检：会计学（课程/薪酬/长文）；心理学（研究及职业场景）；电子电气工程（岗位）；纯艺术（活动）；3专业比较的中国薪酬行；60题测评全流程；PDF打印。

> 若 GitHub Actions 无法部署，先打开失败步骤日志。`build-atlas.mjs` 对原站脚本的 Git blob SHA 进行严格校验：若原站以后重新编译改变了文件，需要审查新数据格式并更新提取脚本/校验SHA，而不能悄悄迁移不同版本内容。

## 手动在电脑上生成完整数据（可用于以后改回branch部署）

如本地有 Node.js 22+，并已下载原仓库编译文件到电脑，可执行：

```bash
node tools/build-atlas.mjs --source /path/to/index-ZjQvt1sT.js
```

它会生成 `data/atlas-full.js` 和 `data/atlas-full.json`。**把这两个生成文件上传到测试仓库**后，即可在 `Deploy from a branch` 模式下工作，无需构建工作流。脚本不会改写旧仓库。

## 注意事项

- 此版本的“迁移”指**将原发布站已有资料完整复制为本地结构化数据并原生渲染**；不是重新撰写、实时核验100个专业或重新建立工资统计。引用原站内容及其原有来源，不自动补充新事实。
- 中国薪酬为**职业簇规划参考区间**，不是专业毕业生工资样本统计、薪资承诺或职业收入预测。仍需逐地区、执照、行业核验。
- 原站的部分活动、课程及第三方网址可能失效或年份过时，界面已标明未逐项核验。若用户需要最新要求，以大学官网为准。
- 28专业岗位资料与100专业长文数据年份不同，不能宣称按O*NET31.0逐项更新完毕。
- 原图鉴正文中文为主；RIASEC测评双语；尚未新增100篇文章的英文翻译。
- 仅浏览器本地保存测评数据，不自动跨设备同步；导出的JSON请妥善保管。

## 测试 / 数据结构

| 文件 | 作用 |
|---|---|
| `data/catalog.js` | 100专业索引、RIASEC、科目映射 |
| `data/careers.js` | 28专业岗位/学历/AI深度数据 |
| `data/questions.js` | 60道RIASEC原题 |
| `data/crosswalk.js` | 28→100专业映射 |
| `tools/build-atlas.mjs` | 通过公开源码提取100篇完整数据，校验原始SHA与记录数 |
| `data/atlas-full.js` | GitHub Actions构建后生成的完整结构化资料，浏览器直接加载 |
| `data/atlas-full.json` | GitHub Actions构建后生成的可检视备份 |
| `.github/workflows/deploy.yml` | GitHub Pages自动构建发布工作流 |

原站来源：[MAJOR FUTURES](https://github.com/liyoureason813-maker/MAJOR-FUTURES)、[海外百大专业指南](https://github.com/liyoureason813-maker/global-majors-guide)。
