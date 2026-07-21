import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { YStack, XStack, SizableText, Paragraph, Button, Circle } from '@hanzo/gui'
import { palette as c } from './theme'
import { Btn } from './ui'
import { Callback } from './auth/callback'
import { Home } from './views/home'
import { Menu } from './views/menu'
import { Reservations } from './views/reservations'

/** The three rooms of the site — no router (one static SPA), just a value. */
export type View = 'home' | 'menu' | 'reservations'

const NAV: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'reservations', label: 'Reservations' },
]

/** A masthead nav link — underlined when it is the room you are in. */
function NavLink({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <YStack
      cursor="pointer"
      onPress={onPress}
      paddingVertical="$1"
      borderBottomWidth={2}
      borderColor={active ? c.ember : 'transparent'}
      hoverStyle={{ borderColor: active ? c.ember : c.line }}
    >
      <SizableText
        size="$4"
        color={active ? c.ink : c.inkSoft}
        fontWeight={active ? '700' : '500'}
      >
        {label}
      </SizableText>
    </YStack>
  )
}

/** Masthead: wordmark + the three rooms + Hanzo IAM sign-in/out. */
function TopBar({ view, go }: { view: View; go: (v: View) => void }) {
  const { isAuthenticated, user, login, logout } = useIam()
  const who = user?.displayName || user?.name || user?.email || 'guest'

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      gap="$4"
      paddingHorizontal="$5"
      paddingVertical="$3"
      backgroundColor={c.paper}
      borderBottomWidth={1}
      borderColor={c.line}
      flexWrap="wrap"
    >
      <XStack alignItems="center" gap="$2" cursor="pointer" onPress={() => go('home')}>
        <Circle size={10} backgroundColor={c.ember} />
        <SizableText size="$7" fontWeight="900" color={c.ink} letterSpacing={4} className="serif">
          EMBER
        </SizableText>
      </XStack>

      <XStack alignItems="center" gap="$5" flexWrap="wrap">
        {NAV.map((n) => (
          <NavLink key={n.id} label={n.label} active={view === n.id} onPress={() => go(n.id)} />
        ))}
        {isAuthenticated ? (
          <XStack alignItems="center" gap="$3">
            <SizableText size="$2" color={c.inkSoft}>{who}</SizableText>
            <Button size="$2" chromeless borderColor={c.line} borderWidth={1} onPress={() => logout()}>
              Sign out
            </Button>
          </XStack>
        ) : (
          <Btn
            size="$3"
            fg={c.cream}
            backgroundColor={c.ember}
            borderWidth={0}
            hoverStyle={{ backgroundColor: c.emberDeep }}
            pressStyle={{ backgroundColor: c.emberDeep }}
            onPress={() => login()}
          >
            Sign in
          </Btn>
        )}
      </XStack>
    </XStack>
  )
}

/** Closing band: hours + wordmark, the warm sign-off of the page. */
function Footer({ go }: { go: (v: View) => void }) {
  return (
    <YStack backgroundColor={c.night} paddingHorizontal="$5" paddingVertical="$8" gap="$5">
      <XStack flexWrap="wrap" justifyContent="space-between" gap="$6" maxWidth={1040} width="100%" alignSelf="center">
        <YStack gap="$2" maxWidth={340}>
          <SizableText size="$8" fontWeight="900" color={c.cream} letterSpacing={4} className="serif">EMBER</SizableText>
          <Paragraph color={c.creamSoft} lineHeight={24}>
            A wood-fired neighborhood kitchen. Seasonal plates, natural wine, and a
            room built for lingering.
          </Paragraph>
        </YStack>
        <YStack gap="$2">
          <SizableText size="$3" color={c.gold} letterSpacing={2}>HOURS</SizableText>
          <SizableText size="$4" color={c.cream}>Tuesday – Sunday</SizableText>
          <SizableText size="$4" color={c.creamSoft}>Dinner · 5 – 11pm</SizableText>
          <SizableText size="$4" color={c.creamSoft}>Weekend brunch · 10am – 2pm</SizableText>
        </YStack>
        <YStack gap="$2">
          <SizableText size="$3" color={c.gold} letterSpacing={2}>VISIT</SizableText>
          <SizableText size="$4" color={c.cream}>On the corner of Vine & Ash</SizableText>
          <SizableText size="$4" color={c.creamSoft}>Walk-ins at the bar</SizableText>
          <Btn
            size="$3"
            marginTop="$2"
            fg={c.gold}
            backgroundColor="transparent"
            borderColor={c.gold}
            borderWidth={1}
            hoverStyle={{ backgroundColor: '#3A1D10' }}
            onPress={() => go('reservations')}
          >
            Reserve a table
          </Btn>
        </YStack>
      </XStack>
      <SizableText size="$1" color={c.creamSoft} alignSelf="center" opacity={0.7}>
        Built on Hanzo — @hanzo/gui · Hanzo IAM · Hanzo Base
      </SizableText>
    </YStack>
  )
}

/**
 * Top-level route + shell. No router (one static SPA):
 *   /auth/callback → finish the PKCE exchange, then land home
 *   otherwise      → the public site (home · menu · reservations)
 *
 * The site is public: anyone can browse. Signing in with Hanzo unlocks the
 * org-scoped Base surfaces — publishing the live menu and reading reservation
 * requests.
 */
export function App() {
  const [view, setView] = useState<View>('home')

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback')) {
    return <Callback />
  }

  return (
    <YStack backgroundColor={c.paper} minHeight="100vh">
      <TopBar view={view} go={setView} />
      {view === 'home' ? (
        <Home go={setView} />
      ) : view === 'menu' ? (
        <Menu />
      ) : (
        <Reservations />
      )}
      <Footer go={setView} />
    </YStack>
  )
}
