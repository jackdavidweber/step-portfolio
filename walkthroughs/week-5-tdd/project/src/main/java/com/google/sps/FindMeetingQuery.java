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

package com.google.sps;

import java.util.Collection;
import java.util.Iterator;
import java.util.Arrays;
import java.util.ArrayList; // import the ArrayList class



public final class FindMeetingQuery {    
  ArrayList<TimeRange> options;

  /*Returns true if the time slot is a possible option with respect to duration*/
  public boolean slotPossibleDuration(MeetingRequest request, int startSlot, int endSlot){
      return (request.getDuration() <= Math.abs(endSlot - startSlot));
  }


  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    // Create collection of timeranges representing options for meeting
    Collection<TimeRange> optionsCollection;
    options = new ArrayList<TimeRange>(); 
    
    // check if duration is longer than the day. if so, return empty collection.
    long duration = request.getDuration();
    if (duration > TimeRange.WHOLE_DAY.duration()){
        optionsCollection = Arrays.asList();
        return optionsCollection;
    }

    // check if no attendees. if so, return collection of one item being the full day
    Collection attendees = request.getAttendees();
    if (attendees.isEmpty()){
        optionsCollection = Arrays.asList(TimeRange.WHOLE_DAY);
        return optionsCollection;
    }

    Iterator<Event> eventsIterator =  events.iterator();

    // if no events return full day
    if(!eventsIterator.hasNext()){
        optionsCollection = Arrays.asList(TimeRange.WHOLE_DAY);
        return optionsCollection;
    }

    // asuming events contains at least one event
    Event conflict = eventsIterator.next();
    System.out.println(conflict);
    int start = conflict.getWhen().end();

    // check if conflict is NOT at the start of day. if it is not, we know we can add option before it (duration permitting).
    TimeRange conflictTR = conflict.getWhen();
    if (!(conflictTR.contains(TimeRange.START_OF_DAY))){
        if(slotPossibleDuration(request, TimeRange.START_OF_DAY, conflict.getWhen().start())){
            options.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, conflict.getWhen().start(), false));
        }
    } 

    while(eventsIterator.hasNext()){
        // add the timerange between the end of the last event and the start of the current event
        conflict = eventsIterator.next();
        if(request.getDuration() <= conflict.getWhen().start() - start){
            options.add(TimeRange.fromStartEnd(start, conflict.getWhen().start(), false));
        }
        // set the start for the next option
        start = conflict.getWhen().end();
    }

    // check if last conflict is at end of day. If NOT, can add option btwn last conflict and end of day.
    if(!(conflict.getWhen().contains(TimeRange.END_OF_DAY))){
        if(slotPossibleDuration(request, start, TimeRange.END_OF_DAY)){
            options.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
        }
    }

    System.out.println(options);
    return options;

    // throw new UnsupportedOperationException("TODO: Implement this method.");
    

    

  }
}
