package com.google.sps.servlets; // is this okay?

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