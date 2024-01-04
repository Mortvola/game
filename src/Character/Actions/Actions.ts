import Actor from "../Actor";
import Action, { TimeType } from "./Action";
import Rage from "./Rage";

export type A<T> = {
  action: new (actor: Actor) => T;
  name: string;
  time: TimeType,
}

export const actions: A<Action>[] = [
  { action: Rage, name: 'Rage', time: 'Bonus' }
]

export const getAction = (name: string): A<Action> | null => {
  const action = actions.find((a) => a.name === name);

  if (action) {
    return action;
  }

  return null;
}
