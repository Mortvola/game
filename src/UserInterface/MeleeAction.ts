import { meleeAttack } from "../Character/Actions/MeleeAttack";
import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import { createElement } from "./CreateElement";
import { actionStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const meleeAction = (props: PropsType) => {
  const handleClick = () => {
    if (props.actor.character.equipped.meleeWeapon) {
      props.actor.setAction(meleeAttack);
    }
  }

  return createElement(
    '',
    {
      style: {
        ...actionStyle,
        border: props.currentAction === meleeAttack ? selectedBorder : unselectdBorder,
        margin: props.currentAction === meleeAttack ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
        backgroundColor: props.actor.character.equipped.meleeWeapon && props.actor.character.actionsLeft > 0 ?  actionStyle.backgroundColor : disabledBackgroundColor,
      },
      onClick: handleClick,
    },
    'Melee',
  )
}