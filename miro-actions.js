document.addEventListener('auxclick', handleAuxClick);

async function handleAuxClick(event) {
  if (event.button === 1) {
    setTimeout(async () => {
      const selection = await miro.board.getSelection();
      if (selection.length > 0 && selection[0].linkedTo) {
        const data = createData(selection[0].linkedTo);
        await sendPostRequest(data);
      }
      await miro.board.deselect();
    }, 10);
  }
}

function createData(linkedTo) {
  if (linkedTo.includes('obsidian')) {
    return {
      Arg1: "openObsidian",
      Arg2: linkedTo
    };
  } else {
    return {
      Arg1: "openCanary",
      Arg2: linkedTo
    };
  }
}

function sendPostRequest(data) {
  return fetch('http://localhost:5199/Commands/ExecuteCommand', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => console.log("Success:", data))
    .catch(error => console.error('Error:', error));
}

function alertTest() {
  alert('Test');
}