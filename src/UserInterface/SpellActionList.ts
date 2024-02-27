import { ActionFactory, ActionInterface, CreatureActorInterface } from "../types";
import { createElement } from "./CreateElement";
import { actionStyle, bonusStyle, disabledBackgroundColor, selectedBorder, unselectdBorder } from "./Styles";

type PropsType = {
  actor: CreatureActorInterface,
  currentAction: ActionFactory<ActionInterface> | null,
}

export const spellActionList = (props: PropsType) => {
  return props.actor.character.spells.map((spell) => {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }

    const handleClick = () => {
      if (spell.available(props.actor)) {
        props.actor.setAction(spell);
      }
    }
    
    return createElement(
      '',
      {
        style: {
          ...style,
          border: props.currentAction === spell ? selectedBorder : unselectdBorder,
          margin: props.currentAction === spell ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
          backgroundColor: spell.available(props.actor) ?  style.backgroundColor : disabledBackgroundColor,
        },
        onClick: handleClick,
      },
      spell.name,
    )
  })
}