var gl_oCurrUser = null;

window.signIn = (bRedirect) => {
    authenticate(bRedirect);
};


window.signOut = () => {
    gapi.auth2.getAuthInstance().signOut();

    processSignout();
}


function init() {
    // file search/query req scope: https://www.googleapis.com/auth/drive || https://www.googleapis.com/auth/drive.metadata.readonly,
    // seems like to search only appDataFolder https://www.googleapis.com/auth/drive.appdata is enough
    // example of other scopes: // https://www.googleapis.com/auth/drive.file

    gapi.load("client:auth2", function () {
        gapi.auth2.init({
            client_id: "323996053258-3smc60hane62th9l0nm9dupoin6v15qd.apps.googleusercontent.com",
            scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/drive.appdata",
            prompt: "select_account"
        }); // cnfg !!! !!!
    });
}


function processSignin(bRedirect) {
    console.log("Sign-in successfully.");

    CSupport.hideElm(bttnSignIn);
    CSupport.showElm(bttnSignOut);
    CSupport.showElm(divGetPlaylists);

    gl_oCurrUser = gapi.auth2.getAuthInstance().currentUser.get();
    var token = gl_oCurrUser.getAuthResponse().access_token;
    JsToDotNetBridge.setJsValJs("gapi_token", [token]);

    var oProf = gl_oCurrUser.getBasicProfile();
    //var id = oProf.getId();
    //var name = oProf.getName();
    //var imgUrl = oProf.getImageUrl();
    var email = oProf.getEmail();

    JsToDotNetBridge.setJsValJs((bRedirect ? "gapi_signin_redirect" : "gapi_signin"), [email]);
}


function processSignout() {
    console.log("Sign-out successfully.");

    CSupport.hideElm(bttnSignOut);
    CSupport.showElm(bttnSignIn);
    CSupport.hideElm(divGetPlaylists);


    JsToDotNetBridge.setJsValJs("gapi_signin_redirect", [""]);
}


function authenticate(bRedirect) {
    return gapi.auth2.getAuthInstance()
        .signIn()  // used to specify scopes here
        .then(function () {
            processSignin(bRedirect);
        },
            function (err) {
                showError("Failed to sign-in.", err.error);
            });
}


async function uploadTxtFile(szData, szFileName, szFldId, szFileId) {
    var file = new Blob([szData], { type: "text/plain" });

    var accessToken = gapi.auth.getToken().access_token;
    var bCreate = CSupport.isEmpty(szFileId);

    var metadata = {
        "mimeType": "text/plain"
    };

    if (bCreate) {
        metadata.name = szFileName;
        metadata.parents = [szFldId]; // or appDataFolder
    }

    var form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    const url = "https://www.googleapis.com/upload/drive/v3/files"
            + (bCreate ? "" : "/" + szFileId)
            + "?uploadType=multipart&fields=id,name,parents,mimeType,modifiedTime";



    /*fetch(url, {
        method: "POST",
        headers: new Headers({ "Authorization": "Bearer " + accessToken }),
        body: form,
    }).then((res) => {
        return res.json();
    }).then(function (val) {
        console.log(val);
    });*/

    let resp = await fetch(url, {
        method: (bCreate ? "POST" : "PATCH"),
        headers: new Headers({ "Authorization": "Bearer " + accessToken }),
        body: form,
    });

    if (resp.ok) { // if HTTP-status is 200-299
        let json = await resp.json();

        return json.id;
    } else {
        showError("Failed to upload.", resp.status + ": " + resp.statusText);
    }

    /*var xhr = new XMLHttpRequest();
    xhr.open("post", url);
    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
    xhr.responseType = "json";
    xhr.onload = () => {
        console.log(xhr.response.id); // Retrieve uploaded file ID.

        return xhr.response.id;
    };
    xhr.send(form);*/
}

