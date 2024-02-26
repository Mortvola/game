import { A, ActionFactory, ActionInterface } from "../../types";
import LayOnHands from "./LayOnHands";
import Rage from "./Rage";

export const actions: ActionFactory<ActionInterface>[] = [
  new ActionFactory(LayOnHands, 'Lay on Hands', 'Action'),
  new ActionFactory(Rage, 'Rage', 'Bonus'),
]

export const getAction = (name: string): ActionFactory<ActionInterface> | null => {
  const action = actions.find((a) => a.name === name);

  if (action) {
    return action;
  }

  return null;
}
