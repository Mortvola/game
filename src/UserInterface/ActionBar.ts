import { IReactionDisposer, autorun } from "mobx"
import ElementNode from "../Renderer/Drawables/SceneNodes/ElementNode"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import { CreatureActorInterface } from "../types"
import { classActionList } from "./ClassActionList"
import { cantripActionList } from "./CantripActionList"
import { spellActionList } from "./SpellActionList"
import { rangeAction } from "./RangeAction"
import { meleeAction } from "./MeleeAction"
import { createElement } from "./CreateElement"
import { statusBar } from "./StatusBar"

type PropsType = {
  actor: CreatureActorInterface,
}

const actionItems = ({ actor }: PropsType) => {
  const currentAction = actor.getAction()

  const commonActionStyle = {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 2 * 54 + 1 * 4 + 8,
    margin: { top: 4 },
  }

  const actionTrayStyle = {
    backgroundColor: [0.25, 0, 0, 1],
    columnGap: 4,
    width: 6 * 54 + 5 * 4,
    height: 2 * 54 + 1 * 4,
    margin: { left: 4, right: 4, top: 4, bottom : 4 },
    border: { color: [1, 1, 1, 1], width: 1 },
    padding: { left: 4, right: 4, top: 4, bottom: 4 },
  }

  return createElement(
    '',
    {},
    createElement(
      '',
      { style: commonActionStyle },
      createElement(meleeAction, { actor, currentAction }),
      createElement(rangeAction, { actor, currentAction }),
    ),
    createElement(
      '',
      { style: actionTrayStyle },
      spellActionList({ actor, currentAction }),
      cantripActionList({ actor, currentAction }),
      classActionList({ actor, currentAction }),
    ),
  );
}

let actionBar: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addActionBar = (actor: CreatureActorInterface | null, scene2d: SceneGraph2D) => {
  const createActionBar = () => {
    let newActionBar: ElementNode | null = null;

    if (actor) {
      const actionBarStyle = {
        flexDirection: 'column',
        position: 'absolute',
        left: '50%',
        transform: 'translate(-50%, 0)',
        bottom: 0,
        backgroundColor: [0.2, 0.2, 0.25, 1],
        padding: { left: 16, top: 4, right: 16 },
        border: { color: [0.4, 0.4, 0.4, 1],  width: 1 }
      }

      newActionBar = createElement(
        '',
        { style: actionBarStyle },
        createElement(statusBar, { actor }),
        createElement(actionItems, { actor }),
      )  
    }

    scene2d.replaceNode(actionBar, newActionBar)

    actionBar = newActionBar
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createActionBar)
}
