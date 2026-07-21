import { YStack, XStack, H1, H2, H3, Paragraph, SizableText, Circle } from '@hanzo/gui'
import { LinearGradient } from '@hanzo/gui/linear-gradient'
import { palette as c } from '../theme'
import { Btn } from '../ui'
import { Flame } from '../icons'
import type { View } from '../app'

/** The chef's current highlights — landing content, not live data. */
const HEARTH: { name: string; price: string; desc: string }[] = [
  { name: 'Charred hispi cabbage', price: '14', desc: 'anchovy butter · toasted hazelnut · lemon' },
  { name: 'Oak-grilled bavette', price: '29', desc: 'bone-marrow salsa verde · roast shallot' },
  { name: 'Wood-oven focaccia', price: '9', desc: 'rosemary · smoked sea salt · olive oil' },
]

/** The public landing: hero → the table → from the hearth → a table is waiting. */
export function Home({ go }: { go: (v: View) => void }) {
  return (
    <YStack backgroundColor={c.paper}>
      {/* Hero — a charred-ember field, cream serif type, two invitations. */}
      <YStack position="relative" overflow="hidden" minHeight={604} justifyContent="center" paddingHorizontal="$5" paddingVertical="$10">
        <LinearGradient fullscreen colors={[c.night, c.nightMid, c.emberDeep]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        <Circle position="absolute" top={-90} right={-70} size={340} backgroundColor={c.amber} opacity={0.16} />
        <Circle position="absolute" bottom={-140} left={-90} size={380} backgroundColor={c.ember} opacity={0.13} />

        <YStack zIndex={1} maxWidth={780} width="100%" alignSelf="center" alignItems="center" gap="$5">
          <XStack alignItems="center" gap="$2">
            <Flame size={20} color={c.gold} />
            <SizableText size="$3" color={c.gold} letterSpacing={3}>
              WOOD-FIRED KITCHEN · NATURAL WINE
            </SizableText>
          </XStack>

          <H1 className="serif" color={c.cream} textAlign="center" fontSize={68} lineHeight={70} fontWeight="900" maxWidth={720}>
            Fire, smoke, and the harvest.
          </H1>

          <Paragraph color={c.creamSoft} textAlign="center" fontSize={19} lineHeight={30} maxWidth={560}>
            Ember is a neighborhood kitchen cooking over live oak — seasonal plates,
            a short natural-wine list, and a low-lit room built for long dinners.
          </Paragraph>

          <XStack gap="$3" marginTop="$2" flexWrap="wrap" justifyContent="center">
            <Btn
              size="$5"
              textSize="$5"
              fg={c.cream}
              backgroundColor={c.ember}
              borderWidth={0}
              hoverStyle={{ backgroundColor: c.gold }}
              pressStyle={{ backgroundColor: c.emberDeep }}
              onPress={() => go('reservations')}
            >
              Reserve a table
            </Btn>
            <Btn
              size="$5"
              textSize="$5"
              weight="600"
              fg={c.cream}
              backgroundColor="transparent"
              borderColor={c.creamSoft}
              borderWidth={1}
              hoverStyle={{ borderColor: c.gold }}
              onPress={() => go('menu')}
            >
              See the menu
            </Btn>
          </XStack>
        </YStack>
      </YStack>

      {/* The table — the room's story beside the practical details. */}
      <XStack maxWidth={1040} width="100%" alignSelf="center" paddingHorizontal="$5" paddingVertical="$9" gap="$8" flexWrap="wrap">
        <YStack flex={2} minWidth={300} gap="$4">
          <XStack alignItems="center" gap="$2">
            <Flame size={20} />
            <SizableText size="$3" color={c.ember} letterSpacing={2}>THE TABLE</SizableText>
          </XStack>
          <H2 className="serif" color={c.ink} fontSize={36} lineHeight={40} maxWidth={520}>
            A hearth at the center, and everyone around it.
          </H2>
          <Paragraph color={c.inkSoft} fontSize={17} lineHeight={28} maxWidth={560}>
            We cook the way people have always cooked — with fire, patience, and
            whatever the farms sent that morning. The menu changes with the week;
            the welcome does not. Pull up a chair, order a little of everything,
            and stay a while.
          </Paragraph>
          <Paragraph color={c.inkSoft} fontSize={17} lineHeight={28} maxWidth={560}>
            Bread is baked in the wood oven each afternoon. Wine is poured by the
            glass so you can wander. Dessert is worth saving room for.
          </Paragraph>
        </YStack>

        <YStack flex={1} minWidth={260} backgroundColor={c.panel} borderRadius={18} borderWidth={1} borderColor={c.line} padding="$5" gap="$4">
          <SizableText size="$3" color={c.emberDeep} letterSpacing={2}>WHEN TO COME</SizableText>
          <YStack gap="$2">
            <XStack justifyContent="space-between" gap="$3">
              <SizableText size="$4" color={c.ink} fontWeight="600">Dinner</SizableText>
              <SizableText size="$4" color={c.inkSoft}>Tue – Sun · 5–11pm</SizableText>
            </XStack>
            <XStack justifyContent="space-between" gap="$3">
              <SizableText size="$4" color={c.ink} fontWeight="600">Brunch</SizableText>
              <SizableText size="$4" color={c.inkSoft}>Sat – Sun · 10am–2pm</SizableText>
            </XStack>
            <XStack justifyContent="space-between" gap="$3">
              <SizableText size="$4" color={c.ink} fontWeight="600">Bar</SizableText>
              <SizableText size="$4" color={c.inkSoft}>Walk-ins welcome</SizableText>
            </XStack>
          </YStack>
          <YStack height={1} backgroundColor={c.line} />
          <Paragraph color={c.inkSoft} fontSize={15} lineHeight={22}>
            On the corner of Vine & Ash. Reservations open two weeks out.
          </Paragraph>
          <Btn
            size="$4"
            fg={c.cream}
            backgroundColor={c.ink}
            borderWidth={0}
            hoverStyle={{ backgroundColor: c.emberDeep }}
            onPress={() => go('reservations')}
          >
            Request a table
          </Btn>
        </YStack>
      </XStack>

      {/* From the hearth — three plates on the fire this week. */}
      <YStack backgroundColor={c.panel} paddingHorizontal="$5" paddingVertical="$9" gap="$6" borderTopWidth={1} borderColor={c.line}>
        <YStack alignItems="center" gap="$2">
          <SizableText size="$3" color={c.ember} letterSpacing={3}>FROM THE HEARTH</SizableText>
          <H2 className="serif" color={c.ink} fontSize={34} textAlign="center">On the fire this week</H2>
        </YStack>
        <XStack maxWidth={1040} width="100%" alignSelf="center" gap="$5" flexWrap="wrap" justifyContent="center">
          {HEARTH.map((d) => (
            <YStack
              key={d.name}
              flex={1}
              minWidth={260}
              backgroundColor={c.paper}
              borderRadius={16}
              borderWidth={1}
              borderColor={c.line}
              padding="$5"
              gap="$3"
              hoverStyle={{ borderColor: c.amber }}
            >
              <YStack width={34} height={3} backgroundColor={c.ember} borderRadius={2} />
              <XStack justifyContent="space-between" alignItems="flex-start" gap="$3">
                <H3 className="serif" color={c.ink} fontSize={22} flex={1}>{d.name}</H3>
                <SizableText size="$5" color={c.emberDeep} fontWeight="700" className="serif">{d.price}</SizableText>
              </XStack>
              <Paragraph color={c.inkSoft} fontSize={15} lineHeight={22}>{d.desc}</Paragraph>
            </YStack>
          ))}
        </XStack>
        <Btn
          alignSelf="center"
          size="$4"
          weight="600"
          fg={c.ink}
          backgroundColor="transparent"
          borderColor={c.ink}
          borderWidth={1}
          hoverStyle={{ backgroundColor: c.paper, borderColor: c.ember }}
          onPress={() => go('menu')}
        >
          See the full menu
        </Btn>
      </YStack>

      {/* A table is waiting — the closing invitation. */}
      <YStack position="relative" overflow="hidden" paddingHorizontal="$5" paddingVertical="$10" alignItems="center" gap="$4">
        <LinearGradient fullscreen colors={[c.emberDeep, c.night]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        <SizableText zIndex={1} size="$3" color={c.gold} letterSpacing={3}>YOUR TABLE, BY FIRELIGHT</SizableText>
        <H2 zIndex={1} className="serif" color={c.cream} fontSize={40} textAlign="center" maxWidth={620}>
          A table is waiting. Come hungry.
        </H2>
        <Btn
          zIndex={1}
          size="$5"
          textSize="$5"
          weight="800"
          fg={c.ink}
          backgroundColor={c.gold}
          borderWidth={0}
          marginTop="$2"
          hoverStyle={{ backgroundColor: c.cream }}
          onPress={() => go('reservations')}
        >
          Reserve a table
        </Btn>
      </YStack>
    </YStack>
  )
}
