## ADDED Requirements

### Requirement: 產品型錄資料庫
系統 SHALL 維護各品牌的產品型錄資料，包含泵、閥件、油壓缸、電機四大類。每筆產品記錄 SHALL 包含：品牌代碼、系列名稱、型號字串、關鍵規格參數（排量/壓力/流量/缸徑等）、產品類型。

支援品牌：
- Propiston 大正：P 系列柱塞泵、DSG 方向閥、BG 溢流閥
- Yuken 油研：PV2R 葉片泵、A 系列柱塞泵、DSG 方向閥
- Rexroth 力士樂：A4VG/A10V 柱塞泵、4WE 方向閥、DBW 溢流閥
- Parker：PV 系列柱塞泵、D1VW 方向閥
- 北部精機 Northman：SWH 方向閥、SRCG 溢流閥
- 匯川 Inovance：IS620P/IS820 伺服驅動 + MS1 伺服電機（功率 0.4kW~55kW、額定扭矩 1.27~176 N·m）

#### Scenario: 型錄資料載入
- **WHEN** 應用程式載入完成
- **THEN** 所有品牌的產品型錄資料 SHALL 可供型號匹配引擎查詢

#### Scenario: 型錄資料結構完整性（泵）
- **WHEN** 查詢任一品牌的泵產品
- **THEN** 每筆記錄 SHALL 包含 model（型號字串）、displacement（排量 cc/rev）、maxPressure（最大壓力 MPa）

#### Scenario: 型錄資料結構完整性（電機）
- **WHEN** 查詢任一品牌的電機產品
- **THEN** 每筆記錄 SHALL 包含 model（電機型號）、power_kW（功率）、ratedTorque_Nm（額定扭矩）、ratedRpm（額定轉速）、servoDriver（驅動器型號，伺服電機適用）、isServo（是否為伺服電機）

### Requirement: 規格自動匹配引擎
系統 SHALL 根據 `calcSystem()` 計算結果，自動為每個品牌匹配最適合的產品型號。匹配規則：在該品牌同類產品中，找到所有關鍵規格皆 ≥ 計算需求值的最小規格型號（向上取整原則）。

#### Scenario: 泵型號匹配
- **WHEN** 計算引擎算出所需排量為 18 cc/rev、工作壓力為 16 MPa
- **THEN** 系統 SHALL 為每個有泵產品的品牌，匹配排量 ≥ 18 cc/rev 且最大壓力 ≥ 16 MPa 的最小排量型號

#### Scenario: 閥件型號匹配
- **WHEN** 計算引擎算出所需流量為 40 L/min、工作壓力為 20 MPa
- **THEN** 系統 SHALL 分別匹配方向閥（額定流量 ≥ 40 L/min）和溢流閥（額定壓力 ≥ 20 MPa）

#### Scenario: 電機型號匹配
- **WHEN** 計算引擎算出所需功率為 7.5 kW、電機類型為伺服
- **THEN** 系統 SHALL 為每個有伺服電機產品的品牌，匹配功率 ≥ 7.5 kW 的最小功率型號，並一併顯示對應驅動器型號

#### Scenario: 無匹配型號
- **WHEN** 某品牌無任何型號滿足計算需求（規格超出該品牌產品範圍）
- **THEN** 系統 SHALL 顯示「超出該品牌產品範圍，請洽業務」而非空白

### Requirement: 匹配結果顯示
系統 SHALL 在現有品牌推薦 UI 中升級顯示匹配到的具體產品型號。每個品牌卡片 SHALL 顯示：匹配到的型號字串、關鍵規格參數、與計算需求的比較。

#### Scenario: 品牌卡片顯示型號
- **WHEN** 使用者完成計算且切換到某元件分頁（如油壓泵）
- **THEN** 每張品牌卡片 SHALL 顯示匹配到的具體型號（如「P22V-RS-11-CC-10-J」）取代原本僅顯示系列名稱

#### Scenario: 多元件型號聯合顯示
- **WHEN** 使用者切換到「總報告」分頁
- **THEN** 系統 SHALL 顯示每個品牌的完整選型方案（泵 + 閥件 + 缸 + 電機的匹配型號）
