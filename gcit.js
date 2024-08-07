import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Create a single Supabase client for interacting with your database
const supabase = createClient('https://xfvagueuvegsjvekkaga.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmFndWV1dmVnc2p2ZWtrYWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMjg1ODcsImV4cCI6MjAzNzcwNDU4N30.XKEergITkwL2fNLVpnV07-Ryn3ZasS5ebj3SslhDj7w');




function initializeZoomAndPan() {
    const svg = document.querySelector('#map-container svg');
    const container = document.getElementById('map-container');

    let isDragging = false;
    let startX, startY;

    // Set initial transformation values
    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    // Update SVG transform based on scale and translation
    function updateTransform() {
        svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Add room numbers based on inkscape:label
    function addRoomNumbers() {
        const paths = svg.querySelectorAll('path');
        paths.forEach(path => {
            const label = path.getAttribute('inkscape:label');
            if (label) {
                const bbox = path.getBBox();
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', bbox.x + bbox.width / 2);
                text.setAttribute('y', bbox.y + bbox.height / 2);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.textContent = label;
                svg.appendChild(text);
            }
        });
    }

    // Mouse down event for panning
    svg.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX - translateX;
        startY = event.clientY - translateY;
        container.style.cursor = 'grabbing';
    });

    // Mouse move event for panning
    container.addEventListener('mousemove', (event) => {
        if (isDragging) {
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
            updateTransform();
        }
    });

    // Mouse up event to stop panning
    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });


    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    // Mouse wheel event for zooming
    container.addEventListener('wheel', (event) => {
        event.preventDefault();

        // Calculate new scale factor
        const zoomFactor = 1.1;
        const { offsetX, offsetY } = event;
        const newScale = event.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;

        // Adjust the translation based on zoom to keep the mouse position in place
        const deltaScale = newScale - scale;
        translateX -= (offsetX - translateX) * deltaScale / newScale;
        translateY -= (offsetY - translateY) * deltaScale / newScale;

        scale = newScale;
        updateTransform();
    });

    // Initial setup
    updateTransform();
    addRoomNumbers();
}





document.getElementById('back').addEventListener('click', async () => {
    event.preventDefault();
    
    window.location.href = 'welcome.html';
});

document.addEventListener("DOMContentLoaded", function() {
    // Select all paths that are not hallways
    initializeZoomAndPan();
    const rooms = document.querySelectorAll('#map-container svg path:not(.hallway)');

    // Add click event listener to each room path
    rooms.forEach(room => {
        room.addEventListener('click', async function() {
            const label = room.getAttribute('inkscape:label');
            console.log(`You clicked on ${label}`);

            // Check if the room already exists in the Supabase database
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('label', label)
                .single();

            if (error && error.code !== 'PGRST116') {
                // Handle any error that is not related to a room not found
                alert(`Error fetching room: ${error.message}`);
                return;
            }

            if (data) {
                // Room found, prompt to update the attributes
                const newPropertyValue = prompt(`Current property value: ${data.other_property}. Enter a new value:`);
                if (newPropertyValue !== null) {
                    const updatedRoom = {
                        other_property: newPropertyValue
                    };

                    const { error: updateError } = await supabase
                        .from('rooms')
                        .update(updatedRoom)
                        .eq('id', data.id);

                    if (updateError) {
                        alert(`Error updating room: ${updateError.message}`);
                    } else {
                        alert(`Room updated! ID: ${data.id}, Label: ${data.label}`);
                    }
                }
            } else {
                // Room not found, create a new room
                const { data: newRoom, error: createError } = await supabase
                    .from('rooms')
                    .insert([{ label: label, other_property: 'Initial value' }])
                    .single();

                if (createError) {
                    alert(`Error creating room: ${createError.message}`);
                } else {
                    alert(`Room created! ID: ${newRoom.id}, Label: ${newRoom.label}`);
                }
            }
        });
    });
});