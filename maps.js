import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabase = createClient('https://xfvagueuvegsjvekkaga.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmFndWV1dmVnc2p2ZWtrYWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMjg1ODcsImV4cCI6MjAzNzcwNDU4N30.XKEergITkwL2fNLVpnV07-Ryn3ZasS5ebj3SslhDj7w');

// Check if the user is authenticated
const session = await supabase.auth.getSession();

if (!session) {
    // Redirect to login page if not authenticated
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Modal handling
    const modal = document.getElementById('role-update-modal');
    const openModalButton = document.getElementById('open-modal');
    const closeButton = document.getElementsByClassName('close-button')[0];


    openModalButton.onclick = function () {
        console.log('Open button clicked');
        modal.style.display = 'block';
        
    }

    closeButton.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Handle role update form submission
    document.getElementById('update-role-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('form submitted')

        const email = document.getElementById('user-email').value;
        const newRole = document.getElementById('new-role').value;
        const errorMessage = document.getElementById('role-update-error-message');

        const emailInput = document.getElementById('user-email');
            const newRoleInput = document.getElementById('new-role');

            if (!emailInput.checkValidity() || !newRoleInput.checkValidity()) {
                console.error('One or more inputs are invalid');
                return;
            }
        
        try{
            const { data: userData, error: userError } = await supabase
                    .from('auth.users')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (userError) {
                    errorMessage.textContent = 'Error fetching user: ' + userError.message;
                    console.error('Error fetching user:', userError);
                    return;
                }

                if (!userData) {
                    errorMessage.textContent = 'User not found.';
                    console.error('User data is null');
                    return;
                }

                const { error: roleUpdateError } = await supabase
                    .from('user_profiles')
                    .update({ role: newRole })
                    .eq('user_id', userData.id);

                if (roleUpdateError) {
                    errorMessage.textContent = 'Error updating role: ' + roleUpdateError.message;
                    console.error('Error updating role:', roleUpdateError);
                    return;
                }

                errorMessage.textContent = 'User role updated successfully!';
                document.getElementById('update-role-form').reset();
        } catch (err) {
            console.error(err);
            errorMessage.textContent = err.message;
        }
        
    });
});


