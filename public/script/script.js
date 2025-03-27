document.addEventListener("DOMContentLoaded", function () {
    // Hide success message after 3 seconds
    const successMessage = document.querySelector(".success");
    if (successMessage) {
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }

    // Hide error message after 3 seconds
    const errorMessage = document.querySelector(".error");
    if (errorMessage) {
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }

    // Form validation: Check only required inputs and textareas
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        form.addEventListener("submit", function(event) {
            let valid = true;
            // Only check inputs and textareas that are required
            const inputs = form.querySelectorAll("input[required], textarea[required]");
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.border = "2px solid red"; // Highlight invalid inputs
                } else {
                    input.style.border = "";
                }
            });
            if (!valid) {
                event.preventDefault();
                showError("Please fill in all required fields.");
            }
        });
    });

    // Task completion toggle (for checkboxes with class "task-checkbox")
    document.querySelectorAll(".task-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const taskId = e.target.dataset.id;
            const isCompleted = e.target.checked;

            // Send a PUT request to update task completion status
            fetch(`/tasks/update/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: isCompleted }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update UI to reflect task completion
                    const taskItem = document.querySelector(`#task-${taskId}`);
                    if (taskItem) {
                        taskItem.classList.toggle("completed", isCompleted);
                    }
                    showSuccess("Task updated successfully.");
                } else {
                    showError("Failed to update task.");
                }
            })
            .catch(err => {
                console.error("Error updating task:", err);
                showError("Error updating task.");
            });
        });
    });

    // Show error messages
    function showError(message) {
        const errorElement = document.querySelector("#error-message");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        } else {
            // Fallback if no error element is found
            alert(message);
        }
    }

    // Show success messages
    function showSuccess(message) {
        const successElement = document.querySelector("#success-message");
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = "block";
        } else {
            // Fallback if no success element is found
            alert(message);
        }
    }
});
