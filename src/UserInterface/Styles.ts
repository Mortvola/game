import { Style } from "../Renderer/Drawables/SceneNodes/ElementNode"

const actionColor = [0, 0.5, 0, 1];
const bonusColor = [1, 0.65, 0, 1];

export const unselectdBorder = { color: [1, 1, 1, 1], width: 1 };
export const selectedBorder = { color: [1, 1, 0, 1], width: 3 };
export const disabledBackgroundColor = [0.5, 0.5, 0.5, 1];

export const actionStyle: Style = {
  width: 48,
  height: 48,
  backgroundColor: actionColor,
  border: { color: [1, 1, 1, 1], width: 1 },
  margin: { top: 2, left: 2, bottom: 2, right: 2 },
}

export const bonusStyle: Style = {
  ...actionStyle,
  color: [0, 0, 0, 1],
  backgroundColor: bonusColor,
}
