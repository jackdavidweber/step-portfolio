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
import java.util.Collections;
import java.util.Iterator;
import java.util.Arrays;
import java.util.ArrayList; // import the ArrayList class
import java.util.Set;


public final class FindMeetingQuery {    
  ArrayList<TimeRange> options;

  /*Returns true if the time slot is a possible option with respect to duration*/
  public boolean slotPossibleDuration(MeetingRequest request, int startSlot, int endSlot){
      return (request.getDuration() <= (endSlot - startSlot));
  }

  public boolean conflictIsRelevant(Event conflict, Collection meetingAttendees){
    Set<String> conflictAttendees = conflict.getAttendees();
    // Collection<String> meetingAttendees = request.getAttendees();

    // returns true if the two sets have at least one attendee in common
    return !(Collections.disjoint(conflictAttendees, meetingAttendees));
  }

  public boolean conflictIsOptionallyRelevant(Event conflict, MeetingRequest request){
    Set<String> conflictAttendees = conflict.getAttendees();
    Collection<String> optionalAttendees = request.getOptionalAttendees();

    // returns true if the two sets have at least one optional attendee in common
    return !(Collections.disjoint(conflictAttendees, optionalAttendees));  }

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

    Collection attendees = request.getAttendees();
    Collection optionalAttendees = request.getOptionalAttendees();

    // if no attendees or optional attendees return collection of one item being the full day
    if (attendees.isEmpty() && optionalAttendees.isEmpty()){
        optionsCollection = Arrays.asList(TimeRange.WHOLE_DAY);
        return optionsCollection;
    
    // if there are optional attendees but no attendees, treat optional attendees as attendees
    } else if (attendees.isEmpty()){
        attendees = optionalAttendees;
    }

    Iterator<Event> eventsIterator =  events.iterator();

    // if no events return full day
    if(!eventsIterator.hasNext()){
        optionsCollection = Arrays.asList(TimeRange.WHOLE_DAY);
        return optionsCollection;
    }

    // now we know that there is at least one event
    Event conflict = eventsIterator.next();
    int start;

    // check if conflict involves anybody in the request. If it does NOT, we can effectively ignore the conflict.
    if(!conflictIsRelevant(conflict, attendees)){  // if conflict is NOT relevant...
        start = TimeRange.START_OF_DAY;
    } else{
        // we now have to pay attention to the conflict
        start = conflict.getWhen().end();

        // check if conflict is NOT at the start of day. if it is not, we know we can add option before it (duration permitting).
        if (!(conflict.getWhen().contains(TimeRange.START_OF_DAY))){
            // check duration
            if(slotPossibleDuration(request, TimeRange.START_OF_DAY, conflict.getWhen().start())){
                options.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, conflict.getWhen().start(), false));
            }
        } 
    }
    while(eventsIterator.hasNext()){
        Event prevConflict = conflict;
        conflict = eventsIterator.next();

        // if previous conflict end is after curren conflict end, replace current conflict with previous conflict
        if (prevConflict.getWhen().end() > conflict.getWhen().end()){
            conflict = prevConflict;
        }

        // if conflict is relevant to attendees OR (there already is a viable time AND conflict is relevant to optional attendees)
        if(conflictIsRelevant(conflict, attendees) || (!options.isEmpty() && conflictIsOptionallyRelevant(conflict, request))){

            // check duration
            if(slotPossibleDuration(request, start, conflict.getWhen().start())){
                TimeRange slot = TimeRange.fromStartEnd(start, conflict.getWhen().start(), false);

                // add the timerange between the end of the last event and the start of the current event
                options.add(slot);
            }

            // set the start for the next option
            start = conflict.getWhen().end();
        }
    }

    // check if last conflict is not relevant. If not, add option btwn last conflict and end of day
    if(!conflictIsRelevant(conflict, attendees)){
        options.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
        return options;
    }

    // check if last conflict is at end of day. If NOT, can add option btwn last conflict and end of day.
    if(!(conflict.getWhen().contains(TimeRange.END_OF_DAY))){
        // check duration
        if(slotPossibleDuration(request, start, TimeRange.END_OF_DAY)){
            options.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
        }
    }
    return options;
  }
}
