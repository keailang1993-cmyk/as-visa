"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { Button, Check, FileText, Upload } from "@as-visa/ui";
import styles from "./intake.module.css";

type IntakeStep = 1 | 2 | 3 | 4 | 5;

type BasicInfo = {
  name: string;
  phone: string;
  birthDate: string;
  passportNumber: string;
  destination: string;
  travelDate: string;
  occupation: string;
};

type DocumentItem = {
  id: keyof UploadedDocuments;
  name: string;
  requirement: string;
};

type UploadedDocuments = {
  passport: string;
  idCard: string;
  bankStatement: string;
  photo: string;
};

const initialInfo: BasicInfo = {
  name: "",
  phone: "",
  birthDate: "",
  passportNumber: "",
  destination: "日本",
  travelDate: "",
  occupation: ""
};

const initialDocuments: UploadedDocuments = {
  passport: "",
  idCard: "",
  bankStatement: "",
  photo: ""
};

const occupationOptions = ["在职", "自由职业", "学生", "退休", "未成年人", "其他"] as const;

const documents: DocumentItem[] = [
  {
    id: "passport",
    name: "护照首页",
    requirement: "请上传清晰照片，确保四角完整、无反光。"
  },
  {
    id: "idCard",
    name: "身份证正反面",
    requirement: "请上传身份证正面和反面照片。"
  },
  {
    id: "bankStatement",
    name: "银行流水",
    requirement: "请上传近 6 个月银行流水文件或截图。"
  },
  {
    id: "photo",
    name: "证件照",
    requirement: "请上传白底证件照。"
  }
];

export default function IntakePage() {
  const [step, setStep] = useState<IntakeStep>(1);
  const [info, setInfo] = useState<BasicInfo>(initialInfo);
  const [uploaded, setUploaded] = useState<UploadedDocuments>(initialDocuments);
  const submittedAt = useMemo(() => new Date().toLocaleString("zh-CN", { hour12: false }), []);

  const missingDocuments = documents.filter((item) => !uploaded[item.id]);
  const allDocumentsUploaded = missingDocuments.length === 0;

  function updateInfo(field: keyof BasicInfo, value: string) {
    setInfo((current) => ({ ...current, [field]: value }));
  }

  function handleUpload(documentId: keyof UploadedDocuments, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploaded((current) => ({ ...current, [documentId]: file.name }));
  }

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell} aria-labelledby="intake-title">
        <header className={styles.header}>
          <p className={styles.brand}>AS VISA</p>
          <span>资料收集</span>
        </header>

        <div className={styles.progress} aria-label={`第 ${step} 步，共 5 步`}>
          {[1, 2, 3, 4, 5].map((item) => (
            <span className={item <= step ? styles.progressDotActive : styles.progressDot} key={item} />
          ))}
        </div>

        {step === 1 ? (
          <section className={styles.step}>
            <div className={styles.hero}>
              <p className={styles.kicker}>日本旅游签证</p>
              <h1 id="intake-title">签证资料填写</h1>
              <p>请按照提示填写信息并上传资料，我们会为您进行初步检查。</p>
            </div>

            <article className={styles.caseCard}>
              <div>
                <span>办理类型</span>
                <strong>日本旅游签证</strong>
              </div>
              <div>
                <span>当前状态</span>
                <strong>等待提交资料</strong>
              </div>
              <div>
                <span>预计用时</span>
                <strong>3-5 分钟</strong>
              </div>
            </article>

            <Button className={styles.primaryButton} onClick={() => setStep(2)}>
              开始填写
            </Button>
          </section>
        ) : null}

        {step === 2 ? (
          <section className={styles.step}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>基础信息</p>
              <h1 id="intake-title">请填写申请人信息</h1>
              <p>信息仅用于本次签证资料初步整理。</p>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>姓名</span>
                <input onChange={(event) => updateInfo("name", event.target.value)} placeholder="请输入姓名" value={info.name} />
              </label>
              <label className={styles.field}>
                <span>手机号</span>
                <input inputMode="tel" onChange={(event) => updateInfo("phone", event.target.value)} placeholder="请输入手机号" value={info.phone} />
              </label>
              <label className={styles.field}>
                <span>出生日期</span>
                <input onChange={(event) => updateInfo("birthDate", event.target.value)} type="date" value={info.birthDate} />
              </label>
              <label className={styles.field}>
                <span>护照号码</span>
                <input onChange={(event) => updateInfo("passportNumber", event.target.value)} placeholder="请输入护照号码" value={info.passportNumber} />
              </label>
              <label className={styles.field}>
                <span>出行国家</span>
                <input onChange={(event) => updateInfo("destination", event.target.value)} placeholder="日本" value={info.destination} />
              </label>
              <label className={styles.field}>
                <span>出行时间</span>
                <input onChange={(event) => updateInfo("travelDate", event.target.value)} type="date" value={info.travelDate} />
              </label>
              <label className={styles.field}>
                <span>职业类型</span>
                <select onChange={(event) => updateInfo("occupation", event.target.value)} value={info.occupation}>
                  <option value="">请选择职业类型</option>
                  {occupationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <Button className={styles.primaryButton} onClick={() => setStep(3)}>
              下一步，上传资料
            </Button>
          </section>
        ) : null}

        {step === 3 ? (
          <section className={styles.step}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>资料上传</p>
              <h1 id="intake-title">请上传所需资料</h1>
              <p>支持照片、截图或文件。请确保内容清晰可读。</p>
            </div>

            <div className={styles.documentList}>
              {documents.map((item) => {
                const fileName = uploaded[item.id];
                return (
                  <article className={styles.documentCard} key={item.id}>
                    <div className={styles.documentIcon}>
                      {fileName ? <Check size={18} strokeWidth={2.4} /> : <FileText size={18} strokeWidth={1.8} />}
                    </div>
                    <div className={styles.documentCopy}>
                      <h2>{item.name}</h2>
                      <p>{item.requirement}</p>
                      {fileName ? <strong>{fileName}</strong> : null}
                    </div>
                    <label className={fileName ? styles.reuploadButton : styles.uploadButton}>
                      <Upload size={15} strokeWidth={1.8} />
                      {fileName ? "重新上传" : "上传"}
                      <input accept="image/*,.pdf" onChange={(event) => handleUpload(item.id, event)} type="file" />
                    </label>
                  </article>
                );
              })}
            </div>

            <Button className={styles.primaryButton} onClick={() => setStep(4)}>
              下一步，确认提交
            </Button>
          </section>
        ) : null}

        {step === 4 ? (
          <section className={styles.step}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>确认提交</p>
              <h1 id="intake-title">请确认资料信息</h1>
              <p>提交后，顾问会开始审核您的资料。</p>
            </div>

            <section className={styles.summaryCard}>
              <h2>基础信息</h2>
              <dl>
                <div><dt>姓名</dt><dd>{info.name || "未填写"}</dd></div>
                <div><dt>手机号</dt><dd>{info.phone || "未填写"}</dd></div>
                <div><dt>出生日期</dt><dd>{info.birthDate || "未填写"}</dd></div>
                <div><dt>护照号码</dt><dd>{info.passportNumber || "未填写"}</dd></div>
                <div><dt>出行国家</dt><dd>{info.destination || "未填写"}</dd></div>
                <div><dt>出行时间</dt><dd>{info.travelDate || "未填写"}</dd></div>
                <div><dt>职业类型</dt><dd>{info.occupation || "未填写"}</dd></div>
              </dl>
            </section>

            <section className={styles.summaryCard}>
              <h2>已上传资料</h2>
              <div className={styles.uploadSummary}>
                {documents.map((item) => (
                  <span className={uploaded[item.id] ? styles.uploadedTag : styles.missingTag} key={item.id}>
                    {uploaded[item.id] ? "已上传" : "缺失"} · {item.name}
                  </span>
                ))}
              </div>
            </section>

            {!allDocumentsUploaded ? (
              <p className={styles.warning}>还有资料未上传，请补充后再提交。</p>
            ) : null}

            <Button className={styles.primaryButton} disabled={!allDocumentsUploaded} onClick={() => setStep(5)}>
              确认提交
            </Button>
          </section>
        ) : null}

        {step === 5 ? (
          <section className={`${styles.step} ${styles.successStep}`}>
            <div className={styles.successIcon}>
              <Check size={30} strokeWidth={2.4} />
            </div>
            <h1 id="intake-title">资料已提交</h1>
            <p>我们已收到您的资料，顾问会进行审核。如需补充资料，我们会通过企业微信联系您。</p>

            <article className={styles.caseCard}>
              <div>
                <span>提交时间</span>
                <strong>{submittedAt}</strong>
              </div>
              <div>
                <span>办理类型</span>
                <strong>日本旅游签证</strong>
              </div>
              <div>
                <span>当前状态</span>
                <strong>顾问审核中</strong>
              </div>
            </article>

            <Button className={styles.primaryButton} onClick={() => undefined}>
              查看提交记录
            </Button>
            <p className={styles.secondaryCopy}>您可以关闭页面，后续进展会通过企业微信通知。</p>
          </section>
        ) : null}
      </section>
    </main>
  );
}
