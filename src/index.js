import { Engine } from "./engine";
import UI from "./UI";
import gameConfiguration from "json-loader!yaml-loader!./gamedata.yml";

const engine = new Engine({
  gameConfiguration
});

const ui = new UI({
  engine
});

ui.render();
