import Engine from "./Engine";
import UI from "./UI";
import gamedata from "json-loader!yaml-loader!./gamedata.yml";

console.log(gamedata);

const engine = new Engine({
  gamedata
});

const ui = new UI({
  engine
});
