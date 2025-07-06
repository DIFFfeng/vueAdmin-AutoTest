// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * @description 针对 Vue SPA应用的考试试卷批改流程，最终优化版端到端测试
 * @date 2025年7月6日 
 */
test('系统模型识别核心测试 - 批改端到端测试', async ({ page }) => {

  // --- 步骤 1: 登录系统 ---
  await page.goto('http://localhost/');
  
  await page.locator('[placeholder="账号"]').fill('admin');
  await page.locator('[placeholder="密码"]').fill('admin123');
  await page.getByRole('button', { name: '登录' }).click();
  
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

  // --- 步骤 4: 模型核心功能识别 ---
  await page.getByRole('button', { name: '大模型识别' }).click();

  // await page.waitForTimeout(3000);

  // --- 步骤 5: 执行批改 ---
  const correctButton = page.getByRole('button', { name: /批改/ });
  
  await expect(correctButton).toBeEnabled({ timeout: 15000 });
  
  await correctButton.click();
  
  
  // --- 步骤 6: 结果验证 ---
  const resultPanel = page.getByText('经检测过程无误，答案正确 题目总分5分，得分5分')
  
  await expect(resultPanel).toBeVisible({ timeout: 10000 });
  
  await expect(resultPanel).toContainText('得分');
  

  // --- 步骤 7: 结束前等待静默输出 ---
  await page.waitForTimeout(3000);
});