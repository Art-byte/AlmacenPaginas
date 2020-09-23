const linksSection = document.querySelector(".links");
const errorMessage = document.querySelector(".error-message");
const newLinkForm = document.querySelector(".new-link-form");
const newLinkUrl = document.querySelector(".new-link-url");
const newLinkButton = document.querySelector(".new-link-button");
const clearStorageButton = document.querySelector(".clear-storage");


/*************          DOM           **************/
const parse = new DOMParser();
const {shell} = require('electron');


const parserResponse = text =>{
    return parse.parseFromString(text, "text/html");
}

const findTitle=(node)=>{
    return node.querySelector('title').innerText;
}

const storeLink=(title, url)=>{
    localStorage.setItem(url, JSON.stringify({title,url}));
}

const getLinks = () =>{
    return Object.keys(localStorage)
            .map(key => JSON.parse(localStorage.getItem(key)));
}

const createElements = link =>{
    return `    <div>
        <h2>${link.title}</h2>
        <p>
            <a href=${link.url}>${link.url}</a>
        </p>
    </div>`;
}

const renderLinks = () =>{
    const linksElements = getLinks().map(createElements).join('');
    linksSection.innerHTML = linksElements;
}

const clearForm =()=>{
    newLinkUrl.value = null;
}

const handelError = (err, url)=>{
    errorMessage.innerHTML = `
    Error al agregar "${url}" : ${err.message}`.trim();
    setInterval(() =>{
        errorMessage.innerHTML = null;
    }, 5000);
}






/*************          Eventos           **************/
renderLinks();

newLinkUrl.addEventListener('keyup', () =>{
    //Valida si el tipo de entrada coincide con el objetivo del formulario
    newLinkButton.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const url = newLinkUrl.value;
    try{
        const res = await fetch(url); //peticion get sobre navegador
        const texto = await res.text();
        const document = parserResponse(texto);
        const title = findTitle(document);
        storeLink(title,url);
        clearForm();
        renderLinks();

    }catch(e){
        handelError(e, url);
    }

});

clearStorageButton.addEventListener('click', () =>{
    localStorage.clear();
    linksSection.innerHTML = ''; 
});


linksSection.addEventListener('click', (e) =>{
    if(e.target.href){
        e.preventDefault();
        shell.openExternal(e.target.href);
    }
});