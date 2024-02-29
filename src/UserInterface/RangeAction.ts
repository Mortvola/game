import { rangeAttack } from "../Character/Actions/RangeAttack";
import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import UI from "./CreateElement";
import { actionStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const rangeAction: UI.FC<PropsType> = ({ actor, currentAction}) => {
  const handleClick = () => {
    if (actor.character.equipped.rangeWeapon) {
      actor.setAction(rangeAttack);
    }
  }

  return UI.createElement(
    '',
    {
      style: {
        ...actionStyle,
        border: currentAction === rangeAttack ? selectedBorder : unselectdBorder,
        margin: currentAction === rangeAttack ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
        backgroundColor: actor.character.equipped.rangeWeapon && actor.character.actionsLeft > 0 ?  actionStyle.backgroundColor : disabledBackgroundColor,
      },
      onClick: handleClick,
    },
    'Range',
  )
}