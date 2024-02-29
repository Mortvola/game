import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import UI from "./CreateElement";
import { actionStyle, bonusStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const classActionList = ({ actor, currentAction}: PropsType) => {
  return actor.character.charClass.actions.map((classAction) => {
    let style = actionStyle
    if (classAction.time === 'Bonus') {
      style = bonusStyle
    }
    
    const handleClick = () => {
      if (classAction.available(actor)) {
        actor.setAction(classAction);
      }
    }

    return UI.createElement(
      '',
      {
        style: {
          ...style,
          border: currentAction === classAction ? selectedBorder : unselectdBorder,
          margin: currentAction === classAction ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
          backgroundColor: classAction.available(actor) ?  style.backgroundColor : disabledBackgroundColor,
        },
        onClick: handleClick,
      },
      classAction.name,
    )
  })
}