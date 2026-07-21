import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery, useMutation, type BaseRecord } from '@hanzo/base/react'
import { YStack, XStack, H1, H2, H3, Paragraph, SizableText, Input, Spinner } from '@hanzo/gui'
import { palette as c } from '../theme'
import { Btn } from '../ui'

/** One row of the `menu_items` collection provisioned from schema.sql. */
interface MenuItem extends BaseRecord {
  section: string
  name: string
  price: string
  desc?: string
}

/** A dish to render — a live Base row (has `id`) or a sample from the house menu. */
type Dish = { id?: string; section: string; name: string; price: string; desc?: string }

/** The house menu — the empty state before the kitchen publishes to Base. */
const HOUSE_MENU: Dish[] = [
  { section: 'To Start', name: 'Wood-oven focaccia', price: '9', desc: 'rosemary · smoked sea salt · olive oil' },
  { section: 'To Start', name: 'Charred hispi cabbage', price: '14', desc: 'anchovy butter · toasted hazelnut · lemon' },
  { section: 'To Start', name: 'Burrata & grilled peach', price: '16', desc: 'basil oil · aged balsamic · sourdough' },
  { section: 'From the Fire', name: 'Oak-grilled bavette', price: '29', desc: 'bone-marrow salsa verde · roast shallot' },
  { section: 'From the Fire', name: 'Whole roasted branzino', price: '32', desc: 'fennel · charred lemon · caper salsa' },
  { section: 'From the Fire', name: 'Ember-baked celeriac', price: '22', desc: 'brown butter · crispy sage · walnut' },
  { section: 'Sides', name: 'Fire potatoes', price: '8', desc: 'confit garlic · rosemary' },
  { section: 'Sides', name: 'Little gem salad', price: '9', desc: 'buttermilk · chive · toasted seed' },
  { section: 'Sweet', name: 'Burnt-honey tart', price: '11', desc: 'crème fraîche' },
  { section: 'Sweet', name: 'Olive-oil cake', price: '10', desc: 'grilled orange · pistachio' },
]

/** Group dishes by section, preserving first-seen section order. */
function bySection(items: Dish[]): [string, Dish[]][] {
  const map = new Map<string, Dish[]>()
  for (const it of items) {
    const arr = map.get(it.section) ?? []
    arr.push(it)
    map.set(it.section, arr)
  }
  return Array.from(map.entries())
}

/** A single carte row: name + dotted leader + price, description beneath. */
function Row({ dish, onRemove }: { dish: Dish; onRemove?: () => void }) {
  return (
    <YStack gap="$1" paddingVertical="$2">
      <XStack alignItems="flex-end" gap="$3">
        <SizableText size="$6" color={c.ink} fontWeight="600" className="serif">{dish.name}</SizableText>
        <YStack flex={1} height={1} marginBottom={7} className="leader" />
        <SizableText size="$6" color={c.emberDeep} fontWeight="700" className="serif">{dish.price}</SizableText>
        {onRemove ? (
          <Btn size="$1" chromeless weight="500" fg={c.inkSoft} onPress={onRemove}>Remove</Btn>
        ) : null}
      </XStack>
      {dish.desc ? <Paragraph color={c.inkSoft} fontSize={15} lineHeight={22}>{dish.desc}</Paragraph> : null}
    </YStack>
  )
}

/** Render the whole carte, grouped into serif-headed sections. */
function Sections({ items, onRemove }: { items: Dish[]; onRemove?: (id: string) => void }) {
  return (
    <YStack gap="$7">
      {bySection(items).map(([section, dishes]) => (
        <YStack key={section} gap="$1">
          <XStack alignItems="center" gap="$3" marginBottom="$2">
            <H2 className="serif" color={c.ink} fontSize={26}>{section}</H2>
            <YStack flex={1} height={1} backgroundColor={c.line} />
          </XStack>
          {dishes.map((d, i) => (
            <Row key={d.id ?? `${section}-${i}`} dish={d} onRemove={d.id && onRemove ? () => onRemove(d.id!) : undefined} />
          ))}
        </YStack>
      ))}
    </YStack>
  )
}

/** The kitchen composer — add a dish to the live Base carte (signed-in only). */
function AddDish({ onAdded }: { onAdded: () => void }) {
  const create = useMutation('menu_items', 'create')
  const [section, setSection] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [desc, setDesc] = useState('')

  async function add() {
    if (!section.trim() || !name.trim() || !price.trim() || create.isLoading) return
    await create.mutate({ section: section.trim(), name: name.trim(), price: price.trim(), desc: desc.trim() })
    setName(''); setPrice(''); setDesc('')
    onAdded()
  }

  return (
    <YStack backgroundColor={c.panel} borderRadius={16} borderWidth={1} borderColor={c.line} padding="$5" gap="$3">
      <SizableText size="$3" color={c.emberDeep} letterSpacing={2}>PUBLISH TO THE CARTE</SizableText>
      <XStack gap="$3" flexWrap="wrap">
        <Input flex={1} minWidth={140} value={section} placeholder="Section (e.g. From the Fire)" onChangeText={setSection} backgroundColor={c.paper} borderColor={c.line} />
        <Input flex={1} minWidth={160} value={name} placeholder="Dish name" onChangeText={setName} backgroundColor={c.paper} borderColor={c.line} />
        <Input width={110} value={price} placeholder="Price" onChangeText={setPrice} backgroundColor={c.paper} borderColor={c.line} />
      </XStack>
      <XStack gap="$3" flexWrap="wrap">
        <Input flex={1} minWidth={220} value={desc} placeholder="Description (optional)" onChangeText={setDesc} onSubmitEditing={add} backgroundColor={c.paper} borderColor={c.line} />
        <Btn
          fg={c.cream}
          backgroundColor={c.ember}
          borderWidth={0}
          disabled={create.isLoading || !section.trim() || !name.trim() || !price.trim()}
          hoverStyle={{ backgroundColor: c.emberDeep }}
          onPress={add}
        >
          {create.isLoading ? 'Adding…' : 'Add dish'}
        </Btn>
      </XStack>
      {create.error ? <Paragraph color={c.ember}>{create.error.message}</Paragraph> : null}
    </YStack>
  )
}

/**
 * The Menu view. Reads the `menu_items` collection (org-scoped, carrying the IAM
 * token). When the kitchen has published dishes, the live carte renders; until
 * then the house menu stands in, and a signed-in owner can publish their own.
 */
export function Menu() {
  const { isAuthenticated, login } = useIam()
  const { data, isLoading, error, refetch } = useQuery<MenuItem>('menu_items', { sort: 'section', realtime: false })
  const remove = useMutation('menu_items', 'delete')

  const live = data.length > 0
  const dishes: Dish[] = live ? data : HOUSE_MENU

  async function del(id: string) {
    await remove.mutate({ id })
    await refetch()
  }

  return (
    <YStack backgroundColor={c.paper}>
      {/* Header band */}
      <YStack alignItems="center" gap="$3" paddingHorizontal="$5" paddingTop="$9" paddingBottom="$7">
        <SizableText size="$3" color={c.ember} letterSpacing={3}>THE CARTE</SizableText>
        <H1 className="serif" color={c.ink} fontSize={52} textAlign="center">The Menu</H1>
        <Paragraph color={c.inkSoft} fontSize={17} lineHeight={26} textAlign="center" maxWidth={560}>
          Cooked over live oak and served family-style. The carte turns with the
          season — this is what the fire is giving us now.
        </Paragraph>
      </YStack>

      <YStack maxWidth={760} width="100%" alignSelf="center" paddingHorizontal="$5" paddingBottom="$10" gap="$7">
        {isAuthenticated ? <AddDish onAdded={refetch} /> : null}

        {!live ? (
          <XStack alignItems="center" gap="$3" backgroundColor={c.panel} borderRadius={12} borderWidth={1} borderColor={c.line} padding="$4" flexWrap="wrap">
            <SizableText size="$3" color={c.emberDeep} fontWeight="700">SAMPLE CARTE</SizableText>
            <Paragraph flex={1} minWidth={220} color={c.inkSoft} fontSize={15} lineHeight={22}>
              This is our house menu. {isAuthenticated ? 'Publish a dish above to go live.' : 'Sign in to publish your own carte to Base.'}
            </Paragraph>
            {!isAuthenticated ? (
              <Btn size="$3" fg={c.cream} backgroundColor={c.ink} borderWidth={0} onPress={() => login()}>Sign in</Btn>
            ) : null}
          </XStack>
        ) : null}

        {isLoading ? (
          <XStack gap="$2" alignItems="center" opacity={0.7}>
            <Spinner color={c.ember} /> <SizableText color={c.inkSoft}>Loading the carte…</SizableText>
          </XStack>
        ) : error ? (
          <YStack gap="$3">
            <Paragraph color={c.ember}>
              Couldn’t reach Base ({error.message}). Showing the house menu.
            </Paragraph>
            <Sections items={HOUSE_MENU} />
          </YStack>
        ) : (
          <Sections items={dishes} onRemove={live ? del : undefined} />
        )}

        <H3 className="serif" color={c.inkSoft} fontSize={18} textAlign="center" opacity={0.8}>
          A discretionary 5% is added for our kitchen team. Thank you.
        </H3>
      </YStack>
    </YStack>
  )
}
