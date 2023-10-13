import { run, dynamic_words } from "./lib/interp";
import { Stack, Stream } from "./lib/types";
import { split_up, parse_token } from "./lib/parse";

import { base_builtins } from "./builtins/base.builtins"
import { math_builtins } from "./builtins/math.builtins"
import { database_builtins } from "./builtins/database.builtins"
import { ui_builtins } from "./builtins/ui.builtins"

export const builtins = {
  ...base_builtins,
  ...math_builtins,
  ...database_builtins,
  ...ui_builtins
}


let stack: Stack = { main_stack: [], hold_stack: [] };

const clear_button = document.getElementById('clear');
const clear = () => { document.getElementById('console').value = '' }
clear_button.onclick = clear

let ticker: NodeJS.Timeout;

const run_button = document.getElementById("runable");
run_button.onclick = function () {
  // clear existing loop
  clearInterval(ticker);
  clear();
  // read in code and create stream.
  let data: any = document.getElementById("input");
  let token_stream = new Stream(split_up(data.value).map(parse_token));
  stack = run(token_stream, stack);

  if ("loop" in dynamic_words && ticker == null ) {
    ticker = setInterval(() => {
      let token_stream = new Stream(split_up(" loop ").map(parse_token));
      stack = run(token_stream, stack);
    }, 35)
  }
}

// watch words, so we can show user defined words.
let words = document.getElementById("words")
setInterval(() => {
  words.innerHTML = ""
  Object.keys(dynamic_words).forEach((word: string) => {
    words.innerHTML += `<li>${word}</li>`
  });

}, 500)


const load_file = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  if (urlParams.get("loadfile") == null) return;

  fetch(`https://corsproxy.io/?${urlParams.get("loadfile")}`).then(async (resp) => {
    document.getElementById("input").value = await resp.text()
  })

};
load_file();


// let share = document.getElementById("share");
// let shareModal = document.querySelector("dialog");
// share.onclick = function () {
//   let data = document.getElementById("input").value;
//   let compressed_data=kissc.compress(data)
//   let url = `${window.location}#${compressed_data}`;

//   shareModal.showModal()
//   // let clip = new window.Clipboard();
//   navigator.clipboard.writeText(url);
//   setTimeout(() => {
//     shareModal.close();
//   }, 750);
//   location.replace(url);  
//   console.log(url);
// }