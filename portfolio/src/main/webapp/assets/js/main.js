$(window).on('load', function() {

    $('.level-bar-inner').each(function() {
    
        var itemWidth = $(this).data('level');
        
        $(this).animate({
            width: itemWidth
        }, 800);
        
    });

});


jQuery(document).ready(function($) {


    /*======= Skillset *=======*/
    
    $('.level-bar-inner').css('width', '0');
    
    
    
    /* Bootstrap Tooltip for Skillset */
    $('.level-label').tooltip();
    
    
    /* jQuery RSS - https://github.com/sdepold/jquery-rss */
    
    $("#rss-feeds").rss(
    
        //Change this to your own rss feeds
        "https://feeds.feedburner.com/TechCrunch/startups",
        
        {
        // how many entries do you want?
        // default: 4
        // valid values: any integer
        limit: 3,
        
        // the effect, which is used to let the entries appear
        // default: 'show'
        // valid values: 'show', 'slide', 'slideFast', 'slideSynced', 'slideFastSynced'
        effect: 'slideFastSynced',
        
        // will request the API via https
	    // default: false
	    // valid values: false, true
	    ssl: true,
        
        // outer template for the html transformation
        // default: "<ul>{entries}</ul>"
        // valid values: any string
        layoutTemplate: "<div class='items'>{entries}</div>",
        
        // inner template for each entry
        // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
        // valid values: any string
        entryTemplate: '<div class="item"><h3 class="title"><a href="{url}" target="_blank">{title}</a></h3><div><p>{shortBodyPlain}</p><a class="more-link" href="{url}" target="_blank"><i class="fas fa-external-link-alt"></i>Read more</a></div></div>'
        
        }
    );
    
    /* Github Activity Feed - https://github.com/caseyscarborough/github-activity */
    GitHubActivity.feed({ username: "jackdavidweber", selector: "#ghfeed" });

});


async function getTestimonials() {
  const response = await fetch('/data');
  const result = await response.json();
  
  arrTestimonials = result["arrTestimonials"];

  const testimonialsListElement = document.getElementById('testimonials');
  testimonialsListElement.innerHTML = '';

  for (let i = 0; i < arrTestimonials.length; i++) {
      testimonialsListElement.appendChild(createTestimonialElement(arrTestimonials[i], googleProfile.getName(), "titleName"));
  }

  const numTestimonialsElement = document.getElementById('numTestimonials');
  numTestimonialsElement.innerHTML = "<p>Number of Testimonials Visible: "+ arrTestimonials.length.toString() + "</p>"
}

/** Create testimonial html element using the testimonial text,
author and title of the author. */
function createTestimonialElement(text,author,title){
    // create elements within block quote	
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
    testimonialElementDiv = document.createElement('div');
    testimonialElementDiv.appendChild(blockQuoteElement);
    testimonialElementDiv.appendChild(paragraphElement);

    return testimonialElementDiv;
}

// sign in through google example
function onSignIn(googleUser) {
  googleProfile = googleUser.getBasicProfile();
  console.log('ID: ' + googleProfile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + googleProfile.getName());
  console.log('Image URL: ' + googleProfile.getImageUrl());
  console.log('Email: ' + googleProfile.getEmail()); // This is null if the 'email' scope is not present.
}