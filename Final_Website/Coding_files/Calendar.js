document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date(); // Keep track of the date being displayed

    function generateCalendar(date) {
        const calendarGrid = document.querySelector('.calendar-grid');
        const eventDetailsContainer = document.querySelector('.events-details');
        const monthYearText = document.getElementById('month-display');

        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const today = new Date();

        const months = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
        
        monthYearText.innerText = `${months[monthIndex]} ${year}`;

        // Find month details
        const firstDay = new Date(year, monthIndex, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        // Clear the grid and add names
        calendarGrid.innerHTML = `
            <div class="day-name">Mo</div><div class="day-name">Tu</div><div class="day-name">We</div>
            <div class="day-name">Th</div><div class="day-name">Fr</div><div class="day-name">Sa</div><div class="day-name">Su</div>
        `;

        // Empty boxes at the start
        for (let i = 0; i < startOffset; i++) {
            calendarGrid.innerHTML += `<div class="day empty" style="background: transparent;"></div>`;
        }

        let monthEvents = [];

        // List of possible events with icons and colors
        const possibleEvents = [
            { title: "Farm Activity", description: "Come enjoy the day on the farm!", icon: "🚜", color: "#6a417e" },
            { title: "Flower Exhibition", description: "See the most beautiful bouquets and décor.", icon: "🌸", color: "#c190d5" },
            { title: "Coffee & Cake Day", description: "Taste fresh pastries and local coffee.", icon: "☕", color: "#f8a861" },
            { title: "Wedding Inspiration", description: "Ideas for wedding décor and bouquets.", icon: "💍", color: "#ff4d4d" },
            { title: "Family Festival", description: "Bring the kids for games and fun.", icon: "🎉", color: "#4CAF50" }
        ];

        // Loop through each day
        for (let day = 1; day <= daysInMonth; day++) {
            let className = "day";
            
            // Is it today?
            if (day === today.getDate() && monthIndex === today.getMonth() && year === today.getFullYear()) {
                className += " today";
            }

            // Simulate events on certain days
            let isEvent = (day % 9 === 0 || day === 15 || day === 22);
            if (isEvent) {
                className += " event";
                const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
                monthEvents.push({ day: day, ...randomEvent });
            }

            calendarGrid.innerHTML += `<div class="${className}">${day}</div>`;
        }

        // Update the list next to the calendar
        eventDetailsContainer.innerHTML = `<h3>Events for ${months[monthIndex]}</h3>`;
        if (monthEvents.length === 0) {
            eventDetailsContainer.innerHTML += `<p>No events for this month.</p>`;
        } else {
            monthEvents.forEach(e => {
                eventDetailsContainer.innerHTML += `
                    <div class="event-item" style="display: flex; gap: 15px; background: rgba(243, 232, 255, 0.4); padding: 12px; border-radius: 15px; margin-bottom: 10px; border-left: 5px solid ${e.color};">
                        <span class="event-date" style="font-weight: bold; color: ${e.color};">${e.icon} ${e.day} ${months[monthIndex].substring(0,3)}</span>
                        <div class="event-info">
                            <h4 style="margin: 0;">${e.title}</h4>
                            <p style="margin: 0; font-size: 0.9rem;">${e.description}</p>
                        </div>
                    </div>
                `;
            });
        }
    }

    // Button events for navigation
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });

    // Start with the current month
    generateCalendar(currentDate);
});
