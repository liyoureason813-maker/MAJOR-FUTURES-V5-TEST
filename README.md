# MAJOR FUTURES V5.1 · 准确性、解释与学生隐私修复版

版本日期：2026-11-17。用于 **MAJOR-FUTURES-V5-TEST 测试站**；不会影响已有两个正式网站。继承原 V5 的100篇专业资料数据构建、60题测评、A-Level探索匹配和28专业职业分析。

## 本版变更（相对 V5.0 Complete）

1. **测评不再强行制造三字母代码**：若六类型最高最低分差小于4分，或第三、第四名出现同分，页面会显示“三字母待确认”并提供原因；每类分数仍然显示。该阈值仅是避免误导的展示规则，**不是经过常模验证的心理测量标准**。旧版导入或历史测评在展示时也重新评估分数结构，不会修改原始记录。
2. **没有个人信息就不生成伪推荐**：未有有效RIASEC代码、也没填写A-Level时，个人报告不再硬列6个“零分推荐”，100专业目录仍可正常浏览。
3. **修复报告HTML**：`**并非...**` 不再原样显示，替换为正确的HTML加粗提示。可继续打印PDF、下载独立HTML和JSON备份。
4. **推荐理由可以解释**：100专业卡片、详情页、三专业对比和个人报告，均展示兴趣代码重合、已选的相关A-Level科目、需核对的核心探索科目；不把站内积分解释为匹配概率或大学录取资格。
5. **职业关系映射**：将原有 `equivalent`（基本对应）与 `exact` 一同归入直接/基本对应，其他保留“相关方向”警示（如人工智能与计算机科学不能当成同一个本科专业）。
6. **2027英国本科入学考试**：依据 Oxford、UCL、LSE 官方页面，将速查表拆为41条具体课程/课程组，区分“必考”“建议参加”与UCL 2027已明确取消的若干附加测试。核验日期2026-11-17，用户申请前应再次核对官方页面。
7. **改善无障碍和移动端操作**：菜单`aria-expanded`状态、Esc关菜单、跳到正文链接、键盘焦点、尊重减少动画偏好、部分手机布局改进；“中/EN”按钮明确注明仅切换测评题目语言，不是假称全站双语。
8. **公用电脑隐私**：可以明确选择清除V5与旧版V4同源历史；同时保留单独删除旧版V4历史的入口。清除不可逆，须先导出必要数据。

## 最简部署方式（推荐）

在本仓库 [`MAJOR-FUTURES-V5-TEST`](https://github.com/liyoureason813-maker/MAJOR-FUTURES-V5-TEST) 的 `main` 根目录，**只替换四个文件**：

- `index.html`
- `app.js`
- `styles.css`
- `README.md`

**无需重新上传 `data/`、`tools/` 或 `.github/workflows/deploy.yml`；原有 GitHub Actions 会在 `main` 提交后自动生成100专业完整数据并部署。**

在 Settings → Pages 确保 Source = GitHub Actions。检查 `Actions → Build and deploy complete V5 major atlas`，需构建成功后再打开 [测试站](https://liyoureason813-maker.github.io/MAJOR-FUTURES-V5-TEST/) 强制刷新。

## 建议验收

- 新访客无兴趣和选课：报告不应显示任何0分“推荐专业”。
- 60题全部选0或全部选4：不得返回强制生成的RIA，而是显示三字母待确认。
- 60题R=4、I=3、A=2、S=1、E/C=0：应返回RIA（依据原题类型分配，不是前10题）。
- 只在第三与第四分数同分时：不能强制选择第三名。
- 在课程中选数学：100张专业卡应显示推荐理由，详情可展开。
- 物理／应用物理对应关系不再误标为仅相关专业。
- 可比较3个专业；报告可下载HTML与JSON；手机菜单可用Esc关闭。
- 2027申请页 Oxford、UCL、LSE 总计41条，并且相关记录可打开大学官方说明页面。
- 100篇完整专业资料仍显示“100个完整专业档案已载入”。

## 数据边界与后续事项

- 本次**没有**重新验证所有100篇内容与外部资源链接，也没有重新估计薪酬、岗位AI影响或逐条映射O*NET 31.0。
- 100专业资料来自你本人另一站的历史发布数据；薪酬是职业簇规划区间而非调查中位数。
- 当前匹配是可解释的自定义探索启发式，不能用作测量心理特质的临床效度、专业申请资格或预测录取概率。
- 28重点专业以外的72专业仍没有原版同样粒度的AI岗位深度地图；现有100专业长文仍以中文为主。分享链接、G10–G12交互式任务清单和全站英文本地化属于后续独立开发，不在此修复包中。
- 入学测试规则可能调整：来源为[Oxford](https://www.ox.ac.uk/admissions/undergraduate/applying/guide-for-applicants/admissions-tests)、[UCL](https://www.ucl.ac.uk/study/prospective-students/school-teachers-and-counsellors/tests-tasks-and-interviews)、[LSE](https://www.lse.ac.uk/study-at-lse/Undergraduate/Prospective-Students/How-to-Apply/Test-of-Mathematics-for-University-Admission-TMUA)，最后核对日期2026-11-17。
