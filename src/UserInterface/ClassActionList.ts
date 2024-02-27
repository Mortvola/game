import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import { createElement } from "./CreateElement";
import { actionStyle, bonusStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const classActionList = (props: PropsType) => {
  return props.actor.character.charClass.actions.map((classAction) => {
    let style = actionStyle
    if (classAction.time === 'Bonus') {
      style = bonusStyle
    }
    
    const handleClick = () => {
      if (classAction.available(props.actor)) {
        props.actor.setAction(classAction);
      }
    }

    return createElement(
      '',
      {
        style: {
          ...style,
          border: props.currentAction === classAction ? selectedBorder : unselectdBorder,
          margin: props.currentAction === classAction ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
          backgroundColor: classAction.available(props.actor) ?  style.backgroundColor : disabledBackgroundColor,
        },
        onClick: handleClick,
      },
      classAction.name,
    )
  })
}