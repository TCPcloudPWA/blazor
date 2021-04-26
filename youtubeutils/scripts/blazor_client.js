window.JsToDotNetBridge = {
    m_dotNetReference: null,

    setDotNetReference: function (dotNetReference) {
        this.m_dotNetReference = dotNetReference;
    },

    showErrorJs: function (title, msg) {
        this.m_dotNetReference.invokeMethod("showError", title, msg);
    },

    showInfoJs: function (msg) {
        this.m_dotNetReference.invokeMethod("showInfo", msg);
    },

    setJsValJs: function (varName, aVals) { // aVals array of values
        this.m_dotNetReference.invokeMethod("setJsVal", varName, aVals);
    }
}


function showError(title, msg) {
    console.error("-E- "+ title, msg);

    JsToDotNetBridge.showErrorJs(title, msg);
}


function showInfo(msg) {
    console.info("-I- "+ msg);

    JsToDotNetBridge.showInfoJs(msg);
}
