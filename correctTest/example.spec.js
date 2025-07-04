// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * @description 针对若依(RuoYi-Vue)系统的考试试卷批改流程端到端自动化测试
 *
 * 测试流程:
 * 1. 打开登录页面并执行登录操作
 * 2. 验证是否成功跳转到系统首页
 * 3. 暂停1秒后，导航到试卷批改页面
 * 4. 上传待批改的试卷图片
 * 5. 点击 "大模型识别" 按钮进行智能分析
 * 6. 等待3秒让后台处理
 * 7. 点击 "批改" 按钮
 * 8. 验证批改结果是否成功渲染在界面右侧
 */
test('新智教伙伴 - 考试试卷批改端到端测试', async ({ page }) => {

  // --- 步骤 1: 登录系统 ---
  // 访问应用的根路径，通常会跳转到登录页
  await page.goto('http://localhost/');

  // 找到用户名和密码输入框并填写
  // 若依默认的 placeholder 是 "账号" 和 "密码"
  // 请根据您的实际情况修改 'admin' 和 'admin123'
  await page.locator('[placeholder="账号"]').fill('admin');
  await page.locator('[placeholder="密码"]').fill('admin123');

  // 点击登录按钮。若依的登录按钮文本通常是 "登 录" (中间有空格)
  await page.getByRole('button', { name: '登 录' }).click();
  console.log('✅ 1、已提交登录信息');

  // --- 步骤 2: 验证登录成功并跳转到首页 ---
  // 登录成功后，URL应该变为首页地址。使用 waitForURL 进行等待和验证。
  await page.waitForURL('**/index');
  await expect(page).toHaveTitle(/.*首页.*/); // 验证页面标题是否包含 "首页"
  console.log('✅ 2、登录成功，已跳转到系统首页');

  // --- 步骤 3: 暂停并导航到目标测试页面 ---
  // 按照您的要求，暂停1秒钟
  await page.waitForTimeout(1000);
  console.log('⏰ 已暂停 1000ms');

  // 直接导航到【考试试卷批改】页面
  await page.goto('http://localhost/exams/correction');
  await expect(page).toHaveTitle(/.*考试试卷批改.*/); // 再次验证确保到达了正确的页面
  console.log('✅ 3、成功导航到试卷批改页面');

  // --- 步骤 4: 上传图片 ---
  // 定义图片的绝对路径
  const imagePath = path.join(process.cwd(), 'images', 'test_paper_image.png');

  // 监听 filechooser 事件来处理 Element-UI 的文件上传
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: '选择图片' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(imagePath);
  console.log(`✅ 4、成功选择图片: ${imagePath}`);
  
  // 断言：验证UI上是否出现了已上传文件的提示
  await expect(page.getByText('test_paper_image.png')).toBeVisible();
  console.log('✅ 5、验证图片已成功上传并显示');

  // --- 步骤 5: 点击【大模型识别】按钮 ---
  await page.getByRole('button', { name: '大模型识别' }).click();
  console.log('✅ 6、已点击【大模型识别】按钮');

  // --- 步骤 6: 等待处理 ---
  // 强制等待3秒
  await page.waitForTimeout(3000);
  console.log('⏰ 已等待 3000ms');

  // --- 步骤 7: 点击【批改】按钮 ---
  await page.getByRole('button', { name: '批改' }).click();
  console.log('✅ 7、已点击【批改】按钮');

  // --- 步骤 8: 验证最终结果 ---
  // **请务必将 '.correction-result-panel' 替换为您项目中实际的、唯一的选择器！**
  const resultPanel = page.locator('.correction-result-panel');

  // 断言结果容器可见，并设置一个合理的超时时间
  await expect(resultPanel).toBeVisible({ timeout: 10000 });
  console.log('✅ 批改结果容器已在页面上显示');

  // 断言结果容器中包含预期的文本
  await expect(resultPanel).toContainText('批改完成');
  console.log('✅ 验证结果内容符合预期');
  console.log('🎉 测试成功完成！');
});