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

/** Servlet that returns some example content. TODO: modify this file to handle testimonials data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  private int maxTestimonials = 3;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Testimonial").addSort("timestamp", SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    
    ArrayList<Testimonial> arrTestimonials = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      String text = (String) entity.getProperty("text");
      String name = (String) entity.getProperty("name");
      String title = (String) entity.getProperty("title");
      Testimonial newTestimonial = new Testimonial(text, name, title);
      arrTestimonials.add(newTestimonial);
    }

    Gson gson = new Gson();    
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(arrTestimonials));
  }

@Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String text = getParameter(request, "text", "");
    String name = getParameter(request, "name", "");
    String company = getParameter(request, "company", "");
    String title = getParameter(request, "title", "");
    String combinedTitle = company + ", " + title;
    
    long timestamp = System.currentTimeMillis();

    // prevents blank testimonials from being added
    if (text.length() > 0){
        Entity testimonialEntity = new Entity("Testimonial");
        testimonialEntity.setProperty("text", text);
        testimonialEntity.setProperty("name", name);
        testimonialEntity.setProperty("title", combinedTitle);
        testimonialEntity.setProperty("timestamp", timestamp);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(testimonialEntity);
    }
    response.sendRedirect("/index.html");
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
