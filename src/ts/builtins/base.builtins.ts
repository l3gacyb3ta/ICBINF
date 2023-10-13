import { Stack } from "../lib/types";
import { DestructureString, String, Number } from "../lib/utils";

export const base_builtins: any = {
    "concat": function (stack: Stack): Stack {
        let y = stack.main_stack.pop().value;
        let x = DestructureString(stack.main_stack.pop());

        if ((x != null) && (y != null)) {
            stack.main_stack.push(String(x.concat(y.toString())));
        }
        return stack;
    },
    "swap": function (stack: Stack): Stack {
        let y = stack.main_stack.pop();
        let x = stack.main_stack.pop();
        if (x && y) {
            stack.main_stack.push(y);
            stack.main_stack.push(x);
        }
        return stack;
    },
    "dup": function (stack: Stack): Stack {
        let x = stack.main_stack.pop();
        if (x) {
            stack.main_stack.push(x);
            stack.main_stack.push(x);
        }
        return stack;
    },
    "hold": function (stack: Stack): Stack {
        let x = stack.main_stack.pop()
        if (x) stack.hold_stack.push(x);
        return stack;
    },
    "release": function (stack: Stack): Stack {
        let x = stack.hold_stack.pop()
        if (x) stack.main_stack.push(x);
        return stack;
    },
    "drop": function (stack: Stack): Stack {
        stack.main_stack.pop()
        return stack;
    },
    ".": function (stack: Stack): Stack {
        let x = stack.main_stack.pop();
        let console_el: any = document.getElementById("console");
        console_el.value += x?.value + "\n";
        console.log(x?.value)
        return stack;
    },
    "=": function (stack: Stack): Stack {
        let y = stack.main_stack.pop();
        let x = stack.main_stack.pop();

        if (y?.value == x?.value && x?.tag == y?.tag) {
            stack.main_stack.push(Number(1))
        } else {
            stack.main_stack.push(Number(0))
        }

        return stack;
    }
}