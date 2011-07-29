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

                settings = status_exercise_request.responseText.split(", ");
                radiobuttons = document.getElementsByName(exercise);

                for (i = 0; i < radiobuttons.length; i++) {
                    button = radiobuttons[i];
                    if (button.getAttribute("value") != settings[0]) {
                        button.removeAttribute("checked");
                    } else {
                        button.setAttribute("checked", "checked");
                    }
                }

                level = document.getElementById("level");
                if (level != null) {
                    level.innerHTML = settings[1];
                }

                bar = document.getElementById("xpbardone");
                if (bar != null) {
                    bar.style.width = settings[2] + "%";
                    bar.innerHTML = settings[3] + "/" + settings[4]
                }

                points = document.getElementById("total_points");
                if (points != null) {
                    points.innerHTML = settings[5];
                }
            }
        }

    status_exercise_request.setRequestHeader("Content-type", "text/plain");
    status_exercise_request.send("status=" + status);
}