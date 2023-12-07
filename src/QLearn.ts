import Participants from "./Participants";
import QStore from "./QStore";

export const qStore = new QStore();

class QLearn {
  participants = new Participants()

  learn(iterations: number) {

    for (let i = 0; i < iterations; i += 1) {
    }
  }
}

export default QLearn;
