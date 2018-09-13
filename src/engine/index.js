import { EventEmitter } from "events";
import { createTicker } from "./ticker";

const debug = {
  log: message => {
    console.log(message);
    return message;
  }
};

const functions = {
  ADD: (self, a, b) => a + b,
  MULTIPLY: (self, a, b) => a * b,
  MOD: (self, a, b) => a % b,

  EQ: (self, a, b) => a === b,
  GT: (self, a, b) => a > b,
  GTE: (self, a, b) => a >= b,
  LT: (self, a, b) => a < b,
  LTE: (self, a, b) => a <= b,

  AND: (self, a, b) => a && b,
  OR: (self, a, b) => a || b,

  CALL: (self, commandName, ...vals) => self.runCommand(commandName, ...vals),
  EMIT: (self, event, ...vals) => self.emit(event, ...vals),
  SET: (self, key, value) => self.set(key, value),
  GET: (self, key) => self.get(key),
  VAL: (self, index, ...vals) => vals[index],
  LOG: (self, message) => debug.log(message)
};

export class Engine extends EventEmitter {
  constructor(options) {
    super();

    const { gameConfiguration } = options;

    this.tick = this.tick.bind(this);
    this.prepareFunction = this.prepareFunction.bind(this);

    this.ticker = createTicker(gameConfiguration.config.tick_ms, this.tick);
    this.model = gameConfiguration.model;
    this.commands = this.prepareCommands(gameConfiguration.commands);
    this.levels = gameConfiguration.levels;
  }

  prepareCommands(commands) {
    const result = {};

    for (const key in commands) {
      const command = commands[key];

      let runEffects = () => null;
      let runPreConditions = () => true;

      if (command.pre_conditions) {
        const preConditions = command.pre_conditions.map(this.prepareFunction);
        runPreConditions = (...vals) =>
          preConditions.every(condition => condition(...vals));
      }

      if (command.effects) {
        const effects = command.effects.map(this.prepareFunction);
        runEffects = (...vals) => {
          if (runPreConditions(...vals)) {
            effects.forEach(effect => effect(...vals));
          }
        };
      }

      if (command.on) {
        this.on(command.on, runEffects);
      }

      if (command.once) {
        this.once(command.once, runEffects);
      }

      result[key] = runEffects;
    }

    return result;
  }

  prepareFunction(definition) {
    const fn = functions[definition[0]];
    const args = definition
      .slice(1, definition.length)
      .map(arg => (arg instanceof Array ? this.prepareFunction(arg) : arg));

    return (...vals) => {
      return fn(
        this,
        ...args.map(arg => (arg instanceof Function ? arg(...vals) : arg)),
        ...vals
      );
    };
  }

  set(key, value) {
    this.model[key] = value;
    this.emit(`@change_${key}`, value);
  }

  get(key) {
    return this.model[key];
  }

  runCommand(commandName, ...vals) {
    this.commands[commandName](...vals);
  }

  tick() {
    this.emit("@tick");
  }

  start() {
    this.ticker.start();
  }
}
