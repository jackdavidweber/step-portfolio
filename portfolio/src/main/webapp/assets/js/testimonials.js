async function getTestimonials() {
  const response = await fetch('/data');
  const arrTestimonials = await response.json();
  
  const testimonialsListElement = document.getElementById('testimonials');
  testimonialsListElement.innerHTML = '';

  for (let i = 0; i < arrTestimonials.length; i++) {
      testimonialsListElement.appendChild(createTestimonialElement(arrTestimonials[i]["text"], arrTestimonials[i]["name"], arrTestimonials[i]["title"]));
  }
}

function createTestimonialElement(text,author,title){
    // // create elements within block quote	
    const blockQuoteParagraphElement = document.createElement('p');	
    const iTagElement = document.createElement('i');
    iTagElement.setAttribute("class","fas fa-quote-left");
    const blockQuoteText = document.createTextNode(text);

    // create block quote wrapper and add all elements to it
    const blockQuoteElement = document.createElement('blockquote');
    blockQuoteElement.setAttribute("class", "quote");
    blockQuoteParagraphElement.appendChild(iTagElement);
    blockQuoteParagraphElement.appendChild(blockQuoteText);
    blockQuoteElement.appendChild(blockQuoteParagraphElement);

    // create span elements within author attribution
    const authorSpanElement = document.createElement("span");
    authorSpanElement.setAttribute("class","name");
    authorSpanElement.appendChild(document.createTextNode(author));
    const titleSpanElement = document.createElement("span");
    titleSpanElement.setAttribute("class","title");
    titleSpanElement.appendChild(document.createTextNode(title));
    
    //add span and other elements to paragraph element in author attribution
    const paragraphElement = document.createElement('p');
    paragraphElement.setAttribute("class","source");	
    paragraphElement.appendChild(authorSpanElement);
    paragraphElement.appendChild(document.createElement('br'));
    paragraphElement.appendChild(titleSpanElement);

    // wrap elements into a div and return
    testimonialElementLi = document.createElement('li');
    testimonialElementLi.appendChild(blockQuoteElement);
    testimonialElementLi.appendChild(paragraphElement);

    return testimonialElementLi;
}

function filterFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("filterInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("testimonialUl");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        blockQuote = li[i].getElementsByTagName("blockquote")[0];
        p = blockQuote.getElementsByTagName("p")[0];
        txtValue = p.textContent || p.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function startListening(){
    annyang.resume();
}

function stopListening(){
    annyang.pause();
}

function initializeVoiceControl(){
    if (annyang) {
        var typeThis = function(spoken){
            // OPTION A Works when going back and forth between typing and voice
            var textElement = document.getElementById('text');
            textElement.value += spoken;
        }

        // Define commands using wildcard notation
        var commands = {
            '*spoken': typeThis
        };

        // Add  commands to annyang
        annyang.addCommands(commands);

        // this initializes annyang but does not start truly listening until it is unpaused
        annyang.start({paused: true});

        // only want voice button to appear if annyang is working
        renderVoiceButton();
    }
}

function renderVoiceButton(){
    const voiceDiv = document.getElementById("voiceButton");
    const buttonElement = document.createElement('button');
    buttonElement.setAttribute("type", "button");
    buttonElement.setAttribute("onmousedown", "startListening()");
    buttonElement.setAttribute("onmouseup","stopListening()");
    buttonElement.appendChild(document.createTextNode("Voice to Text"));
    voiceDiv.appendChild(buttonElement);
}

function pageLoad(){
    getTestimonials();
    initializeVoiceControl();
}