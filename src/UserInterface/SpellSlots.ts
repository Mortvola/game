import { CreatureActorInterface } from "../types"
import { spellLevelSlots } from "./SpellLevelSlots"
import UI from './CreateElement'

type PropsType = {
  actor: CreatureActorInterface
}

export const spellSlots: UI.FC<PropsType> = ({ actor }) => {
  const levels: UI.UIElement [] = []

  for (let level = 0; level < actor.character.getMaxSpellLevel()!; level += 1) {
    levels.push(
      UI.createElement(
        spellLevelSlots,
        {
          maxSpellSlots: actor.character.getMaxSpellSlots(level + 1)!,
          available: actor.character.spellSlots[level],
        },
      ),
    )
  }

  return UI.createElement(
    '',
    { style: { columnGap: 8 }},
    ...levels,
  )
}
