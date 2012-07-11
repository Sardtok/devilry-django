/**
 * A function for setting an exercise's status.
 * It will make an AJAX request to set the status,
 * and update the HTML code on the page when the server responds.
 */
setStatus = function(link, exercise, status) {
    elems = link.parentNode.parentNode.childNodes;
    var status_exercise_request;
    if (window.XMLHttpRequest) { // REAL browsers
        status_exercise_request = new XMLHttpRequest();
    } else { // Shitty IE5 and 6
        status_exercise_request = ActiveXObject("Microsoft.XMLHTTP");
    }

    status_exercise_request.open("POST", "/trix/exercise/"
                                 + exercise + "/status",
                                 true);

    // Function that updates the HTML when the server responds.
    status_exercise_request.onreadystatechange =
        function() {
            if (status_exercise_request.readyState != 4) {
                return;
            }

            if (status_exercise_request.status != 200) {
                alert("Error setting status ("
                      + status_exercise_request.status
                      + ")!");
                return;
            }

            settings = status_exercise_request.responseText.split(", ");

            // Update the status text and hide the links to set the status
            for (i = 0; i < elems.length; i++) {
                if (elems[i].nodeType !== 1)
                    continue;

                cls = elems[i].getAttribute("class");
                if (cls == "choices" && settings[0] != "-1") {
                    elems[i].style.display = 'none';
                } else if (cls == "status") {
                    status = unsolved;
                    if (settings[0] != "-1") {
                        status = statuses[settings[0]];
                        elems[i].innerHTML = status + ' - <a href="javascript:void(0)" onclick="showChoices(this)">' + change_str + '</a>' + ' <a href="javascript:void(0)" onclick="setStatus(this, ' + exercise + ', -1)">' + reset_str + '</a>';
                        elems[i].style.display = 'block';
                    } else {
                        showChoices(elems[i].childNodes[0]);
                    }
                }
            }

            // XP bar update
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

    status_exercise_request.setRequestHeader("Content-type", "text/plain");
    status_exercise_request.send("status=" + status);
}

/**
 * Shows the links for setting the status and hides the unset status.
 */
showChoices = function(link) {
    elems = link.parentNode.parentNode.childNodes;
    for (i = 0; i < elems.length; i++) {
        if (elems[i].nodeType !== 1)
            continue;
        
        cls = elems[i].getAttribute("class");
        if (cls == "choices") {
            elems[i].style.display = 'block';
        } else if (cls == "status") {
            elems[i].style.display = 'none';
        }
    }
}
