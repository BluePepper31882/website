// auth.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Create a single Supabase client for interacting with your database
const supabase = createClient('https://xfvagueuvegsjvekkaga.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmFndWV1dmVnc2p2ZWtrYWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMjg1ODcsImV4cCI6MjAzNzcwNDU4N30.XKEergITkwL2fNLVpnV07-Ryn3ZasS5ebj3SslhDj7w');

document.addEventListener('DOMContentLoaded', async () => {

    const session = await supabase.auth.getSession();
    if (session.data.session) {
        window.location.href = 'welcome.html';
        return;
    }

    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        const errorMessage = document.getElementById('error-message');
        const loadingBar = document.getElementById('loading-bar');

        loadingBar.classList.add('show')

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        if (error) {
            errorMessage.textContent = 'Error fetching user data: ' + error.message;
            loadingBar.classList.remove('show');
            return;
        }

        if (data.user){
            const sessionExpiration = rememberMe ? (60 * 60 * 24 * 7) : (60 * 60 * 1);
            document.cookie = `supabaseToken=${data.session.access_token}; path=/; max-age=${sessionExpiration}; HttpOnly`;
            window.location.href = 'welcome.html'
        } else {
            errorMessage.textContent = 'Login failed. Please try again.';
            loadingBar.classList.remove('show');
        }

        
    });
});





