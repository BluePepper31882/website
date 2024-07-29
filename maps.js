console.log('JavaScript is running!');

document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    
    document.getElementById('gcit').addEventListener('click', () => {
        changeDiv('Div 1 Content');
    });

    document.getElementById('bbe').addEventListener('click', () => {
        changeDiv('Div 2 Content');
    });

    document.getElementById('bbr').addEventListener('click', () => {
        changeDiv('Div 3 Content');
    });

    document.getElementById('bdc').addEventListener('click', () => {
        changeDiv('Div 4 Content');
    });

    changeDiv("This is Div 1 Content")
    function changeDiv(content) {
        console.log("changing div to:", content);        // Set the content of the div
        contentDiv.textContent = content;

        // Remove the show class to collapse the div
        contentDiv.classList.remove('show');

        // Force a reflow to enable the transition effect
        void contentDiv.offsetWidth;

        // Add the show class to expand the div
        contentDiv.classList.add('show');
    }
});
