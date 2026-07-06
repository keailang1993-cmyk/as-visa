"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CaseNote } from "../_lib/adminData";
import { formatDateTime } from "../_lib/adminData";
import styles from "../admin.module.css";

type InternalNotesPanelProps = {
  caseId: string;
  initialNotes: CaseNote[];
};

export function InternalNotesPanel({ caseId, initialNotes }: InternalNotesPanelProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [staffName, setStaffName] = useState("AS VISA Staff");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingStaffName, setEditingStaffName] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function refreshNotes() {
    const response = await fetch(`/api/admin/cases/${caseId}/notes`, {
      method: "GET"
    });

    if (!response.ok) return;

    const payload = await response.json() as { notes: CaseNote[] };
    setNotes(payload.notes);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!content.trim()) {
      setMessage("请先填写内部备注。");
      return;
    }

    const response = await fetch(`/api/admin/cases/${caseId}/notes`, {
      body: JSON.stringify({
        content,
        staffName
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (!response.ok) {
      setMessage("备注保存失败，请稍后重试。");
      return;
    }

    setContent("");
    setMessage("备注已保存。");
    await refreshNotes();
    startTransition(() => router.refresh());
  }

  function startEdit(note: CaseNote) {
    setEditingNoteId(note.id);
    setEditingStaffName(note.staff_name);
    setEditingContent(note.content);
    setMessage("");
  }

  function cancelEdit() {
    setEditingNoteId(null);
    setEditingStaffName("");
    setEditingContent("");
  }

  async function handleUpdate(noteId: string) {
    setMessage("");

    if (!editingContent.trim()) {
      setMessage("备注内容不能为空。");
      return;
    }

    const response = await fetch(`/api/admin/cases/${caseId}/notes/${noteId}`, {
      body: JSON.stringify({
        content: editingContent,
        staffName: editingStaffName
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });

    if (!response.ok) {
      setMessage("备注更新失败，请稍后重试。");
      return;
    }

    cancelEdit();
    setMessage("备注已更新。");
    await refreshNotes();
    startTransition(() => router.refresh());
  }

  async function handleDelete(noteId: string) {
    setMessage("");

    const response = await fetch(`/api/admin/cases/${caseId}/notes/${noteId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      setMessage("备注删除失败，请稍后重试。");
      return;
    }

    setMessage("备注已删除。");
    await refreshNotes();
    startTransition(() => router.refresh());
  }

  return (
    <section className={`${styles.card} ${styles.notesPanel}`} aria-labelledby="internal-notes-heading">
      <div className={styles.notesHeader}>
        <div>
          <span className={styles.label}>Staff Only</span>
          <h2 id="internal-notes-heading">Internal Notes</h2>
        </div>
        <span className={styles.timelineCount}>{notes.length}</span>
      </div>

      <form className={styles.noteForm} onSubmit={handleCreate}>
        <label className={styles.noteField}>
          <span>Staff name</span>
          <input
            disabled={isPending}
            onChange={(event) => setStaffName(event.target.value)}
            value={staffName}
          />
        </label>
        <label className={styles.noteField}>
          <span>Add Note</span>
          <textarea
            disabled={isPending}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Add a private staff-only note. Customers will never see this."
            value={content}
          />
        </label>
        <button className={styles.button} disabled={isPending} type="submit">
          Save Note
        </button>
      </form>

      {message ? <p className={styles.formMessage}>{message}</p> : null}

      <div className={styles.notesList}>
        {notes.length === 0 ? <p className={styles.muted}>暂无内部备注</p> : null}
        {notes.map((note) => (
          <article className={styles.noteCard} key={note.id}>
            {editingNoteId === note.id ? (
              <div className={styles.noteEditForm}>
                <label className={styles.noteField}>
                  <span>Staff name</span>
                  <input
                    disabled={isPending}
                    onChange={(event) => setEditingStaffName(event.target.value)}
                    value={editingStaffName}
                  />
                </label>
                <label className={styles.noteField}>
                  <span>Note</span>
                  <textarea
                    disabled={isPending}
                    onChange={(event) => setEditingContent(event.target.value)}
                    value={editingContent}
                  />
                </label>
                <div className={styles.noteActions}>
                  <button className={styles.secondaryButton} disabled={isPending} onClick={cancelEdit} type="button">
                    Cancel
                  </button>
                  <button className={styles.button} disabled={isPending} onClick={() => handleUpdate(note.id)} type="button">
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.noteMeta}>
                  <strong>{note.staff_name}</strong>
                  <span>{formatDateTime(note.created_at)}</span>
                </div>
                <p>{note.content}</p>
                {note.updated_at !== note.created_at ? (
                  <span className={styles.noteEdited}>Updated {formatDateTime(note.updated_at)}</span>
                ) : null}
                <div className={styles.noteActions}>
                  <button className={styles.secondaryButton} disabled={isPending} onClick={() => startEdit(note)} type="button">
                    Edit
                  </button>
                  <button className={styles.dangerButton} disabled={isPending} onClick={() => handleDelete(note.id)} type="button">
                    Delete
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
