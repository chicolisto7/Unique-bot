async function generate(){

let number = document.getElementById("number").value

let res = await fetch("/pair")

let data = await res.json()

document.getElementById("result").innerHTML = "PAIR CODE: " + data.pair_code

}
