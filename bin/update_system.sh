#!/bin/bash

##
# 格式（参数如）：~/query-server/A.tar /tmp/1311312/ ~/query-server 
#
#
#
##

##
#FILEPATH=$1
#echo "完整路径：${FILEPATH}"
#echo "全  名： ${FILEPATH##*/}"
#FILENAME=${FILEPATH##*/}
#echo "文件名： ${FILENAME%.*}"
#echo "扩展名： ${FILENAME##*.}"
##
FILEPATH=$1
TMPPATH=$2
RAILSROOT=$3
PATCHNAME=${FILEPATH##*/} #如：A.tar
TARNAME=${PATCHNAME%.*} #如：A
USERROOT=~/src
echo "FILEPATH = ${FILEPATH}"
echo "TMPPATH = ${TMPPATH}"
echo "RAILSROOT = ${RAILSROOT}"
echo "PATCHNAME = ${PATCHNAME}"
echo "TARNAME = ${TARNAME}"


chmod 775 $FILEPATH 
if [ ! -d "${USERROOT}" ]; then
    echo "创建目录：~/src"
	mkdir ~/src
fi
if [ ! -d "${TMPPATH}" ]; then
    echo "创建目录：${TMPPATH}"
	mkdir $TMPPATH 
fi


echo "备份源文件(${FILEPATH})到${USERROOT}目录下，并将其解压到${TMPPATH}"
cp $FILEPATH ~/src/ 
tar xvf $FILEPATH -C $TMPPATH 

if [ -f "${TMPPATH}/patch_${PATCHNAME}" ]; then
	echo "即将解压${TMPPATH}/patch_${PATCHNAME}到${RAILSROOT}目录下"
	chmod 775 "${TMPPATH}/patch_${PATCHNAME}"  
	tar xvf "${TMPPATH}/patch_${PATCHNAME}" -C ${RAILSROOT} 
fi


if [ -f "${TMPPATH}/sh_${PATCHNAME}" ]; then
	echo "即将解压${TMPPATH}/sh_${PATCHNAME}到${TMPPATH}目录下"
	chmod 775 "${TMPPATH}/sh_${PATCHNAME}"
	tar xvf "${TMPPATH}/sh_${PATCHNAME}" -C ${TMPPATH} 
fi

if [ -f "${TMPPATH}/script/${TARNAME}.sh" ]; then
	echo "即将执行${TMPPATH}/script/${TARNAME}.sh 这个文件"
	sh ${TMPPATH}/script/$TARNAME.sh 
fi
if [ -d "${TMPPATH}" ]; then
echo "将要删除的目录是：${TMPPATH}"
	rm -rf $TMPPATH	
fi
