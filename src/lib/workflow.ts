// 記事の状態遷移。docs/DATA.md「記事の状態」の正本実装。
// サーバー側でも同じ関数で検査する想定（画面だけで止めない）。

import type { Article, ArticleStatus, ReviewPolicy, Role } from "@/types/domain";

export type ArticleAction =
  | { type: "edit"; newVersionId: string }
  | { type: "request_review" }
  | { type: "request_changes" }
  | { type: "approve" }
  | { type: "publish"; url: string; at: string };

export class TransitionError extends Error {
  constructor(public readonly code: "forbidden" | "invalid_state" | "approval_required" | "invalid_url", message: string) {
    super(message);
  }
}

export const STATUS_LABEL: Record<ArticleStatus, string> = {
  drafting: "作成中",
  in_review: "確認待ち",
  changes_requested: "修正依頼あり",
  approved: "承認済み",
  published: "公開済み",
};

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * 記事に操作を適用した結果を返す。許されない操作は TransitionError を投げる。
 * 版の固定（frozen）は呼び出し側で reviewRequestedVersionId / approvedVersionId を見て行う。
 */
export function applyAction(article: Article, action: ArticleAction, role: Role, policy: ReviewPolicy): Article {
  const next: Article = { ...article, lockVersion: article.lockVersion + 1 };

  switch (action.type) {
    case "edit": {
      if (role !== "client_member") throw new TransitionError("forbidden", "記事を編集できるのは顧客担当者です");
      next.currentVersionId = action.newVersionId;
      // 確認待ち中の編集は別版として保存し、確認待ちの版と状態は変えない
      if (article.status === "in_review") return next;
      if (article.status === "approved") next.approvedVersionId = null;
      next.status = "drafting";
      return next;
    }
    case "request_review": {
      if (role !== "client_member") throw new TransitionError("forbidden", "確認依頼は顧客担当者が行います");
      if (article.status !== "drafting" && article.status !== "changes_requested") {
        throw new TransitionError("invalid_state", "この状態では確認依頼できません");
      }
      next.status = "in_review";
      next.reviewRequestedVersionId = article.currentVersionId;
      return next;
    }
    case "request_changes":
    case "approve": {
      if (role !== "coach") throw new TransitionError("forbidden", "レビューはコタム担当者が行います");
      if (article.status !== "in_review") throw new TransitionError("invalid_state", "確認待ちの記事ではありません");
      if (action.type === "approve") {
        next.status = "approved";
        next.approvedVersionId = article.reviewRequestedVersionId;
        // 確認待ちの間に新しい版が作られていたら、承認した版を現在の版に戻す
        next.currentVersionId = article.reviewRequestedVersionId;
      } else {
        next.status = "changes_requested";
      }
      next.reviewRequestedVersionId = null;
      return next;
    }
    case "publish": {
      if (role !== "client_member") throw new TransitionError("forbidden", "公開済みの登録は顧客担当者が行います");
      if (!isHttpUrl(action.url)) throw new TransitionError("invalid_url", "公開URLを正しく入力してください");
      if (article.status === "approved") {
        next.publishedWithoutApproval = false;
      } else if (policy === "required") {
        throw new TransitionError("approval_required", "この会社では承認済みの記事だけを公開済みにできます");
      } else if (article.status === "drafting") {
        next.publishedWithoutApproval = true;
      } else {
        throw new TransitionError("invalid_state", "この状態では公開済みにできません");
      }
      next.status = "published";
      next.publishedUrl = action.url;
      next.publishedAt = action.at;
      return next;
    }
  }
}

/** 画面のボタン表示用。applyAction が投げないかどうかで判定する */
export function canApply(article: Article, action: ArticleAction, role: Role, policy: ReviewPolicy): boolean {
  try {
    applyAction(article, action, role, policy);
    return true;
  } catch {
    return false;
  }
}
