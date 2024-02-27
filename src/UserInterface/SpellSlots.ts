import ElementNode from "../Renderer/Drawables/SceneNodes/ElementNode"
import { CreatureActorInterface } from "../types"
import { createElement } from "./CreateElement"
import { spellLevelSlots } from "./SpellLevelSlots"

type PropsType = {
  actor: CreatureActorInterface
}

export const spellSlots = ({ actor }: PropsType) => {
  const levels: ElementNode[] = []

  for (let level = 0; level < actor.character.getMaxSpellLevel()!; level += 1) {
    levels.push(
      createElement(
        spellLevelSlots,
        {
          maxSpellSlots: actor.character.getMaxSpellSlots(level + 1)!,
          available: actor.character.spellSlots[level],
        },
      ),
    )
  }

  return createElement(
    '',
    { style: { columnGap: 8 }},
    ...levels,
  )
}
