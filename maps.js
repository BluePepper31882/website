

// Import Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabase = createClient('https://xfvagueuvegsjvekkaga.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmFndWV1dmVnc2p2ZWtrYWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMjg1ODcsImV4cCI6MjAzNzcwNDU4N30.XKEergITkwL2fNLVpnV07-Ryn3ZasS5ebj3SslhDj7w');

// Check if the user is authenticated
const { data: session } = await supabase.auth.getSession();

if (!session) {
    // Redirect to login page if not authenticated
    window.location.href = 'index.html';
}

const { data:user } = await supabase.from("user").select("*").single();

// Logout button functionality
document.getElementById('logout-button').addEventListener('click', async () => {
    event.preventDefault();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Error signing out:', error.message);
    } else {
        // Redirect to the login page after logging out
        window.location.href = 'index.html';
    }
});

document.getElementById('gcit').addEventListener('click', async () => {
    event.preventDefault();

    
    if (user?.role === "admin") {
        window.location.href = 'access.html';
    } else {
        
        window.location.href = 'noaccess.html';
    }
});


