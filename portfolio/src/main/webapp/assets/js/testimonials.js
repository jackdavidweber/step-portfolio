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
        const typeThis = function(spoken){
            // OPTION A Works when going back and forth between typing and voice
            let textElement = document.getElementById('text');
            textElement.value += spoken;
        }

        // Define commands using wildcard notation
        const commands = {
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

function onPageLoad(){
    getTestimonials();
    initializeVoiceControl();
}

/** Takes two words and builds/returns the starting DP table to work with */
function buildInitialTable(w1, w2){
    // create 2d matrix dp table using array of arrays
    dp = [];
    
    // create first row representing edit distance of empty vs w2
    r1 = []
    for(i=0; i<w2.length+1; i++){
      r1.push(i);
    }
    
    // add first row to dp table
    dp.push(r1);

    // Fill in remaining rows TODO: optimize to O(N) rather than O(N^2)
    for(i=1; i < w1.length+1; i++){
        row = [i];
        for(j=0; j<w2.length; j++){
          row.push(null);
        }
        dp.push(row);
    }
    return dp;
}

function findEditDistance(w1,w2){
  dp = buildInitialTable(w1,w2);

  for(j=1; j<dp.length; j++){
    for(k=1; k<dp[j].length; k++){

      // if character in w1 matches character in w2 give current cell same value as diagnol
      if(w1[j-1] == w2[k-1]){
        dp[j][k]=dp[j-1][k-1];
        
      // otherwise give current cell value = 1 + minimum (diagnol, top, left)
      } else {
        diagnol = dp[j-1][k-1];
        above = dp[j-1][k];
        left = dp[j][k-1];
        dp[j][k] = 1 + Math.min(diagnol, above, left);
      }
    }
  }

  // console.log readable DP
  for(i=0; i<dp.length; i++ ){
    console.log(dp[i]);
  }

  // return bottom right corner as the edit distance btwn w1 and w2
  return(dp[dp.length-1][dp[0].length-1]);
}
