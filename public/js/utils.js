utils = {
  papers                 : {},
  addStrokesToPageCanvas : function(pageNum) {
    var pageStrokes = _.filter(allStrokes, function(stroke) { return stroke.page === pageNum; }),
        id = 'js-canvas-page-' + pageNum,
        canvas = document.getElementById(id);

    if (this.papers[id]) {
      this.papers[id].activate();
    } else {
      paper = new paper.PaperScope();
      paper.setup(canvas);
      this.papers[id] = paper;
    }

    pageStrokes.forEach(function(stroke) {
      var path = new paper.Path();
      path.importJSON(stroke.stroke);
    });
  }
}