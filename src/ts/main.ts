import { DestructureString, String, Number } from "./utils";
import { Stack, Stream, split_up, parse_token } from "./types";
import { run, dynamic_words } from "./interp";

let default_builtins: any = {
  "concat": function (stack: Stack): Stack {
    // console.log(JSON.stringify(stack.main_stack))
    let y = stack.main_stack.pop().value;
    let x = DestructureString(stack.main_stack.pop());
    // console.log(String(x.concat(y.toString())))
    if ((x != null) && (y != null)) {
      stack.main_stack.push(String(x.concat(y.toString())));
    }
    console.log(JSON.stringify(stack.main_stack))
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

import { math_builtins } from "./builtins/math.builtins"
import { database_builtins } from "./builtins/database.builtins"
import { ui_builtins } from "./builtins/ui.builtins"

export const builtins = {
  ...default_builtins,
  ...math_builtins,
  ...database_builtins,
  ...ui_builtins
}


let stack: Stack = { main_stack: [], hold_stack: [] };

let clear_button = document.getElementById('clear');
function clear() { document.getElementById('console').value = '' }
clear_button.onclick = clear

let ticker = 0;


let button = document.getElementById("runable");
button.onclick = function () {
  clearInterval(ticker);
  clear();
  let data: any = document.getElementById("input");


  let token_stream = new Stream(split_up(data.value).map(parse_token));
  stack = run(token_stream, stack);

  if ("loop" in dynamic_words) {
    ticker = setInterval(() => {
      let token_stream = new Stream(split_up(" loop ").map(parse_token));
      stack = run(token_stream, stack);
    }, 35)
  }
}

document.getElementById("input").value = `Slider #redSlider id
Square #square id
2 VStack
render

: slider ( value - )
    255 * round 
    "rgb(" swap concat ",0,0)" concat 
    #background-color swap #square #set-style ui
;

#slider #redSlider #attach ui`

let words = document.getElementById("words")
setInterval(() => {
  words.innerHTML = ""
  Object.keys(dynamic_words).forEach((word: string) => {
    words.innerHTML += `<li>${word}</li>`
  });

}, 500)
