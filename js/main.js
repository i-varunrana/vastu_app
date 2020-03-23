var SCREEN_WIDTH = $(window).width();
var SCREEN_HEIGHT = $(window).height();
var CANVAS_WIDTH = SCREEN_WIDTH * (75 / 100);
var CANVAS_HEIGHT = SCREEN_HEIGHT;
var PARENT = "main-container";

$(function() {
  //newDiv = new Div("div1","myDiv");
  //newDiv.append(PARENT);
  // var layer1 = new Layer("layer1","myLayer",CANVAS_WIDTH,CANVAS_HEIGHT);
  // layer1.append(PARENT);

  var localStorage = new LocalStorage();
  if (localStorage.hasData("LAYER_STAGE")) {
    var STAGE = localStorage.getData("LAYER_STAGE");

    switch (STAGE) {

      case "0": {
        stageInitial(localStorage);
        break;
      }
      case "1": {
        stage_one();
        break;
      }

    }

  } else {

    var STAGE = 0;
    localStorage.setData("LAYER_STAGE", STAGE);
    stageInitial();
  }

  function stageInitial(localStorage) {
    newDiv = new Element(
      "wrapper1",
      "container-wrapper d-flex flex-column justify-content-center align-items-center height-100"
    );
    newDiv.addElement("main-container", "DIV");

    newButton = new Element(
      "button1",
      "btn btn-primary btn-lg",
      "upload-image-btn"
    );
    newButton.addElement(
      "wrapper1",
      "BUTTON",
      '<i class="fa fa-upload"></i>&nbsp; Upload Image'
    );

    newText = new Element("text1", "drop-here-text mt-2");
    newText.addElement("wrapper1", "h5", "or drop a file");

    newInput = new Element("file-input", "file d-none", "image-file");
    newInput.addElement("wrapper1", "INPUT");
    newInput.setType("file");

    $("#button1").click(function() {
      $("#file-input").click();
    });
  
    $("#file-input").change(function(e) {
      var preview = document.querySelector("img");
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();
  
      reader.addEventListener(
        "load",
        function() {
          let imageFile = reader.result;
          localStorage.setData("HOUSE_MAP", imageFile); //Save into localstorage
          STAGE = 1;
          localStorage.setData("LAYER_STAGE", STAGE); //Save into localstorage
        },
        false
      );
  
      if (file) {
        reader.readAsDataURL(file);
      }
    });

  }

  function stage_one() {
    let divName = "upload-area";
    let uploadArea = new Div(divName, divName);
    uploadArea.append(PARENT);

    let inputField = document.createElement("INPUT");
    inputField.name = "file";
    inputField.setType("file");

    let text = document.createElement("H5");
    text.className = "drop-here-text";

    let node = document.getElementById(divName);
    node.appendChild(text);
    node.appendChild(inputField);

    // preventing page from redirecting
    $(".upload-area").on("dragover", function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(".upload-area").css("background-color", "rgba(0,0,0,0.5)");
      $(".drop-here-text").text("Drop Here");
    });

    $(".upload-area").on("dragleave", function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(".upload-area").css("background-color", "#fff");
      $(".drop-here-text").text("");
    });

    // Drop
    $(".upload-area").on("drop", function(e) {
      e.stopPropagation();
      e.preventDefault();

      var file = e.originalEvent.dataTransfer.files;

      if (file && file[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(file[0]);

        reader.onloadend = function(e) {
          var img = $("<img>").attr("src", e.target.result);
          $(".upload-area").remove();
          $(".main-container").html(img);
          let fileToSave = e.target.result;
          saveData("HOUSE_MAP", fileToSave); //Save into localstorage
          STAGE = 1;
          saveData("LAYER_STAGE", STAGE); //Save into localstorage
          var fileName = retrieveData("HOUSE_MAP");

        };
      }
    });
  }

  //! Function for responsive layer starts
  $(window).resize(function() {
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var canvasWidth = screenWidth * (75 / 100);
    var canvasHeight = screenHeight;
    //layer1.changeShape(canvasWidth, canvasHeight);
  });
  //! Function for responsive layer end
});

$(function() {
});

class LocalStorage {
  setData(FILE_KEY, data) {
    localStorage.setItem(FILE_KEY, data);
  }
  getData(FILE_KEY) {
    return localStorage.getItem(FILE_KEY);
  }
  hasData(FILE_KEY) {
    return localStorage.hasOwnProperty(FILE_KEY) ? true : false;
  }
}

class Div {
  constructor(id = null, className = "myDiv") {
    this.id = id;
    this.className = className;
  }

  append(parent) {
    let node = document.getElementById(parent);
    var div = document.createElement("DIV");
    div.className = this.className;
    div.id = this.id;
    node.appendChild(div);
  }

  remove() {}

  addClass(className) {
    let element = document.getElementById(this.id);
    element.classList.add(className);
  }

  removeClass(className) {
    let element = document.getElementById(this.id);
    element.classList.remove(className);
  }

  getWidth() {
    return document.getElementById(this.id).width;
  }

  getHeight() {
    return document.getElementById(this.id).height;
  }

  setType(type) {
    document.getElementById(this.id).type = type;
  }
}

class Layer {
  constructor(id, className = "myCanvas", setWidth = 350, setHeight = 300) {
    this.id = id;
    this.className = className;
    this.setWidth = setWidth;
    this.setHeight = setHeight;
    console.log(id + className + setWidth + setHeight);
  }

  append(parent) {
    let node = document.getElementById(parent);
    let canvas = document.createElement("CANVAS");
    canvas.id = this.id;
    canvas.className = this.className;
    canvas.width = this.setWidth;
    canvas.height = this.setHeight;
    node.appendChild(canvas);
  }

  changeShape(newWidth, newHeight) {
    var canvas = document.getElementById(this.id);
    canvas.width = newWidth;
    canvas.height = newHeight;
  }

  getWidth() {
    return document.getElementById(id).width;
  }

  getHeight() {
    return document.getElementById(id).height;
  }
}

class Draw {
  consturtor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
  }

  drawText(text, posX, poxY, color) {
    this.ctx.font = "14px Verdana";
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, posX, poxY);
  }
}

class Element {
  constructor(elementId, elementClass, elementName = null) {
    this.elementId = elementId;
    this.elementClass = elementClass;
    this.elementName = elementName;
  }

  addElement(parentId, elementTag, html = null) {
    // Adds an element to the document
    let p = document.getElementById(parentId);
    let newElement = document.createElement(elementTag);
    newElement.className = this.elementClass;
    newElement.id = this.elementId;
    newElement.name = this.elementName;
    newElement.innerHTML = html;
    p.appendChild(newElement);
  }

  removeElement() {
    // Removes an element from the document
    let element = document.getElementById(this.elementId);
    element.parentNode.removeChild(element);
  }

  addClass(className) {
    let element = document.getElementById(this.elementId);
    element.classList.add(className);
  }

  removeClass(className) {
    let element = document.getElementById(this.elementId);
    element.classList.remove(className);
  }

  getElementId() {
    return document.getElementById(this.elementId).id;
  }

  setType(type) {
    document.getElementById(this.elementId).type = type;
  }
}

// function addElement(parentId, elementTag, elementId, html) {
//     // Adds an element to the document
//     var p = document.getElementById(parentId);
//     var newElement = document.createElement(elementTag);
//     newElement.setAttribute('id', elementId);
//     newElement.innerHTML = html;
//     p.appendChild(newElement);
// }

// function removeElement(elementId) {
//     // Removes an element from the document
//     var element = document.getElementById(elementId);
//     element.parentNode.removeChild(element);
// }
