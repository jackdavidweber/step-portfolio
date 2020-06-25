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
    const stringArray = [];
    for (i = 0; i < li.length; i++) {
        blockQuote = li[i].getElementsByTagName("blockquote")[0];
        p = blockQuote.getElementsByTagName("p")[0];
        txtValue = p.textContent || p.innerText;
        stringArray.push(txtValue.toUpperCase());
        
        // set all of the list items to disapear so that they can be made to reapear later
        li[i].style.display = "none";
    }

    // TODO: give user feedback that only one term is supported https://github.com/jackdavidweber/step-portfolio/pull/26#discussion_r443534422
    const matches = distanceOfArr(stringArray, filter, 2)

    // make matches re-appear
    for (let i=0; i < matches.length; i++){
        li[matches[i].arrIndex].style.display = "";
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
    const dp = [];
    
    // create first row representing edit distance of empty vs w2
    const r1 = []
    for(let i=0; i<w2.length+1; i++){
      r1.push(i);
    }
    
    // add first row to dp table
    dp.push(r1);

    // Fill in remaining rows TODO: optimize to O(N) rather than O(N^2)
    for(let i=1; i < w1.length+1; i++){
        let row = [i];
        for(j=0; j<w2.length; j++){
          row.push(null);
        }
        dp.push(row);
    }
    return dp;
}

/**
 * Uses dynamic programming table to compute the minimum edit distance between two strings.
 * DP table is 2D with the minimum edit distance in the bottom right corner.
 */
function findEditDistance(w1,w2){
  const dp = buildInitialTable(w1,w2);

  for(let j=1; j<dp.length; j++){
    for(let k=1; k<dp[j].length; k++){

      // if character in w1 matches character in w2 give current cell same value as diagonal
      if(w1[j-1] == w2[k-1]){
        dp[j][k]=dp[j-1][k-1];
      // otherwise give current cell value = 1 + minimum (diagonal, top, left)
      } else {
        let diagonal = dp[j-1][k-1];
        let above = dp[j-1][k];
        let left = dp[j][k-1];
        dp[j][k] = 1 + Math.min(diagonal, above, left);
      }
    }
  }

  // return bottom right corner as the edit distance btwn w1 and w2
  return(dp[dp.length-1][dp[0].length-1]);
}

/** Takes array of strings and a term. Returns an array of objects 
 *  maxED specifies the string with maximum edit distance to the term to be included in the returned array.
 *  Note that for this purpose, edit distance refers to the minimum edit distance of a word in the string
 *  TODO: sorted by their edit distance to the term. Where first item in the array has the lowest edit distance.

 */
function distanceOfArr(arrSentences, term, maxED){
  let tracker = 0
  let retArray = []
  for (const sentence of arrSentences){
    let ed = minEditDistanceWord(sentence, term)
    if(ed < maxED){
      retArray.push({"sentence": sentence, "editDistance": ed, "arrIndex": tracker});
      tracker++;
    }
  }
  return retArray;
}

/** Takes a sentence and returns the minimum edit distance of a word in the sentence to the term */
function minEditDistanceWord(sentence, term){
  const arrOfWords = sentence.split(" ");

  let minEditDistance = Infinity;
  for (const word of arrOfWords){
    minEditDistance = Math.min(minEditDistance, findEditDistance(word, term));
  }

  return minEditDistance
}