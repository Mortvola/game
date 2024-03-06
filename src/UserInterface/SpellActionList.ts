import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import UI from "./CreateElement";
import { actionStyle, bonusStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const spellActionList = ({ actor, currentAction }: PropsType) => {
  return actor.character.spells.map((spell) => {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }

    const handleClick = () => {
      if (spell.available(actor)) {
        actor.setAction(spell);
      }
    }
    
    return UI.createElement(
      '',
      {
        style: {
          ...style,
          border: currentAction === spell ? selectedBorder : unselectdBorder,
          margin: currentAction === spell ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
          backgroundColor: spell.available(actor) ?  style.backgroundColor : disabledBackgroundColor,
        },
        onClick: handleClick,
      },
      spell.name,
    )
  })
}