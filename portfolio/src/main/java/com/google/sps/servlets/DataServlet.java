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

package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.Gson;

//datastore imports
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

//query imports
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

//google auth imports
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

//jsonfactory
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;

//HTTP transport
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;

//collections
import java.util.Collections;


/** Servlet that returns some example content. TODO: modify this file to handle testimonials data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  private int maxTestimonials = 3;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Testimonial").addSort("timestamp", SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    
    ArrayList<String> arrTestimonials = new ArrayList<>();
    System.out.println(results.asIterable());
    for (Entity entity : results.asIterable()) {
      String testimonial = (String) entity.getProperty("testimonial");
      arrTestimonials.add(testimonial);
    }

    Testimonials testimonials = new Testimonials();
    testimonials.setArrTestimonials(arrTestimonials.size() < maxTestimonials ? arrTestimonials : new ArrayList(arrTestimonials.subList(0,maxTestimonials)));

    Gson gson = new Gson();    
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(testimonials));
  }

@Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String text = getParameter(request, "userTestimonial", "");
    String idTokenString = request.getParameter("idTokenString");
    String idTokenString = null;


    long timestamp = System.currentTimeMillis();
    maxTestimonials = getMaxTestimonialsChoice(request);

    // Set up Testimonial entity and add timestamp and testimonial text
    Entity testimonialEntity = new Entity("Testimonial");
    testimonialEntity.setProperty("timestamp", timestamp);
    testimonialEntity.setProperty("testimonial", text);


    // Initialize Google Verifier
    JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
    HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(httpTransport, jsonFactory)
        // Specify the CLIENT_ID of the app that accesses the backend:
        .setAudience(Collections.singletonList("404214930329-3kkfj6agqjgfmdvfmk3dmm131bb5p1ob.apps.googleusercontent.com"))
        // Or, if multiple clients access the backend:
        //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
        .build();
     
    // Verify User through Google and store Information
    GoogleIdToken idToken = verifier.verify(idTokenString);
    if (idToken != null) {
        Payload payload = idToken.getPayload();

        // Print user identifier
        String userId = payload.getSubject();
        System.out.println("User ID: " + userId);

        // Get profile information from payload
        String email = payload.getEmail();
        boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");
        String locale = (String) payload.get("locale");
        String familyName = (String) payload.get("family_name");
        String givenName = (String) payload.get("given_name");

        // store profile information
        testimonialEntity.setProperty("userID", userID);
        testimonialEntity.setProperty("email", email);
        testimonialEntity.setProperty("name", name);
        testimonialEntity.setProperty("locale", locale);
    } else {
        System.out.println("Invalid ID token.");
    }

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(testimonialEntity);
    
    response.sendRedirect("/index.html");
  }


  /**  Returns the choice entered by the user, or -1 if the choice was invalid. */
  private int getMaxTestimonialsChoice(HttpServletRequest request) {
    String testimonialChoiceString = request.getParameter("max-testimonials");

    // Convert the input to an int.
    int testimonialChoice;
    try {
      testimonialChoice = Integer.parseInt(testimonialChoiceString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + testimonialChoiceString);
      return maxTestimonials;
    }

    // Check that the input is greater than 1.
    if (testimonialChoice < 1) {
      System.err.println("User choice is out of range: " + testimonialChoiceString);
      return maxTestimonials;
    }

    return testimonialChoice;
    }

  /**
   * @return the request parameter, or the default value if the parameter
   *         was not specified by the client
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }
}
