async function generateCode() {
  const number = document.getElementById("number").value;
  if(!number){
    alert("Enter a number");
    return;
  }

  document.getElementById("pairCode").innerText = "Generating...";

  try{
    const res = await fetch("/pair",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({number})
    });

    const data = await res.json();
    if(data.pairCode){
      document.getElementById("pairCode").innerText = data.pairCode;
    } else {
      document.getElementById("pairCode").innerText = "Error generating code";
    }
  } catch(err){
    document.getElementById("pairCode").innerText = "Server error";
  }
      }
