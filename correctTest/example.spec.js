// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * @description 针对 Vue SPA应用的考试试卷批改流程，最终优化版端到端测试
 */
test('新智教伙伴 - 考试试卷批改端到端测试', async ({ page }) => {

  // --- 步骤 1: 登录系统 ---
  await page.goto('http://localhost/');
  console.log('🚀 开始测试：访问登录页面');
  
  await page.locator('[placeholder="账号"]').fill('admin');
  await page.waitForTimeout(3000);
  await page.locator('[placeholder="密码"]').fill('admin123');
  await page.getByRole('button', { name: '登 录' }).click();
  
  await page.waitForURL('**/index');
  console.log('✅ 登录成功，已进入系统首页');
  
  // --- 步骤 2: SPA 菜单导航 (定位器优化) ---
  console.log('🧭 开始模拟用户点击菜单进行导航...');
  
  // 点击父菜单 "考试管理"
  await page.getByText('考试管理').click();
  console.log('   -> 点击了 "考试管理" 菜单');
  
  // 根据您提供的HTML，点击 "考试试卷批改"。
  // getByRole('menuitem', ...) 是最符合无障碍和用户习惯的定位方式，非常稳健。
  // 它能精确匹配 <li role="menuitem" ...>考试试卷批改</li> 这样的元素。
  await page.getByRole('menuitem', { name: '考试试卷批改' }).click();
  console.log('   -> 点击了 "考试试卷批改" 子菜单');

  await page.waitForURL('**/exams/correction');
  console.log('✅ 导航成功，当前页面路由: /exams/correction');

  // --- 步骤 3 ~ 6: 核心测试流程 (保持不变) ---
  const imagePath = path.join(process.cwd(), 'images', 'shijuan_1.jpg');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: '选择图片' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(imagePath);
  console.log(`✅ 成功上传图片: ${imagePath}`);

  await page.getByRole('button', { name: '大模型识别' }).click();
  console.log('✅ 已点击【大模型识别】按钮');

  await page.waitForTimeout(3000);
  console.log('⏰ 已等待 3000ms');

  const correctButton = page.getByRole('button', { name: /批改/ });
  console.log('⏳ 正在等待【批改】按钮变为可点击状态...');
  await expect(correctButton).toBeEnabled({ timeout: 15000 });
  console.log('✅ 【批改】按钮已启用!');
  
  await correctButton.click();
  console.log('🖱️ 已点击【批改】按钮');
  
  // --- 步骤 7: 验证最终结果 ---
  console.log('🧐 正在等待最终批改结果显示...');
  // const resultPanel = page.locator('.correction-result-panel');
  const resultPanel = page.getByText('经检测过程无误，答案正确 题目总分5分，得分5分')
  await expect(resultPanel).toBeVisible({ timeout: 100000 });
  await expect(resultPanel).toContainText('得分');
  console.log('👍 结果内容验证通过');
  
  console.log('🎉🎉🎉 测试成功完成！');

  // --- 步骤 8: 最终等待 (新增优化) ---
  console.log('👀 测试成功，页面将保持打开 3 秒钟以便观察...');
  await page.waitForTimeout(3000);
});