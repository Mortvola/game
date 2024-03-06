import { CreatureActorInterface } from "../types"
import UI from "./CreateElement"
import { spellSlots } from "./SpellSlots"

type PropsType = {
  actor: CreatureActorInterface,
}

export const statusBar: UI.FC<PropsType> = ({ actor }) => {
  const actionStyle = {
    width: 32,
    height: 32,
    backgroundColor: actor.character.actionsLeft > 0 ? [0, 0.5, 0, 1] : [0, 0, 0, 1],
    border: { color: [1, 1, 1, 1], width: 1 },
  }

  const bonusStyle = {
    ...actionStyle,
    backgroundColor: actor.character.bonusActionsLeft > 0 ? [1, 0.65, 0, 1] : [0, 0, 0, 1],
  }

  return UI.createElement(
    '',
    { style: { columnGap: 8, margin: { top: 4, bottom: 4 } }},
    UI.createElement('', { style: actionStyle }),
    UI.createElement('', { style: bonusStyle }),
    UI.createElement(spellSlots, { actor }),
  )
}
