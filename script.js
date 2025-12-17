function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("card");
  if (c == "todos") c = "";
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    if (x[i].className.indexOf(c) > -1) {
      x[i].style.display = "block";
    }
  }
}