#!/bin/bash -e

# TMP dir that the file should be saved to
# DO NOT OUTPUT debug message in this script.
# the calling processing needs to read from the stdout
# of this program.

DOCID=$1
TMPDIR="${HOME}/query-server/public/root/docimages/$DOCID"


mkdir -p $TMPDIR

bucket=${DOCID:0:4}
PROXY_SERVER=dms-proxy1
echo "tmp file $TMPDIR/$DOCID.pdf"
if [ -f $TMPDIR/$DOCID.pdf ]; then
  echo "PDF already exists."
  exit 0
fi
cd $TMPDIR

filename="$DOCID.7z"
#echo swift -A https://$PROXY_SERVER/auth/v1.0 -U test:tester -K testing download -o t.7z $bucket $filename 
swift -A https://$PROXY_SERVER/auth/v1.0 -U test:tester -K testing download -o t.7z $bucket $filename  > /dev/null

#cp $HOME/t.7z .

# TMP HACK for local testing 
#HACK_DIR=/tmp/doc_21426
#cp $HACK_DIR/$DOCID.7z t.7z

result=`/usr/bin/7z l t.7z -so 2>&1 | perl -n -e '/key(\d+)/ && print $1'`
echo "key$result, $TMPDIR"
read passwd

/usr/bin/7z x -p$passwd t.7z > /dev/null



#rm t.7z
# generate thumbnail.

#cd $DOCID

#mkdir thumb

#for f in `ls *.jpg`; do /usr/bin/convert -thumbnail 50% $f thumb/t_$f; done

