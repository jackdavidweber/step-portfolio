package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Returns bigfoot data as a JSON object, e.g. {"2017": 52, "2018": 34}] */
@WebServlet("/climbing-data")
public class ClimbingDataServlet extends HttpServlet {

  private LinkedHashMap<Integer, Integer> climbingParticipation = new LinkedHashMap<>();

  @Override
  public void init() {
    Scanner scanner = new Scanner(getServletContext().getResourceAsStream(
        "/WEB-INF/usaClimbingParticipationByYear.csv"));
    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");

      Integer year = Integer.valueOf(cells[0]);
      Integer sightings = Integer.valueOf(cells[1]);

      climbingParticipation.put(year, sightings);
    }
    scanner.close();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(climbingParticipation);
    response.getWriter().println(json);
  }
}