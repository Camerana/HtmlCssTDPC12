window.onload = Init;

function Init() {
    setInterval(setClockTime, 1000);

    //RECUPERARE ELEMENTO CON JS PURO
    var buttonJS = document.getElementById("btnGetDataJS");
    buttonJS.addEventListener("click", GetData);
    
    var buttonJquery = $('#btnGetDataJquery');
    buttonJquery.on("click", () => {
        GetDataWithAjax("users", "GET", renderUsers);
    });
}

var setClockTime = () => {
    var clock = document.getElementById("clock");
    var now = new Date();
    var date = now.toLocaleDateString();
    var time = now.toLocaleTimeString(); 
    clock.innerHTML = '<span>' + date + '<br/>' + time + '</span>';
}

function GetData() {
    var req = new XMLHttpRequest();

    req.addEventListener('load', () => {
        if (req.status === 200) {
            var data = JSON.parse(req.responseText);
            renderUsers(data)
        }
        else{
            alert("Errore durante il recupero dei dati. Riprovare più tardi.")
        }
    })

    // URL PER RECUPERO DATI OPEN SOURCE => https://jsonplaceholder.typicode.com

    //req.open('get', "JS/data.json", true);
    req.open('get', "https://jsonplaceholder.typicode.com/users", true);
    req.setRequestHeader('Content-type', 'application/json');
    req.send();
}

const baseUrl = "https://jsonplaceholder.typicode.com/";

function GetDataWithAjax(resource, method, onSuccess) {
    var settings = {
        url: baseUrl + resource,
        dataType: 'json',
        method: method,
        data: null,
        async: true,
        success: onSuccess,
        error: (xhr) => {
            console.error(xhr);
        }
    };
    $.ajax(settings);
}

var page = 0;
var perPage = 5;

var renderUsers = (users) => {
    $("#tabellaPersone").html("");

    if (page + perPage > users.length) {
        page = 0;
    }

    users.slice(page, page + perPage).forEach((user, index) => {
        renderUser(user);
    })

    page += perPage;
}

var renderUser = (data) => {
    $("#tabellaPersone").append(
        $("<tr>").append(
            $("<td>").html(data.id),
            $("<td>").html(data.name),
            $("<td>").html(data.username),
            $("<td>").html(data.email),
            $("<td>").append(
                $("<button>").html("DETTAGLI").on("click", () => {
                    //alert(data.id + ' ' + data.email);
                    //alert(`${data.id} ${data.email}`);

                    var albumsResource = "users/" + data.id + "/albums";

                    // GetDataWithAjax(albumsResource, "GET", (albums) => {
                    //     console.log(albums);
                    // });

                    GetDataWithAjax(albumsResource, "GET", renderAlbums);
                })
            )
        )
    );
}

var renderAlbums = (albums) => {
    var albumsContainer = $("<div>").addClass("albumsContainer");

    albums.forEach((album) => {
        albumsContainer.append(
            $("<div>").addClass("album").html(album.title)
        )
    })

    $("#container").append(albumsContainer);
}
