import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import UI from "./CreateElement";
import { actionStyle, bonusStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const cantripActionList = (props: PropsType) => {
  return props.actor.character.cantrips.map((cantrip) => {
    let style = actionStyle
    if (cantrip.time === 'Bonus') {
      style = bonusStyle
    }
    
    const handleClick = () => {
      if (cantrip.available(props.actor)) {
        props.actor.setAction(cantrip);
      }
    }

    return UI.createElement(
      '',
      {
        style: {
          ...style,
          border: props.currentAction === cantrip ? selectedBorder : unselectdBorder,
          margin: props.currentAction === cantrip ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
          backgroundColor: cantrip.available(props.actor) ?  style.backgroundColor : disabledBackgroundColor,
        },
        onClick: handleClick,
      },
      cantrip.name,
    )
  })
}