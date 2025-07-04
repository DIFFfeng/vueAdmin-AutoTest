// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * @description 针对 Vue SPA应用的考试试卷批改流程，最终优化版端到端测试
 */
test('新智教伙伴 - 考试试卷批改端到端测试', async ({ page }) => {

  // --- 步骤 1: 登录系统 ---
  console.log('1-1: 开始测试, 导航至登录页面');
  await page.goto('http://localhost/');
  
  await page.locator('[placeholder="账号"]').fill('admin');
  await page.locator('[placeholder="密码"]').fill('admin123');
  await page.getByRole('button', { name: '登 录' }).click();
  console.log('1-2: 已填写凭据并点击登录');
  
  await page.waitForURL('**/index');
  console.log('1-3: 登录成功, 已跳转至系统首页');
  
  // --- 步骤 2: SPA 菜单导航 ---
  console.log('2-1: 开始通过菜单进行SPA导航');
  
  await page.getByText('考试管理').click();
  console.log('2-2: 已点击父菜单 "考试管理"');
  
  await page.getByRole('menuitem', { name: '考试试卷批改' }).click();
  console.log('2-3: 已点击子菜单 "考试试卷批改"');

  await page.waitForURL('**/exams/correction');
  console.log('2-4: 导航成功, 当前URL已更新');

  // --- 步骤 3: 文件上传 ---
  const imagePath = path.join(process.cwd(), 'images', 'shijuan_1.jpg');
  console.log(`3-1: 准备上传图片, 路径: ${imagePath}`);
  
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: '选择图片' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(imagePath);
  console.log('3-2: 图片已成功附加到文件选择器');

  // --- 步骤 4: AI识别改卷 ---
  await page.getByRole('button', { name: '大模型识别' }).click();
  console.log('4-1: 已点击 [大模型识别] 按钮');

  await page.waitForTimeout(3000);
  console.log('4-2: 已等待 3000ms');

  // --- 步骤 5: 执行批改 ---
  const correctButton = page.getByRole('button', { name: /批改/ });
  console.log('5-1: 正在等待 [批改] 按钮变为可点击状态...');
  
  await expect(correctButton).toBeEnabled({ timeout: 15000 });
  console.log('5-2: [批改] 按钮已启用');
  
  await correctButton.click();
  console.log('5-3: 已点击 [批改] 按钮');
  
  // --- 步骤 6: 结果验证 ---
  console.log('6-1: 正在等待最终批改结果面板显示...');
  const resultPanel = page.getByText('经检测过程无误，答案正确 题目总分5分，得分5分 y′=') // 请确保这是您通过 Inspector 找到的正确选择器
  
  await expect(resultPanel).toBeVisible({ timeout: 10000 });
  console.log('6-2: 批改结果面板已在页面上可见');
  
  await expect(resultPanel).toContainText('得分');
  console.log('6-3: 结果内容验证通过');
  
  // --- 步骤 7: 测试总结 ---
  console.log('7-1: 测试所有步骤成功完成');

  // --- 步骤 8: 结束前观察 ---
  console.log('8-1: 测试结束, 页面将保持打开 3 秒以便观察');
  await page.waitForTimeout(3000);
});