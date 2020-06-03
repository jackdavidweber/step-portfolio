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
      testimonialsListElement.appendChild(createTestimonialElement(arrTestimonials[i], "authorName", "titleName"));
  }

  const numTestimonialsElement = document.getElementById('numTestimonials');
  numTestimonialsElement.innerHTML = "<p>Number of Testimonials Visible: "+ arrTestimonials.length.toString() + "</p>"
}

/** Creates an <li> element containing text. */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

function createTestimonialElement(text, author, title){
    //set up block quote
    testimonialElement = `
        <blockquote class="quote">
            <p><i class="fas fa-quote-left"></i>
        `;
    
    //add testimonial text
    testimonialElement += text + '</p></blockquote>';
    
    //author attribution
    testimonialElement += '<p class="source"><span class="name">' + author + "</span>";

    //author title
    testimonialElement += '<br /><span class="title">' + title + '</span></p>'

    testimonialElementDiv = document.createElement('div');
    testimonialElementDiv.innerHTML = testimonialElement;

    return testimonialElementDiv;
}
