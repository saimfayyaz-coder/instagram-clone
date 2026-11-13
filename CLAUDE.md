# CLAUDE.md — InstagramClone (React Native)

React Native 0.87 · React 19 · TypeScript · Redux Toolkit + RTK Query · redux-persist (MMKV) ·
react-hook-form + zod · i18next (en, es, fr, ur + RTL) · Feature-Sliced Design.
Detailed UI kit docs: `src/shared/ui/README.md` — read it before building UI.

## Commands (run from this folder)

- Type check: `npx tsc --noEmit`
- Unit tests: `npm test` (`jest __tests__/unit`). All suites must pass. Tests of schemas/logic import the model file directly (or stub `@/shared/ui`) so they never load UI and native modules.
- Lint: `npm run lint` (0 errors expected; 3 known warnings in `Header`, `Stack`, `MainTabNavigator`)
- Android release bundle check: `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output <tmp>/index.android.bundle`

## Architecture (Feature-Sliced Design)

Layers, top to bottom; a layer imports only from layers below it:
`app` → `pages` → `widgets` → `features` → `entities` → `shared`.

| Layer | Holds | Example |
|---|---|---|
| `app/` | store, navigation, providers | `app/store/hooks.ts` (`useAppSelector`, `useAppDispatch`) |
| `pages/` | one component per navigation route (`*Page`), thin | `pages/auth/login/ui/LoginPage.tsx` |
| `widgets/` | screen sections and domain templates (`*Widget`, `*Section`, `*Layout`) | `widgets/edit-profile/ui/EditFieldLayout.tsx` |
| `features/` | user actions: `api/`, `model/`, `ui/`, `index.ts` | `features/login-by-email` |
| `entities/` | domain models: `api/`, `model/`, `ui/`, `lib/` | `entities/user`, `entities/otp` |
| `shared/` | domain-agnostic code: `ui`, `theme`, `constants`, `lib`, `api`, `hooks`, `types` | |

- Every slice exposes a public `index.ts`. Import slices through it (`@/entities/user`), never deep paths into another slice.
- `shared` never imports from `entities`/`features`. Domain UI (OTP input, password rules) lives in `entities/*/ui`.
- Path alias `@/` = `src/`.

## UI rules

**Every screen** renders `<Screen>` as its root (directly or via a template):
```tsx
<Screen preset="scroll" header={<Header title={t(KEYS.X)} onBack={goBack} />}>
  <Section><Stack gap="md">…</Stack></Section>
  <Divider />
</Screen>
```
- Presets: `fixed` (static or `FlatList`), `scroll`, `form` (keyboard-aware, use for any inputs).
- Templates: `AuthLayout` (login), `AuthStepLayout` (signup/otp/forgot/reset steps), `EditFieldLayout` (edit-profile fields).
- Safe area: `Header` owns the top inset. Header-less screens pass `safeAreaEdges={['top']}`.
- Horizontal padding comes from `Section`/`Container` (`layout.gutter`), never set per screen. Full-bleed parts (tab bars, grids, dividers) stay outside `Section`. Lists pad via `contentContainerStyle={{ paddingHorizontal: layout.gutter }}`.
- Horizontal layout: `<Row>` (= `commonStyles.rowCenter`), `<Row justify="space-between">` (= `rowBetween`). Equal gaps: `Stack`/`Row gap="sm|md|…"`. One-off gap: `<Spacer size="…" />`.
- Rows in lists and sheet options: `ListItem` (`icon`/`left`, `title`/`subtitle`, `selected`, `chevron`, `destructive`, `divider`). Empty screens: `EmptyState`.
- Sheets: `<Sheet>` + `<SheetContent>` (direct child, applies `layout.sheetGutter`) + `<SheetHeader title=… />`. Long lists: `BottomSheetFlatList`.
- Headers: `Header` props `title` | `leftTitle` | `center`, `onBack` + `backIcon={HEADER_BACK_ICON.CLOSE}`, `rightActions={[headerActions.menu(fn)]}`, `left`/`right` slots.

**Kit imports**
- App code imports UI from `@/shared/ui` (or a group like `@/shared/ui/primitives`).
- Inside `src/shared/ui`, import specific groups/files, never the `@/shared/ui` root barrel (cycles), and `useTheme` from `@/shared/hooks/useTheme`.
- Use the kit's `Text` and `Touchable`, never `Text`/`TouchableOpacity` from `react-native` (lint error outside `shared/ui`).
- `Text`: `variant` (`hero|heading|subheading|body|caption|link|error`), `weight` (`regular|medium|semibold|bold`), `color`, `align`. Don't override `fontSize` unless no variant fits.
- Icons: `<Icon type="Ionicons" name={APP_ICONS.X} />`. Add new names to `APP_ICONS` (`shared/constants/ui.ts`).

## Styling and tokens

- Theme in components: `const { theme } = useTheme()` → `theme.colors.*`, `theme.spacing.*`, `theme.typography.*`, `theme.layout.*`.
- Static styles: `StyleSheet.create` with `ms()` (moderate scale), `spacing`, `layout`, `commonStyles` from `@/shared/theme`. Theme-dependent styles: `makeStyles(theme => ({…}))`.
- `commonStyles`: `flex1`, `flexGrow1`, `fullWidth`, `center`, `centerFlex`, `alignCenter`, `rowCenter`, `rowBetween`.
- Spacing tokens: `xs 4`, `sm 8`, `md 12`, `lg 16`, `xl 24`, `xxl 32`, `hero 48` (all scaled).
- Layout tokens (`layout`): `gutter 16`, `sheetGutter 20`, `headerHorizontal 16`, `screenBottom 40`, `authStepBottom 32`, `authMaxWidth 440`, `listItemVertical 14`.
- Screen, sheet and header edges always use tokens. `ms(n)` is fine inside a component (button insets, icon gaps) when no token fits.
- **Colors only from `theme.colors`** (light + dark palettes in `shared/theme/colors.ts`), e.g. `onPrimary`, `errorSurface`, `divider`, `textSecondary`. No hex literals outside `shared/theme` (lint warning). Add new colors to both palettes.
- Avoid inline style objects for static values; keep them in `StyleSheet`.

## Strings, i18n and constants

- **No user-facing literals.** Use `t(TRANSLATION_KEYS.X)` (`shared/lib/i18n/translationKeys.ts`). A new key must be added to all four locales: `shared/lib/i18n/locales/{en,es,fr,ur}.json`. Accessibility labels are translated too.
- Urdu is RTL: use `marginStart`/`marginEnd`-safe layouts; `Row` mirrors automatically.
- **No magic strings.** Compare against and pass constants from `@/shared/constants`: `BUTTON_VARIANTS`, `BUTTON_SIZES`, `SCREEN_PRESETS`, `TEXT_VARIANTS`, `TEXT_WEIGHTS`, `TOAST_TYPES`, `TOAST_POSITIONS`, `ALERT_BUTTON_STYLES`, `MASK_SHAPES`, `THEME_MODES`, `HEADER_BACK_ICON`, `APP_ICONS`, `ACCESSIBILITY_ROLES`, `TEST_IDS`, `AUTH_ROUTES`/`MAIN_ROUTES`/`TAB_ROUTES`, `OTP_PURPOSES`, `LANGUAGE_CODES`, `API_ENDPOINTS`, `HTTP_METHODS`, `HTTP_STATUS`, `API_ERROR_CODES`. Derive types from them (`(typeof X)[keyof typeof X]`). Literal unions typed on a component prop (`preset="form"`, `variant="body"`) are fine.
- Storage keys: `STORAGE_KEYS` + `storage` (`shared/lib/mmkv/appStorage.ts`). Tokens go through `authStorage` (Keychain), never MMKV.
- Test IDs: `TEST_IDS` (`shared/constants/testIds.ts`).

## Data, forms, feedback

- API: endpoints are injected into `baseApi` (`shared/api`) per slice: `baseApi.injectEndpoints({ endpoints: builder => … })`, URLs from `API_ENDPOINTS`, methods from `HTTP_METHODS`.
- Forms: `react-hook-form` + `zodResolver(create*Schema(t))`; schemas live in the slice's `model/`. Submit through `executeFormMutation({ mutationPromise, setError, clearErrors, showToast: true, onSuccess })` (maps field errors; `showToast: true` toasts general errors). Form-level error key: `FORM_ROOT_ERROR`.
- Feedback: `showToast(...)` from `@/shared/lib/toast` and `showAlert(...)` from `@/shared/lib/alert`. Plain functions, callable from components, hooks, helpers and middleware. `ToastOverlay`/`AlertOverlay` (mounted in `App.tsx`) keep their own state and register through `createOverlayController` (`shared/lib/overlay`); toast and alert are not in Redux.
- Redux selectors live in `entities/*/model/selectors.ts`; read state with `useAppSelector`.

## Naming

| Kind | Rule |
|---|---|
| Navigation route | `*Page` |
| Full-screen view that isn't a route | `*View` |
| Screen template | `*Layout` |
| Screen section | `*Widget` / `*Section` |
| Bottom sheet | `*Sheet` |
| Global overlay | `*Overlay` |
| Shared UI component | no prefix (`Text`, `Avatar`, not `AppText`) |
| Hooks | `use*`, one per file |
| Files | file name = exported component |

## Code comments

- Comment only where the code isn't obvious: a reason, a workaround, a non-obvious rule.
- One short, plain line, written like a person would. No multi-line `/* … */` blocks, no comments that repeat the code, no section banners.
- `// Initial load runs only when permission changes` is good; `/** This function handles the press event of the button */` is not.

## Git and PRs

- **Commits are a single line only**: `type(scope): what changed` (e.g. `fix(auth): translate back button label`). No body.
- **Never add `Co-Authored-By`, "Generated with Claude" or any attribution** to commits or PR descriptions.
- Branches: `feat/`, `fix/`, `ref/`, `chore/`, `test/` + kebab-case.
- PRs: 2–3 commits, ~25–30 files; mechanical refactors can be stacked branches. Every commit must pass `tsc`.
- Rules live in `.local/git-rules/`: `COMMIT_RULES.md` and `PR_GUIDELINES.md` (PR description = 1–2 sentence summary + `### Changes` bullets).
- Commit only when asked; push only when asked.
- UI refactors must keep the UI identical unless a visual change is agreed; verify with `tsc`, tests, lint, and say what needs a device check.

## Local notes (`.local/`, git-ignored)

- `git-rules/`: commit and PR rules.
- `changes/`: notes on larger changes (e.g. visual before/after comparisons).
- `dpr/`: daily progress reports, one `YYYY-MM-DD.md` per day, written per `dpr/DPR_GUIDELINES.md` (plain, human, one point per task).

## Environment notes (Windows)

- No Python; script edits with Node. Source files use CRLF in the working tree (`core.autocrlf=true`), so edit scripts must preserve line endings.
- Git Bash rewrites `@/…` arguments into Windows paths; prefix with `MSYS_NO_PATHCONV=1` when passing them to Node.
- `git mv` on whole directories can fail while Metro/IDE watches them; move files one by one and never chain a destructive step after moves.
