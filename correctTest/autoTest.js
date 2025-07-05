// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';


test('项目兼容性测试 - 考试试卷批改端到端测试', async ({ page }) => {

  // --- 步骤 1: 登录系统 ---
  await page.goto('http://localhost/');
  
  await page.locator('[placeholder="账号"]').fill('admin');
  await page.locator('[placeholder="密码"]').fill('admin123');
  await page.getByRole('button', { name: '登 录' }).click();
  
  await page.waitForURL('**/index');
  
  // --- 步骤 2: SPA 菜单导航 ---
  
  await page.getByText('考试管理').click();
  
  await page.getByRole('menuitem', { name: '考试试卷批改' }).click();

  await page.waitForURL('**/exams/correction');

  // --- 步骤 3: 文件上传 ---
  const imagePath = path.join(process.cwd(), 'images', 'shijuan_1.jpg');
  
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: '选择图片' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(imagePath);

  // --- 步骤 4: 大模型识别 ---
  await page.getByRole('button', { name: '大模型识别' }).click();

  await page.waitForTimeout(3000);

  // --- 步骤 5: 执行批改 ---
  const correctButton = page.getByRole('button', { name: /批改/ });
  
  await expect(correctButton).toBeEnabled({ timeout: 15000 });
  
  await correctButton.click();
  
  // --- 步骤 6: 结果验证 ---
  // const resultPanel = page.locator('#app .el-form .el-card .el-card__body'); // 请确保这是您通过 Inspector 找到的正确选择器
  const resultPanel = page.getByText('经检测过程无误，答案正确 题目总分5分，得分5分')

  
  await expect(resultPanel).toBeVisible({ timeout: 10000 });
  
  await expect(resultPanel).toContainText('得分');
  
  // --- 步骤 7: 测试总结 ---

  // --- 步骤 8: 结束前观察 ---
  await page.waitForTimeout(3000);
});