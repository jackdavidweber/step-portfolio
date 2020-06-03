// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random quote to the page.
 */
function addRandomQuote() {
  const officeQuotes = [
      '“Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.” – Michael Scott',
      '“I’m not superstitious, but I am a little stitious.” – Michael Scott',
      '“And I knew exactly what to do. But in a much more real sense, I had no idea what to do.” – Michael Scott',
      '"You miss 100% of the shots you dont take. - Wayne Gretsky" - Michael Scott',
    ];

  // Pick a random quote.
  const quote = officeQuotes[Math.floor(Math.random() * officeQuotes.length)];

  // Add quote to the page.
  const quoteContainer = document.getElementById('quote-container');
  quoteContainer.innerText = quote;
}

console.log("hello world");

async function getRandomQuoteUsingAsyncAwait() {
  const response = await fetch('/data');
  const quote = await response.text();
  document.getElementById('fetchTutorial').innerText = quote;
}


/**
 * Fetches comments from the servers and adds them to the DOM.
 */
function getCommentsold() {
  fetch('/data').then(response => response.json()).then((comments) => {
    // comments is an object, not a string, so we have to
    // reference its fields to create HTML content
    console.log(comments);
    const commentsArr = JSON.parse(comments);


    const commentsListElement = document.getElementById('comments');
    commentsListElement.innerHTML = '';
    commentsListElement.appendChild(createListElement(commentsArr[0]));
    
  });
}

async function getComments() {
  const response = await fetch('/data');
  const commentsArr = await response.json();

  const commentsListElement = document.getElementById('comments');
  commentsListElement.innerHTML = '';

  for (var i = 0; i < commentsArr.length; i++) {
      commentsListElement.appendChild(createListElement(commentsArr[i]));

  }

  const numCommentsElement = document.getElementById('numComments');
  numCommentsElement.innerHTML = "<p>Number of Comments Visible: "+ commentsArr.length.toString() + "</p>"


}

/** Creates an <li> element containing text. */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}