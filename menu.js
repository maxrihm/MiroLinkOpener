let enteredName = '';
let generatedLink = '';
let selectedExtension = '.canvas';
let hideTimeout;
let selectedSize = 'medium'; // Default selected size

function init() {
  createMainButton();
  createDropdownMenu();
}

init();

function createMainButton() {
  const mainButton = document.createElement('button');
  mainButton.id = 'mainButton';
  mainButton.textContent = 'Menu';
  document.body.appendChild(mainButton);

  mainButton.addEventListener('mouseenter', showDropdown);
  mainButton.addEventListener('mouseleave', startHideTimeout);
}

function createDropdownMenu() {
  const dropdownMenu = document.createElement('div');
  dropdownMenu.id = 'dropdownMenu';
  document.body.appendChild(dropdownMenu);

  dropdownMenu.addEventListener('mouseenter', showDropdown);
  dropdownMenu.addEventListener('mouseleave', startHideTimeout);

  addMenuOptions(dropdownMenu);
}

function addMenuOptions(dropdownMenu) {
  const menuOptions = [
    { text: 'Create Node', action: showModalMenu },
    // { text: 'Option 4', action: () => alert('Option 4 selected') },
    // { text: 'Option 5', action: () => alert('Option 5 selected') }
  ];

  menuOptions.forEach(option => {
    const menuItem = document.createElement('div');
    menuItem.textContent = option.text;
    menuItem.onclick = option.action;
    dropdownMenu.appendChild(menuItem);
  });
}

function showDropdown() {
  clearTimeout(hideTimeout);
  document.getElementById('dropdownMenu').style.display = 'flex';
}

function startHideTimeout() {
  hideTimeout = setTimeout(() => {
    document.getElementById('dropdownMenu').style.display = 'none';
  }, 200);
};

// Function to create the shape and text on the Miro board with a link
async function createShapeAndText() {
  const viewport = await miro.board.viewport.get();
  const centerX = viewport.x + viewport.width / 2;
  const centerY = viewport.y + viewport.height / 2;

  // Set size values based on selectedSize
  const sizeMap = {
    small: 10,
    medium: 12,
    large: 14
  };
  const selectedCircleSize = sizeMap[selectedSize];
  const selectedTextSize = sizeMap[selectedSize];

  const shape = await miro.board.createShape({
    // content: '',
    shape: 'circle',
    style: {
      fillColor: '#e6e6e6',
      borderOpacity: 0,
      fillOpacity: 1.0,
    },
    x: centerX,
    y: centerY,
    width: selectedCircleSize,
    height: selectedCircleSize,
    linkedTo: generatedLink,
  });

  const text = await miro.board.createText({
    content: `${enteredName}`,
    style: {
      color: '#e6e6e6',
      // fillColor: 'transparent',
      fontFamily: 'opensans',
      fontSize: selectedTextSize,
      textAlign: 'center',
    },
    x: centerX,
    y: centerY + (selectedTextSize % 10) + 15,
    width: 105,
  });

  console.log('Shape created with link:', generatedLink);
  console.log('Text created with name:', enteredName);
}


function showModalMenu() {
  const modal = document.createElement('div');
  modal.id = 'modal';
  document.body.appendChild(modal);

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modal.appendChild(modalContent);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Enter name';
  nameInput.className = 'modal-input';
  modalContent.appendChild(nameInput);

  const extensionSelect = document.createElement('select');
  extensionSelect.className = 'modal-input';

  const canvasOption = document.createElement('option');
  canvasOption.value = '.canvas';
  canvasOption.textContent = 'Create .canvas';
  extensionSelect.appendChild(canvasOption);

  const mdOption = document.createElement('option');
  mdOption.value = '.md';
  mdOption.textContent = 'Create .md';
  extensionSelect.appendChild(mdOption);

  modalContent.appendChild(extensionSelect);

  // Create radio buttons for size selection
  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ];

  const sizeContainer = document.createElement('div');
  sizeContainer.className = 'size-container';
  modalContent.appendChild(sizeContainer);

  sizeOptions.forEach(option => {
    const radioLabel = document.createElement('label');
    radioLabel.className = 'radio-label';

    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'size';
    radioInput.value = option.value;
    radioInput.checked = option.value === selectedSize; // Set medium as default
    radioInput.onchange = () => {
      selectedSize = option.value;
    };

    radioLabel.appendChild(radioInput);
    radioLabel.appendChild(document.createTextNode(option.label));
    sizeContainer.appendChild(radioLabel);
  });

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Create Node';
  submitButton.className = 'modal-button submit-button';
  submitButton.onclick = () => {
    handleSubmit(nameInput.value, extensionSelect.value);
    document.body.removeChild(modal);
  };
  modalContent.appendChild(submitButton);

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'modal-button cancel-button';
  cancelButton.onclick = () => {
    document.body.removeChild(modal);
  };
  modalContent.appendChild(cancelButton);
}

async function handleSubmit(name, extension) {
  enteredName = name;
  selectedExtension = extension;

  if (enteredName) {
    // Generate the link based on the entered name and selected extension
    generatedLink = `obsidian://advanced-uri?vault=Obsidian%20Vault&filepath=Graph%2520Nodes%252F${encodeURIComponent(
      enteredName
    )}${selectedExtension}`;
    console.log('Entered name:', enteredName);
    console.log('Generated link:', generatedLink);
    await createShapeAndText();
    openCreatedLink();
  } else {
    alert('Please enter a name.');
  }
}

// Function to send a POST request to open the last link
function openCreatedLink() {
  if (generatedLink) {
    sendPostRequest(createData(generatedLink));
  } else {
    console.log('No link to open.');
  }
}

console.log('Dropdown menu with options added to the page.');
