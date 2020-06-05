package com.google.sps.servlets;

import java.util.ArrayList;

public class Testimonials { 
   private ArrayList<Testimonial> arrTestimonials; 

   public Testimonials(){} 
   
   public ArrayList<Testimonial> getArrTestimonials() { 
      return arrTestimonials; 
   }
   
   public void addTestimonial(String text, String name, String title) { 
      Testimonial newTestimonial = new Testimonial(text, name, title); 
      arrTestimonials.add(newTestimonial);
   }
   
   public void setArrTestimonials(ArrayList<Testimonial> arrTestimonials) { 
      this.arrTestimonials = arrTestimonials; 
   } 
   
   public String toString() { 
      return "Testimonials [ arrTestimonials: "+arrTestimonials+",]"; 
   }  
}
