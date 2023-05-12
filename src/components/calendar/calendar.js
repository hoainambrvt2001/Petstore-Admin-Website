import React, { useEffect, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Router from "next/router";




function Calendar({ reservations }) {
  const [hoveredEventId, setHoveredEventId] = useState(null);

  const statusColor = {
    BOOKED: '#FFB020',
    SUCCESS: '#14B8A6',
    CANCELLED: '#D14343',
  }
  const statusTitle = {
    BOOKED: "Booked",
    CANCELLED: "Cancelled",
    SUCCESS: "Success",
  }
  const handleEventClick = (eventInfo) => {
    const { event } = eventInfo;
    const { url } = event.extendedProps;

    // Navigate to the desired URL
    Router.push(url);
  };
  const handleEventMouseEnter = (arg) => {
    setHoveredEventId(arg.event.id);
  };

  const handleEventMouseLeave = () => {
    setHoveredEventId(null);
  };



  const styles = {
    hoveredEvent: {
      backgroundColor: 'lightblue',
      cursor: 'pointer',
    },
    eventTitle: {
      whiteSpace: 'normal', // Allow wrapping to next line
      overflow: 'hidden', // Hide any overflow beyond the container
      textOverflow: 'ellipsis', // Show an ellipsis (...) when the text overflows
      maxHeight: '2.4em', // Set the maximum height for two lines
      lineHeight: '1.2em', // Set the line height for proper spacing
    },
  };
  // const events = reservations.map ((reservation)=>({
  //   id: `${reservation._id}`,
  //   title: `${reservation.reservationHour.name} - ${reservation.serviceType.name}`,
  //   date: `${reservation.reservationDate.slice(0, 10)}`,
  //   color: statusColor[reservation.status],
  //   extendedProps:{
  //     url: `/reservations/edit/${reservation._id}?isEdited=false`
  //   }
  // }))
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = a.reservationDate.slice(0, 10);
    const dateB = b.reservationDate.slice(0, 10);
    const hourA = a.reservationHour.time;
    const hourB = b.reservationHour.time;
    if (dateA !== dateB) {
      return new Date(dateA) - new Date(dateB);
    } else {
      return hourA - hourB;
    }
  });


  const events = sortedReservations.map((reservation) => {
    const reservationDate = reservation.reservationDate.slice(0, 10); // Get the reservation date
    const reservationTime = reservation.reservationHour.timeFrame; // Get the reservation time

    // Combine the reservation date and time into a single Date object
    const dateTime = new Date(`${reservationDate}T${reservationTime}`);
    console.log(dateTime);
    return {
      id: `${reservation._id}`,
      title: `${reservation.reservationHour.name} - ${reservation.serviceType.name}`,
      date: dateTime,
      color: statusColor[reservation.status],
      textColor: `white`,
      extendedProps: {
        url: `/reservations/edit/${reservation._id}?isEdited=false`,
      },
    };
  });

  return <div>
    <Fullcalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={'dayGridMonth'}
      headerToolbar={{
        start: 'today prev,next',
        center: 'title',
        end: 'dayGridMonth timeGridWeek timeGridDay'
      }}
      height={'90vh'}
      events={events}

      eventClick={handleEventClick} // Attach the eventClick callback
      eventMouseEnter={handleEventMouseEnter} // Attach the eventMouseEnter callback
      eventMouseLeave={handleEventMouseLeave} // Attach the eventMouseLeave callback
      eventContent={(arg) => (
        <div
          className={`fc-content ${arg.event.id === hoveredEventId ? 'hovered-event' : ''}`}
          style={{
            backgroundColor: arg.event.backgroundColor,
            color: arg.event.textColor,
            ...(arg.event.id === hoveredEventId ? styles.hoveredEvent : {}),
          }}
        >
          <div style={styles.eventTitle}>{arg.event.title}</div>
        </div>
      )}

    />



  </div>
}

export default Calendar;
