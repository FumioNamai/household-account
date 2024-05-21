# N 式家計簿

## アプリの概要

食品・日用品などの在庫管理、家計計算、買い物リスト作成を簡単にするアプリ

## 目指した課題解決

それまでメモアプリに手作業で購入商品の記録、税込/税抜入力、使用金額集計、在庫数管理、日別集計、月別集計を行っていた家計計算作業を効率化
買い物のリストアップから家計計算までを一貫して 1 つのアプリで対応

## URL

https://household-account-kappa.vercel.app/<br>
テスト用アカウント<br>
メールアドレス：testuser@mail.com<br>
パスワード：240424<br>

## 利用方法

1. ユーザー登録をする
1. 在庫/商品登録をする

## 基本機能の使い方

<table>
  <tr>
    <th colspan="2">ログイン</th>
  </tr>
  <tr>
    <td>GIF</td>
　　<td>メールアドレスに testuser@mail.com を入力<br>
        パスワードに 240424 を入力<br>
        ログインボタンをクリック
    </td>
  </tr>
  <tr>
  <th colspan="2">在庫/商品登録</th>
  </tr>
  <tr>
    <td>GIF</td>
　　<td>在庫一覧/検索ページへ移動<br>
        在庫/商品登録ボタンをクリック<br>
        購入日・種別・分類を選択し商品名を入力<br>
        数量を選択<br>
        在庫一覧に登録するボタンをクリック
    </td>
  </tr>
  <tr>
    <th colspan="2">在庫/買い物リスト登録</th>
  </tr>
  <tr>
    <td>GIF</td>
    <td>買い物リストページへ移動<br>
        登録ボタンをクリック<br>
        種別・分類を選択し商品名を入力<br>
        購入予定店を選択<br>
        買い物リストに追加するボタンをクリック
    </td>
  </tr>
  <tr>
    <th colspan="2">使用済み操作</th>
  </tr>
  <tr>
    <td>GIF</td>
    <td>在庫一覧/検索ページへ移動<br>
        種別・分類を選択<br>
        在庫リストから該当商品の✔ボタンをクリック
    </td>
  </tr>
  <tr>
  </tr>
</table>

## 実装した機能

- ユーザー登録/認証

- ダークモード

- データベースに変更を加える操作を行うと snackbar で操作に対しての成否をメッセージで表示

- アイコンボタンを長押し、またはホバーで注釈を表示

- 在庫/商品登録

- 買い物リスト登録

- 在庫検索機能

  - 選択した種別・分類でリストを表示
  - 商品名での検索が可能

- 商品リストに在庫操作用アイコンボタンを設置

  - 在庫あり
    - 「✓」指定した使用日で在庫を 1 つ使用済みにする
    - 「＋」在庫数を 1 つ増やす
    - 「－」在庫数を 1 つ減らす
    - 「🛒」買い物リストに追加/削除する
      買い物リストに入っている場合、アイコンをオレンジで表示
  - 在庫なし
    - 「🖊」入力した価格で登録する
    - 「🗑️」一覧から削除する
    - 「🛒」買い物リストに追加/削除する
      買い物リストに入っている場合、アイコンをオレンジで表示

- 月別集計

  - 選択した対象年月の合計・内訳・消費品目を表示
  - 消費品目は種別「その他」に限定し、個別の金額を表示
  - 「⬅️」在庫に戻す（登録した使用日を消去）

- 日別集計

  - 選択した対象年月日の合計・内訳・消費品目を表示
  - 消費品目は個別の金額を表示
  - 「⬅️」在庫に戻す（登録した使用日を消去）

- 買い物リスト
  - 商品名をクリックすると個別リストをモーダルで表示し、在庫の操作ができる MaterialUI
  - 「☐」買い物中にカゴに入れたときに目印の ✓ を入れておける。（リロードしてもチェックは消えない）
  - 「▼」から購入予定店を選択し、リストを店舗別に表示できる。

## 実装予定の機能

- 買い物リストをドラッグアンドドロップで並べ替えができる機能
- MUI の Popover を使って説明文を表示させる機能
- 買い物リストタイトルの下に購入予定店のボタンを配置し、クリックするとリストに移動できる機能
- 種別や分類、購入予定店をカスタマイズできる機能
- 月別集計と日別集計をグラフで表示する機能
- データベースの構造を見直し

## 使用技術

- フレームワーク : Next.js TypeScript<br>
- データベース : Supabase<br>
- インフラ : Vercel<br>
- ライブラリ : MaterialUI(UI コンポーネント), next-themes(ダークモード), day.js(日付・時刻), zod(バリデーション), zustand(状態管理)

## 工夫した箇所など

- ユーザー認証機能を SupabaseAuth で実装
- ダークモードの実装
- トップページの「月別集計」「日別集計」「在庫一覧/検索」「買い物リスト」をトグルボタンで切り替えて表示
- 登録データが存在しない場合に、商品登録を促すメッセージを表示
- 登録データが存在するときに上記メッセージが表示されないように、カスタムフックでレンダリングを遅らせる処理を追加
- スクロール動作を減らすため、各所に税込・税抜表示切替ができるボタンを配置
- 税込・税抜切り替えボタンで、表示金額を切り替え可能
- 在庫一覧の表示内容を在庫ありとなしで出しわける
- 在庫一覧を種別・分類でソートできる機能
- 在庫一覧を商品名で検索できる機能
- 在庫一覧を操作したときに、画面がスクロールされないよう、月別集計・日別集計の消費品目欄はアコーディオンで表示させた
- データを変更するイベント後に snackbar で処理の成否を表示
- データベースに変更を加える操作を行うと snackbar で操作に対しての成否を表示
- アイコンボタンを長押し、またはホバーで注釈を表示
- データベースから取得した個別の商品データを「同じ名前、同じ価格」の商品をグループ化し数量を取得
- 買い物リストから商品名をクリックすると在庫登録用のモーダルを表示し、在庫登録が可能
- 買い物リストを購入予定店舗別に表示

## 制作期間

- 2024.01.06~
