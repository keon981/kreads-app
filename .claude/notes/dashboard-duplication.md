# apps/dashboard 與 apps/web 重複／覆寫紀錄

開發 `apps/dashboard` 時記錄跟 `apps/web` 重複的程式碼，以及為了不動共用元件而在 dashboard 端做的覆寫。開發完後由使用者評估要不要抽出共用。

## 重複的檔案

| dashboard | web | 差異 | 建議 |
| --- | --- | --- | --- |
| `components/theme-provider.tsx` | `contexts/theme-provider.tsx` | 邏輯相同（含 `D` 鍵切換主題）；位置不同，dashboard 照 project-structure 放 `components/`。dashboard 版另補了回傳型別，`onKeyDown` 改名 `handleKeyDown`（code-standards） | 抽到 `packages/ui`（需加 `next-themes` 依賴），或兩邊統一放 `components/` |
| `app/server/device.ts` | `app/server/device.ts` | 內容相同（讀 `viewport` cookie＋UA 判斷初始是否為手機） | 抽成共用 server helper（`packages/ui` 不宜放 server-only，可考慮新 package 或 `@workspace/ui/lib/server/*`） |
| `app/layout.tsx` 的字型與 `DeviceRoot` | `app/layout.tsx` | 字型設定與 `DeviceRoot` 相同；dashboard 沒有 auth 與 SignInDialog | 字型可抽成共用設定 |
| `configs/constants.ts` 的 `VIEWPORT_COOKIE` re-export | `configs/constants.ts` | 同樣從 `@workspace/ui/lib/constants` re-export | 可直接 import ui，不必 re-export |
| `app/(pages)/keys/utils.ts` 的 `formatDateTime` | `components/blocks/issue.tsx` 的 `formatDateTime` | 內容相同（fr-CA、Asia/Taipei 的 YYYY-MM-DD）；ui 移除後兩邊各一份 | 兩個 App 都用，可考慮抽回 `packages/ui` |
| `configs/nav-config.tsx` 的 `THEME_OPTIONS` | `configs/nav-config.tsx` 的 `themeOptions` | 內容相同（淺色／深色／跟隨系統）；dashboard 照 code-standards 改成 UPPER_SNAKE_CASE | 可抽成共用常數 |
| `components/layout/user-menu.tsx` 的外觀切換子選單 | `configs/nav-config.tsx` 的 settings dropdown | 同樣是 `DropdownMenuRadioGroup` 切主題 | 主題切換子選單可抽成共用元件 |

## 對共用元件的覆寫（沒有改 packages/ui）

| 覆寫的地方 | 原因 |
| --- | --- |
| `app/(pages)/layout.tsx`：`SidebarProvider` 用 `style` 改 `--sidebar-width: 16rem`、`--sidebar-width-icon: 3.5rem`，並傳 `defaultOpen` | `SIDEBAR_CONFIG` 寫死主站的 20rem／5rem，`defaultOpen` 預設 false |
| `components/layout/app-sidebar.tsx` 的 `MENU_BUTTON_CLASS`：`justify-start`、收合時 `size-10`、只顯示第一個子元素 | `SidebarMenuButton` 為主站做成置中、收合時 `size-14` 的圖示列 |
| `components/layout/app-sidebar.tsx`：手機版自己用 `Sheet` 包選單 | `Sidebar` 是 `hidden md:block`，手機版不顯示（主站手機用 `MobileTabBar`） |

若之後要抽共用，可考慮讓 `packages/ui` 的 sidebar 透過 props／variant 支援這兩種樣式，而不是兩邊各自覆寫。

## 對 packages/ui 的修改

| 檔案 | 修改 | 原因 |
| --- | --- | --- |
| `src/components/chart.tsx` | `[stroke='#fff']` 改成 `[stroke="#fff"]`（`#ccc` 同） | eslint 把字串改成單引號後，裡面的 `'` 被跳脫成 `\'`，Tailwind 產生壞掉的 CSS，整個頁面 500 |
| `src/components/chart.tsx` | `React.useContext` → `React.use`、`<ChartContext.Provider>` → `<ChartContext>` | 跟現有元件（sidebar）的 React 19 寫法一致，消除 lint 警告 |

## 其他注意事項

- 本機兩個 App 都在 `localhost`，cookie 不分 port：`sidebar_state`（`SIDEBAR_CONFIG.cookieName`）與 `viewport` 兩邊共用、會互相覆蓋。
