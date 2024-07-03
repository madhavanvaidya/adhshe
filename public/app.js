document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.querySelector('input[name="username"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        try {
            const response = await fetch('/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                form.reset();
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    });
});
