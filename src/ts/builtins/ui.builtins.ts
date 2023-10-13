import { Stack, TypeTag, Item, Stream } from "../lib/types"
import { DestructureNumber, DestructureString, DestructureTag, Identifier, Number } from "../lib/utils"
import { run } from "../lib/interp";

export const ui_builtins = {
    "Title": function (stack: Stack): Stack {
        let string = DestructureString(stack.main_stack.pop())
        if (string == null) return stack

        stack.main_stack.push({
            tag: TypeTag.JSON,
            value: { html_tag: "h2", value: string, style: "" }
        })

        return stack
    },
    "Body": function (stack: Stack): Stack {
        let string = DestructureString(stack.main_stack.pop())
        if (string == null) return stack

        stack.main_stack.push({
            tag: TypeTag.JSON,
            value: { html_tag: "p", value: string, style: "" }
        })

        return stack
    },
    "HStack": function (stack: Stack): Stack {
        let count = DestructureNumber(stack.main_stack.pop())
        if (count == null) return stack

        let data: Item[] = [];

        for (let index = 0; index < count; index++) {
            let el = stack.main_stack.pop();
            if (el == undefined) continue;
            data.push(el)
        }
        data = data.reverse()


        stack.main_stack.push({
            tag: TypeTag.JSON,
            value: { collection: data, direction: "Horizontal", style: "" }
        })

        return stack
    },
    "VStack": function (stack: Stack): Stack {
        let count = DestructureNumber(stack.main_stack.pop())
        if (count == null) return stack

        let data: Item[] = [];

        for (let index = 0; index < count; index++) {
            let el = stack.main_stack.pop();
            if (el == undefined) continue;
            data.push(el)
        }

        data = data.reverse()

        stack.main_stack.push({
            tag: TypeTag.JSON,
            value: { collection: data, direction: "Vertical", style: "" }
        })

        return stack
    },
    "style": function (stack: Stack): Stack {
        let value = stack.main_stack.pop().value;
        if (typeof value != "string") return stack;
        let property = DestructureTag(stack.main_stack.pop())
        if (property == null) return stack;

        let object: any = stack.main_stack.pop()
        if (object == null) return stack;
        if (!(object.tag == TypeTag.JSON)) return stack;

        object.value.style += `${property}: ${value};`

        stack.main_stack.push(object);
        return stack;
    },
    "id":  function (stack: Stack): Stack {
        let value = DestructureTag(stack.main_stack.pop())
        if (value == null) return stack;
        
        let object: any = stack.main_stack.pop()
        if (object == null) return stack;
        if (!(object.tag == TypeTag.JSON)) return stack;
        
        object.value.id = value;
        stack.main_stack.push(object);

        return stack
    },
    "Square": function (stack: Stack): Stack {
        stack.main_stack.push({
            tag: TypeTag.JSON,
            value: { html_tag: "div", value: "", style: "width: 40px; height: 40px;" }
        })

        return stack;
    },
    "Slider": function (stack: Stack): Stack {
        stack.main_stack.push({
            tag: TypeTag.JSON,
            value: { html_tag: 'input type="range" min="1" max="100" value="0"', value: "", style: ""}
        })

        return stack;
    },
    "ui": function (stack: Stack): Stack {

        let op = DestructureTag(stack.main_stack.pop())
        if (op == null) return stack;

        let operand = DestructureTag(stack.main_stack.pop())
        if (operand == null) return stack;

        switch (op) {
            case "get-slider": {
                let el : any = document.getElementById("output").contentWindow.document.getElementById(operand);
                stack.main_stack.push(Number(el.value / 100));
                break;
            }
            case "set-slider": {
                let value = DestructureNumber(stack.main_stack.pop())
                if (value == null) return stack;
                document.getElementById("output").contentWindow.document.getElementById(operand).value = (value * 100);
                break;
            }
            case "attach": {
                let tag = DestructureTag(stack.main_stack.pop());
                
                
                document.getElementById("output").contentWindow.document.getElementById(operand).onchange = function(e) {
                    let nstack: Stack = {
                        main_stack: [Number(e.target.value / 100)],
                        hold_stack: []
                    }
                    run(new Stream<Item>([Identifier(tag)]), nstack);
                };
                break;
            }
            case "set-style": {
                let value = stack.main_stack.pop().value;
                if (typeof value != "string") return stack;

                let property = DestructureTag(stack.main_stack.pop())
                if (property == null) return stack;
                
                let el = document.getElementById("output").contentWindow.document.getElementById(operand);

                el.style[property] = value;
            }
        }


        return stack;
    },
    "render": function (stack: Stack): Stack {
        let object: any = stack.main_stack.pop()

        let out = `<style>
.uiHorizontal {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* for vertical aligning */
    align-items: center;
  }
</style>`;

        if (object.value.collection != undefined) {
            out += `<div class="ui${object.value.direction}">`
            object.value.collection.forEach((el: any) => {
                out += `<${el.value.html_tag} style="${el.value.style}" id="${el.value.id}">${el.value.value}</${el.value.html_tag}>`
            });
            out += `</div>`

        } else {
            out += `<${object.value.html_tag} style="${object.value.style}" id="${object.value.id}">${object.value.value}</${object.value.html_tag}>`
        }

        let el: any = document.getElementById("output")
        el.contentWindow.document.open();
        el.contentWindow.document.write("<!DOCTYPE html>");
        el.contentWindow.document.write(out);
        el.contentWindow.document.close();

        return stack;
    }
}