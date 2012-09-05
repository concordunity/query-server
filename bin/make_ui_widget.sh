#!/bin/bash

#$1 is the widget name

w=$1

BASEDIR=$HOME/query-server/public/docview/ui

mkdir -p $BASEDIR/$w
mkdir -p $BASEDIR/$w/views
touch $BASEDIR/$w/views/init.ejs

cat > $BASEDIR/$w/$w.js <<EOF
steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'docview/bootstrap/bootstrap.css'
).then(
    './views/init.ejs'
).then(function($) {
    \$.Controller('Docview.Ui.$w', {}, {
        init : function() {
           this.element.html(this.view('init'));
        },

        show : function() {
        }
});
});

EOF


cat > $BASEDIR/$w/${w}_test.html <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>$w Widget Unit Test</title>
</head>
<body>

  <div class="container-fluid">
  <div class="row-fluid">
    <div id="${w}-test">  </div>
  </div>
  </div>
 <script type='text/javascript' src='../../../steal/steal.js'></script>
 <script type='text/javascript'>
steal('jquery/dom/route', 'docview/ui/$w').then(function(\$) {

   \$('#${w}-test').docview_ui_$w();

 }); 
 </script>
        </body>
</html>

EOF
