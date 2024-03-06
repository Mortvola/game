import { IReactionDisposer, IReactionPublic, autorun } from "mobx"
import ElementNode, { Style } from "../Renderer/Drawables/SceneNodes/ElementNode"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import { CreatureActorInterface } from "../types"
import { classActionList } from "./ClassActionList"
import { cantripActionList } from "./CantripActionList"
import { spellActionList } from "./SpellActionList"
import { rangeAction } from "./RangeAction"
import { meleeAction } from "./MeleeAction"
import UI from "./CreateElement"
import { statusBar } from "./StatusBar"

type PropsType = {
  actor: CreatureActorInterface,
}

const actionItems: UI.FC<PropsType> = ({ actor }) => {
  const currentAction = actor.getAction()

  const commonActionStyle: Style = {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 2 * 54 + 1 * 4 + 8,
    margin: { top: 4 },
  }

  const actionTrayStyle: Style = {
    backgroundColor: [0.25, 0, 0, 1],
    columnGap: 4,
    width: 6 * 54 + 5 * 4,
    height: 2 * 54 + 1 * 4,
    margin: { left: 4, right: 4, top: 4, bottom : 4 },
    border: { color: [1, 1, 1, 1], width: 1 },
    padding: { left: 4, right: 4, top: 4, bottom: 4 },
  }

  return UI.createElement(
    '',
    {},
    UI.createElement(
      '',
      { style: commonActionStyle },
      UI.createElement(meleeAction, { actor, currentAction }),
      UI.createElement(rangeAction, { actor, currentAction }),
    ),
    UI.createElement(
      '',
      { style: actionTrayStyle },
      spellActionList({ actor, currentAction }),
      cantripActionList({ actor, currentAction }),
      classActionList({ actor, currentAction }),
    ),
  );
}

const actionBar = ({ actor }: { actor: CreatureActorInterface }) => {
  const actionBarStyle: Style = {
    flexDirection: 'column',
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    bottom: 0,
    backgroundColor: [0.2, 0.2, 0.25, 1],
    padding: { left: 16, top: 4, right: 16 },
    border: { color: [0.4, 0.4, 0.4, 1],  width: 1 }
  }

  return UI.createElement(
    '',
    { style: actionBarStyle },
    UI.createElement(statusBar, { actor }),
    UI.createElement(actionItems, { actor }),
  )
}

let currentActionBar: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addActionBar = (actor: CreatureActorInterface | null, scene2d: SceneGraph2D) => {
  const createActionBar = (r: IReactionPublic) => {
    let newActionBar: ElementNode | null = null;

    if (actor) {
      // const actionBarStyle: Style = {
      //   flexDirection: 'column',
      //   position: 'absolute',
      //   left: '50%',
      //   transform: 'translate(-50%, 0)',
      //   bottom: 0,
      //   backgroundColor: [0.2, 0.2, 0.25, 1],
      //   padding: { left: 16, top: 4, right: 16 },
      //   border: { color: [0.4, 0.4, 0.4, 1],  width: 1 }
      // }

      // const temp = UI.createElement(
      //   '',
      //   { style: actionBarStyle },
      //   UI.createElement(statusBar, { actor }),
      //   UI.createElement(actionItems, { actor }),
      // )

      newActionBar = UI.render(
        UI.createElement(actionBar, { actor }),
        scene2d,
      )
    }

    scene2d.replaceNode(currentActionBar, newActionBar)
    currentActionBar = newActionBar
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createActionBar)
}
