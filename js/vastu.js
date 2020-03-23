this.screenWidth = $(window).width();
this.screenHeight = $(window).height();
this.canvasWidth = screenWidth * (78 / 100);
this.canvasHeight = screenHeight;

/**
 * @class Model
 * Manages the data of the application.
 */

class Model {
  constructor() {
    // The state of the model, an array of House Map objects, prepopulated with some data
    this.houseMaps = JSON.parse(localStorage.getItem("houseMaps")) || [];
  }

  _commit(houseMaps) {
    localStorage.setItem("houseMaps", JSON.stringify(houseMaps));
  }

  addHouseMap(data) {
    const houseMap = {
      id:
        this.houseMaps.length > 0
          ? this.houseMaps[this.houseMaps.length - 1].id + 1
          : 1,
      stage: 0,
      imageData: data,
      complete: false
    };

    this.houseMaps.push(houseMap);
    this._commit(this.houseMaps);
  }

  // Map through all houseMaps, and replace the image of houseMap with the specified id
  editHouseMapImageData(id, updatedData) {
    this.houseMaps = this.houseMaps.map(houseMap =>
      houseMap.id === id
        ? { id: houseMap.id, stage: 0, imageData: updatedData, complete: false }
        : houseMap
    );

    this._commit(this.houseMaps);
  }

  // Alter stage according to completion
  staging(id, stage) {
    this.houseMaps = this.houseMaps.map(houseMap =>
      houseMap.id === id
        ? {
            id: houseMap.id,
            stage: stage,
            imageData: houseMap.imageData,
            complete: false
          }
        : houseMap
    );

    this._commit(this.houseMaps);
  }

  // Processing is complete
  complete(id) {
    this.houseMaps = this.houseMaps.map(houseMap =>
      houseMap.id === id
        ? {
            id: houseMap.id,
            stage: houseMap.stage,
            imageData: houseMap.imageData,
            complete: true
          }
        : houseMap
    );

    this._commit(this.houseMaps);
  }

  // TO get stage of houseMap
  _getStage(id) {
    return this.houseMaps.map(houseMap =>
      houseMap.id === id ? houseMap.stage : false
    );
  }

  // Filter a House Map out of the array by id
  deleteHouseMap(id) {
    this.houseMaps = this.houseMaps.filter(houseMap => houseMap.id !== id);

    this._commit(this.houseMaps);
  }

  // Flip the complete boolean on the specified todo
  toggleHouseMap(id) {
    this.houseMaps = this.houseMaps.map(houseMap =>
      houseMap.id === id
        ? {
            id: houseMap.id,
            imageData: houseMap.imageData,
            complete: !houseMap.complete
          }
        : houseMap
    );

    this._commit(this.houseMaps);
  }

  _getHouseMap() {
    return this.houseMaps;
  }

  _hasHouseMap() {
    return this.houseMaps.length > 0 ? true : false
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor() {
    this.app = this.getElement("#root");
  }

  createElement(tag, classList = null, name = null, type = null, html = null) {
    const element = document.createElement(tag);
    element.className = classList;
    element.name = name;
    element.type = type;
    element.innerHTML = html;

    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  appendElement(element) {
    this.app.appendChild(element);
  }

  appendChildElement(element, parent) {
    parent.appendChild(element);
  }

  setWidthHeight(width, height, element) {
    element.width = width;
    element.height = height;
  }

  addClass(element, className) {
    element.classList.add(className);
  }

  removeClass(element, className) {
    element.classList.remove(className);
  }

  removeElement(element) {
    element.remove();
  }
}

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.houseMap = this.model._getHouseMap();

    // Default function call onload
    //this.index();
  }

  index = stage => {};

  initialStage = () => {
    const drawArea = this.view.createElement(
      "div",
      "draw-area d-flex justify-content-center align-items-center"
    );
    this.view.appendElement(drawArea);

    const uploadArea = this.view.createElement("div", "upload-area");
    this.view.appendChildElement(uploadArea, drawArea);

    const uploadBtn = this.view.createElement(
      "button",
      "upload-btn btn btn-primary btn-lg",
      "btn",
      "button",
      '<i class="fa fa-upload"></i>&nbsp;&nbsp;Upload Image'
    );
    this.view.appendChildElement(uploadBtn, uploadArea);

    const dropText = this.view.createElement(
      "h5",
      "drop-text text-center mt-2"
    );
    this.view.appendChildElement(dropText, uploadArea);
    dropText.innerHTML = "or drop here";

    const fileInput = this.view.createElement(
      "input",
      "file-input d-none",
      "file",
      "file"
    );
    this.view.appendChildElement(fileInput, uploadArea);
  };

  firstStage = () => {
    const drawArea = this.view.createElement(
      "div",
      "draw-area d-flex justify-content-center align-items-center"
    );
    this.view.appendElement(drawArea);

    const layerOne = this.view.createElement("canvas", "canvas-one my-canvas");
    const layerOneCtx = layerOne.getContext("2d");

    drawArea.appendChild(layerOne);
    this.view.setWidthHeight(canvasWidth, canvasHeight, layerOne);

    var image = new Image();
    image.src = this.houseMap[0].imageData;
    image.onload = function() {
      layerOneCtx.drawImage(
        image,
        (layerOne.width - image.width / 2) / 2,
        (layerOne.height - image.height / 2) / 2,
        image.width / 2,
        image.height / 2
      );
    };
  };

  secondStage = () => {
    const houseMap = this.model._getHouseMap();
    const drawArea = this.view.createElement(
      "div",
      "draw-area d-flex justify-content-center align-items-center"
    );
    this.view.appendElement(drawArea);

    const canvas = this.view.createElement("canvas", "canvas-one my-canvas");
    const ctx = canvas.getContext("2d");

    drawArea.appendChild(canvas);
    this.view.setWidthHeight(canvasWidth, canvasHeight, canvas);

    $(function(e) {
      var canvasOffset = $("#root .canvas-one").offset();
      var offsetX = canvasOffset.left;
      var offsetY = canvasOffset.top;

      var startX;
      var startY;
      var isDown = false;

      var pi2 = Math.PI * 2;
      var resizerRadius = 5;
      var rr = resizerRadius * resizerRadius;
      var draggingResizer = {
        x: 0,
        y: 0
      };
      var imageX = 50;
      var imageY = 50;
      var imageWidth, imageHeight, imageRight, imageBottom;
      var draggingImage = false;
      var mouseX;
      var mouseY;

      var imageClick;

      var img = new Image();
      img.onload = function() {
        imageWidth = img.width;
        imageHeight = img.height;
        imageRight = imageX + imageWidth;
        imageBottom = imageY + imageHeight;
        draw(true, false);
      };
      img.src = houseMap[0].imageData;

      function draw(withAnchors, withBorders) {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw the image
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          imageX,
          imageY,
          imageWidth,
          imageHeight
        );

        // optionally draw the draggable anchors
        if (withAnchors) {
          drawDragAnchor(imageX, imageY);
          drawDragAnchor(imageRight, imageY);
          drawDragAnchor(imageRight, imageBottom);
          drawDragAnchor(imageX, imageBottom);
        }

        // optionally draw the connecting anchor lines
        if (withBorders) {
          ctx.beginPath();
          ctx.moveTo(imageX, imageY);
          ctx.lineTo(imageRight, imageY);
          ctx.lineTo(imageRight, imageBottom);
          ctx.lineTo(imageX, imageBottom);
          ctx.closePath();
          ctx.stroke();
        }
      }

      function drawDragAnchor(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, resizerRadius, 0, pi2, false);
        ctx.closePath();
        ctx.fill();
      }

      function anchorHitTest(x, y) {
        var dx, dy;

        // top-left
        dx = x - imageX;
        dy = y - imageY;
        if (dx * dx + dy * dy <= rr) {
          return 0;
        }
        // top-right
        dx = x - imageRight;
        dy = y - imageY;
        if (dx * dx + dy * dy <= rr) {
          return 1;
        }
        // bottom-right
        dx = x - imageRight;
        dy = y - imageBottom;
        if (dx * dx + dy * dy <= rr) {
          return 2;
        }
        // bottom-left
        dx = x - imageX;
        dy = y - imageBottom;
        if (dx * dx + dy * dy <= rr) {
          return 3;
        }
        return -1;
      }

      function hitImage(x, y) {
        return (
          x > imageX &&
          x < imageX + imageWidth &&
          y > imageY &&
          y < imageY + imageHeight
        );
      }

      function handleMouseDown(e) {
        startX = parseInt(e.clientX - offsetX);
        startY = parseInt(e.clientY - offsetY);
        draggingResizer = anchorHitTest(startX, startY);
        draggingImage = draggingResizer < 0 && hitImage(startX, startY);
      }

      function handleMouseUp(e) {
        draggingResizer = -1;
        draggingImage = false;
        draw(true, false);
      }

      function handleMouseOut(e) {
        handleMouseUp(e);
      }

      function handleMouseMove(e) {
        if (draggingResizer > -1) {
          mouseX = parseInt(e.clientX - offsetX);
          mouseY = parseInt(e.clientY - offsetY);

          // resize the image
          switch (draggingResizer) {
            case 0:
              //top-left
              imageX = mouseX;
              imageWidth = imageRight - mouseX;
              imageY = mouseY;
              imageHeight = imageBottom - mouseY;
              break;
            case 1:
              //top-right
              imageY = mouseY;
              imageWidth = mouseX - imageX;
              imageHeight = imageBottom - mouseY;
              break;
            case 2:
              //bottom-right
              imageWidth = mouseX - imageX;
              imageHeight = mouseY - imageY;
              break;
            case 3:
              //bottom-left
              imageX = mouseX;
              imageWidth = imageRight - mouseX;
              imageHeight = mouseY - imageY;
              break;
          }

          if (imageWidth < 25) {
            imageWidth = 25;
          }
          if (imageHeight < 25) {
            imageHeight = 25;
          }

          // set the image right and bottom
          imageRight = imageX + imageWidth;
          imageBottom = imageY + imageHeight;

          // redraw the image with resizing anchors
          draw(true, true);
        } else if (draggingImage) {
          imageClick = false;

          mouseX = parseInt(e.clientX - offsetX);
          mouseY = parseInt(e.clientY - offsetY);

          // move the image by the amount of the latest drag
          var dx = mouseX - startX;
          var dy = mouseY - startY;
          imageX += dx;
          imageY += dy;
          imageRight += dx;
          imageBottom += dy;
          // reset the startXY for next time
          startX = mouseX;
          startY = mouseY;

          // redraw the image with border
          draw(false, true);
        }
      }

      $(".canvas-one").mousedown(function(e) {
        handleMouseDown(e);
      });
      $(".canvas-one").mousemove(function(e) {
        handleMouseMove(e);
      });
      $(".canvas-one").mouseup(function(e) {
        handleMouseUp(e);
      });
      $(".canvas-one").mouseout(function(e) {
        handleMouseOut(e);
      });
    });
  };
}

$(function() {
  const app = new Controller(new Model(), new View())
  const houseMap = app.model._getHouseMap()

  switch (app.model._hasHouseMap() ? houseMap[0].id : 0 ) {
    case 0: {
      app.initialStage();
      break;
    }
    case 1: {
      app.secondStage();
      break;
    }
  }

  // app.index(houseMap[0].id);

  //app.index(0);

  $(".upload-btn").click(function() {
    $(".file-input").click();
  });

  $(".file-input").change(function(e) {
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();

    reader.addEventListener(
      "load",
      function() {
        let imageData = reader.result
        app.model.addHouseMap(imageData)
        $(".upload-draw").remove()
        app.secondStage()
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file)
    }
  });

  // preventing page from redirecting
  $(".draw-area").on("dragover", function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(".draw-area").css("background-color", "rgba(0,0,0,0.3)");
    $(".upload-btn").hide();
    $(".drop-text").text("Drop Here");
  });

  $(".upload-area").on("dragleave", function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(".draw-area").css("background-color", "#fff");
    $(".upload-btn").hide();
    $(".drop-here-text").text("or drop here");
  });

  // Drop
  $(".upload-area").on("drop", function(e) {
    e.stopPropagation()
    e.preventDefault()

    var file = e.originalEvent.dataTransfer.files;

    if (file && file[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(file[0]);

      reader.onloadend = function(e) {
        var img = $("<img>").attr("src", e.target.result)
        let imageData = e.target.result
        app.model.addHouseMap(imageData)
        $(".draw-area").remove()
        app.secondStage()
        console.log("working")
      }
    }
  })

  $(window).resize(function() {
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var canvasWidth = screenWidth * (78 / 100);
    var canvasHeight = screenHeight;
    var canvas = $(".my-canvas");
    canvas.attr("width", canvasWidth);
    canvas.attr("height", canvasHeight);
  });
});
