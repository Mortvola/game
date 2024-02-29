import { meleeAttack } from "../Character/Actions/MeleeAttack";
import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import UI from "./CreateElement";
import { actionStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const meleeAction: UI.FC<PropsType> = ({ actor, currentAction}) => {
  const handleClick = () => {
    if (actor.character.equipped.meleeWeapon) {
      actor.setAction(meleeAttack);
    }
  }

  console.log(`actor: ${actor.character.name}, ${actor.character.equipped.meleeWeapon}, ${actor.character.actionsLeft}`)

  return UI.createElement(
    '',
    {
      style: {
        ...actionStyle,
        border: currentAction === meleeAttack ? selectedBorder : unselectdBorder,
        margin: currentAction === meleeAttack ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
        backgroundColor: actor.character.equipped.meleeWeapon && actor.character.actionsLeft > 0 ?  actionStyle.backgroundColor : disabledBackgroundColor,
      },
      onClick: handleClick,
    },
    'Melee',
  )
}