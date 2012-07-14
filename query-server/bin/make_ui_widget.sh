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
    'jquery/controller/view'
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