// auth.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Create a single Supabase client for interacting with your database
const supabase = createClient('https://xfvagueuvegsjvekkaga.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmFndWV1dmVnc2p2ZWtrYWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMjg1ODcsImV4cCI6MjAzNzcwNDU4N30.XKEergITkwL2fNLVpnV07-Ryn3ZasS5ebj3SslhDj7w');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        const { data, error } = await supabase
            .from('USERS')
            .select('*')
            .eq('email', email);
        
        if (error) {
            errorMessage.textContent = 'Error fetching user data: ' + error.message;
            return;
        }

        if (data.length === 0) {
            errorMessage.textContent = 'Email not found. Please try again.';
        } else if (data.length > 1) {
            errorMessage.textContent = 'Multiple users found with this email. Please contact support.';
        } else {
            const user = data[0];
            if (user.password === password) {
                window.location.href = 'welcome.html';
            } else {
                errorMessage.textContent = 'Incorrect password. Please try again.';
            }
        }
    });
});
