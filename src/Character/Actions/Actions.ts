import { A, ActionInterface } from "../../types";
import Rage from "./Rage";

export const actions: A<ActionInterface>[] = [
  { action: Rage, name: 'Rage', time: 'Bonus' }
]

export const getAction = (name: string): A<ActionInterface> | null => {
  const action = actions.find((a) => a.name === name);

  if (action) {
    return action;
  }

  return null;
}
