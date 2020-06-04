package com.google.sps.servlets;

import java.util.ArrayList;

public class Testimonials { 
   private ArrayList<String> arrTestimonials; 

   public Testimonials(){} 
   
   public ArrayList<String> getArrTestimonials() { 
      return arrTestimonials; 
   }
   
   public void setArrTestimonials(ArrayList<String> arrTestimonials) { 
      this.arrTestimonials = arrTestimonials; 
   } 
   
   public String toString() { 
      return "Testimonials [ arrTestimonials: "+arrTestimonials+",]"; 
   }  
}

class innerObj {
    private String testimonial;
    private String name;
    private String title;
}