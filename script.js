document.addEventListener('DOMContentLoaded', () => {
    const addQuestionForm = document.getElementById('add-question-form');
    const showQuestionsButton = document.getElementById('show-questions-button');
    const questionsListDiv = document.getElementById('questions-list');

    addQuestionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(addQuestionForm);
        const data = {
            question: formData.get('question'),
            option1: formData.get('option1'),
            option2: formData.get('option2'),
            option3: formData.get('option3'),
            option4: formData.get('option4'),
            correct_option: parseInt(formData.get('correct_option'), 10)
        };

        try {
            const response = await fetch('/add-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            if (result.success) {
                addQuestionForm.reset();
                fetchQuestions();
            } else {
                console.error('Error adding question:', result);
            }
        } catch (error) {
            console.error('Error adding question:', error);
        }
    });

    async function displayQuestionsList() {
        try {
            const response = await fetch('/questions');
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            questionsListDiv.innerHTML = '';
            if (data.length > 0) {
                const ul = document.createElement('ul');
                data.forEach(question => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${question.question}</strong><br>
                        Option 1: ${question.option1}<br>
                        Option 2: ${question.option2}<br>
                        Option 3: ${question.option3}<br>
                        Option 4: ${question.option4}<br>
                        Correct Option: ${question.correct_option}<br>
                        <button class="delete-button" data-id="${question.id}">Delete</button>
                    `;
                    ul.appendChild(li);
                });
                questionsListDiv.appendChild(ul);

                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        deleteQuestion(id);
                    });
                });
            } else {
                questionsListDiv.innerHTML = '<p>No questions available.</p>';
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    async function deleteQuestion(id) {
        try {
            const response = await fetch(`/delete-question/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            if (result.success) {
                fetchQuestions();
            } else {
                console.error('Error deleting question:', result);
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    }

    showQuestionsButton.addEventListener('click', () => {
        displayQuestionsList();
    });

    displayQuestionsList();
});
