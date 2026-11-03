# shared/ui — UI kit and screen conventions

Domain-agnostic building blocks for every screen. Nothing here knows about users,
posts or auth state. Domain UI lives in `entities/*/ui`, `features/*/ui` or `widgets/*`.

## Structure

| Folder        | Contents                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| `primitives/` | `Text`, `Button`, `Icon`, `Input`, `FloatingInput`, `Avatar`, `Skeleton`, `Loader`, `InstagramLogo`, `Touchable` |
| `layout/`     | `Screen`, `Container`, `Section`, `Stack`, `Row`, `Spacer`, `Divider`, `KeyboardScroll` |
| `header/`     | `Header`, `HeaderBackButton`, `HeaderActionButton`, `headerActions`       |
| `form/`       | `FormField`, `ErrorAlert`, `DividerWithText`                              |
| `list/`       | `ListItem` (rows in lists and sheet options)                              |
| `feedback/`   | `EmptyState`                                                              |
| `overlays/`   | `Sheet`, `SheetContent`, `SheetHeader`, `ToastOverlay`, `AlertOverlay`, `LoadingHudOverlay`, `LanguageSelect*` |
| `templates/`  | Reusable screen templates: `AuthLayout`, `AuthStepLayout` (+ `AuthHeader`, `AuthFooter`, `AuthStepHeader`) |

### Import rules

- Outside `shared/ui`: import from `@/shared/ui`, or from a group (`@/shared/ui/primitives`)
  when you want a lighter import (e.g. entity UI used by schema tests). Never deeper.
- Inside `shared/ui`: import a specific group or file, never the root `@/shared/ui` barrel (cycles).
  Import `useTheme` from `@/shared/hooks/useTheme`, not the `@/shared/hooks` barrel.
- Use `Text` and `Touchable` from the kit, not `Text`/`TouchableOpacity` from `react-native`.

## Naming conventions

| Kind                         | Rule                          | Examples                                   |
| ---------------------------- | ----------------------------- | ------------------------------------------ |
| Navigation route component   | `*Page`                       | `ProfilePage`, `EditProfilePage`           |
| Non-route full-screen view   | `*View`                       | `EditBioView`, `PermissionGuardView`       |
| Screen template              | `*Layout`                     | `AuthLayout`, `AuthStepLayout`, `EditFieldLayout` |
| Widget (screen section)      | `*Widget` / `*Section`        | `ProfileMainWidget`, `ProfileBioSection`   |
| Bottom sheet                 | `*Sheet`                      | `GenderSelectSheet`, `ProfileLinksSheet`   |
| Global overlay               | `*Overlay`                    | `ToastOverlay`, `AlertOverlay`             |
| Shared UI components         | No prefix                     | `Text`, `Button`, `Avatar` (not `AppText`) |
| Hooks                        | `use*`, one per file          | `useTheme`, `useOtpTimer`                  |
| Files                        | File name = exported component | `Header.tsx` exports `Header`             |
| Slice folders                | kebab-case                    | `edit-profile`, `media-picker`             |

## Screen rules

1. **Every route renders `<Screen>` as its root** (directly or through a `*Layout` template).
2. **Safe area:** if there is a `Header`, the Header owns the top inset (`withSafeArea` is on by
   default). Header-less screens pass `safeAreaEdges={['top']}`. The tab bar owns the bottom
   inset on tab screens; stack and auth screens that need it pass `'bottom'`.
3. **Horizontal padding comes from `Section` / `Container`, never from the screen itself.**
   Full-bleed parts (tab bars, grids, dividers, list rows with edge-to-edge borders) are left
   outside a `Section`.
4. **Spacing between elements** uses `Stack gap="md"`, `Spacer`, or `theme.spacing.*`, not raw `ms(n)`.
5. **Sheets:** wrap static sheet content in `SheetContent` (applies `layout.sheetGutter` and must be
   the direct child of `Sheet` so dynamic sizing works). Long lists use `BottomSheetFlatList`.
6. **Rows:** a `View` that only lays children out horizontally is a `Row`
   (`commonStyles.rowCenter` = `<Row>`, `rowBetween` = `<Row justify="space-between">`).
7. **No magic strings:** compare against and pass constants (`BUTTON_VARIANTS.PRIMARY`,
   `THEME_MODES.DARK`), not string literals. Literal unions typed on a component prop are fine.

### Allowed exceptions

- **Lists** (`FlatList`/`ScrollView` content) can not be wrapped in a `Section`; pad them with
  `contentContainerStyle={{ paddingHorizontal: layout.gutter }}`.
- **Fixed-height bars** (e.g. the photo picker toolbar) keep a border as their separator; a
  sibling `Divider` would add a hairline to their height.
- **Pressable rows** keep their row style on the `Touchable` itself (the row is the button).
- **`ProfileMainWidget`** owns its `ScrollView` (shared by two pages, owns the refresh control).

### `Screen` presets

| Preset  | Use for                                   | Content container         |
| ------- | ----------------------------------------- | ------------------------- |
| `fixed` | Static screens, screens with a `FlatList` | `View` (flex: 1)          |
| `scroll`| Long static content                       | `ScrollView`              |
| `form`  | Screens with inputs                       | `KeyboardScroll` (keyboard-aware) |

## Recipes

### A new screen

```tsx
export const NotificationsPage: React.FC<Props> = ({ navigation }) => (
  <Screen
    preset="scroll"
    header={<Header title={t(KEYS.NOTIFICATIONS)} onBack={navigation.goBack} />}
  >
    <Section>
      <Stack gap="md">
        <Text variant="heading">…</Text>
        <Text variant="caption">…</Text>
      </Stack>
    </Section>
    <Divider />
    <Section>…</Section>
  </Screen>
);
```

### Header

```tsx
<Header title="Settings" onBack={goBack} />                          // centered title + back
<Header leftTitle="Edit profile" onBack={goBack} />                  // large left title
<Header backIcon={HEADER_BACK_ICON.CLOSE} onBack={close} />          // close icon
<Header center={<InstagramLogo />} rightActions={[headerActions.notifications(onPress)]} />
<Header left={<CustomLeft />} right={<CustomRight />} />             // full custom slots
```

### A bottom sheet

```tsx
const sheetRef = useRef<BottomSheetModal>(null);
sheetRef.current?.present();

<Sheet ref={sheetRef} enableDynamicSizing enablePanDownToClose>
  <SheetContent>
    <SheetHeader title={t(KEYS.TITLE)} />
    <ListItem icon={APP_ICONS.CAMERA} title="Take photo" onPress={onTakePhoto} />
    <ListItem icon={APP_ICONS.TRASH} title="Remove" onPress={onRemove} destructive />
  </SheetContent>
</Sheet>
```

### A list row

`ListItem` is the one row component for lists and sheet options:
`[icon | left] title / subtitle [right | ✓ | ›]`.

```tsx
<ListItem icon={APP_ICONS.LINK} title={link.title} subtitle={link.url} onPress={edit} chevron divider />
<ListItem title="Female" selected={gender === FEMALE} onPress={select} />   // ✓ when selected
<ListItem left={<Thumbnail />} title={album.title} subtitle={count} />
```

- `selected` shows a checkmark and bolds the title; `chevron` shows ›; `right` takes anything else.
- `divider` draws a hairline under the row; `destructive` turns the title and icon red.
- Row height comes from `layout.listItemVertical`.

### An empty state

```tsx
<EmptyState
  icon={APP_ICONS.CAMERA}
  title={t(KEYS.NO_POSTS_TITLE)}
  subtitle={t(KEYS.NO_POSTS_SUBTITLE)}
  actionLabel={t(KEYS.SHARE_FIRST_PHOTO)}
  onAction={onShare}
/>
```

## Layout tokens (`theme.layout` / `layout`)

| Token              | Value      | Used by                                            |
| ------------------ | ---------- | -------------------------------------------------- |
| `gutter`           | `spacing.lg` (ms 16) | `Section`, `Container`, screen content edges |
| `sheetGutter`      | ms 20      | `SheetContent`                                     |
| `headerHorizontal` | ms 16      | `Header`                                           |
| `screenBottom`     | ms 40      | Bottom padding at the end of scrollable screens    |
| `authStepBottom`   | ms 32      | `AuthStepLayout`                                   |
| `authMaxWidth`     | 440        | Auth templates (readable width on tablets)         |
| `listItemVertical` | ms 14      | `ListItem` vertical padding                        |

Theme-aware styles: `const useStyles = makeStyles(theme => ({ … }))`, then `const styles = useStyles()`.

## Known inconsistencies (kept on purpose, decide later)

These were preserved exactly during the UI foundation refactor so nothing changed visually:

- `AuthLayout`: unscaled `paddingBottom: 24` and footer `paddingBottom: 8` (everything else is scaled).
- Gutters that differ from `layout.gutter`: `LinksManagerView` empty state and add button (20),
  `AvatarEditSection` (12), `PermissionGuardView` (24), `ProfilePostsEmptyState` (32).
- `AlbumSelectSheet` and `ProfileLinksSheet` use 16 while other sheets use `sheetGutter` (20).
- Hard-coded colors that should become tokens: `#FFFFFF` on primary buttons and header badges
  (`onPrimary`), `ErrorAlert` backgrounds (`errorSurface`).
- `authStepStyles` font sizes (22/28, 14/20) are off the typography scale.
- `ToastOverlay` uses React Native's `Text`, not the themed `Text`.
- `HeaderBackButton` accessibility labels ("Back"/"Close") are not translated.
- `LanguageSelect` changes app state (language + restart); it belongs in `features/` once
  `AuthHeader` receives the language button as a prop.
