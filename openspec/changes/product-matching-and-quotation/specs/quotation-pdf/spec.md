## ADDED Requirements

### Requirement: Propiston 正式報價單 PDF 生成
系統 SHALL 提供報價單 PDF 生成功能，僅限 Propiston（大正）品牌可生成正式報價單。報價單 SHALL 包含：

- 公司資訊：大正油壓機械股份有限公司、412台中市大里區夏田路23號、886-4-2407-3898、info@propiston.com
- 報價日期（自動帶入當日）
- 客戶名稱（使用者輸入）
- 產品明細表：項次、型號、規格摘要、數量、單價、小計
- 合計金額
- 備註：「本報價有效期 30 天，實際交期請洽業務確認」

#### Scenario: 生成 Propiston 報價單
- **WHEN** 使用者完成計算，且在 Propiston 品牌區塊點擊「生成報價單」按鈕
- **THEN** 系統 SHALL 生成 PDF 檔案並觸發瀏覽器下載，檔名格式為 `Propiston_報價單_YYYYMMDD.pdf`

#### Scenario: 報價單包含完整產品明細
- **WHEN** 報價單 PDF 生成
- **THEN** PDF SHALL 包含所有匹配到的 Propiston 產品型號（泵、閥件等），每項列出型號、規格、單價

#### Scenario: 報價單中文顯示正確
- **WHEN** 報價單 PDF 生成
- **THEN** 所有中文字元 SHALL 正確顯示（不得出現亂碼或方塊字）

### Requirement: 其他品牌建議規格書
對於非 Propiston 品牌，系統 SHALL 提供「建議規格書」匯出功能，內容僅包含型號與規格參數，不含價格資訊。

#### Scenario: 生成建議規格書
- **WHEN** 使用者在非 Propiston 品牌區塊點擊「匯出建議規格」按鈕
- **THEN** 系統 SHALL 生成 PDF 檔案，標題為「液壓系統建議規格書」，不含公司抬頭，不含價格欄位

#### Scenario: 建議規格書標注非正式報價
- **WHEN** 建議規格書 PDF 生成
- **THEN** PDF SHALL 在頁尾標注「此為建議規格，非正式報價，實際規格與價格請洽各品牌代理商」

### Requirement: PDF 生成按鈕的顯示條件
PDF 生成相關按鈕 SHALL 僅在計算完成且有匹配結果時顯示。

#### Scenario: 未計算時不顯示按鈕
- **WHEN** 使用者尚未執行計算（無計算結果）
- **THEN** 報價單和建議規格書的生成按鈕 SHALL 不顯示

#### Scenario: 計算完成後顯示按鈕
- **WHEN** 使用者完成計算且有匹配結果
- **THEN** Propiston 品牌卡片顯示「生成報價單」按鈕，其他品牌卡片顯示「匯出建議規格」按鈕
