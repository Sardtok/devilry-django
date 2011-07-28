setStatus = function(exercise, status) {
    var status_exercise_request;
    if (window.XMLHttpRequest) { // REAL browsers
        status_exercise_request = new XMLHttpRequest();
    } else { // Shitty IE5 and 6
        status_exercise_request = ActiveXObject("Microsoft.XMLHTTP");
    }

    status_exercise_request.open("POST", "/trix/exercise/"
                                 + exercise + "/status",
                                 true);

    status_exercise_request.onreadystatechange =
        function() {
            if (status_exercise_request.readyState == 4) {
                if (status_exercise_request.status != 200) {
                    alert("Error setting status ("
                          + status_exercise_request.status
                          + ")!");
                    return;
                }

                var actualstate = status_exercise_request.responseText;
                radiobuttons = document.getElementsByName(exercise);

                for (button in radiobuttons) {
                    if (button.getAttribute("value") != actualstate) {
                        button.removeAttribute("checked");
                    } else {
                        button.setAttribute("checked", "checked");
                    }
                }
            }
        }

    status_exercise_request.setRequestHeader("Content-type", "text/plain");
    status_exercise_request.send("status=" + status);
}