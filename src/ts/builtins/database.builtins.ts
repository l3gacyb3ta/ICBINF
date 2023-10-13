import { DestructureTag, Number } from "../utils";
import { Stack, Item } from "../types";

let k_v_database: any = {};
let streams: any = {};

export const database_builtins = {
  "kv": function (stack: Stack): Stack {
    let operation = DestructureTag(stack.main_stack.pop())
    if (!operation) return stack
    switch (operation) {
      case "get": {
        let key = DestructureTag(stack.main_stack.pop());
        if (!key) return stack;

        stack.main_stack.push(k_v_database[key])

        break;
      }
      case "set": {
        let key = DestructureTag(stack.main_stack.pop());
        if (!key) return stack;
        let value = stack.main_stack.pop();
        if (!value) return stack;

        console.log("setting", key, "to", value)
        
        k_v_database[key] = value;
        break;
      }
    }

    return stack
  },
  "stream": function (stack: Stack): Stack {
    let operation = DestructureTag(stack.main_stack.pop())
    if (!operation) return stack

    switch (operation) {
      case "add": {
        let key = DestructureTag(stack.main_stack.pop());
        if (key == null) return stack;
        let value = stack.main_stack.pop();

        if (!streams[key]) streams[key] = []

        streams[key].push(value);
        break;
      }

      case "get": {
        let key = DestructureTag(stack.main_stack.pop());
        if (!key) return stack;

        streams[key].forEach((element: Item) => {
          stack.main_stack.push(element)
        });
        stack.main_stack.push(Number(streams[key].length))

      }

    }

    return stack;
  }
}