import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Create a single Supabase client for interacting with your database
const supabase = createClient('https://xfvagueuvegsjvekkaga.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmFndWV1dmVnc2p2ZWtrYWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMjg1ODcsImV4cCI6MjAzNzcwNDU4N30.XKEergITkwL2fNLVpnV07-Ryn3ZasS5ebj3SslhDj7w');

document.getElementById('back').addEventListener('click', async () => {
    event.preventDefault();
    
    window.location.href = 'welcome.html';
});

document.addEventListener("DOMContentLoaded", function() {
    // Select all paths that are not hallways
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