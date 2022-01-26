window.onload = function () {
    document.getElementById("divHeader").innerHTML = header
    document.getElementById("createAccount").addEventListener("click", activateModal)
    document.getElementById("userLogin").addEventListener("click", activateModal1 )
};
var header = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">A place to plan your future</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item active">
                <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                {% if session %}
                    <a class="nav-link disabled" href="/logout">Logout</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" href="/userpage">{{ session.name }}</a>
                    </li>
                {% else %}
                    <a class="nav-link disabled" id="userLogin">Login/Registration</a>
                    <li>
                        <a class="nav-link disabled" id="createAccount">Create account</a>
                    </li>
                {% endif %}
            </li>
        </ul>
    </div>
</nav>`

function activateModal() {
    $("#modal2").modal();
}
function activateModal1(){
    $("#modal").modal();
}
