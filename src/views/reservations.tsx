import { useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery, useMutation, type BaseRecord } from '@hanzo/base/react'
import { YStack, XStack, H1, H2, H3, Paragraph, SizableText, Input, Spinner } from '@hanzo/gui'
import { LinearGradient } from '@hanzo/gui/linear-gradient'
import { palette as c } from '../theme'
import { Btn } from '../ui'
import { Flame } from '../icons'

/** One row of the `reservations` collection provisioned from schema.sql. */
interface Reservation extends BaseRecord {
  name: string
  party: number
  when: string
}

/** A signed-in request row with a way to withdraw it. */
function RequestRow({ res, onRemove }: { res: Reservation; onRemove: () => void }) {
  return (
    <XStack alignItems="center" justifyContent="space-between" gap="$3" backgroundColor={c.paper} borderWidth={1} borderColor={c.line} borderRadius={12} padding="$4">
      <YStack gap="$1" flex={1}>
        <SizableText size="$5" color={c.ink} fontWeight="600" className="serif">{res.name}</SizableText>
        <SizableText size="$3" color={c.inkSoft}>Party of {res.party} · {res.when}</SizableText>
      </YStack>
      <Btn size="$2" chromeless weight="500" fg={c.inkSoft} onPress={onRemove}>Withdraw</Btn>
    </XStack>
  )
}

/** The requests the signed-in user has already sent (org-scoped Base read). */
function MyRequests() {
  const { data, isLoading, error, refetch } = useQuery<Reservation>('reservations', { sort: '-created', realtime: false })
  const remove = useMutation('reservations', 'delete')

  async function del(id: string) {
    await remove.mutate({ id })
    await refetch()
  }

  if (isLoading) {
    return (
      <XStack gap="$2" alignItems="center" opacity={0.7}>
        <Spinner color={c.ember} /> <SizableText color={c.inkSoft}>Loading your requests…</SizableText>
      </XStack>
    )
  }
  if (error) {
    return <Paragraph color={c.ember}>Couldn’t reach Base ({error.message}).</Paragraph>
  }
  if (data.length === 0) {
    return <Paragraph color={c.inkSoft} opacity={0.8}>No requests yet — send one above.</Paragraph>
  }
  return (
    <YStack gap="$3">
      {data.map((r) => <RequestRow key={r.id} res={r} onRemove={() => del(r.id)} />)}
    </YStack>
  )
}

/**
 * The Reservations view: a request form that writes to the `reservations`
 * collection. Sending requires signing in with Hanzo (the row is stamped to the
 * caller's org); the room's notes sit alongside so the page reads like a real
 * restaurant, not a bare form.
 */
export function Reservations() {
  const { isAuthenticated, login } = useIam()
  const create = useMutation('reservations', 'create')
  const [name, setName] = useState('')
  const [party, setParty] = useState('')
  const [when, setWhen] = useState('')
  const [sent, setSent] = useState<{ name: string; party: string; when: string } | null>(null)

  const size = Number(party)
  const ready = name.trim().length > 0 && size > 0 && when.trim().length > 0

  async function submit() {
    if (!isAuthenticated) { login(); return }
    if (!ready || create.isLoading) return
    await create.mutate({ name: name.trim(), party: size, when: when.trim() })
    setSent({ name: name.trim(), party: party.trim(), when: when.trim() })
    setName(''); setParty(''); setWhen('')
  }

  return (
    <YStack backgroundColor={c.paper}>
      {/* Header band */}
      <YStack alignItems="center" gap="$3" paddingHorizontal="$5" paddingTop="$9" paddingBottom="$7">
        <SizableText size="$3" color={c.ember} letterSpacing={3}>JOIN US FOR DINNER</SizableText>
        <H1 className="serif" color={c.ink} fontSize={52} textAlign="center">Reserve a table</H1>
        <Paragraph color={c.inkSoft} fontSize={17} lineHeight={26} textAlign="center" maxWidth={560}>
          Send a request and we’ll confirm by email. Tables are held for 15
          minutes; the bar is always open to walk-ins.
        </Paragraph>
      </YStack>

      {/* Two columns: the room's note, and the request form. */}
      <XStack maxWidth={980} width="100%" alignSelf="center" paddingHorizontal="$5" paddingBottom="$10" gap="$6" flexWrap="wrap">
        {/* Left — a warm note on an ember field. */}
        <YStack flex={1} minWidth={280} position="relative" overflow="hidden" borderRadius={18} padding="$6" gap="$4" justifyContent="center">
          <LinearGradient fullscreen colors={[c.nightMid, c.night]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          <XStack zIndex={1} alignItems="center" gap="$2">
            <Flame size={20} color={c.gold} />
            <SizableText size="$3" color={c.gold} letterSpacing={2}>THE FINE PRINT</SizableText>
          </XStack>
          <H2 zIndex={1} className="serif" color={c.cream} fontSize={28} lineHeight={32}>Come as you are, stay as long as you like.</H2>
          <YStack zIndex={1} gap="$3">
            <Paragraph color={c.creamSoft} fontSize={15} lineHeight={22}>· Parties of six or more — email us and we’ll set a family table.</Paragraph>
            <Paragraph color={c.creamSoft} fontSize={15} lineHeight={22}>· The kitchen’s last seating is 10pm; the bar pours later.</Paragraph>
            <Paragraph color={c.creamSoft} fontSize={15} lineHeight={22}>· Tell us about allergies in the request and we’ll cook around them.</Paragraph>
          </YStack>
        </YStack>

        {/* Right — the request form / confirmation. */}
        <YStack flex={1} minWidth={300} backgroundColor={c.panel} borderRadius={18} borderWidth={1} borderColor={c.line} padding="$6" gap="$4">
          {sent ? (
            <YStack gap="$4">
              <XStack alignItems="center" gap="$2">
                <Flame size={22} />
                <SizableText size="$3" color={c.emberDeep} letterSpacing={2}>REQUEST RECEIVED</SizableText>
              </XStack>
              <H2 className="serif" color={c.ink} fontSize={26}>See you soon, {sent.name}.</H2>
              <Paragraph color={c.inkSoft} fontSize={16} lineHeight={24}>
                We’ve logged your table for {sent.party} on {sent.when}. A confirmation
                is on its way — reply to it with anything we should know.
              </Paragraph>
              <Btn alignSelf="flex-start" fg={c.cream} backgroundColor={c.ink} borderWidth={0} hoverStyle={{ backgroundColor: c.emberDeep }} onPress={() => setSent(null)}>
                Request another
              </Btn>
            </YStack>
          ) : (
            <YStack gap="$4">
              <SizableText size="$3" color={c.emberDeep} letterSpacing={2}>YOUR REQUEST</SizableText>
              <YStack gap="$3">
                <YStack gap="$2">
                  <SizableText size="$3" color={c.inkSoft}>Name</SizableText>
                  <Input value={name} placeholder="Who’s joining us?" onChangeText={setName} backgroundColor={c.paper} borderColor={c.line} />
                </YStack>
                <XStack gap="$3" flexWrap="wrap">
                  <YStack gap="$2" flex={1} minWidth={120}>
                    <SizableText size="$3" color={c.inkSoft}>Party size</SizableText>
                    <Input value={party} placeholder="2" keyboardType="number-pad" onChangeText={setParty} backgroundColor={c.paper} borderColor={c.line} />
                  </YStack>
                  <YStack gap="$2" flex={2} minWidth={180}>
                    <SizableText size="$3" color={c.inkSoft}>When</SizableText>
                    <Input value={when} placeholder="Fri, Jul 25 · 7:30pm" onChangeText={setWhen} onSubmitEditing={submit} backgroundColor={c.paper} borderColor={c.line} />
                  </YStack>
                </XStack>
              </YStack>

              {create.error ? <Paragraph color={c.ember}>{create.error.message}</Paragraph> : null}

              <Btn
                size="$5"
                textSize="$5"
                fg={c.cream}
                backgroundColor={c.ember}
                borderWidth={0}
                disabled={create.isLoading}
                opacity={isAuthenticated && !ready ? 0.55 : 1}
                hoverStyle={{ backgroundColor: c.emberDeep }}
                onPress={submit}
              >
                {create.isLoading ? 'Sending…' : isAuthenticated ? 'Request this table' : 'Sign in to request a table'}
              </Btn>
              {!isAuthenticated ? (
                <Paragraph color={c.inkSoft} fontSize={13} lineHeight={20} opacity={0.8}>
                  Requests are saved to your org in Hanzo Base — sign in with Hanzo to send one.
                </Paragraph>
              ) : null}
            </YStack>
          )}
        </YStack>
      </XStack>

      {/* Signed-in: the requests already sent. */}
      {isAuthenticated ? (
        <YStack maxWidth={980} width="100%" alignSelf="center" paddingHorizontal="$5" paddingBottom="$10" gap="$4">
          <XStack alignItems="center" gap="$3">
            <H3 className="serif" color={c.ink} fontSize={22}>Your requests</H3>
            <YStack flex={1} height={1} backgroundColor={c.line} />
          </XStack>
          <MyRequests />
        </YStack>
      ) : null}
    </YStack>
  )
}
