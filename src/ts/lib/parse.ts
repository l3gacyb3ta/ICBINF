import { Item, TypeTag } from "./types";
import { Number, isNumeric } from "./utils";


export function split_up(input: string): string[] {
  let output: string[] = [];
  let parsing_string = false;
  let current_value = "";

  for (const c of input) {
    if (parsing_string) {
      if (c == '"') {
        parsing_string = false;
        current_value += c;
        continue;
      }
      current_value += c;
    } else if (c == " " || c == "\n" || c == "\t") {
      if (current_value != "") {
        output.push(current_value.trim());
      }
      current_value = "";
    } else if (c == '"') {
      current_value += c;
      parsing_string = true;
    } else {
      current_value += c;
    }
  }

  if (current_value != "") output.push(current_value.trim());

  return output;
}

export function parse_token(input: string): Item {
  if (input === "0") {
    return Number(0);
  }
  if (input.startsWith('"')) {
    return {
      tag: TypeTag.String,
      value: input.slice(1, -1)
    };
  } else if (input.startsWith("#")) {
    return {
      tag: TypeTag.Tag,
      value: input.slice(1)
    };
  } else if (isNumeric(input)) {
    return {
      tag: TypeTag.Number,
      value: parseFloat(input)
    };
  }
  return {
    tag: TypeTag.Identifier,
    value: input
  };
}
