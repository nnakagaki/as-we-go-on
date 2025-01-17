tool.fixedDistance = 5;

var path;
var strokeEnds = 20;

function onMouseDown(event) {
  tool.fixedDistance = $('#js-stroke-thickness').val();
  path = new Path();
  path.fillColor = '#' + $('#js-stroke-color').val();
}

var lastPoint;
function onMouseDrag(event) {
  // If this is the first drag event,
  // add the strokes at the start:
  if(event.count == 0) {
    addStrokes(event.middlePoint, event.delta * -1);
  } else {
    var step = event.delta / 2;
    step.angle += 90;

    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    path.add(top);
    path.insert(0, bottom);
  }

  lastPoint = event.middlePoint;
}

function onMouseUp(event) {
  var delta = event.point - lastPoint,
      flipbookPage = window.flipbook.turn('page'),
      currentPage,
      strokeData;

  delta.length = tool.maxDistance;
  addStrokes(event.point, delta);
  path.closed = true;
  path.smooth();

  if (view._id === 'js-left-canvas') {
    if (flipbookPage % 2 === 0) {
      currentPage = flipbookPage;
    } else {
      currentPage = flipbookPage - 1;
    }
  } else {
    if (flipbookPage % 2 === 0) {
      currentPage = flipbookPage + 1;
    } else {
      currentPage = flipbookPage;
    }
  }

  strokeData = {
    stroke : path.exportJSON(),
    page   : currentPage
  }

  $.ajax({
    url    : '/strokes',
    method : 'POST',
    data   : {
      stroke : strokeData
    },
    success : function() {
      allStrokes.push(strokeData);
      utils.addStrokesToPageCanvas(currentPage);
      ws.send(JSON.stringify(strokeData));
    },
    complete : function() {
      paper.project.clear();
    }
  });
}

function addStrokes(point, delta) {
  var step = delta.rotate(90);
  var strokePoints = strokeEnds * 2 + 1;
  point -= step / 2;
  step /= strokePoints - 1;
  for(var i = 0; i < strokePoints; i++) {
    var strokePoint = point + step * i;
    var offset = delta * (Math.random() * 0.3 + 0.1);
    if(i % 2) {
      offset *= -1;
    }
    strokePoint += offset;
    path.insert(0, strokePoint);
  }
}