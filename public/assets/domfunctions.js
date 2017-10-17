function captainUpdate(input){
	if(input.checked){
		document.getElementById("agent").checked = true;
	}
}

function agentUpdate(input){
	if(input.checked){
		document.getElementById("leader").checked = true;
	}
}

//create function
//if player is on team, cannot be freeAgent