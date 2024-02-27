import { rangeAttack } from "../Character/Actions/RangeAttack";
import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import { createElement } from "./CreateElement";
import { actionStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const rangeAction = (props: PropsType) => {
  const handleClick = () => {
    if (props.actor.character.equipped.rangeWeapon) {
      props.actor.setAction(rangeAttack);
    }
  }

  return createElement(
    '',
    {
      style: {
        ...actionStyle,
        border: props.currentAction === rangeAttack ? selectedBorder : unselectdBorder,
        margin: props.currentAction === rangeAttack ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
        backgroundColor: props.actor.character.equipped.rangeWeapon && props.actor.character.actionsLeft > 0 ?  actionStyle.backgroundColor : disabledBackgroundColor,
      },
      onClick: handleClick,
    },
    'Range',
  )
}