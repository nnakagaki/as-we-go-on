utils = {
  addStrokesToPageCanvas : function(pageNum, strokes) {
    var canvas = document.getElementById('js-canvas-page-' + pageNum);

    paper.setup(canvas);
    strokes.forEach(function(stroke) {
      var path = new paper.Path();
      path.importJSON(stroke.stroke);
    });
  }
}