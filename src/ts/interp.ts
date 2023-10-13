import { Number, DestructureNumber, DestructureTag, Identifier } from "./utils";
import { Item, TypeTag, Stack, Stream } from "./types";
import { builtins } from "./main";


export let dynamic_words: any = {};

export function run(program: Stream<Item>, stack: Stack): Stack {
  let go = true;
  let looping = {
    going: false,
    end: -1,
    index: -1,
    steps_to_go_back: 0,
  };

  while (go) {
    let element = program.consume();

    if (element == null) {
      return stack;
    }

    switch (0 + element.tag) { // why the fuck do I have to add the +
      case TypeTag.Number:
      case TypeTag.String:
      case TypeTag.Tag: {
        stack.main_stack.push(element);
        break;
      }
      case TypeTag.Identifier: {
        if (looping.going) {
          looping.steps_to_go_back += 1;
        }

        if (typeof element.value == "object") continue;

        if (element.value == "(") { // comments
          let go_2 = true;
          while (go_2) { // consume till running
            let elx = program.consume();
            looping.steps_to_go_back += 1;
            if (elx?.value == ")") go_2 = false;
          }
        }
        if (element.value in builtins) {
          if (typeof element.value == "string") stack = builtins[element.value](stack);
        } else if (element.value in dynamic_words) {
          let w_stream = new Stream<Item>(dynamic_words[element.value]);
          stack = run(w_stream, stack);
        } else if (element.value == "if") { // if statements
          let condition = DestructureNumber(stack.main_stack.pop());
          if (condition !== null) {
            if (condition === 0) { // false
              let go_2 = true;
              while (go_2) { // consume till running
                let elx = program.consume();
                if (elx?.value == "then" || elx?.value == "else") go_2 = false;
                looping.steps_to_go_back += 1;
              }
            }
          }
        } else if (element.value == "else") {
          let go_2 = true;
          while (go_2) { // consume till running
            let elx = program.consume();
            if (elx?.value == "then") go_2 = false;
            looping.steps_to_go_back += 1;
          }
        } else if (element.value == "apply") {
          let word = DestructureTag(stack.main_stack.pop());
          program.inject([Identifier(word)]);
          console.log("injected", word);
        } else if (element.value == "do") { // looping
          let end = DestructureNumber(stack.main_stack.pop());
          let start = DestructureNumber(stack.main_stack.pop());
          if ((end != null) && (start != null)) {
            looping = {
              going: true,
              index: start,
              end: end,
              steps_to_go_back: 0,
            };
          }
        } else if (element.value == "loop") {
          if (looping.going) {
            looping.index += 1;
            if (looping.index >= looping.end) {
              looping.going = false;
            } else {
              program.seek_back(looping.steps_to_go_back * -1);
              looping.steps_to_go_back = 1;
            }
          }
        } else if (element.value == "i") {
          if (looping.going) {
            stack.main_stack.push(Number(looping.index));
          }
        } else if (element.value == "then") {
          break;
        } else if (element.value == ":") {
          let ident = program.consume()?.value;
          let value: Item[] = [];

          let go_2 = true;
          while (go_2) { // consume till running
            let elx = program.consume();
            if (elx?.value == ";") go_2 = false;
            else if (elx) {
              value.push(elx);
            }
          }

          if (typeof ident == "string") dynamic_words[ident] = value;

        } else {
          console.error(`${element.value} not an identifier`);
        }
        break;
      }
    }
  }


  return stack;
}
