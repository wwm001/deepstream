import type { SettingCheck } from "./types";

export const settingsChecks: SettingCheck[] = [
  {
    label: "Dev Server",
    value: "Vite によるローカル確認フローを継続中",
    state: "ok",
    note: "画面確認のサイクルは安定しています。ポート切替が起きても動作自体は正常です。",
  },
  {
    label: "Git Sync",
    value: "main ブランチは GitHub と同期済み",
    state: "ok",
    note: "小さく変更して即 push する運用が定着しており、差分を長く抱え込んでいません。",
  },
  {
    label: "UI Direction",
    value: "静的モックから状態連動UIへ移行済み",
    state: "watch",
    note: "今後は見た目だけでなく、実データや実操作に寄せる段階に入ります。",
  },
  {
    label: "Next Expansion",
    value: "セクション別の専用表示を追加中",
    state: "next",
    note: "設定以外の画面にも、そのセクション専用の表示ブロックを増やしていく余地があります。",
  },
];