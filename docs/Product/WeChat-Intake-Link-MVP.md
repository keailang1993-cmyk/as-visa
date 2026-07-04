# WeChat Intake Link MVP

## Product Direction

AS VISA customer entry is pivoting from an app-like customer portal to a WeChat-friendly intake link.

The real use case is:

1. A staff member sends a link to the customer through WeChat or Enterprise WeChat.
2. The customer opens the link inside WeChat.
3. The customer fills in basic information.
4. The customer uploads required visa documents.
5. The customer reviews and submits the form.
6. The customer sees a clear success state.

## Why This Is Not An App

The customer should not need to explore navigation, dashboards, tabs, or account areas.

This experience should feel like:

- A premium WeChat web form
- A guided intake link
- A direct document submission flow
- A calm and trustworthy service handoff

It should not feel like:

- A mobile app
- A dashboard
- A CRM
- A system the customer needs to learn

## Customer Journey

1. Open `/intake`
2. Review case information
3. Tap `开始填写`
4. Fill in basic information
5. Upload required documents
6. Review information and uploaded documents
7. Submit
8. See success state

## Page States

The MVP uses one route:

- `/intake`

The route contains step states:

1. Welcome / Case Info
2. Basic Information
3. Document Upload
4. Review & Submit
5. Success

## Fields

Basic information fields:

- 姓名
- 手机号
- 出生日期
- 护照号码
- 出行国家
- 出行时间
- 职业类型

职业类型 options:

- 在职
- 自由职业
- 学生
- 退休
- 未成年人
- 其他

## Upload Requirements

Required documents:

- 护照首页
  - 请上传清晰照片，确保四角完整、无反光。
- 身份证正反面
  - 请上传身份证正面和反面照片。
- 银行流水
  - 请上传近 6 个月银行流水文件或截图。
- 证件照
  - 请上传白底证件照。

Each document item includes:

- Document name
- Short requirement
- Upload button
- Uploaded state
- Re-upload option

## MVP Limitations

- Data is local state only.
- Uploaded files are not stored.
- There is no Supabase connection yet.
- There is no real customer database yet.
- There is no SMS login in this flow.
- There is no OpenAI or OCR document review yet.
- Submit success is local only.
- `查看提交记录` is a placeholder CTA.

## Future Backend Integration Plan

1. Create intake link records per visa case.
2. Load case metadata from backend by secure token.
3. Persist basic information to Supabase/PostgreSQL.
4. Store uploaded files in encrypted storage.
5. Generate required documents from Rule Engine.
6. Run OCR and AI checks after upload.
7. Save review results to the visa case.
8. Notify staff through Enterprise WeChat.
9. Notify customers when additional materials are needed.
10. Add a read-only submission record page.
