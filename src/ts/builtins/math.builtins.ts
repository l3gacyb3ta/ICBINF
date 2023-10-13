import { Stack } from "../types";
import { Number, DestructureNumber } from "../utils";

export const math_builtins = {
  "+": function (stack: Stack): Stack {
    let y = DestructureNumber(stack.main_stack.pop());
    let x = DestructureNumber(stack.main_stack.pop());
    console.log(y, x)
    if ((x != null) && (y != null)) {
      stack.main_stack.push(Number(x + y));
    }
    return stack;
  },
  "-": function (stack: Stack): Stack {
    let y = DestructureNumber(stack.main_stack.pop());
    let x = DestructureNumber(stack.main_stack.pop());
    if ((x != null) && (y != null)) {
      stack.main_stack.push(Number(x - y));
    }
    return stack;
  },
  "*": function (stack: Stack): Stack {
    let y = DestructureNumber(stack.main_stack.pop());
    let x = DestructureNumber(stack.main_stack.pop());
    if ((x != null) && (y != null)) {
      stack.main_stack.push(Number(x * y));
    }
    return stack;
  },
  "%": function (stack: Stack): Stack {
    let y = DestructureNumber(stack.main_stack.pop());
    let x = DestructureNumber(stack.main_stack.pop());
    if ((x != null) && (y != null)) {
      stack.main_stack.push(Number(x % y));
    }
    return stack;
  },
  "round": function (stack: Stack): Stack {
    let y = DestructureNumber(stack.main_stack.pop());
    if (y != null) {
      stack.main_stack.push(Number(Math.round(y)));
    }
    return stack;
  },
  "/": function (stack: Stack): Stack {
    let y = DestructureNumber(stack.main_stack.pop());
    let x = DestructureNumber(stack.main_stack.pop());
    if ((x != null) && (y != null)) {
      stack.main_stack.push(Number(x / y));
    }
    return stack;
  },
  "sqrt": function (stack: Stack): Stack {
    let x = DestructureNumber(stack.main_stack.pop());
    if (x != null) {
      stack.main_stack.push(Number(Math.sqrt(x)));
    }
    return stack;
  },
  "exp": function (stack: Stack): Stack {
    let y = DestructureNumber(stack.main_stack.pop());
    let x = DestructureNumber(stack.main_stack.pop());
    if ((x != null) && (y != null)) {
      stack.main_stack.push(Number(x ** y));
    }
    return stack;
  },
}