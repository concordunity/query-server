
/**
 * docInfo is the JSON response from the web service.
 * filters is empty or an array of filter values
 */
function Document(docInfo, filters) {
    var metadata = docInfo.doc_info;
    this.groups = new Array();
    this.comments = docInfo.comments;
    this.folder_id = docInfo.folder_id;
    this.directory = docInfo.directory;
    this.docId = metadata.doc_id;
    
    this.isSpecialDoc = (this.directory === '/docimages_mod');
    this.specialDoc = false;
    if (docInfo.special_doc_info) {
	this.specialDoc = true;
    }
    this.pages = new Array();
    this.pageTypes = new Array();
    this.pageBT = new Array();
    
    var images = docInfo.image_info.T_blog;
    this.originalTBlog = images;

    this.totalPages = images.length;

    this.label = docInfo.label;

    var subgroup = new Array();
    this.originalIndices = new Array();

    //console.log("filter is", filters);
    var doFiltering = (filters);
    var prevType = undefined;
    var prevGroupName = "";

    for (var i=0; i < this.totalPages; i++) {
	var pt = images[i].TCode;
	if (doFiltering && pt!=0 && $.inArray(pt, filters) < 0) {
            //console.log("passing page ... ", pt);
            continue;
        }
        if (prevType !== undefined && pt !== prevType) {
            // Push previous subgroup and type into groups
            this.groups.push({
                type: prevType,
                name: prevGroupName,
                pages: subgroup
            });
            subgroup = new Array();
        }
        subgroup.push(images[i].FN);
	this.pageTypes.push(pt);
        this.pages.push(images[i].FN);
	var org_num = this.originalIndices.length;
	this.originalIndices.push(org_num);
	this.pageBT.push(org_num+1);
        if (images[i].BT) {
            subgroup.push(images[i].BT);
	    this.pageTypes.push(pt);
            this.pages.push(images[i].BT);
	    this.originalIndices.push(this.originalIndices.length);
	    this.pageBT.push(org_num+1);
        }
        prevType = pt;
        prevGroupName = images[i].T;
    }
    // Push our remaining subgroup into groups
    this.groups.push({
        type: prevType,
        name: prevGroupName,
        pages: subgroup
    });
    //console.log(this.originalIndices.join(","));
}

Document.prototype.deleteCommentData = function(nth) {
    var p = -1;
    for (i=0; i < this.comments.length; i++) {
	if (this.comments[i] && this.comments[i].page == nth) {
	    p = i;
	    break;
	}
    }

    if (p != -1) {
	delete this.comments[p];
    }
}

Document.prototype.updateCommentData = function(comment) {
    var nth = comment.page;
    var is_tag = false;
    for (i=0; i < this.comments.length; i++) {
	if (this.comments[i] && this.comments[i].page == nth) {
	   //console.log("for current page",nth);
	   //console.log('current comment is ',this.comments[i]);
	   //console.log('it will update comment is ',comment);
	    this.comments[i] = comment;
	    is_tag = true;
	    break;
	}
    }
    if (is_tag == false){
        this.comments.push(comment);
    }
}

Document.prototype.addPageTypeComment = function(comment) {
    this.comments.push(comment);
}

Document.prototype.getProposedPageType = function (nth) {
    //console.log("we have comments ", this.comments);
    for (var i=0; i<this.comments.length;i++) {
	var c = this.comments[i];
	if (c &&  (c.page == nth)) {
	    return { code: c.subcode,
		     label : c.info };
	}
    }
    return null;
}

Document.prototype.getComments = function() {
    this.comments;
}

Document.prototype.getCommentList = function(docIndex, docInfo, thumbs) {
    var comment_list = new Array(); 
    var comments = docInfo.comments
    //console.log('current comments list is :',comments);
    for(var i = 1; i <= thumbs.length; i++) {
	var tmp_comment = false;
	for(var j = 0; j < comments.length; j++) {
	    if (comments[j] != undefined && comments[j].page == i){
		tmp_comment = true;	
	    }
	}
	if (tmp_comment == true) {
	    comment_list.push(true);
	}else{
	    comment_list.push(false);
	}
    }
    return comment_list;
}

Document.prototype.getThumbnailPaths = function() {
    var path = this.directory + "/";
    //console.log('this.directory = ',this.directory);
    if (this.folder_id != undefined && this.directory === "/docimages_mod") {
	path = path + this.folder_id + "_";
    }
    path = path + this.docId + '/' + this.docId + '/thumb/t_';

    var ret = []
    for (i=0; i< this.pages.length; i++) {
	ret.push(path + this.pages[i])
    }
    return ret;
}

Document.prototype.getDocId = function() {
    return this.docId;
}

Document.prototype.getPageTypeFor = function(index) {
    if (index < 0) {
	return -1;
    }
    return this.pageTypes[index -1];
}

// index is 1-based.
Document.prototype.getImagePathFor = function(index) {
    if (index < 0) {
	return "";
    }
    var path = this.directory + "/";
    if (this.folder_id != undefined && this.directory === "/docimages_mod") {
        path = path + this.folder_id + "_";
    }
    path = path + this.docId + '/' + this.docId + '/' + this.pages[index -1];

    //console.log(path);
    return path; 
}

Document.prototype.getJsonString = function () {

    var T_blog = this.originalTBlog;

    var nthPage = 0;
    for (var i=0; i < this.totalPages; i++) {
	var page = T_blog[i];

	nthPage ++;
	var proposed = this.getProposedPageType(nthPage);
	if (proposed != null) {
	    page.TCode = proposed.code;
	    page.T = proposed.label;
	}

	//page.TCode
	if (page.BT) {
	    nthPage ++;
	}
    }
    var ret = $.toJSON({T_blog: T_blog});
   //console.log(ret);
    return ret;
}

Document.prototype.getLabel = function() {
    return this.label;
}

Document.prototype.getPageGroups = function() {
    return this.groups;
}

Document.prototype.getTotalPages = function () {
    return this.totalPages;
}

// Note: numImages may be different from the numPages
// because a filter is applied.
Document.prototype.getNumImages = function () {
    return this.pages.length;
}

// Given page index selection 0, 1, 2, .....
Document.prototype.getPrintUrl = function (base, pageSelection) {
    var url = base + "?doc_id=" + this.docId;
    if (this.isSpecialDoc) {
	url = url + "&mod=1&folder_id="+this.folder_id;
    }

    if (pageSelection) {
	var idx = [];
	for (i=0; i<pageSelection.length; i++) {
	    idx.push(this.originalIndices[pageSelection[i]]);
	}
    	url = url + "&pages=" + idx.join(',');
    } else {
	if (this.getNumImages() < this.totalPages) {
	    // We need to get all the indices in
	    url = url + "&pages=" + this.originalIndices.join(',');
	}
    }
    return url;
    // get the original index.
    // get doc_id
    // get modified path
}

Document.prototype.printGroups = function () {
    var s= "";
    for (var i=0; i< this.groups.length; i++) {
	s += "\n" + i;
	s += " has pages: " + this.groups[i].pages.length;
    }
    return s;
}

Document.prototype.hasSpecialDoc = function () {
    return this.specialDoc;
}
